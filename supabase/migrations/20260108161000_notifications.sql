-- Criar tabela de notificações
CREATE TABLE notifications (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES auth.users ON DELETE CASCADE NOT NULL,
  type text NOT NULL,  -- 'new_document', 'document_approved', 'document_rejected', 'due_date_reminder'
  title text NOT NULL,
  message text NOT NULL,
  link text,
  read boolean DEFAULT false,
  created_at timestamp with time zone DEFAULT now()
);

-- Adicionar campo de data de vencimento em documents
ALTER TABLE documents ADD COLUMN due_date date;

-- Index para performance
CREATE INDEX idx_notifications_user ON notifications(user_id);
CREATE INDEX idx_notifications_read ON notifications(user_id, read);
CREATE INDEX idx_documents_due_date ON documents(due_date) WHERE due_date IS NOT NULL;

-- RLS para notifications
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Usuários podem ver suas próprias notificações"
  ON notifications FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "Usuários podem marcar suas notificações como lidas"
  ON notifications FOR UPDATE
  USING (user_id = auth.uid());

-- Function para criar notificação quando documento é enviado
CREATE OR REPLACE FUNCTION notify_new_document()
RETURNS TRIGGER AS $$
DECLARE
  company_users uuid[];
  user_record uuid;
BEGIN
  -- Buscar todos os usuários da empresa
  SELECT array_agg(user_id) INTO company_users
  FROM user_companies
  WHERE company_id = NEW.company_id
  AND user_id != NEW.uploaded_by;  -- Não notificar quem enviou

  -- Criar notificação para cada usuário
  FOREACH user_record IN ARRAY company_users
  LOOP
    INSERT INTO notifications (user_id, type, title, message, link)
    VALUES (
      user_record,
      'new_document',
      'Novo documento enviado',
      'Um novo documento foi adicionado: ' || NEW.name,
      '/documentos?folder=' || COALESCE(NEW.folder_id::text, '')
    );
  END LOOP;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger para notificar quando documento é criado
CREATE TRIGGER trigger_notify_new_document
  AFTER INSERT ON documents
  FOR EACH ROW
  EXECUTE FUNCTION notify_new_document();
