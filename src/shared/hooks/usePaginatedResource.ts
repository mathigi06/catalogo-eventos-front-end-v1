import { useCallback, useEffect, useRef, useState } from "react";

export type PageResult<T> = {
  items: T[];
  page: number;
  totalPages: number;
  total?: number;
};

export type LoadPageFn<T, Q> = (args: {
  page: number;
  limit: number;
  query: Q;
}) => Promise<PageResult<T>>;

export type UsePaginatedResourceOptions<T, Q> = {
  query: Q;
  limit?: number;
  loadPage: LoadPageFn<T, Q>;
  auto?: boolean; // default true: carrega page 1 automaticamente
  resetOnQueryChange?: boolean; // default true
};

export function usePaginatedResource<T, Q>({
  query,
  limit = 12,
  loadPage,
  auto = true,
  resetOnQueryChange = true,
}: UsePaginatedResourceOptions<T, Q>) {
  const [items, setItems] = useState<T[]>([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState<number | undefined>(undefined);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const inflight = useRef(false);
  const queryKeyRef = useRef<string>("");

  const canLoadMore = page < totalPages;

  const reset = useCallback(() => {
    setItems([]);
    setPage(0);
    setTotalPages(1);
    setTotal(undefined);
    setError(null);
  }, []);

  const loadNext = useCallback(async () => {
    if (loading || inflight.current) return;
    if (!canLoadMore && page !== 0) return;

    inflight.current = true;
    setLoading(true);
    setError(null);

    try {
      const nextPage = page + 1;
      const res = await loadPage({ page: nextPage, limit, query });

      setItems((prev) => (nextPage === 1 ? res.items : [...prev, ...res.items]));
      setPage(res.page);
      setTotalPages(res.totalPages);
      if (typeof res.total === "number") setTotal(res.total);
    } catch (e) {
      console.error(e);
      setError("Não foi possível carregar os dados.");
    } finally {
      setLoading(false);
      inflight.current = false;
    }
  }, [loading, canLoadMore, page, loadPage, limit, query]);

  // reset + load ao mudar query
  useEffect(() => {
    if (!resetOnQueryChange) return;

    const key = JSON.stringify(query);
    if (queryKeyRef.current === "") queryKeyRef.current = key;

    if (queryKeyRef.current !== key) {
      queryKeyRef.current = key;
      reset();
      if (auto) void loadNext();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query, resetOnQueryChange]);

  // load inicial
  useEffect(() => {
    if (!auto) return;
    if (page === 0 && items.length === 0 && !loading) void loadNext();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [auto]);

  return {
    // dados
    items,
    page,
    totalPages,
    total,

    // status
    loading,
    error,
    canLoadMore,

    // ações
    loadNext,
    reset,
  };
}