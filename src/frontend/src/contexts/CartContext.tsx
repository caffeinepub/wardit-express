import {
  type ReactNode,
  createContext,
  useCallback,
  useContext,
  useState,
} from "react";
import type { MenuItemLocal } from "../data/menuData";

export interface CartItem {
  item: MenuItemLocal;
  quantity: number;
}

interface CartContextValue {
  items: CartItem[];
  addItem: (item: MenuItemLocal) => void;
  removeItem: (id: string) => void;
  updateQty: (id: string, qty: number) => void;
  clearCart: () => void;
  totalItems: number;
  subtotal: number;
  discount: number;
  ecoPackaging: boolean;
  setEcoPackaging: (v: boolean) => void;
  total: number;
  isOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
}

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [ecoPackaging, setEcoPackaging] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const addItem = useCallback((item: MenuItemLocal) => {
    setItems((prev) => {
      const existing = prev.find((c) => c.item.id === item.id);
      if (existing) {
        return prev.map((c) =>
          c.item.id === item.id ? { ...c, quantity: c.quantity + 1 } : c,
        );
      }
      return [...prev, { item, quantity: 1 }];
    });
  }, []);

  const removeItem = useCallback((id: string) => {
    setItems((prev) => prev.filter((c) => c.item.id !== id));
  }, []);

  const updateQty = useCallback((id: string, qty: number) => {
    if (qty <= 0) {
      setItems((prev) => prev.filter((c) => c.item.id !== id));
    } else {
      setItems((prev) =>
        prev.map((c) => (c.item.id === id ? { ...c, quantity: qty } : c)),
      );
    }
  }, []);

  const clearCart = useCallback(() => {
    setItems([]);
    setEcoPackaging(false);
  }, []);

  const totalItems = items.reduce((s, c) => s + c.quantity, 0);
  const subtotal = items.reduce((s, c) => s + c.item.price * c.quantity, 0);
  const discount = subtotal > 1000 ? Math.round(subtotal * 0.15) : 0;
  const ecoFee = ecoPackaging ? 5 : 0;
  const total = subtotal - discount + ecoFee;

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateQty,
        clearCart,
        totalItems,
        subtotal,
        discount,
        ecoPackaging,
        setEcoPackaging,
        total,
        isOpen,
        openCart: () => setIsOpen(true),
        closeCart: () => setIsOpen(false),
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
