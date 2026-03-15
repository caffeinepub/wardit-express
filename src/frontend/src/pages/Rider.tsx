import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link } from "@tanstack/react-router";
import { ArrowLeft, Bike, MapPin, Package, Train } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { type OrderStatus, useOrders } from "../contexts/OrdersContext";

const RIDER_CREDS = { phone: "rider1", password: "1234" };

export function Rider() {
  const { orders, updateStatus } = useOrders();
  const [loggedIn, setLoggedIn] = useState(false);
  const [phone, setPhone] = useState("");
  const [pass, setPass] = useState("");

  const handleLogin = () => {
    if (phone === RIDER_CREDS.phone && pass === RIDER_CREDS.password) {
      setLoggedIn(true);
      toast.success("Welcome, Rider!");
    } else {
      toast.error("Use rider1 / 1234");
    }
  };

  if (!loggedIn) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        {/* Portal Header */}
        <header className="sticky top-0 z-30 bg-background border-b border-border">
          <div className="max-w-[480px] mx-auto px-4 py-3 flex items-center gap-3">
            <Link
              to="/"
              data-ocid="rider.back.link"
              className="p-1.5 rounded-lg hover:bg-secondary transition-colors"
            >
              <ArrowLeft className="h-5 w-5 text-muted-foreground" />
            </Link>
            <div className="bg-white rounded-lg px-3 py-1">
              <img
                src="/assets/uploads/IMG-20260120-WA0002-1.png"
                alt="WARDIT"
                className="h-7 object-contain"
              />
            </div>
            <span className="text-foreground font-bold text-base font-display">
              Rider Portal
            </span>
          </div>
        </header>

        <div className="flex-1 flex flex-col items-center justify-center px-6">
          <Bike className="h-12 w-12 text-primary mb-4" />
          <h1 className="font-display font-bold text-foreground text-2xl mb-1">
            Rider Login
          </h1>
          <p className="text-muted-foreground text-sm mb-6">
            Use rider1 / 1234
          </p>
          <div className="w-full max-w-sm space-y-3">
            <div>
              <Label className="text-muted-foreground text-xs mb-1 block">
                Username
              </Label>
              <Input
                data-ocid="rider.username.input"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="rider1"
                className="bg-card border-border text-foreground gold-glow-focus"
              />
            </div>
            <div>
              <Label className="text-muted-foreground text-xs mb-1 block">
                Password
              </Label>
              <Input
                data-ocid="rider.password.input"
                type="password"
                value={pass}
                onChange={(e) => setPass(e.target.value)}
                placeholder="1234"
                className="bg-card border-border text-foreground gold-glow-focus"
                onKeyDown={(e) => e.key === "Enter" && handleLogin()}
              />
            </div>
            <Button
              data-ocid="rider.login.submit_button"
              className="w-full gold-gradient text-primary-foreground font-bold h-11"
              onClick={handleLogin}
            >
              Sign In
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const readyOrders = orders.filter((o) => o.status === "Ready");

  return (
    <div className="min-h-screen bg-background pb-8">
      {/* Portal Header */}
      <header className="sticky top-0 z-30 bg-background border-b border-border">
        <div className="max-w-[480px] mx-auto px-4 py-3 flex items-center gap-3">
          <Link
            to="/"
            data-ocid="rider.back.link"
            className="p-1.5 rounded-lg hover:bg-secondary transition-colors"
          >
            <ArrowLeft className="h-5 w-5 text-muted-foreground" />
          </Link>
          <div className="bg-white rounded-lg px-3 py-1">
            <img
              src="/assets/uploads/IMG-20260120-WA0002-1.png"
              alt="WARDIT"
              className="h-7 object-contain"
            />
          </div>
          <span className="text-foreground font-bold text-base font-display">
            Rider Dashboard
          </span>
          <div className="ml-auto">
            <p className="text-muted-foreground text-xs">ADI Junction</p>
          </div>
        </div>
      </header>

      <div className="max-w-[480px] mx-auto px-4 pt-4 space-y-4">
        {/* Platform map placeholder */}
        <div className="bg-card border border-border rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <MapPin className="h-4 w-4 text-primary" />
            <span className="text-foreground font-semibold text-sm">
              Ahmedabad Junction Layout
            </span>
          </div>
          <div className="bg-secondary/50 rounded-lg p-3 text-xs text-muted-foreground space-y-1">
            <p>🔹 Gate A → Platform 1 & 2 (Shatabdi, Rajdhani)</p>
            <p>🔹 Gate B → Platform 3 & 4 (Express Trains)</p>
            <p>🔹 Gate C → Platform 5 & 6 (Passenger Trains)</p>
            <p>🔹 Gate D → Platform 7+ (Local & MEMUs)</p>
            <p className="text-primary font-medium mt-2">
              ⚡ Active Deliveries: Platform 1, 4
            </p>
          </div>
        </div>

        <h2 className="text-foreground font-semibold text-base">
          Ready for Delivery ({readyOrders.length})
        </h2>

        {readyOrders.length === 0 ? (
          <div
            data-ocid="rider.empty_state"
            className="flex flex-col items-center justify-center py-12 text-muted-foreground"
          >
            <Package className="h-12 w-12 mb-3 opacity-30" />
            <p>No deliveries assigned</p>
          </div>
        ) : (
          readyOrders.map((order, idx) => (
            <div
              key={order.id}
              data-ocid={`rider.order.card.${idx + 1}`}
              className="bg-card border border-border rounded-xl p-4 card-shadow"
            >
              <div className="flex justify-between items-start mb-3">
                <div>
                  <p className="text-foreground font-bold">#{order.id}</p>
                  <p className="text-muted-foreground text-xs">
                    {order.vendorName}
                  </p>
                </div>
                <Badge className="bg-green-500/20 text-green-400 border-green-500/30 text-xs">
                  Ready
                </Badge>
              </div>
              <div className="grid grid-cols-2 gap-2 mb-3">
                <div className="bg-secondary/50 rounded-lg p-2">
                  <p className="text-[10px] text-muted-foreground uppercase mb-0.5">
                    Platform
                  </p>
                  <p className="text-foreground font-bold text-sm flex items-center gap-1">
                    <Train className="h-3 w-3 text-primary" /> PF{" "}
                    {order.platformNumber}
                  </p>
                </div>
                <div className="bg-secondary/50 rounded-lg p-2">
                  <p className="text-[10px] text-muted-foreground uppercase mb-0.5">
                    Deliver To
                  </p>
                  <p className="text-foreground font-bold text-sm">
                    Coach {order.coachNumber}, Seat {order.seatNumber}
                  </p>
                </div>
              </div>
              <div className="space-y-0.5 mb-3">
                {order.items.map((ci) => (
                  <p key={ci.item.id} className="text-muted-foreground text-xs">
                    {ci.item.name} ×{ci.quantity}
                  </p>
                ))}
              </div>
              <div className="flex items-center justify-between">
                <span className="text-primary font-bold">₹{order.total}</span>
                <Button
                  data-ocid={`rider.deliver.button.${idx + 1}`}
                  size="sm"
                  className="gold-gradient text-primary-foreground font-semibold h-8 text-xs"
                  onClick={() => {
                    updateStatus(order.id, "Delivered" as OrderStatus);
                    toast.success(`Order #${order.id} delivered!`);
                  }}
                >
                  Mark Delivered
                </Button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
