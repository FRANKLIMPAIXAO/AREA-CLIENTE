# Área do Cliente

Este repositório contém o código fonte para o sistema "Área do Cliente", uma solução completa para gerenciamento de clientes com interfaces Web e Mobile.

## Objetivo

O objetivo deste sistema é fornecer uma plataforma centralizada onde clientes podem acessar seus dados, realizar solicitações e interagir com os serviços oferecidos.

## Estrutura do Projeto

O projeto está organizado da seguinte forma:

- **/web**: Aplicação Web (Next.js)
- **/mobile**: Aplicação Mobile (React Native / Expo)
- **/supabase**: Configurações e migrações do Supabase (Auth, Database, Storage)

## Tecnologias Utilizadas

- **Frontend Web**: Next.js, React, Tailwind CSS
- **Mobile**: React Native, Expo
- **Backend / Infraestrutura**: Supabase (PostgreSQL, Authentication, Storage)

## Configuração

### Pré-requisitos

- Node.js (versão LTS recomendada)
- npm ou yarn
- Conta no Supabase

### Instalação

1. Clone o repositório.
2. Navegue até a pasta do projeto desejado (`web` ou `mobile`).
3. Instale as dependências:
   ```bash
   npm install
   ```

### Supabase

As configurações do Supabase estão localizadas na pasta `supabase`. Consulte o README interno para mais detalhes sobre como configurar o ambiente local e realizar migrações.
