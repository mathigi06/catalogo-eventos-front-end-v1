import type { Cidade, Evento, PontoTuristico } from "../domain";
import { api } from "../http/api";

/** ===== Tipos do Envelope (API real) ===== */
export type Link = { href: string; method: string };
export type LinksMap = Record<string, Link>;
export type SortDir = "asc" | "desc";
export type Sort = { by: string; dir: SortDir };

export type Paginated<T> = {
  items: T[];
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  sort?: Sort;
};

export type ApiListResponse<T> = {
  data: Paginated<T>;
  links?: LinksMap;
  meta?: Record<string, unknown>;
};

export type ApiItemResponse<T> = {
  data: { item: T };
  links?: LinksMap;
  meta?: Record<string, unknown>;
};

type ListParams = {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortDir?: SortDir;
};

/** ===== Helpers: detectar envelope vs json-server (sem any) ===== */
type UnknownRecord = Record<string, unknown>;

function isRecord(x: unknown): x is UnknownRecord {
  return typeof x === "object" && x !== null;
}

function isApiListResponse<T>(x: unknown): x is ApiListResponse<T> {
  if (!isRecord(x)) return false;
  const data = x["data"];
  if (!isRecord(data)) return false;

  const items = data["items"];
  const page = data["page"];

  return Array.isArray(items) && typeof page === "number";
}

function isApiItemResponse<T>(x: unknown): x is ApiItemResponse<T> {
  if (!isRecord(x)) return false;
  const data = x["data"];
  if (!isRecord(data)) return false;
  return "item" in data;
}

function isJsonServerArray<T>(x: unknown): x is T[] {
  return Array.isArray(x);
}

function isJsonServerItem<T>(x: unknown): x is T {
  // json-server retorna um objeto "cru" (sem data/item)
  return isRecord(x) && !("data" in x);
}

function toApiList<T>(
  items: T[],
  page: number,
  limit: number,
  total: number,
  sort?: Sort,
): Paginated<T> {
  const safeLimit = Math.max(1, limit);
  const totalPages = Math.max(1, Math.ceil(total / safeLimit));
  return { items, page, limit: safeLimit, total, totalPages, sort };
}

/**
 * json-server suporta paginação com:
 *  - _page, _limit
 *  - _sort, _order
 * e retorna total em header: X-Total-Count
 */
async function getJsonServerList<T>(
  path: string,
  params: ListParams,
  fallbackSortBy?: string,
) {
  const page = params.page ?? 1;
  const limit = params.limit ?? 24;
  const sortBy = params.sortBy ?? fallbackSortBy;
  const sortDir = params.sortDir ?? "asc";

  const res = await api.get<T[]>(path, {
    params: {
      ...(sortBy ? { _sort: sortBy } : {}),
      ...(sortBy ? { _order: sortDir } : {}),
      _page: page,
      _limit: limit,
    },
  });

  const rawTotal = (res.headers?.["x-total-count"] ??
    res.headers?.["X-Total-Count"]) as string | undefined;

  const total = rawTotal ? Number(rawTotal) : (res.data?.length ?? 0);

  return toApiList(
    res.data ?? [],
    page,
    limit,
    Number.isFinite(total) ? total : (res.data?.length ?? 0),
    sortBy ? { by: sortBy, dir: sortDir } : undefined,
  );
}

/** ===== Tipos de retorno possíveis (API real OU json-server) ===== */
type ListOrArray<T> = ApiListResponse<T> | T[];
type ItemOrEnvelope<T> = ApiItemResponse<T> | T;

/** ===== EVENTOS ===== */
export async function listEventos(params: ListParams = {}) {
  const path = `/eventos?_page=${params.page ?? 1}&_per_page=${params.limit ?? 24}&_sort=${params.sortBy ?? "data"}&_order=${params.sortDir ?? "asc"}`;
  const res = await api.get<ListOrArray<Evento>>(path);

  const data: unknown = res.data;

  if (isApiListResponse<Evento>(data)) return data.data;
  if (isJsonServerArray<Evento>(data)) {
    // se alguém bater direto em /eventos sem _page/_limit
    // ou se o backend ignorar o envelope, a gente envolve aqui
    // (sem total real: fallback para length)
    return toApiList(
      data,
      params.page ?? 1,
      params.limit ?? data.length ?? 24,
      data.length ?? 0,
      params.sortBy
        ? { by: params.sortBy, dir: params.sortDir ?? "asc" }
        : undefined,
    );
  }

  // fallback “certo” para json-server paginado
  return getJsonServerList<Evento>("/eventos", params, "data");
}

