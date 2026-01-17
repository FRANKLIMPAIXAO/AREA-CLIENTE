# Configuração do Supabase

Este diretório contém as configurações e migrações do banco de dados Supabase.

## Estrutura

- `/migrations`: Scripts SQL para versionamento do banco de dados.
- `/seed`: Scripts para popular o banco de dados com dados iniciais.

## Como usar

1. Instale a CLI do Supabase:
   ```bash
   npm install -g supabase
   ```

2. Faça login:
   ```bash
   supabase login
   ```

3. Inicialize o projeto (se ainda não tiver feito):
   ```bash
   supabase init
   ```

4. Para iniciar o desenvolvimento local:
   ```bash
   supabase start
   ```

5. Para aplicar migrações:
   ```bash
   supabase db reset
   ```
