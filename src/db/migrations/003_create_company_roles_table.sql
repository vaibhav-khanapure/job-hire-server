CREATE TABLE IF NOT EXISTS company_roles (
    id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,

    company_id INTEGER REFERENCES companies(id) ON DELETE CASCADE,
    employer_id INTEGER REFERENCES employers(id) ON DELETE CASCADE,

    role VARCHAR(50) NOT NULL CHECK (
        role IN ('admin', 'hr', 'recruiter', 'hiring_manager')
    ),

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    UNIQUE (company_id, employer_id)
);