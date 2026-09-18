const BASE_ID = 'appRlcL5eYnjxfXV0';

export default async (req) => {
  const token = Netlify.env.get('AIRTABLE_PAT');
  if (!token) return new Response(JSON.stringify({ error: 'AIRTABLE_PAT not configured' }), { status: 500 });

  const url = new URL(req.url);
  const table = url.searchParams.get('table');
  if (!table) return new Response(JSON.stringify({ error: 'Missing table param' }), { status: 400 });

  const recordId = url.searchParams.get('recordId');

  let airtableUrl = `https://api.airtable.com/v0/${BASE_ID}/${table}`;
  if (recordId) airtableUrl += `/${recordId}`;

  const forwardParams = new URLSearchParams();
  for (const [k, v] of url.searchParams.entries()) {
    if (k !== 'table' && k !== 'recordId') forwardParams.append(k, v);
  }
  const qs = forwardParams.toString();
  if (qs && req.method === 'GET') airtableUrl += `?${qs}`;

  const opts = {
    method: req.method,
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  };

  if (req.method !== 'GET' && req.method !== 'DELETE') {
    try {
      const body = await req.text();
      if (body) opts.body = body;
    } catch {}
  }

  try {
    const resp = await fetch(airtableUrl, opts);
    const data = await resp.text();
    return new Response(data, {
      status: resp.status,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: e.message }), { status: 502 });
  }
};

export const config = {
  path: '/api/airtable',
};
