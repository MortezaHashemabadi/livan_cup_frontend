import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { CartProvider, useCart } from "./cart-context";

// Mock auth: controlled per-test via a mutable object
const authState: { isAuthenticated: boolean } = { isAuthenticated: true };
vi.mock("./auth-context", () => ({
  useAuth: () => ({ isAuthenticated: authState.isAuthenticated }),
}));

const openAuthModal = vi.fn();
vi.mock("./auth-modal-context", () => ({
  useAuthModal: () => ({ openAuthModal }),
}));

vi.mock("sonner", () => ({
  toast: { success: vi.fn(), error: vi.fn() },
}));

vi.mock("./api/endpoints/cart", () => ({
  cartApi: {
    get: vi.fn(),
    addItem: vi.fn(),
    updateItem: vi.fn(),
    removeItem: vi.fn(),
  },
}));

import { cartApi } from "./api/endpoints/cart";

const mockedCartApi = cartApi as unknown as {
  get: ReturnType<typeof vi.fn>;
  addItem: ReturnType<typeof vi.fn>;
  updateItem: ReturnType<typeof vi.fn>;
  removeItem: ReturnType<typeof vi.fn>;
};

const emptyCart = {
  id: 1,
  items: [],
  subtotal: 0,
  discount_code: null,
  discount_amount: 0,
  total: 0,
};

function TestConsumer() {
  const { cart, totalItems, addItem, updateQuantity, removeItem } = useCart();
  return (
    <div>
      <span data-testid="total-items">{totalItems}</span>
      <span data-testid="cart-total">{cart?.total ?? "none"}</span>
      <button onClick={() => addItem(1, 2)}>add</button>
      <button onClick={() => updateQuantity(10, 5)}>update</button>
      <button onClick={() => updateQuantity(10, 0)}>update-invalid</button>
      <button onClick={() => removeItem(10)}>remove</button>
    </div>
  );
}

function renderWithProviders() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return render(
    <QueryClientProvider client={queryClient}>
      <CartProvider>
        <TestConsumer />
      </CartProvider>
    </QueryClientProvider>,
  );
}

describe("CartProvider", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    authState.isAuthenticated = true;
    mockedCartApi.get.mockResolvedValue(emptyCart);
  });

  it("does not fetch cart when user is not authenticated", async () => {
    authState.isAuthenticated = false;
    renderWithProviders();
    await waitFor(() => {
      expect(mockedCartApi.get).not.toHaveBeenCalled();
    });
    expect(screen.getByTestId("cart-total").textContent).toBe("none");
  });

  it("fetches cart when authenticated and computes totalItems", async () => {
    mockedCartApi.get.mockResolvedValue({
      ...emptyCart,
      items: [
        { id: 1, quantity: 2 },
        { id: 2, quantity: 3 },
      ],
      total: 500,
    });

    renderWithProviders();

    await waitFor(() =>
      expect(screen.getByTestId("total-items").textContent).toBe("5"),
    );
    expect(screen.getByTestId("cart-total").textContent).toBe("500");
  });

  it("opens auth modal instead of adding item when not authenticated", async () => {
    authState.isAuthenticated = false;
    const user = userEvent.setup();
    renderWithProviders();

    await user.click(screen.getByText("add"));

    expect(openAuthModal).toHaveBeenCalled();
    expect(mockedCartApi.addItem).not.toHaveBeenCalled();
  });

  it("adds item when authenticated", async () => {
    mockedCartApi.addItem.mockResolvedValue({});
    const user = userEvent.setup();
    renderWithProviders();

    await waitFor(() => expect(mockedCartApi.get).toHaveBeenCalled());
    await user.click(screen.getByText("add"));

    await waitFor(() => expect(mockedCartApi.addItem).toHaveBeenCalled());
    expect(mockedCartApi.addItem.mock.calls[0][0]).toEqual({
      variant: 1,
      design: undefined,
      quantity: 2,
      print_file: undefined,
    });
  });

  it("ignores updateQuantity when quantity is less than 1", async () => {
    const user = userEvent.setup();
    renderWithProviders();
    await waitFor(() => expect(mockedCartApi.get).toHaveBeenCalled());

    await user.click(screen.getByText("update-invalid"));

    expect(mockedCartApi.updateItem).not.toHaveBeenCalled();
  });

  it("calls updateItem with valid quantity", async () => {
    mockedCartApi.updateItem.mockResolvedValue({});
    const user = userEvent.setup();
    renderWithProviders();
    await waitFor(() => expect(mockedCartApi.get).toHaveBeenCalled());

    await user.click(screen.getByText("update"));

    await waitFor(() =>
      expect(mockedCartApi.updateItem).toHaveBeenCalledWith(10, {
        quantity: 5,
      }),
    );
  });

  it("calls removeItem with the item id", async () => {
    mockedCartApi.removeItem.mockResolvedValue({});
    const user = userEvent.setup();
    renderWithProviders();
    await waitFor(() => expect(mockedCartApi.get).toHaveBeenCalled());

    await user.click(screen.getByText("remove"));

    await waitFor(() =>
      expect(mockedCartApi.removeItem).toHaveBeenCalledWith(10),
    );
  });
});
