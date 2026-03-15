import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Clock, Package, Train } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useAuth } from "../contexts/AuthContext";
import { type OrderStatus, useOrders } from "../contexts/OrdersContext";

const STATUS_STEPS: OrderStatus[] = [
  "Pending",
  "Accepted",
  "Preparing",
  "Ready",
  "Delivered",
];

const STATUS_COLORS: Record<string, string> = {
  Pending: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
  Accepted: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  Preparing: "bg-orange-500/20 text-orange-400 border-orange-500/30",
  Ready: "bg-green-500/20 text-green-400 border-green-500/30",
  Delivered: "bg-secondary text-muted-foreground",
  Cancelled: "bg-red-500/20 text-red-400 border-red-500/30",
};

function StatusTracker({ status }: { status: OrderStatus }) {
  const currentIdx = STATUS_STEPS.indexOf(status);
  return (
    <div className="flex items-center gap-1 mt-3 overflow-x-auto scrollbar-hide">
      {STATUS_STEPS.map((s, i) => (
        <div key={s} className="flex items-center gap-1">
          <div
            className={`flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-bold border ${
              i < currentIdx
                ? "gold-gradient text-primary-foreground border-transparent"
                : i === currentIdx
                  ? "bg-primary/20 border-primary text-primary"
                  : "bg-secondary border-border text-muted-foreground"
            }`}
          >
            {i < currentIdx ? "✓" : i + 1}
          </div>
          {i < STATUS_STEPS.length - 1 && (
            <div
              className={`w-4 h-0.5 flex-shrink-0 ${i < currentIdx ? "bg-primary" : "bg-border"}`}
            />
          )}
        </div>
      ))}
      <span className="text-[9px] text-muted-foreground ml-1 flex-shrink-0">
        {status}
      </span>
    </div>
  );
}

export function Orders() {
  const { orders, cancelOrder } = useOrders();
  const { addCredits } = useAuth();
  const [tab, setTab] = useState("active");

  const active = orders.filter(
    (o) => !["Delivered", "Cancelled"].includes(o.status),
  );
  const past = orders.filter((o) =>
    ["Delivered", "Cancelled"].includes(o.status),
  );

  const handleCancel = (id: string, total: number) => {
    cancelOrder(id, addCredits);
    const refund = Math.round(total * 1.1);
    toast.success(
      `Order cancelled. ₹${refund} (with 10% bonus) refunded to wallet!`,
    );
  };

  const displayed = tab === "active" ? active : past;

  return (
    <div className="min-h-screen bg-background pb-24">
      <header className="sticky top-0 z-30 bg-background border-b border-border">
        <div className="max-w-[480px] mx-auto px-4 py-3">
          <h1 className="font-display font-bold text-foreground text-xl">
            My Orders
          </h1>
        </div>
      </header>

      <div className="max-w-[480px] mx-auto px-4 pt-4">
        <Tabs value={tab} onValueChange={setTab}>
          <TabsList className="w-full bg-secondary border border-border">
            <TabsTrigger
              data-ocid="orders.active.tab"
              value="active"
              className="flex-1 data-[state=active]:gold-gradient data-[state=active]:text-primary-foreground"
            >
              Active ({active.length})
            </TabsTrigger>
            <TabsTrigger
              data-ocid="orders.past.tab"
              value="past"
              className="flex-1 data-[state=active]:gold-gradient data-[state=active]:text-primary-foreground"
            >
              Past ({past.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value={tab} className="mt-4 space-y-3">
            {displayed.length === 0 ? (
              <div
                data-ocid="orders.empty_state"
                className="flex flex-col items-center justify-center py-16 text-muted-foreground"
              >
                <Package className="h-12 w-12 mb-3 opacity-30" />
                <p className="font-medium">
                  {tab === "active" ? "No active orders" : "No past orders"}
                </p>
                <p className="text-xs mt-1">
                  Place your first order from the Home tab!
                </p>
              </div>
            ) : (
              displayed.map((order, idx) => (
                <div
                  key={order.id}
                  data-ocid={`orders.item.${idx + 1}`}
                  className="bg-card border border-border rounded-xl p-4 card-shadow"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <p className="text-foreground font-bold text-sm">
                        #{order.id}
                      </p>
                      <p className="text-muted-foreground text-xs">
                        {order.vendorName}
                      </p>
                    </div>
                    <Badge
                      className={`text-xs ${STATUS_COLORS[order.status] || ""}`}
                    >
                      {order.status}
                    </Badge>
                  </div>

                  <div className="space-y-1 mb-3">
                    {order.items.slice(0, 2).map((ci) => (
                      <p
                        key={ci.item.id}
                        className="text-muted-foreground text-xs"
                      >
                        {ci.item.name} ×{ci.quantity}
                      </p>
                    ))}
                    {order.items.length > 2 && (
                      <p className="text-muted-foreground text-xs">
                        +{order.items.length - 2} more items
                      </p>
                    )}
                  </div>

                  <div className="flex items-center gap-3 text-xs text-muted-foreground mb-2">
                    <span className="flex items-center gap-1">
                      <Train className="h-3 w-3" /> Coach {order.coachNumber},
                      Seat {order.seatNumber}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {new Date(order.createdAt).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-primary font-bold">
                      ₹{order.total}
                    </span>
                    {(order.status === "Pending" ||
                      order.status === "Accepted") && (
                      <Button
                        data-ocid={`orders.cancel.button.${idx + 1}`}
                        size="sm"
                        variant="outline"
                        className="border-red-500/50 text-red-400 hover:bg-red-500/10 text-xs h-7"
                        onClick={() => handleCancel(order.id, order.total)}
                      >
                        Cancel Order
                      </Button>
                    )}
                  </div>

                  {!(["Cancelled", "Delivered"] as OrderStatus[]).includes(
                    order.status,
                  ) && <StatusTracker status={order.status} />}
                </div>
              ))
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
