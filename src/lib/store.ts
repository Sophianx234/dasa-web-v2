import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export type CartItem = any;
export type UserDTO = any;

export type storeState = {
  user: UserDTO | null;
  cart: CartItem[];
  removeItem: (id: string) => void;
  updateQuantity: (id: string, qty: number) => void;
  clearCart: () => void;

  // computed values
  cartTotal: () => number;
  setUser: (user: UserDTO|null) => void;
  setCart: (product: any, qty: number) => void;
  loadCart: (cartItems: any[]) => void;
};

export const useDashStore = create<storeState>()(
  persist(
    (set, get) => ({
      user: null,
      cart: [],
  setUser: (user: any|null) => set(() => ({ user })),
  setCart: (product: any, qty: number) =>
  set((state) => {
    const existing = state.cart.find((item) => item._id === product._id);

    if (existing) {
      return {
        cart: state.cart.map((item) =>
          item._id === product._id
            ? { ...item, quantity:  qty }
            : item
        ),
      };
    }

    return {
      cart: [...state.cart, { ...product, quantity: qty }],
    };
  }),
   removeItem: (id: string) =>
    set((state) => ({
      cart: state.cart.filter((item) => String(item._id) !== id),
    })),

  // Update quantity (not add — overwrite)
  updateQuantity: (id:string, qty:number) =>
    set((state) => ({
      cart: state.cart.map((item) =>
        item._id === id ? { ...item, quantity: qty } : item
      ),
    })),
loadCart: (cartItems) =>
    set(() => ({
      cart: cartItems.map((item) => ({
        ...item.product,        // product data
        quantity: item.quantity // quantity from DB
      })),
    })),
  // Clear entire cart
  clearCart: () => set({ cart: [] }),

  // Computed: total cost
  cartTotal: () => {
    return get().cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
  }, 

}),
{
  name: "rammys-radiance-store",
  storage: createJSONStorage(() => localStorage),
  partialize: (state) => ({ cart: state.cart }),
}
));
