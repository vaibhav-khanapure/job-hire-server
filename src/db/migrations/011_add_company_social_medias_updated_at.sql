CREATE TRIGGER company_social_medias_updated_at
BEFORE UPDATE ON company_social_medias
FOR EACH ROW
EXECUTE FUNCTION set_updated_at();