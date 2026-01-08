-- Criar tabela de departamentos
CREATE TABLE departments (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL,
  slug text UNIQUE NOT NULL,  -- 'dp', 'fiscal', 'contratos', 'alvaras'
  icon text,
  color text,
  description text,
  created_at timestamp with time zone DEFAULT now()
);

-- Criar tabela de pastas (hierárquica)
CREATE TABLE folders (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  company_id uuid REFERENCES companies ON DELETE CASCADE NOT NULL,
  department_id uuid REFERENCES departments NOT NULL,
  parent_folder_id uuid REFERENCES folders ON DELETE CASCADE,
  name text NOT NULL,
  path text,  -- Caminho completo: /DP/Folha de Pagamento/2024
  created_at timestamp with time zone DEFAULT now()
);

-- Atualizar tabela de documentos
ALTER TABLE documents ADD COLUMN department_id uuid REFERENCES departments;
ALTER TABLE documents ADD COLUMN folder_id uuid REFERENCES folders;

-- Indexes para performance
CREATE INDEX idx_folders_company ON folders(company_id);
CREATE INDEX idx_folders_department ON folders(department_id);
CREATE INDEX idx_folders_parent ON folders(parent_folder_id);
CREATE INDEX idx_documents_department ON documents(department_id);
CREATE INDEX idx_documents_folder ON documents(folder_id);

-- RLS para folders
ALTER TABLE folders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Usuários podem ver pastas de suas empresas"
  ON folders FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM user_companies
      WHERE user_companies.company_id = folders.company_id
      AND user_companies.user_id = auth.uid()
    )
  );

CREATE POLICY "Usuários podem criar pastas em suas empresas"
  ON folders FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM user_companies
      WHERE user_companies.company_id = folders.company_id
      AND user_companies.user_id = auth.uid()
    )
  );

-- RLS para departments (público, todos podem ler)
ALTER TABLE departments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Todos podem ver departamentos"
  ON departments FOR SELECT
  USING (true);

-- Inserir departamentos padrão
INSERT INTO departments (name, slug, icon, color, description) VALUES
('Departamento Pessoal', 'dp', '👥', '#3B82F6', 'Folha de pagamento, admissões, demissões, férias'),
('Fiscal', 'fiscal', '💰', '#10B981', 'Impostos, declarações, obrigações acessórias'),
('Contratos', 'contratos', '📄', '#8B5CF6', 'Contratos de prestação de serviços, locação, fornecedores'),
('Alvarás e Licenças', 'alvaras', '🏛️', '#F59E0B', 'Alvarás de funcionamento, sanitários, ambientais')
ON CONFLICT (slug) DO NOTHING;
