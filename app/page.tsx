import { createClient } from '../supabase/server'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { Button } from '../components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card'
import { BuildingOfficeIcon, DocumentTextIcon, ShieldCheckIcon, ChartBarIcon } from '@heroicons/react/24/outline'

export default async function Home() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (user) {
    redirect('/dashboard')
  }

  const features = [
    {
      title: 'Recuperação Tributária',
      description: 'Análise completa para identificar oportunidades de recuperação de impostos pagos indevidamente.',
      icon: ChartBarIcon,
    },
    {
      title: 'Gestão de Documentos',
      description: 'Acesse guias, contratos e relatórios contábeis com segurança e agilidade.',
      icon: DocumentTextIcon,
    },
    {
      title: 'Conformidade Fiscal',
      description: 'Mantenha sua empresa em dia com a legislação vigente e evite multas.',
      icon: ShieldCheckIcon,
    },
  ]

  return (
    <div className="flex min-h-screen flex-col bg-stone-50">
      {/* Navbar */}
      <header className="flex h-16 items-center justify-between border-b bg-white px-6 shadow-sm">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center text-white font-bold">
            P
          </div>
          <span className="text-xl font-bold text-gray-800 tracking-tight">PAC <span className="text-primary">Tributária</span></span>
        </div>
        <div className="flex gap-4">
          <Link href="/login">
            <Button variant="outline" className="border-primary text-primary hover:bg-orange-50 font-semibold">
              Área do Cliente
            </Button>
          </Link>
          <Link href="https://wa.me/550000000000" target="_blank">
            <Button className="bg-[#22C55E] hover:bg-[#16A34A] text-white font-bold shadow-md">
              Falar no WhatsApp
            </Button>
          </Link>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden py-24 md:py-32 bg-gradient-to-br from-orange-50 via-white to-white">
          <div className="container mx-auto px-4 md:px-6 flex flex-col items-center text-center space-y-8">
            <div className="inline-flex items-center rounded-full border border-orange-200 bg-orange-50 px-3 py-1 text-sm font-medium text-orange-800 mb-4">
              <span className="flex h-2 w-2 rounded-full bg-orange-600 mr-2"></span>
              Soluções Inteligentes para sua Empresa
            </div>
            <div className="space-y-4 max-w-4xl">
              <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-gray-900 sm:text-5xl">
                Inteligência Tributária que <span className="bg-gradient-to-r from-primary to-orange-600 bg-clip-text text-transparent">Gera Resultados</span>
              </h1>
              <p className="mx-auto max-w-[800px] text-gray-600 md:text-xl leading-relaxed">
                Somos especialistas em transformar a gestão tributária do seu negócio. Acesse nossa área do cliente para gerenciar documentos e acompanhar processos.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Link href="/login">
                <Button size="lg" className="h-14 px-8 text-lg font-bold shadow-orange-200 shadow-xl bg-gradient-to-r from-primary to-orange-600 hover:from-orange-600 hover:to-orange-700 border-0">
                  Acessar Área do Cliente
                </Button>
              </Link>
            </div>
          </div>

          {/* Abstract Shapes */}
          <div className="absolute top-1/2 left-0 -translate-y-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-orange-200/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 right-0 translate-y-1/3 translate-x-1/3 w-[600px] h-[600px] bg-green-200/20 rounded-full blur-3xl pointer-events-none" />
        </section>

        {/* Features Section */}
        <section className="container mx-auto px-4 md:px-6 py-24">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Porque escolher a PAC Tributária?
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              Tecnologia e expertise unidas para o crescimento do seu negócio.
            </p>
          </div>
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature) => (
              <Card key={feature.title} className="border-0 shadow-lg bg-white hover:shadow-xl transition-all duration-300 group">
                <CardHeader>
                  <div className="mb-4 h-14 w-14 rounded-2xl bg-orange-50 flex items-center justify-center group-hover:bg-primary transition-colors duration-300">
                    <feature.icon className="h-7 w-7 text-primary group-hover:text-white transition-colors duration-300" />
                  </div>
                  <CardTitle className="text-xl font-bold text-gray-900">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-500 leading-relaxed">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-200 py-12 bg-white">
        <div className="container mx-auto px-4 md:px-6 flex flex-col sm:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="h-6 w-6 rounded bg-primary flex items-center justify-center text-white text-xs font-bold">P</div>
            <span className="font-bold text-gray-700">PAC Tributária</span>
          </div>
          <p className="text-sm text-gray-500">
            © {new Date().getFullYear()} PAC Tributária. Todos os direitos reservados.
          </p>
        </div>
      </footer>
    </div>
  )
}
