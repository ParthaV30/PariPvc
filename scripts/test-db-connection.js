const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://roymaxvvjczwvidpmiiw.supabase.co';
const supabaseKey = 'sb_publishable_CKc-34WGqBLXuO90JP6ccg_kmn9vGpM';

const supabase = createClient(supabaseUrl, supabaseKey);

async function testConnection() {
  console.log('Testing connection to Supabase:', supabaseUrl);

  const tables = ['clients', 'quotes', 'employees', 'invoices', 'company_settings'];
  const results = {};

  for (const table of tables) {
    try {
      const { data, error } = await supabase.from(table).select('*').limit(1);
      if (error) {
        results[table] = { status: 'ERROR', message: error.message, code: error.code };
      } else {
        results[table] = { status: 'CONNECTED', rowCount: data ? data.length : 0 };
      }
    } catch (e) {
      results[table] = { status: 'EXCEPTION', message: e.message };
    }
  }

  console.log('\n--- CONNECTION RESULTS ---');
  console.log(JSON.stringify(results, null, 2));

  const allConnected = Object.values(results).every(r => r.status === 'CONNECTED');
  if (allConnected) {
    console.log('\nSUCCESS: All tables are connected and accessible!');
  } else {
    console.log('\nATTENTION: Some tables are not yet accessible.');
  }
}

testConnection();
