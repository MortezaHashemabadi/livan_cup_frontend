import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor, act } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { AuthProvider, useAuth } from "./auth-context";

// Mock the api client so no real network calls happen
vi.mock("./api/client", () => ({
  api: {
    get: vi.fn(),
    post: vi.fn(),
  },
  registerAuthHooks: vi.fn(),
}));

import { api } from "./api/client";

const mockedApi = api as unknown as {
  get: ReturnType<typeof vi.fn>;
  post: ReturnType<typeof vi.fn>;
};

// Small test component that exposes useAuth to the DOM for assertions
function TestConsumer() {
  const { isAuthenticated, user, isLoadingAuth, sendOtp, verifyOtp, logout } =
    useAuth();

  return (
    <div>
      <span data-testid="loading">{String(isLoadingAuth)}</span>
      <span data-testid="authenticated">{String(isAuthenticated)}</span>
      <span data-testid="phone">{user?.phone ?? ""}</span>
      <button onClick={() => sendOtp("09123456789")}>send</button>
      <button onClick={() => verifyOtp("09123456789", "111111")}>
        verify
      </button>
      <button onClick={() => logout(false)}>logout</button>
    </div>
  );
}

function renderWithProvider() {
  return render(
    <AuthProvider>
      <TestConsumer />
    </AuthProvider>,
  );
}

describe("AuthProvider", () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
    // default: no refresh token in storage, refresh call not expected to matter
    mockedApi.post.mockResolvedValue({});
  });

  it("starts with isLoadingAuth true, then resolves to false with no session", async () => {
    renderWithProvider();
    await waitFor(() =>
      expect(screen.getByTestId("loading").textContent).toBe("false"),
    );
    expect(screen.getByTestId("authenticated").textContent).toBe("false");
  });

  it("calls send otp endpoint with phone and default purpose", async () => {
    const user = userEvent.setup();
    renderWithProvider();
    await waitFor(() =>
      expect(screen.getByTestId("loading").textContent).toBe("false"),
    );

    await user.click(screen.getByText("send"));

    expect(mockedApi.post).toHaveBeenCalledWith(
      "/accounts/otp/send/",
      { phone: "09123456789", purpose: "login" },
      { auth: false },
    );
  });

  it("verifyOtp stores session and marks user authenticated", async () => {
    mockedApi.post.mockImplementation((path: string) => {
      if (path === "/accounts/otp/verify/") {
        return Promise.resolve({
          access: "access-token",
          refresh: "refresh-token",
          user: { id: 1, phone: "09123456789" },
          created: true,
        });
      }
      return Promise.resolve({});
    });

    const user = userEvent.setup();
    renderWithProvider();
    await waitFor(() =>
      expect(screen.getByTestId("loading").textContent).toBe("false"),
    );

    await user.click(screen.getByText("verify"));

    await waitFor(() =>
      expect(screen.getByTestId("authenticated").textContent).toBe("true"),
    );
    expect(screen.getByTestId("phone").textContent).toBe("09123456789");
    expect(localStorage.getItem("il_refresh_token")).toBe("refresh-token");
  });

  it("logout clears session and localStorage", async () => {
    mockedApi.post.mockImplementation((path: string) => {
      if (path === "/accounts/otp/verify/") {
        return Promise.resolve({
          access: "access-token",
          refresh: "refresh-token",
          user: { id: 1, phone: "09123456789" },
          created: false,
        });
      }
      return Promise.resolve({});
    });

    const user = userEvent.setup();
    renderWithProvider();
    await waitFor(() =>
      expect(screen.getByTestId("loading").textContent).toBe("false"),
    );

    await user.click(screen.getByText("verify"));
    await waitFor(() =>
      expect(screen.getByTestId("authenticated").textContent).toBe("true"),
    );

    await act(async () => {
      await user.click(screen.getByText("logout"));
    });

    expect(screen.getByTestId("authenticated").textContent).toBe("false");
    expect(localStorage.getItem("il_refresh_token")).toBeNull();
  });

  it("restores session on mount when a refresh token exists", async () => {
    localStorage.setItem("il_refresh_token", "old-refresh-token");
    mockedApi.post.mockImplementation((path: string) => {
      if (path === "/accounts/token/refresh/") {
        return Promise.resolve({ access: "new-access-token" });
      }
      return Promise.resolve({});
    });
    mockedApi.get.mockResolvedValue({ id: 1, phone: "09121112233" });

    renderWithProvider();

    await waitFor(() =>
      expect(screen.getByTestId("authenticated").textContent).toBe("true"),
    );
    expect(screen.getByTestId("phone").textContent).toBe("09121112233");
  });

  it("clears session if restoring fails (me endpoint errors)", async () => {
    localStorage.setItem("il_refresh_token", "old-refresh-token");
    mockedApi.post.mockImplementation((path: string) => {
      if (path === "/accounts/token/refresh/") {
        return Promise.resolve({ access: "new-access-token" });
      }
      return Promise.resolve({});
    });
    mockedApi.get.mockRejectedValue(new Error("unauthorized"));

    renderWithProvider();

    await waitFor(() =>
      expect(screen.getByTestId("loading").textContent).toBe("false"),
    );
    expect(screen.getByTestId("authenticated").textContent).toBe("false");
    expect(localStorage.getItem("il_refresh_token")).toBeNull();
  });
});
