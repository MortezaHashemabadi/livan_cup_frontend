import { ApiError } from "./types";

const BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://127.0.0.1:8000/api";

type TokenGetter = () => string | null;
type RefreshHandler = () => Promise<string | null>;

let getAccessToken: TokenGetter = () => null;
let onRefresh: RefreshHandler = async () => null;
let onAuthFailure: () => void = () => {};

export function registerAuthHooks(opts: {
  getAccessToken: TokenGetter;
  onRefresh: RefreshHandler;
  onAuthFailure: () => void;
}) {
  getAccessToken = opts.getAccessToken;
  onRefresh = opts.onRefresh;
  onAuthFailure = opts.onAuthFailure;
}

interface RequestOptions {
  method?: "GET" | "POST" | "PATCH" | "PUT" | "DELETE";
  body?: unknown;
  auth?: boolean;
  isFormData?: boolean;
  _retry?: boolean;
}

async function parseErrorBody(res: Response) {
  try {
    return await res.json();
  } catch {
    return { detail: res.statusText };
  }
}

export async function apiFetch<T>(
  path: string,
  options: RequestOptions = {},
): Promise<T> {
  const {
    method = "GET",
    body,
    auth = true,
    isFormData = false,
    _retry = false,
  } = options;

  const headers: Record<string, string> = {};
  if (!isFormData) headers["Content-Type"] = "application/json";
  if (auth) {
    const token = getAccessToken();
    if (token) headers["Authorization"] = `Bearer ${token}`;
  }

  const res = await fetch(`${BASE_URL}${path}`, {
    method,
    headers,
    body:
      body === undefined
        ? undefined
        : isFormData
          ? (body as FormData)
          : JSON.stringify(body),
  });

  if (res.status === 401 && auth && !_retry) {
    const newAccess = await onRefresh();
    if (newAccess) return apiFetch<T>(path, { ...options, _retry: true });
    onAuthFailure();
    throw new ApiError(401, await parseErrorBody(res));
  }

  if (!res.ok) throw new ApiError(res.status, await parseErrorBody(res));
  if (res.status === 204) return undefined as T;
  return res.json() as Promise<T>;
}

export const api = {
  get: <T>(path: string, options?: Omit<RequestOptions, "method" | "body">) =>
    apiFetch<T>(path, { ...options, method: "GET" }),
  post: <T>(
    path: string,
    body?: unknown,
    options?: Omit<RequestOptions, "method" | "body">,
  ) => apiFetch<T>(path, { ...options, method: "POST", body }),
  patch: <T>(
    path: string,
    body?: unknown,
    options?: Omit<RequestOptions, "method" | "body">,
  ) => apiFetch<T>(path, { ...options, method: "PATCH", body }),
  delete: <T>(
    path: string,
    options?: Omit<RequestOptions, "method" | "body">,
  ) => apiFetch<T>(path, { ...options, method: "DELETE" }),
};
