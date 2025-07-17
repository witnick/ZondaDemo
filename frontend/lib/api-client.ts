const API_ROOT = 'https://localhost:7295';

export async function apiGet<T>(path: string): Promise<T> {
  const res = await fetch(`${API_ROOT}${path}`);
  if (!res.ok) {
    let errorMsg = 'API GET error';
    try {
      const err = await res.json();
      errorMsg = err.message || JSON.stringify(err);
    } catch {}
    throw new Error(errorMsg);
  }
  return res.json();
}

export async function apiPost<T>(path: string, body: any): Promise<T> {
  const res = await fetch(`${API_ROOT}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    let errorMsg = 'API POST error';
    try {
      const err = await res.json();
      errorMsg = err.message || JSON.stringify(err);
    } catch {}
    throw new Error(errorMsg);
  }
  return res.json();
}

export async function apiPut<T>(path: string, body: any): Promise<T> {
  const res = await fetch(`${API_ROOT}${path}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    let errorMsg = 'API PUT error';
    try {
      const err = await res.json();
      errorMsg = err.message || JSON.stringify(err);
    } catch {}
    throw new Error(errorMsg);
  }
  return res.json();
}

export async function apiDelete<T>(path: string): Promise<T> {
  const res = await fetch(`${API_ROOT}${path}`, { method: 'DELETE' });
  if (!res.ok && res.status !== 204) {
    let errorMsg = 'API DELETE error';
    try {
      const err = await res.json();
      errorMsg = err.message || JSON.stringify(err);
    } catch {}
    throw new Error(errorMsg);
  }
  // If 204 No Content, return null
  return res.status === 204 ? (null as T) : res.json();
} 