-- Adicionar campo para metadados extraídos pela IA
ALTER TABLE documents ADD COLUMN extracted_data jsonb;
ALTER TABLE documents ADD COLUMN ai_confidence float;
ALTER TABLE documents ADD COLUMN ai_analyzed_at timestamp with time zone;

-- Index para buscar por dados extraídos
CREATE INDEX idx_documents_extracted_data ON documents USING gin(extracted_data);

-- Exemplos de dados que serão extraídos:
-- {
--   "tipo_documento": "DARF",
--   "departamento_sugerido": "fiscal",
--   "tipo_sugerido": "guia",
--   "competencia_extraida": "2024-01",
--   "vencimento": "2024-01-31",
--   "valor_total": 15000.00,
--   "cnpj": "12.345.678/0001-99",
--   "codigo_receita": "2089",
--   "pasta_sugerida": "/Fiscal/IRPJ/2024",
--   "empresa_nome": "Tech Solutions Ltda"
-- }
