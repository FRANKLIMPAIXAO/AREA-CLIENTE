-- ========================================
-- SCRIPT DE DADOS DE TESTE - PRONTO PARA EXECUTAR
-- Área do Cliente Contábil
-- ========================================

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

INSERT INTO user_companies (user_id, company_id, role) VALUES
('dfec84fc-9b6c-4420-bb32-e1e836b70954', '11111111-1111-1111-1111-111111111111', 'owner'),
('dfec84fc-9b6c-4420-bb32-e1e836b70954', '22222222-2222-2222-2222-222222222222', 'viewer'),
('dfec84fc-9b6c-4420-bb32-e1e836b70954', '33333333-3333-3333-3333-333333333333', 'accountant')
ON CONFLICT (user_id, company_id) DO NOTHING;

-- ========================================
-- 3. CRIAR DOCUMENTOS DE EXEMPLO
-- ========================================

INSERT INTO documents (company_id, name, type, competence, file_path, file_size, uploaded_by, uploaded_at) VALUES
-- Tech Solutions - Guias
('11111111-1111-1111-1111-111111111111', 'DARF - Imposto de Renda.pdf', 'guia', '2024-01', '11111111-1111-1111-1111-111111111111/2024-01/guia/darf_jan24.pdf', 245632, 'dfec84fc-9b6c-4420-bb32-e1e836b70954', '2024-02-05'),
('11111111-1111-1111-1111-111111111111', 'GPS - Previdência Social.pdf', 'guia', '2024-01', '11111111-1111-1111-1111-111111111111/2024-01/guia/gps_jan24.pdf', 189234, 'dfec84fc-9b6c-4420-bb32-e1e836b70954', '2024-02-05'),
('11111111-1111-1111-1111-111111111111', 'DARF - Imposto de Renda.pdf', 'guia', '2024-02', '11111111-1111-1111-1111-111111111111/2024-02/guia/darf_fev24.pdf', 251234, 'dfec84fc-9b6c-4420-bb32-e1e836b70954', '2024-03-05'),

-- Tech Solutions - Contrato
('11111111-1111-1111-1111-111111111111', 'Contrato de Serviços Contábeis 2024.pdf', 'contrato', NULL, '11111111-1111-1111-1111-111111111111/sem-competencia/contrato/contrato_tech.pdf', 523456, 'dfec84fc-9b6c-4420-bb32-e1e836b70954', '2024-01-10'),

-- Comércio ABC - Documentos
('22222222-2222-2222-2222-222222222222', 'Balancete Janeiro.pdf', 'balancete', '2024-01', '22222222-2222-2222-2222-222222222222/2024-01/balancete/balancete_jan.pdf', 423189, 'dfec84fc-9b6c-4420-bb32-e1e836b70954', '2024-02-01'),
('22222222-2222-2222-2222-222222222222', 'Nota Fiscal - Compra Mercadorias.pdf', 'documento', '2024-01', '22222222-2222-2222-2222-222222222222/2024-01/documento/nf_compra.pdf', 156789, 'dfec84fc-9b6c-4420-bb32-e1e836b70954', '2024-01-25'),

-- Comércio ABC - Guias
('22222222-2222-2222-2222-222222222222', 'ICMS - Janeiro 2024.pdf', 'guia', '2024-01', '22222222-2222-2222-2222-222222222222/2024-01/guia/icms_jan24.pdf', 198765, 'dfec84fc-9b6c-4420-bb32-e1e836b70954', '2024-02-10'),

-- Indústria XYZ - Contrato
('33333333-3333-3333-3333-333333333333', 'Contrato Prestação Serviços.pdf', 'contrato', NULL, '33333333-3333-3333-3333-333333333333/sem-competencia/contrato/contrato_xyz.pdf', 678901, 'dfec84fc-9b6c-4420-bb32-e1e836b70954', '2023-06-15'),

-- Indústria XYZ - Documentos recentes
('33333333-3333-3333-3333-333333333333', 'Folha de Pagamento Dezembro.pdf', 'documento', '2023-12', '33333333-3333-3333-3333-333333333333/2023-12/documento/folha_dez.pdf', 389012, 'dfec84fc-9b6c-4420-bb32-e1e836b70954', '2024-01-05'),
('33333333-3333-3333-3333-333333333333', 'Declaração Anual.pdf', 'documento', '2023-12', '33333333-3333-3333-3333-333333333333/2023-12/documento/declaracao_2023.pdf', 512345, 'dfec84fc-9b6c-4420-bb32-e1e836b70954', '2024-01-20')
ON CONFLICT DO NOTHING;
