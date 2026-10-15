CREATE TABLE IF NOT EXISTS company_facilities (
    id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,

    company_id INTEGER NOT NULL REFERENCES companies(id) ON DELETE CASCADE,

    title VARCHAR(300) NOT NULL,
    description TEXT,

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_company_facilities_company_id
ON company_facilities(company_id);