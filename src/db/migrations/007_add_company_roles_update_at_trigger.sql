CREATE TRIGGER company_roles_updated_at
BEFORE UPDATE ON company_roles
FOR EACH ROW
EXECUTE FUNCTION set_updated_at();