export async function findEventById(id: number): Promise<Evento> {
  const res = await api.get<ItemOrEnvelope<Evento>>(`/eventos/${id}`);
  const data: unknown = res.data;

  if (isApiItemResponse<Evento>(data)) return data.data.item;
  if (isJsonServerItem<Evento>(data)) return data;

  throw new Error("Resposta inesperada ao buscar evento por id.");
}

export async function listEventosByCidadeId(
  cidadeId: number,
  params: ListParams = {},
) {
  const path = `/eventos?cidadeId:eq=${cidadeId}&_page=${params.page ?? 1}&_per_page=${params.limit ?? 24}&_sort=${params.sortBy ?? "data"}`;
  // API real
  const res = await api.get<ListOrArray<Evento>>(path);

  const data: unknown = res.data;

  if (isApiListResponse<Evento>(data)) return data.data;
  if (isJsonServerArray<Evento>(data)) {
    // improvável aqui, mas mantemos seguro
    return toApiList(
      data,
      params.page ?? 1,
      params.limit ?? data.length ?? 24,
      data.length ?? 0,
      (params.sortBy ?? "data")
        ? { by: params.sortBy ?? "data", dir: params.sortDir ?? "asc" }
        : undefined,
    );
  }

  // json-server fallback por query cidadeId
  const page = params.page ?? 1;
  const limit = params.limit ?? 24;
  const sortBy = params.sortBy ?? "data";
  const sortDir = params.sortDir ?? "asc";

  const r = await api.get<Evento[]>("/eventos", {
    params: {
      cidadeId,
      _sort: sortBy,
      _order: sortDir,
      _page: page,
      _limit: limit,
    },
  });

  const totalRaw = (r.headers?.["x-total-count"] ??
    r.headers?.["X-Total-Count"]) as string | undefined;

  const total = totalRaw ? Number(totalRaw) : (r.data?.length ?? 0);

  return toApiList(
    r.data ?? [],
    page,
    limit,
    Number.isFinite(total) ? total : (r.data?.length ?? 0),
    {
      by: sortBy,
      dir: sortDir,
    },
  );
}

/** ===== PONTOS TURÍSTICOS ===== */
export async function listPontosTuristicos(params: ListParams = {}) {
  const path = `/pontos-turisticos?_page=${params.page ?? 1}&_per_page=${params.limit ?? 24}&_sort=${params.sortBy ?? "nome"}`;
  const res = await api.get<ListOrArray<PontoTuristico>>(path);

  const data: unknown = res.data;

  if (isApiListResponse<PontoTuristico>(data)) return data.data;
  if (isJsonServerArray<PontoTuristico>(data)) {
    return toApiList(
      data,
      params.page ?? 1,
      params.limit ?? data.length ?? 24,
      data.length ?? 0,
      params.sortBy
        ? { by: params.sortBy, dir: params.sortDir ?? "asc" }
        : undefined,
    );
  }

  return getJsonServerList<PontoTuristico>(
    "/pontos-turisticos",
    params,
    "nome",
  );
}

export async function findPontoById(id: number): Promise<PontoTuristico> {
  const res = await api.get<ItemOrEnvelope<PontoTuristico>>(
    `/pontos-turisticos/${id}`,
  );
  const data: unknown = res.data;

  if (isApiItemResponse<PontoTuristico>(data)) return data.data.item;
  if (isJsonServerItem<PontoTuristico>(data)) return data;

  throw new Error("Resposta inesperada ao buscar ponto turístico por id.");
}

