import { supabase, isSupabaseConfigured } from './supabase';

const LS_CLIENTS_KEY = 'pari_clients';
const LS_QUOTES_KEY = 'pari_quotes';
const LS_EMPLOYEES_KEY = 'pari_employees';
const LS_INVOICES_KEY = 'pari_invoices';
const LS_COMPANY_KEY = 'pari_company';

const getLS = (key) => {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    return [];
  }
};

const setLS = (key, data) => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (e) {
    console.error(`Failed to write to localStorage for key ${key}:`, e);
  }
};

// -------------------------------------------------------------
// CLIENTS
// -------------------------------------------------------------
export async function getClients(userId = '1') {
  if (isSupabaseConfigured()) {
    try {
      const { data, error } = await supabase
        .from('clients')
        .select('*')
        .order('created_at', { ascending: false });
      if (!error && data) return data;
    } catch (e) {
      console.warn('Supabase getClients error, falling back to local storage:', e);
    }
  }
  return getLS(LS_CLIENTS_KEY);
}

export async function addClient(clientData) {
  const newClient = {
    id: clientData.id || `CLI-${Date.now()}`,
    name: clientData.name || '',
    phone: clientData.phone || '',
    email: clientData.email || '',
    location: clientData.location || '',
    sitelocation: clientData.sitelocation || '',
    engineer: clientData.engineer || '',
    require: clientData.require || '',
    user_id: clientData.userId || '1',
    created_at: new Date().toISOString()
  };

  if (isSupabaseConfigured()) {
    try {
      const { data, error } = await supabase
        .from('clients')
        .insert([newClient])
        .select();
      if (!error && data && data.length > 0) return data[0];
    } catch (e) {
      console.warn('Supabase addClient error, using local storage:', e);
    }
  }

  const list = getLS(LS_CLIENTS_KEY);
  list.unshift(newClient);
  setLS(LS_CLIENTS_KEY, list);
  return newClient;
}

// -------------------------------------------------------------
// QUOTATIONS
// -------------------------------------------------------------
export async function getQuotes(userId = '1') {
  if (isSupabaseConfigured()) {
    try {
      const { data, error } = await supabase
        .from('quotes')
        .select('*')
        .order('created_at', { ascending: false });
      if (!error && data) return data;
    } catch (e) {
      console.warn('Supabase getQuotes error, falling back to local storage:', e);
    }
  }
  return getLS(LS_QUOTES_KEY);
}

export async function getQuoteById(quoteId) {
  if (isSupabaseConfigured()) {
    try {
      const { data, error } = await supabase
        .from('quotes')
        .select('*')
        .eq('quote_id', quoteId)
        .single();
      if (!error && data) return data;
    } catch (e) {
      console.warn('Supabase getQuoteById error, falling back to local storage:', e);
    }
  }
  const quotes = getLS(LS_QUOTES_KEY);
  return quotes.find((q) => q.quote_id === quoteId || q.id === quoteId) || null;
}

export async function saveQuote(quoteData) {
  const newQuote = {
    quote_id: quoteData.uniqueId || quoteData.quote_id || `Q-${Date.now()}`,
    client_name: quoteData.name || quoteData.client_name || '',
    phone: quoteData.phone || '',
    location: quoteData.location || '',
    site_location: quoteData.sitelocation || quoteData.site_location || '',
    engineer: quoteData.engineer || '',
    details: quoteData.values || quoteData.details || {},
    items: quoteData.items || [],
    total_amount: quoteData.total_amount || 0,
    status: quoteData.status || 'Active',
    user_id: quoteData.userId || '1',
    created_at: new Date().toISOString()
  };

  if (isSupabaseConfigured()) {
    try {
      const { data, error } = await supabase
        .from('quotes')
        .upsert([newQuote], { onConflict: 'quote_id' })
        .select();
      if (!error && data && data.length > 0) return data[0];
    } catch (e) {
      console.warn('Supabase saveQuote error, using local storage:', e);
    }
  }

  const quotes = getLS(LS_QUOTES_KEY);
  const existingIdx = quotes.findIndex((q) => q.quote_id === newQuote.quote_id);
  if (existingIdx >= 0) {
    quotes[existingIdx] = { ...quotes[existingIdx], ...newQuote };
  } else {
    quotes.unshift(newQuote);
  }
  setLS(LS_QUOTES_KEY, quotes);
  return newQuote;
}

