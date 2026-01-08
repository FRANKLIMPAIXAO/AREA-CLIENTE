-- Tabela de Empresas
create table companies (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  cnpj text unique not null,
  created_at timestamp with time zone default now()
);

-- Relacionamento Usuário-Empresa (N:N)
create table user_companies (
  user_id uuid references auth.users on delete cascade not null,
  company_id uuid references companies on delete cascade not null,
  role text not null default 'viewer', -- 'owner', 'accountant', 'viewer'
  created_at timestamp with time zone default now(),
  primary key (user_id, company_id)
);

-- Tabela de Documentos
create table documents (
  id uuid default gen_random_uuid() primary key,
  company_id uuid references companies on delete cascade not null,
  name text not null,
  type text not null, -- 'contrato', 'guia', 'documento', 'balancete', etc.
  competence text, -- Formato: YYYY-MM
  file_path text not null,
  file_size bigint,
  uploaded_by uuid references auth.users not null,
  uploaded_at timestamp with time zone default now()
);

-- Indexes para performance
create index idx_documents_company on documents(company_id);
create index idx_documents_competence on documents(competence);
create index idx_documents_type on documents(type);
create index idx_user_companies_user on user_companies(user_id);

-- RLS para Companies
alter table companies enable row level security;

create policy "Usuários podem ver empresas que têm acesso"
  on companies for select
  using (
    exists (
      select 1 from user_companies
      where user_companies.company_id = companies.id
      and user_companies.user_id = auth.uid()
    )
  );

-- RLS para User_Companies
alter table user_companies enable row level security;

create policy "Usuários podem ver seus próprios acessos"
  on user_companies for select
  using (user_id = auth.uid());

-- RLS para Documents
alter table documents enable row level security;

create policy "Usuários podem ver documentos de suas empresas"
  on documents for select
  using (
    exists (
      select 1 from user_companies
      where user_companies.company_id = documents.company_id
      and user_companies.user_id = auth.uid()
    )
  );

create policy "Usuários podem criar documentos em suas empresas"
  on documents for insert
  with check (
    exists (
      select 1 from user_companies
      where user_companies.company_id = documents.company_id
      and user_companies.user_id = auth.uid()
    )
    and uploaded_by = auth.uid()
  );

create policy "Usuários podem deletar documentos que enviaram"
  on documents for delete
  using (uploaded_by = auth.uid());

-- Storage bucket para documentos
insert into storage.buckets (id, name, public)
values ('documents', 'documents', false);

-- Policies de Storage
create policy "Usuários podem visualizar documentos de suas empresas"
  on storage.objects for select
  using (
    bucket_id = 'documents'
    and (storage.foldername(name))[1] in (
      select company_id::text from user_companies
      where user_id = auth.uid()
    )
  );

create policy "Usuários podem fazer upload em suas empresas"
  on storage.objects for insert
  with check (
    bucket_id = 'documents'
    and (storage.foldername(name))[1] in (
      select company_id::text from user_companies
      where user_id = auth.uid()
    )
  );

create policy "Usuários podem deletar seus próprios uploads"
  on storage.objects for delete
  using (
    bucket_id = 'documents'
    and owner = auth.uid()
  );
