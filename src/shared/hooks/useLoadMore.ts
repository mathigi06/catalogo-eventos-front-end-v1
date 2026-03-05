import { useCallback, useEffect, useRef, useState } from "react";

type LoadFn<T> = (page: number) => Promise<{
  items: T[];
  page: number;
  totalPages: number;
}>;

export function useLoadMore<T>(loadFn: LoadFn<T>) {
  const [items, setItems] = useState<T[]>([]);
  const [page, setPage] = useState(0); // 0 = nada carregado ainda
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const inflight = useRef(false);

  const canLoadMore = page < totalPages;

  const loadNext = useCallback(async () => {
    if (loading || inflight.current) return;
    if (!canLoadMore) return;

    inflight.current = true;
    setLoading(true);
    setError(null);

    try {
      const nextPage = page + 1;
      const res = await loadFn(nextPage);

      setItems((prev) => (nextPage === 1 ? res.items : [...prev, ...res.items]));
      setPage(res.page);
      setTotalPages(res.totalPages);
    } catch (e) {
      console.error(e);
      setError("Não foi possível carregar mais itens.");
    } finally {
      setLoading(false);
      inflight.current = false;
    }
  }, [canLoadMore, loadFn, loading, page]);

  const reset = useCallback(() => {
    setItems([]);
    setPage(0);
    setTotalPages(1);
    setError(null);
  }, []);

  // carregamento inicial automático
  useEffect(() => {
    if (page === 0) loadNext();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { items, loading, error, canLoadMore, loadNext, reset };
}