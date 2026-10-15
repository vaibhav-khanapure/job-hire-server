CREATE TRIGGER company_facilities_updated_at
BEFORE UPDATE ON company_facilities
FOR EACH ROW
EXECUTE FUNCTION set_updated_at();