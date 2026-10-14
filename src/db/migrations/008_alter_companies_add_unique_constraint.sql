ALTER TABLE companies
ADD CONSTRAINT companies_slug_unique UNIQUE (slug);