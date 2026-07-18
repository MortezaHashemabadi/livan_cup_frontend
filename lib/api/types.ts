export interface User {
  id: number;
  phone: string;
  first_name: string;
  last_name: string;
  is_phone_verified: boolean;
  date_joined: string;
}

export interface Address {
  id: number;
  title: string;
  province: string;
  city: string;
  full_address: string;
  postal_code: string;
  is_default: boolean;
}

export type OtpPurpose = "login" | "register";

export interface OtpSendRequest {
  phone: string;
  purpose?: OtpPurpose;
}
export interface OtpSendResponse {
  detail: string;
}

export interface OtpVerifyRequest {
  phone: string;
  code: string;
}
export interface OtpVerifyResponse {
  access: string;
  refresh: string;
  user: User;
  created: boolean;
}

export interface TokenRefreshResponse {
  access: string;
  refresh?: string;
}

export type ApiFieldErrors = Record<string, string[]>;

export class ApiError extends Error {
  constructor(
    public status: number,
    public payload: ApiFieldErrors | { detail: string } | unknown,
  ) {
    super(
      typeof payload === "object" && payload !== null && "detail" in payload
        ? String((payload as any).detail)
        : "API Error",
    );
    this.name = "ApiError";
  }
}