export async function listPontosByCidadeId(
  cidadeId: number,
  params: ListParams = {},
) {
  const res = await api.get<ListOrArray<PontoTuristico>>(
    `/pontos-turisticos?cidadeId:eq=${cidadeId}`,
    {
      params: {
        page: params.page ?? 1,
        limit: params.limit ?? 24,
        sortBy: params.sortBy ?? "nome",
        sortDir: params.sortDir ?? "asc",
      },
    },
  );

  const data: unknown = res.data;

  if (isApiListResponse<PontoTuristico>(data)) return data.data;
  if (isJsonServerArray<PontoTuristico>(data)) {
    return toApiList(
      data,
      params.page ?? 1,
      params.limit ?? data.length ?? 24,
      data.length ?? 0,
      (params.sortBy ?? "nome")
        ? { by: params.sortBy ?? "nome", dir: params.sortDir ?? "asc" }
        : undefined,
    );
  }

  // json-server fallback por query cidadeId
  const page = params.page ?? 1;
  const limit = params.limit ?? 24;
  const sortBy = params.sortBy ?? "nome";
  const sortDir = params.sortDir ?? "asc";

  const r = await api.get<PontoTuristico[]>("/pontos-turisticos", {
    params: {
      cidadeId,
      _sort: sortBy,
      _order: sortDir,
      _page: page,
      _limit: limit,
    },
  });

  const totalRaw = (r.headers?.["x-total-count"] ??
    r.headers?.["X-Total-Count"]) as string | undefined;

  const total = totalRaw ? Number(totalRaw) : (r.data?.length ?? 0);

  return toApiList(
    r.data ?? [],
    page,
    limit,
    Number.isFinite(total) ? total : (r.data?.length ?? 0),
    {
      by: sortBy,
      dir: sortDir,
    },
  );
}

/** ===== CIDADES ===== */
export async function listCidades(params: ListParams = {}) {
  const res = await api.get<ListOrArray<Cidade>>("/cidades", {
    params: {
      page: params.page ?? 1,
      limit: params.limit ?? 50,
      sortBy: params.sortBy ?? "nome",
      sortDir: params.sortDir ?? "asc",
    },
  });

  const data: unknown = res.data;

  if (isApiListResponse<Cidade>(data)) return data.data;
  if (isJsonServerArray<Cidade>(data)) {
    return toApiList(
      data,
      params.page ?? 1,
      params.limit ?? data.length ?? 50,
      data.length ?? 0,
      params.sortBy
        ? { by: params.sortBy, dir: params.sortDir ?? "asc" }
        : undefined,
    );
  }

  return getJsonServerList<Cidade>("/cidades", params, "nome");
}

export async function findCidadeById(id: number): Promise<Cidade> {
  const res = await api.get<ItemOrEnvelope<Cidade>>(`/cidades/${id}`);
  const data: unknown = res.data;

  if (isApiItemResponse<Cidade>(data)) return data.data.item;
  if (isJsonServerItem<Cidade>(data)) return data;

  throw new Error("Resposta inesperada ao buscar cidade por id.");
}

export async function findCidadeBySlug(slug: string): Promise<Cidade> {
  const res = await api.get<ItemOrEnvelope<Cidade[]>>(`/cidades?slug:eq=${slug}`);
  const data: unknown = res.data;

  if(isJsonServerArray<Cidade>(data)) return data[0];
  if (isApiItemResponse<Cidade>(data)) return data.data.item;
  if (isJsonServerItem<Cidade>(data)) return data;

  throw new Error("Resposta inesperada ao buscar cidade por id.");
}

type DestaquesResult = {
  eventos: Paginated<Evento>;
  pontos: Paginated<PontoTuristico>;
};

/**
 * Lista destaques para Home.
 * - API real: tenta usar params (se sua API suportar), senão filtra no client
 * - json-server: usa query ?destaque=true + paginação
 */
export async function listDestaques(params?: {
  page?: number;
  limit?: number;
}): Promise<DestaquesResult> {
  const page = params?.page ?? 1;
  const limit = params?.limit ?? 10;

  // json-server: query destaque=true
  // API real: se não aceitar "destaque" como param, vai cair no fallback e filtrar
  const [eventosRes, pontosRes] = await Promise.all([
    api.get<unknown>("/eventos", {
      params: {
        page,
        limit,
        sortBy: "data",
        sortDir: "asc",
        destaque: true,
        _page: page,
        _limit: limit,
        _sort: "data",
        _order: "asc",
      },
    }),
    api.get<unknown>("/pontos-turisticos", {
      params: {
        page,
        limit,
        sortBy: "nome",
        sortDir: "asc",
        destaque: true,
        _page: page,
        _limit: limit,
        _sort: "nome",
        _order: "asc",
      },
    }),
  ]);

  // reusa os seus guards do arquivo (isApiListResponse / isJsonServerArray)
  const evData: unknown = eventosRes.data;
  const ptData: unknown = pontosRes.data;

  const eventos = isApiListResponse<Evento>(evData)
    ? evData.data
    : isJsonServerArray<Evento>(evData)
      ? toApiList(
          evData.filter((x) => Boolean((x as Evento).destaque)),
          page,
          limit,
          evData.length,
          { by: "data", dir: "asc" },
        )
      : await getJsonServerList<Evento>(
          "/eventos",
          { page, limit, sortBy: "data", sortDir: "asc" },
          "data",
        ).then((p) => ({
          ...p,
          items: p.items.filter((x) => Boolean(x.destaque)),
          total: p.items.filter((x) => Boolean(x.destaque)).length,
          totalPages: 1,
        }));

  const pontos = isApiListResponse<PontoTuristico>(ptData)
    ? ptData.data
    : isJsonServerArray<PontoTuristico>(ptData)
      ? toApiList(
          ptData.filter((x) => Boolean((x as PontoTuristico).destaque)),
          page,
          limit,
          ptData.length,
          { by: "nome", dir: "asc" },
        )
      : await getJsonServerList<PontoTuristico>(
          "/pontos-turisticos",
          { page, limit, sortBy: "nome", sortDir: "asc" },
          "nome",
        ).then((p) => ({
          ...p,
          items: p.items.filter((x) => Boolean(x.destaque)),
          total: p.items.filter((x) => Boolean(x.destaque)).length,
          totalPages: 1,
        }));

  return { eventos, pontos };
}

