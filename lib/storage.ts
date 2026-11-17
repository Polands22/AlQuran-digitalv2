'use client';
import { useEffect, useState } from 'react';
export function useLS<T>(key: string, init: T) {
  const [v, setV] = useState<T>(init);
  useEffect(() => { try { const s = localStorage.getItem(key); if (s) setV(JSON.parse(s)); } catch {} }, [key]);
  const set = (x: T | ((p: T) => T)) => setV((p) => {
    const n = typeof x === 'function' ? (x as (p: T) => T)(p) : x;
    try { localStorage.setItem(key, JSON.stringify(n)); } catch {}
    return n;
  });
  return [v, set] as const;
}
