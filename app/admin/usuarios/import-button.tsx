'use client'

import { useState } from 'react'
import { Button } from '../../../components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card'
import { ArrowUpTrayIcon, DocumentTextIcon } from '@heroicons/react/24/outline'
import { importClients, ImportResult, ParsedClient } from './actions'

export function ImportClientsButton() {
    const [isOpen, setIsOpen] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [csvContent, setCsvContent] = useState('')
    const [result, setResult] = useState<ImportResult | null>(null)

    const handleImport = async () => {
        setIsLoading(true)
        setResult(null)

        try {
            const lines = csvContent.split('\n')
            const parsedData: ParsedClient[] = []

            for (let i = 1; i < lines.length; i++) { // Skip header
                const line = lines[i].trim()
                if (!line) continue

                const cols = line.split(',')
                if (cols.length < 6) continue

                parsedData.push({
                    nome_empresa: cols[0].trim(),
                    cnpj: cols[1].trim(),
                    email_usuario: cols[2].trim(),
                    nome_usuario: cols[3].trim(),
                    telefone: cols[4].trim(),
                    senha_padrao: cols[5].trim()
                })
            }

            if (parsedData.length === 0) {
                alert('Nenhum dado válido encontrado. Verifique o formato do CSV.')
                setIsLoading(false)
                return
            }

            const importInfo = await importClients(parsedData)
            setResult(importInfo)

            if (importInfo.successCount > 0) {
                setCsvContent('') // Clear input on success
            }

        } catch (error) {
            console.error(error)
            alert('Falha ao importar clientes.')
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <>
            <Button onClick={() => setIsOpen(true)} className="flex items-center gap-2">
                <ArrowUpTrayIcon className="h-4 w-4" />
                Importar Clientes (CSV)
            </Button>

            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
                    <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                        <CardHeader className="flex flex-row items-center justify-between">
                            <CardTitle>Importação em Lote</CardTitle>
                            <button onClick={() => setIsOpen(false)} className="text-gray-500 hover:text-gray-700">
                                Fechar
                            </button>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="rounded-md bg-blue-50 p-4">
                                <p className="text-sm text-blue-700">
                                    <strong>Formato do CSV (sem cabeçalho na linha 1 se for colar):</strong><br />
                                    nome_empresa,cnpj,email_usuario,nome_usuario,telefone,senha_padrao
                                </p>
                            </div>

                            <textarea
                                value={csvContent}
                                onChange={(e) => setCsvContent(e.target.value)}
                                placeholder="Cole aqui os dados do seu CSV..."
                                className="w-full h-48 rounded-md border p-2 font-mono text-sm"
                            />

                            <div className="flex justify-end gap-2">
                                <Button variant="outline" onClick={() => setIsOpen(false)}>Cancelar</Button>
                                <Button onClick={handleImport} disabled={isLoading || !csvContent}>
                                    {isLoading ? 'Importando...' : 'Iniciar Importação'}
                                </Button>
                            </div>

                            {result && (
                                <div className={`mt-4 rounded-md p-4 ${result.errors.length > 0 ? 'bg-yellow-50' : 'bg-green-50'}`}>
                                    <h3 className="font-semibold text-gray-900">Resultado:</h3>
                                    <p className="text-green-700">Sucesso: {result.successCount} registros</p>
                                    <p className="text-red-700">Erros: {result.errorCount} registros</p>

                                    {result.errors.length > 0 && (
                                        <div className="mt-2 text-sm text-red-600 max-h-32 overflow-y-auto">
                                            {result.errors.map((err, idx) => (
                                                <div key={idx}>Linha {err.row} ({err.email}): {err.error}</div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            )}
        </>
    )
}
