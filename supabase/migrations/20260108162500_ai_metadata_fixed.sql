-- Adicionar apenas as colunas que não existem
ALTER TABLE documents ADD COLUMN IF NOT EXISTS extracted_data jsonb;
ALTER TABLE documents ADD COLUMN IF NOT EXISTS ai_confidence float;
ALTER TABLE documents ADD COLUMN IF NOT EXISTS ai_analyzed_at timestamp with time zone;

-- Create index if not exists
CREATE INDEX IF NOT EXISTS idx_documents_extracted_data ON documents USING gin(extracted_data);
