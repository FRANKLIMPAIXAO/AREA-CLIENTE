import { GoogleGenerativeAI } from '@google/generative-ai'
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'

const ANALYSIS_PROMPT = `Você é um especialista em documentos contábeis brasileiros. Analise este documento e extraia as seguintes informações em formato JSON:

{
  "tipo_documento": "string (DARF, GPS, DAS, Holerite, Contrato, Nota Fiscal, etc)",
  "departamento_sugerido": "string (dp, fiscal, contratos, alvaras)",
  "tipo_sugerido": "string (documento, guia, contrato, balancete)",
  "competencia_extraida": "string (YYYY-MM format)",
  "vencimento": "string (YYYY-MM-DD format ou null)",
  "valor_total": "number (em reais ou null)",
  "cnpj": "string (formato XX.XXX.XXX/XXXX-XX ou null)",
  "codigo_receita": "string (para DARFs) ou null",
  "pasta_sugerida": "string (caminho sugerido como /Fiscal/IRPJ/2024)",
  "empresa_nome": "string ou null",
  "observacoes": "string (informações adicionais relevantes)"
}

Regras importantes:
- Se não encontrar uma informação, retorne null
- Para departamentos: "dp" (Departamento Pessoal), "fiscal" (Fiscal), "contratos" (Contratos), "alvaras" (Alvarás)
- Para tipos: "documento" (geral), "guia" (guias de impostos), "contrato", "balancete"
- Seja preciso e confiante nas classificações
- Retorne APENAS o JSON, sem texto adicional

Analise o documento:`;

export async function POST(request: NextRequest) {
    try {
        const supabase = await createClient()
        const { data: { user } } = await supabase.auth.getUser()

        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const formData = await request.formData()
        const file = formData.get('file') as File

        if (!file) {
            return NextResponse.json({ error: 'No file provided' }, { status: 400 })
        }

        // Verificar se API key está configurada
        if (!process.env.GEMINI_API_KEY) {
            return NextResponse.json({
                error: 'Gemini API key not configured'
            }, { status: 500 })
        }

        // Inicializar Gemini apenas quando necessário (lazy loading)
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY)

        // Converter arquivo para base64
        const bytes = await file.arrayBuffer()
        const buffer = Buffer.from(bytes)
        const base64 = buffer.toString('base64')

        // Análise com Gemini
        const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' })

        const result = await model.generateContent([
            {
                inlineData: {
                    mimeType: file.type,
                    data: base64,
                },
            },
            { text: ANALYSIS_PROMPT },
        ])

        const response = result.response
        const text = response.text()

        // Extrair JSON da resposta
        let extractedData
        try {
            extractedData = JSON.parse(text)
        } catch {
            const jsonMatch = text.match(/```json\n([\s\S]*?)\n```/) || text.match(/```\n([\s\S]*?)\n```/)
            if (jsonMatch) {
                extractedData = JSON.parse(jsonMatch[1])
            } else {
                throw new Error('Failed to parse JSON from response')
            }
        }

        // Calcular confiança baseado em quantos campos foram preenchidos
        const totalFields = Object.keys(extractedData).length
        const filledFields = Object.values(extractedData).filter(v => v !== null && v !== '').length
        const confidence = filledFields / totalFields

        return NextResponse.json({
            success: true,
            data: extractedData,
            confidence,
            analyzed_at: new Date().toISOString(),
        })
    } catch (error: any) {
        console.error('AI Analysis error:', error)
        return NextResponse.json({
            error: 'Analysis failed',
            details: error.message
        }, { status: 500 })
    }
}