// ===== CRUD EVENTOS =====
export async function createEventoApi(
  payload: Omit<Evento, "id" | "createdAt" | "updatedAt">
): Promise<Evento> {
  // API real: costuma retornar envelope; json-server retorna item cru
  const res = await api.post<unknown>("/eventos", payload);
  const data: unknown = res.data;

  if (isApiItemResponse<Evento>(data)) return data.data.item;
  if (isJsonServerItem<Evento>(data)) return data;

  throw new Error("Resposta inesperada ao criar evento.");
}

export async function updateEventoApi(
  id: number,
  payload: Partial<Omit<Evento, "id" | "createdAt" | "updatedAt">>
): Promise<Evento> {
  const res = await api.put<unknown>(`/eventos/${id}`, payload);
  const data: unknown = res.data;

  if (isApiItemResponse<Evento>(data)) return data.data.item;
  if (isJsonServerItem<Evento>(data)) return data;

  throw new Error("Resposta inesperada ao atualizar evento.");
}

export async function deleteEventoApi(id: number): Promise<void> {
  await api.delete(`/eventos/${id}`);
}

// ===== CRUD PONTOS =====
export async function createPontoApi(
  payload: Omit<PontoTuristico, "id" | "createdAt" | "updatedAt">
): Promise<PontoTuristico> {
  const res = await api.post<unknown>("/pontos-turisticos", payload);
  const data: unknown = res.data;

  if (isApiItemResponse<PontoTuristico>(data)) return data.data.item;
  if (isJsonServerItem<PontoTuristico>(data)) return data;

  throw new Error("Resposta inesperada ao criar ponto turístico.");
}

export async function updatePontoApi(
  id: number,
  payload: Partial<Omit<PontoTuristico, "id" | "createdAt" | "updatedAt">>
): Promise<PontoTuristico> {
  const res = await api.put<unknown>(`/pontos-turisticos/${id}`, payload);
  const data: unknown = res.data;

  if (isApiItemResponse<PontoTuristico>(data)) return data.data.item;
  if (isJsonServerItem<PontoTuristico>(data)) return data;

  throw new Error("Resposta inesperada ao atualizar ponto turístico.");
}

export async function deletePontoApi(id: number): Promise<void> {
  await api.delete(`/pontos-turisticos/${id}`);
}

// ===== CRUD CIDADES =====
export async function createCidadeApi(
  payload: Omit<Cidade, "id" | "createdAt" | "updatedAt">
): Promise<Cidade> {
  const res = await api.post<unknown>("/cidades", payload);
  const data: unknown = res.data;

  if (isApiItemResponse<Cidade>(data)) return data.data.item;
  if (isJsonServerItem<Cidade>(data)) return data;

  throw new Error("Resposta inesperada ao criar cidade.");
}

export async function updateCidadeApi(
  id: number,
  payload: Partial<Omit<Cidade, "id" | "createdAt" | "updatedAt">>
): Promise<Cidade> {
  const res = await api.put<unknown>(`/cidades/${id}`, payload);
  const data: unknown = res.data;

  if (isApiItemResponse<Cidade>(data)) return data.data.item;
  if (isJsonServerItem<Cidade>(data)) return data;

  throw new Error("Resposta inesperada ao atualizar cidade.");
}

export async function deleteCidadeApi(id: number): Promise<void> {
  await api.delete(`/cidades/${id}`);
}