export async function deleteQuote(quoteId) {
  if (isSupabaseConfigured()) {
    try {
      await supabase.from('quotes').delete().eq('quote_id', quoteId);
    } catch (e) {
      console.warn('Supabase deleteQuote error:', e);
    }
  }
  const quotes = getLS(LS_QUOTES_KEY).filter((q) => q.quote_id !== quoteId && q.id !== quoteId);
  setLS(LS_QUOTES_KEY, quotes);
  return true;
}

// -------------------------------------------------------------
// EMPLOYEES
// -------------------------------------------------------------
export async function getEmployees(userId = '1') {
  if (isSupabaseConfigured()) {
    try {
      const { data, error } = await supabase
        .from('employees')
        .select('*')
        .order('created_at', { ascending: false });
      if (!error && data) return data;
    } catch (e) {
      console.warn('Supabase getEmployees error, falling back to local storage:', e);
    }
  }
  return getLS(LS_EMPLOYEES_KEY);
}

export async function addEmployee(employeeData) {
  const newEmp = {
    id: employeeData.id || `EMP-${Date.now()}`,
    name: employeeData.name || '',
    phone: employeeData.phone || '',
    email: employeeData.email || '',
    role: employeeData.role || 'Staff',
    salary: employeeData.salary || '0',
    user_id: employeeData.userId || '1',
    created_at: new Date().toISOString()
  };

  if (isSupabaseConfigured()) {
    try {
      const { data, error } = await supabase
        .from('employees')
        .insert([newEmp])
        .select();
      if (!error && data && data.length > 0) return data[0];
    } catch (e) {
      console.warn('Supabase addEmployee error, using local storage:', e);
    }
  }

  const emps = getLS(LS_EMPLOYEES_KEY);
  emps.unshift(newEmp);
  setLS(LS_EMPLOYEES_KEY, emps);
  return newEmp;
}

// -------------------------------------------------------------
// INVOICES
// -------------------------------------------------------------
export async function getInvoices(userId = '1') {
  if (isSupabaseConfigured()) {
    try {
      const { data, error } = await supabase
        .from('invoices')
        .select('*')
        .order('created_at', { ascending: false });
      if (!error && data) return data;
    } catch (e) {
      console.warn('Supabase getInvoices error, falling back to local storage:', e);
    }
  }
  return getLS(LS_INVOICES_KEY);
}

export async function saveInvoice(invoiceData) {
  const newInv = {
    invoice_no: invoiceData.invoice_no || `INV-${Date.now()}`,
    quote_id: invoiceData.quote_id || '',
    client_name: invoiceData.client_name || '',
    amount: invoiceData.amount || 0,
    gst_amount: invoiceData.gst_amount || 0,
    total_amount: invoiceData.total_amount || 0,
    status: invoiceData.status || 'Generated',
    user_id: invoiceData.userId || '1',
    created_at: new Date().toISOString()
  };

  if (isSupabaseConfigured()) {
    try {
      const { data, error } = await supabase
        .from('invoices')
        .upsert([newInv], { onConflict: 'invoice_no' })
        .select();
      if (!error && data && data.length > 0) return data[0];
    } catch (e) {
      console.warn('Supabase saveInvoice error, using local storage:', e);
    }
  }

  const invoices = getLS(LS_INVOICES_KEY);
  invoices.unshift(newInv);
  setLS(LS_INVOICES_KEY, invoices);
  return newInv;
}
