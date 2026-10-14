CREATE TRIGGER employers_updated_at
BEFORE UPDATE ON employers
FOR EACH ROW
EXECUTE FUNCTION set_updated_at();