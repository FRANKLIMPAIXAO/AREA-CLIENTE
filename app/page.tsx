import { createClient } from '../supabase/server'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { Button } from '../components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card'
import { BuildingOfficeIcon, DocumentTextIcon, ShieldCheckIcon } from '@heroicons/react/24/outline'

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
      title: 'Gestão Centralizada',
      description: 'Todas as suas empresas e documentos em um único lugar, facilitando o acesso e organização.',
      icon: BuildingOfficeIcon,
    },
    {
      title: 'Documentos Seguros',
      description: 'Acesse guias, contratos e folhas de pagamento com total segurança e criptografia.',
      icon: DocumentTextIcon,
    },
    {
      title: 'Conformidade',
      description: 'Mantenha-se em dia com suas obrigações fiscais e trabalhistas com nossos alertas inteligentes.',
      icon: ShieldCheckIcon,
    },
  ]

  return (
    <div className="flex min-h-screen flex-col bg-background">
      {/* Navbar */}
      <header className="flex h-16 items-center justify-between border-b bg-background/95 px-6 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
            <BuildingOfficeIcon className="h-5 w-5 text-primary" />
          </div>
          <span className="text-lg font-bold">Área do Cliente</span>
        </div>
        <Link href="/login">
          <Button>Acessar Conta</Button>
        </Link>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden py-24 md:py-32 bg-gradient-to-br from-primary/5 via-background to-background">
          <div className="container mx-auto px-4 md:px-6 flex flex-col items-center text-center space-y-8">
            <div className="space-y-4 max-w-3xl">
              <h1 className="text-4xl md:text-6xl font-bold tracking-tighter sm:text-5xl">
                Simplifique a gestão contábil da sua empresa
              </h1>
              <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
                Plataforma completa para acessar documentos, guias de impostos e manter a contabilidade do seu negócio em dia.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/login">
                <Button size="lg" className="h-12 px-8 text-lg">
                  Entrar na Plataforma
                </Button>
              </Link>
              <Button variant="outline" size="lg" className="h-12 px-8 text-lg">
                Saiba Mais
              </Button>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="container mx-auto px-4 md:px-6 py-24">
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature) => (
              <Card key={feature.title} className="border-border/50 hover:shadow-lg transition-all">
                <CardHeader>
                  <div className="mb-4 h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                    <feature.icon className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t py-12 bg-muted/20">
        <div className="container mx-auto px-4 md:px-6 flex flex-col sm:flex-row justify-between items-center gap-6">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} Área do Cliente. Todos os direitos reservados.
          </p>
          <nav className="flex gap-4 sm:gap-6">
            <Link className="text-sm hover:underline underline-offset-4" href="#">
              Termos de Uso
            </Link>
            <Link className="text-sm hover:underline underline-offset-4" href="#">
              Privacidade
            </Link>
          </nav>
        </div>
      </footer>
    </div>
  )
}
