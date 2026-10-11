// Public, browser-safe Supabase configuration. Never put database passwords or service-role keys here.
const SUPABASE_URL='https://xzxyxureqyroyuijjdnw.supabase.co';
const SUPABASE_PUBLISHABLE_KEY='sb_publishable_govho05XdVC9aO1NuAWEZA_4BkF26wI';

async function submitConsultation(payload) {
  const response = await fetch(SUPABASE_URL + '/rest/v1/consultation_requests', {
    method: 'POST',
    headers: {
      'apikey': SUPABASE_PUBLISHABLE_KEY,
      'Authorization': 'Bearer ' + SUPABASE_PUBLISHABLE_KEY,
      'Content-Type': 'application/json',
      'Prefer': 'return=minimal'
    },
    body: JSON.stringify(payload)
  });
  if (!response.ok) {
    const errorText = await response.text();
    console.error('Consultation submission failed:', response.status, errorText);
    throw new Error('저장 요청 실패 (' + response.status + ')');
  }
}
