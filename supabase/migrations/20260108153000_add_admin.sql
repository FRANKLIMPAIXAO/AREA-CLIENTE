-- Adicionar campo is_admin na tabela profiles
ALTER TABLE profiles ADD COLUMN is_admin boolean DEFAULT false;

-- Tornar o usuário atual admin
UPDATE profiles
SET is_admin = true
WHERE id = 'dfec84fc-9b6c-4420-bb32-e1e836b70954';

-- Política RLS para verificar se é admin
CREATE POLICY "Admins podem ver todas as empresas"
  ON companies FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.is_admin = true
    )
  );

CREATE POLICY "Admins podem gerenciar user_companies"
  ON user_companies FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.is_admin = true
    )
  );
