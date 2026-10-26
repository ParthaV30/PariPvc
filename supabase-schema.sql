-- ============================================================
-- PARI AND CO UPVC ERP - SUPABASE DATABASE SCHEMA
-- ============================================================

-- 1. Clients & Architects Table
CREATE TABLE IF NOT EXISTS clients (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  phone TEXT,
  email TEXT,
  location TEXT,
  sitelocation TEXT,
  engineer TEXT,
  require TEXT,
  user_id TEXT DEFAULT '1',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Quotations Table
CREATE TABLE IF NOT EXISTS quotes (
  quote_id TEXT PRIMARY KEY,
  client_name TEXT,
  phone TEXT,
  location TEXT,
  site_location TEXT,
  engineer TEXT,
  details JSONB DEFAULT '{}'::jsonb,
  items JSONB DEFAULT '[]'::jsonb,
  total_amount NUMERIC DEFAULT 0,
  status TEXT DEFAULT 'Active',
  user_id TEXT DEFAULT '1',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Employees & Staff Table
CREATE TABLE IF NOT EXISTS employees (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  phone TEXT,
  email TEXT,
  role TEXT DEFAULT 'Staff',
  salary TEXT DEFAULT '0',
  user_id TEXT DEFAULT '1',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Invoices Table
CREATE TABLE IF NOT EXISTS invoices (
  invoice_no TEXT PRIMARY KEY,
  quote_id TEXT,
  client_name TEXT,
  amount NUMERIC DEFAULT 0,
  gst_amount NUMERIC DEFAULT 0,
  total_amount NUMERIC DEFAULT 0,
  status TEXT DEFAULT 'Generated',
  user_id TEXT DEFAULT '1',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Company & Cost Settings Table
CREATE TABLE IF NOT EXISTS company_settings (
  id TEXT PRIMARY KEY DEFAULT 'default',
  company_name TEXT DEFAULT 'Pari and Co',
  phone TEXT,
  email TEXT,
  address TEXT,
  gst_number TEXT,
  bank_name TEXT,
  bank_account TEXT,
  bank_ifsc TEXT,
  terms TEXT,
  costs JSONB DEFAULT '{}'::jsonb,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security (RLS)
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE quotes ENABLE ROW LEVEL SECURITY;
ALTER TABLE employees ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE company_settings ENABLE ROW LEVEL SECURITY;

-- Allow read/write with Supabase Anon Key
CREATE POLICY "Allow public read-write for clients" ON clients FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow public read-write for quotes" ON quotes FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow public read-write for employees" ON employees FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow public read-write for invoices" ON invoices FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow public read-write for company_settings" ON company_settings FOR ALL USING (true) WITH CHECK (true);
