CREATE TRIGGER company_benefits_updated_at
BEFORE UPDATE ON company_benefits
FOR EACH ROW
EXECUTE FUNCTION set_updated_at();