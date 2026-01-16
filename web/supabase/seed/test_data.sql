-- ========================================
-- SCRIPT DE DADOS DE TESTE
-- Área do Cliente Contábil
-- ========================================

-- IMPORTANTE: Substitua 'SEU_USER_ID_AQUI' pelo seu User ID real
-- Para descobrir seu User ID, rode primeiro:
-- SELECT id, email FROM auth.users WHERE email = 'seu_email@exemplo.com';

-- ========================================
-- 1. CRIAR EMPRESAS
-- ========================================

INSERT INTO companies (id, name, cnpj, created_at) VALUES
('11111111-1111-1111-1111-111111111111', 'Tech Solutions Ltda', '12.345.678/0001-90', '2023-01-15'),
('22222222-2222-2222-2222-222222222222', 'Comércio ABC EIRELI', '98.765.432/0001-12', '2023-03-20'),
('33333333-3333-3333-3333-333333333333', 'Indústria XYZ S.A.', '55.444.333/0001-66', '2023-06-10')
ON CONFLICT (id) DO NOTHING;

-- ========================================
-- 2. VINCULAR USUÁRIO ÀS EMPRESAS
-- ========================================
-- SUBSTITUA 'SEU_USER_ID_AQUI' pelo ID retornado da query acima!

INSERT INTO user_companies (user_id, company_id, role) VALUES
('SEU_USER_ID_AQUI', '11111111-1111-1111-1111-111111111111', 'owner'),
('SEU_USER_ID_AQUI', '22222222-2222-2222-2222-222222222222', 'viewer'),
('SEU_USER_ID_AQUI', '33333333-3333-3333-3333-333333333333', 'accountant')
ON CONFLICT (user_id, company_id) DO NOTHING;

-- ========================================
-- 3. CRIAR DOCUMENTOS DE EXEMPLO
-- ========================================
-- Estes são apenas registros no banco, sem arquivos reais no Storage
-- Você pode fazer upload de arquivos reais pela interface depois

INSERT INTO documents (company_id, name, type, competence, file_path, file_size, uploaded_by, uploaded_at) VALUES
-- Tech Solutions - Guias
('11111111-1111-1111-1111-111111111111', 'DARF - Imposto de Renda.pdf', 'guia', '2024-01', 'fake/path/darf_jan24.pdf', 245632, 'SEU_USER_ID_AQUI', '2024-02-05'),
('11111111-1111-1111-1111-111111111111', 'GPS - Previdência Social.pdf', 'guia', '2024-01', 'fake/path/gps_jan24.pdf', 189234, 'SEU_USER_ID_AQUI', '2024-02-05'),
('11111111-1111-1111-1111-111111111111', 'DARF - Imposto de Renda.pdf', 'guia', '2024-02', 'fake/path/darf_fev24.pdf', 251234, 'SEU_USER_ID_AQUI', '2024-03-05'),

-- Tech Solutions - Contrato
('11111111-1111-1111-1111-111111111111', 'Contrato de Serviços Contábeis 2024.pdf', 'contrato', NULL, 'fake/path/contrato_tech.pdf', 523456, 'SEU_USER_ID_AQUI', '2024-01-10'),

-- Comércio ABC - Documentos
('22222222-2222-2222-2222-222222222222', 'Balancete Janeiro.pdf', 'balancete', '2024-01', 'fake/path/balancete_jan.pdf', 423189, 'SEU_USER_ID_AQUI', '2024-02-01'),
('22222222-2222-2222-2222-222222222222', 'Nota Fiscal - Compra Mercadorias.pdf', 'documento', '2024-01', 'fake/path/nf_compra.pdf', 156789, 'SEU_USER_ID_AQUI', '2024-01-25'),

-- Comércio ABC - Guias
('22222222-2222-2222-2222-222222222222', 'ICMS - Janeiro 2024.pdf', 'guia', '2024-01', 'fake/path/icms_jan24.pdf', 198765, 'SEU_USER_ID_AQUI', '2024-02-10'),

-- Indústria XYZ - Contrato
('33333333-3333-3333-3333-333333333333', 'Contrato Prestação Serviços.pdf', 'contrato', NULL, 'fake/path/contrato_xyz.pdf', 678901, 'SEU_USER_ID_AQUI', '2023-06-15'),

-- Indústria XYZ - Documentos recentes
('33333333-3333-3333-3333-333333333333', 'Folha de Pagamento Dezembro.pdf', 'documento', '2023-12', 'fake/path/folha_dez.pdf', 389012, 'SEU_USER_ID_AQUI', '2024-01-05'),
('33333333-3333-3333-3333-333333333333', 'Declaração Anual.pdf', 'documento', '2023-12', 'fake/path/declaracao_2023.pdf', 512345, 'SEU_USER_ID_AQUI', '2024-01-20')
ON CONFLICT DO NOTHING;

-- ========================================
-- VERIFICAÇÃO
-- ========================================
-- Rode estas queries para confirmar que os dados foram criados:

-- Ver empresas criadas
SELECT * FROM companies;

-- Ver vínculos usuário-empresa
SELECT 
  uc.role,
  c.name as company_name,
  c.cnpj
FROM user_companies uc
JOIN companies c ON c.id = uc.company_id
WHERE uc.user_id = 'SEU_USER_ID_AQUI';

-- Ver documentos por empresa
SELECT 
  c.name as company,
  d.name as document,
  d.type,
  d.competence,
  d.uploaded_at
FROM documents d
JOIN companies c ON c.id = d.company_id
ORDER BY d.uploaded_at DESC;
