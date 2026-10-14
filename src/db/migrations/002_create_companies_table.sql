CREATE TABLE IF NOT EXISTS companies (
    id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,

    name VARCHAR(500) NOT NULL,
    slug TEXT NOT NULL,
    created_by INTEGER NOT NULL REFERENCES employers(id) ON DELETE SET NULL,

    logo_url TEXT,
    tagline VARCHAR(2000),
    industry VARCHAR(200),
    company_type VARCHAR(100),
    employee_count INTEGER CHECK (employee_count >= 0),
    founded_year SMALLINT CHECK (
        founded_year BETWEEN 1000 AND 2100
    ),

    headquarters VARCHAR(255),
    website TEXT,
    description TEXT,

    phone VARCHAR(30),
    contact_email VARCHAR(320),
    address TEXT,

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);