import {
  type ReactNode,
  createContext,
  useCallback,
  useContext,
  useState,
} from "react";
import type { CartItem } from "./CartContext";

export type OrderStatus =
  | "Pending"
  | "Accepted"
  | "Preparing"
  | "Ready"
  | "Delivered"
  | "Cancelled";

export interface LocalOrder {
  id: string;
  items: CartItem[];
  subtotal: number;
  discount: number;
  ecoPackaging: boolean;
  total: number;
  paymentMethod: string;
  coachNumber: string;
  seatNumber: string;
  platformNumber: string;
  trainNumber: string;
  vendorId: string;
  vendorName: string;
  status: OrderStatus;
  createdAt: number;
}

interface OrdersContextValue {
  orders: LocalOrder[];
  addOrder: (order: Omit<LocalOrder, "id" | "createdAt">) => string;
  updateStatus: (id: string, status: OrderStatus) => void;
  cancelOrder: (id: string, addCredits: (n: number) => void) => void;
}

const OrdersContext = createContext<OrdersContextValue | null>(null);

function genId() {
  return `WRD${Math.floor(Math.random() * 900000 + 100000)}`;
}

export function OrdersProvider({ children }: { children: ReactNode }) {
  const [orders, setOrders] = useState<LocalOrder[]>([]);

  const addOrder = useCallback(
    (order: Omit<LocalOrder, "id" | "createdAt">): string => {
      const id = genId();
      setOrders((prev) => [{ ...order, id, createdAt: Date.now() }, ...prev]);
      return id;
    },
    [],
  );

  const updateStatus = useCallback((id: string, status: OrderStatus) => {
    setOrders((prev) => prev.map((o) => (o.id === id ? { ...o, status } : o)));
  }, []);

  const cancelOrder = useCallback(
    (id: string, addCredits: (n: number) => void) => {
      setOrders((prev) =>
        prev.map((o) => {
          if (
            o.id === id &&
            (o.status === "Pending" || o.status === "Accepted")
          ) {
            const refund = Math.round(o.total * 1.1);
            addCredits(refund);
            return { ...o, status: "Cancelled" as OrderStatus };
          }
          return o;
        }),
      );
    },
    [],
  );

  return (
    <OrdersContext.Provider
      value={{ orders, addOrder, updateStatus, cancelOrder }}
    >
      {children}
    </OrdersContext.Provider>
  );
}

export function useOrders() {
  const ctx = useContext(OrdersContext);
  if (!ctx) throw new Error("useOrders must be used within OrdersProvider");
  return ctx;
}
