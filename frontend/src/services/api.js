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
