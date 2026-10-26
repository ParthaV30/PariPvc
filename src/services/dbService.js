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

export async function deleteClient(clientId) {
  if (isSupabaseConfigured()) {
    try {
      await supabase.from('clients').delete().eq('id', clientId);
    } catch (e) {
      console.warn('Supabase deleteClient error:', e);
    }
  }
  const list = getLS(LS_CLIENTS_KEY).filter((c) => c.id !== clientId && c.clientId !== clientId);
  setLS(LS_CLIENTS_KEY, list);
  return true;
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

export async function deleteEmployee(empId) {
  if (isSupabaseConfigured()) {
    try {
      await supabase.from('employees').delete().eq('id', empId);
    } catch (e) {
      console.warn('Supabase deleteEmployee error:', e);
    }
  }
  const emps = getLS(LS_EMPLOYEES_KEY).filter((e) => e.id !== empId && e.user_id !== empId);
  setLS(LS_EMPLOYEES_KEY, emps);
  return true;
}

// -------------------------------------------------------------
// ENGINEERS
// -------------------------------------------------------------
export async function getEngineers(userId = '1') {
  const defaultEngineers = [
    { engineerId: 'ENG-1', engineerName: 'Er. Parthiban M', phone: '9876543210', email: 'parthi@paripvc.com', location: 'Chennai' },
    { engineerId: 'ENG-2', engineerName: 'Er. Suresh Kumar', phone: '9840123456', email: 'suresh@paripvc.com', location: 'Coimbatore' },
    { engineerId: 'ENG-3', engineerName: 'Er. Ramesh Babu', phone: '9790654321', email: 'ramesh@paripvc.com', location: 'Madurai' }
  ];

  const emps = await getEmployees(userId);
  if (Array.isArray(emps) && emps.length > 0) {
    const list = emps.map(e => ({
      engineerId: e.id || e.user_id,
      engineerName: e.name || e.emp_name,
      phone: e.phone || e.emp_phone,
      email: e.email || e.emp_email,
      location: e.location || e.emp_address || ''
    }));
    return [...list, ...defaultEngineers.filter(d => !list.some(l => l.engineerName === d.engineerName))];
  }
  return defaultEngineers;
}

export async function addEngineer(engData) {
  const newEmp = await addEmployee({
    id: `ENG-${Date.now()}`,
    name: engData.name || '',
    phone: engData.phone || '',
    email: engData.email || '',
    role: 'Engineer',
    location: engData.location || '',
    userId: engData.userId || '1'
  });
  return {
    engineerId: newEmp.id,
    engineerName: newEmp.name,
    phone: newEmp.phone,
    email: newEmp.email,
    location: newEmp.location || ''
  };
}

// -------------------------------------------------------------
// QUOTE ITEMS
// -------------------------------------------------------------
export async function saveQuoteItem(coreData) {
  if (!coreData || !coreData.quoteId) return null;
  const quoteId = coreData.quoteId;
  const itemData = coreData.data || {};

  let currentQuote = await getQuoteById(quoteId);
  if (!currentQuote) {
    currentQuote = {
      quote_id: quoteId,
      client_name: 'Customer',
      phone: '',
      location: '',
      site_location: '',
      engineer: '',
      items: [],
      total_amount: 0,
      user_id: coreData.userId || '1',
      created_at: new Date().toISOString()
    };
  }

  const items = Array.isArray(currentQuote.items) ? [...currentQuote.items] : [];
  const newItem = {
    id: `ITEM-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    quoteId,
    quoteData: itemData,
    created_at: new Date().toISOString()
  };

  items.push(newItem);
  currentQuote.items = items;

  const itemTotal = (Number(itemData.grandTotal) || 0) * (Number(itemData.qty) || 1);
  currentQuote.total_amount = (Number(currentQuote.total_amount) || 0) + itemTotal;

  await saveQuote(currentQuote);
  return newItem;
}

export async function deleteQuoteItem(quoteId, itemIndexOrId) {
  const currentQuote = await getQuoteById(quoteId);
  if (!currentQuote || !Array.isArray(currentQuote.items)) return false;

  let newItems = [];
  if (typeof itemIndexOrId === 'number') {
    newItems = currentQuote.items.filter((_, idx) => idx !== itemIndexOrId);
  } else {
    newItems = currentQuote.items.filter(it => it.id !== itemIndexOrId);
  }

  currentQuote.items = newItems;
  let newTotal = 0;
  newItems.forEach(it => {
    const qd = it.quoteData || it.data || it;
    newTotal += (Number(qd.grandTotal) || 0) * (Number(qd.qty) || 1);
  });
  currentQuote.total_amount = newTotal;

  await saveQuote(currentQuote);
  return true;
}

// -------------------------------------------------------------
// COMPANY SETTINGS
// -------------------------------------------------------------
export async function getCompanySettings(userId = '1') {
  const defaultSettings = [{
    companyName: 'Pari & Co UPVC Profiles',
    companyPhone: '+91 9876543210',
    companyEmail: 'contact@paripvc.com',
    companyAddress: 'No. 12, Industrial Estate, Chennai, Tamil Nadu',
    companyGst: '33AABCP1234F1Z5',
    companyBank: 'HDFC Bank',
    companyBranch: 'Main Branch',
    companyBankerName: 'Pari and Co',
    companyBankType: 'Current Account',
    companyAcNum: '50200012345678',
    companyIfsc: 'HDFC0001234',
    companyTerms: '1. 50% advance on order confirmation.\n2. Balance on delivery.\n3. Goods once sold will not be taken back.'
  }];

  if (isSupabaseConfigured()) {
    try {
      const { data, error } = await supabase.from('company_settings').select('*').limit(1);
      if (!error && data && data.length > 0) return data;
    } catch (e) {
      console.warn('Supabase getCompanySettings fallback:', e);
    }
  }

  const local = getLS(LS_COMPANY_KEY);
  if (Array.isArray(local) && local.length > 0) return local;
  return defaultSettings;
}

export async function saveCompanySettings(settings) {
  if (isSupabaseConfigured()) {
    try {
      await supabase.from('company_settings').upsert([settings]);
    } catch (e) {
      console.warn('Supabase saveCompanySettings fallback:', e);
    }
  }
  setLS(LS_COMPANY_KEY, [settings]);
  return settings;
}

