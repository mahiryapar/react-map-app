const BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5108';

export async function savePolygon({ geometry, properties }) {
  const resp = await fetch(`${BASE_URL}/polygons`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ geometry, properties }),
  });
  if (!resp.ok) {
    const text = await resp.text();
    throw new Error(text || `HTTP ${resp.status}`);
  }
  return resp.json().catch(() => ({}));
}

export async function updatePolygon({ id, geometry, properties }) {
  const numericId = typeof id === 'string' ? parseInt(id.split('.').pop(), 10) : id;
  if (!Number.isInteger(numericId)) {
    throw new Error(`Geçersiz id değeri: ${id}`);
  }
  console.log("Updating polygon with id:", numericId, geometry, properties);
  const payload = { id: numericId, geometry, properties };

  const resp = await fetch(`${BASE_URL}/polygons`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!resp.ok) {
    const text = await resp.text();
    throw new Error(text || `HTTP ${resp.status}`);
  }
  return resp.json().catch(() => ({}));
}


/**
 * Server-side paginated table data fetcher
 * @param {Object} params
 * @param {AbortSignal} [params.signal] - optional AbortController signal
 * @param {number} [params.first=0] - DataTable's offset (zero-based)
 * @param {number} [params.rows=10] - page size
 * @param {string|null} [params.sortField=null] - field name to sort by
 * @param {1|-1|null|string} [params.sortOrder=null] - 1 asc, -1 desc, or 'asc'/'desc'
 * @returns {Promise<{ data: any[], total: number }>}
 */
export async function fetchDataTable({ signal, first = 0, rows = 10, sortField = null, sortOrder = null } = {}) {
  const safeRows = Number(rows) > 0 ? Number(rows) : 10;
  const page = Math.floor(Number(first || 0) / safeRows);

  const params = new URLSearchParams({
    page: String(page),
    size: String(safeRows),
  });

  if (sortField) {
    params.append('sortField', String(sortField));
    const order = sortOrder === 1 || sortOrder === 'asc' ? 'asc' : sortOrder === -1 || sortOrder === 'desc' ? 'desc' : '';
    if (order) params.append('sortOrder', order);
  }

  const resp = await fetch(`${BASE_URL}/polygons/paged?${params.toString()}`,
    { headers: { Accept: 'application/json' }, signal }
  );
  if (!resp.ok) {
    const text = await resp.text();
    throw new Error(text || `HTTP ${resp.status}`);
  }

  let payload;
  try {
    payload = await resp.json();
  } catch {
    payload = [];
  }
  console.log("Fetched payload:", payload);
  const data = payload.items;

  const total = payload.total;

  return { data, total: Number(total) || 0 };
}

// export async function fetchPolygons() {
//   const resp = await fetch(`${BASE_URL}/polygons`);
//   if (!resp.ok) {
//     const text = await resp.text();
//     throw new Error(text || `HTTP ${resp.status}`);
//   }
//   return resp.json().catch(() => ({}));
// }



export async function deletePolygon(id) {
  const numericId = typeof id === 'string' ? parseInt(id.split('.').pop(), 10) : id;
  if (!Number.isInteger(numericId)) {
    throw new Error(`Geçersiz id değeri: ${id}`);
  }
  const resp = await fetch(`${BASE_URL}/polygons/${numericId}`, {
    method: 'DELETE',
  });
  if (!resp.ok) {
    const text = await resp.text();
    throw new Error(text || `HTTP ${resp.status}`);
  }
  return resp.json().catch(() => ({}));
}

export { BASE_URL };
