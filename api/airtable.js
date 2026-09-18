export default async function handler(req, res) {
  const token = process.env.AIRTABLE_PAT;
  if (!token) return res.status(500).json({ error: 'AIRTABLE_PAT not configured' });

  const { table, recordId } = req.query;
  if (!table) return res.status(400).json({ error: 'Missing table param' });

  const baseId = 'appRlcL5eYnjxfXV0';
  let url = `https://api.airtable.com/v0/${baseId}/${table}`;
  if (recordId) url += `/${recordId}`;

  const params = new URLSearchParams();
  for (const [k, v] of Object.entries(req.query)) {
    if (k !== 'table' && k !== 'recordId') params.append(k, v);
  }
  const qs = params.toString();
  if (qs && req.method === 'GET') url += `?${qs}`;

  const opts = {
    method: req.method,
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  };

  if (req.method !== 'GET' && req.method !== 'DELETE' && req.body) {
    opts.body = JSON.stringify(req.body);
  }

  try {
    const resp = await fetch(url, opts);
    const data = await resp.json();
    res.status(resp.status).json(data);
  } catch (e) {
    res.status(502).json({ error: e.message });
  }
}
