import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Link } from "@tanstack/react-router";
import { ArrowLeft, Check, ChefHat, Store, Train, X } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import {
  type LocalOrder,
  type OrderStatus,
  useOrders,
} from "../contexts/OrdersContext";

const VENDOR_CREDS = { phone: "vendor1", password: "1234" };
const VENDOR_INFO = {
  name: "Ahmedabad Junction Canteen",
  platformNumber: "1",
  gateEntry: "Gate A",
};

export function Vendor() {
  const { orders, updateStatus } = useOrders();
  const [loggedIn, setLoggedIn] = useState(false);
  const [phone, setPhone] = useState("");
  const [pass, setPass] = useState("");

  const handleLogin = () => {
    if (phone === VENDOR_CREDS.phone && pass === VENDOR_CREDS.password) {
      setLoggedIn(true);
      toast.success("Welcome, Vendor!");
    } else {
      toast.error("Invalid credentials. Use vendor1 / 1234");
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
              data-ocid="vendor.back.link"
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
              Vendor Portal
            </span>
          </div>
        </header>

        <div className="flex-1 flex flex-col items-center justify-center px-6">
          <Store className="h-12 w-12 text-primary mb-4" />
          <h1 className="font-display font-bold text-foreground text-2xl mb-1">
            Vendor Login
          </h1>
          <p className="text-muted-foreground text-sm mb-6">
            Use vendor1 / 1234
          </p>
          <div className="w-full max-w-sm space-y-3">
            <div>
              <Label className="text-muted-foreground text-xs mb-1 block">
                Username
              </Label>
              <Input
                data-ocid="vendor.username.input"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="vendor1"
                className="bg-card border-border text-foreground gold-glow-focus"
              />
            </div>
            <div>
              <Label className="text-muted-foreground text-xs mb-1 block">
                Password
              </Label>
              <Input
                data-ocid="vendor.password.input"
                type="password"
                value={pass}
                onChange={(e) => setPass(e.target.value)}
                placeholder="1234"
                className="bg-card border-border text-foreground gold-glow-focus"
                onKeyDown={(e) => e.key === "Enter" && handleLogin()}
              />
            </div>
            <Button
              data-ocid="vendor.login.submit_button"
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

  const newOrders = orders.filter((o) => o.status === "Pending");
  const preparing = orders.filter(
    (o) => o.status === "Accepted" || o.status === "Preparing",
  );
  const ready = orders.filter((o) => o.status === "Ready");

  const OrderCard = ({ order, idx }: { order: LocalOrder; idx: number }) => (
    <div
      data-ocid={`vendor.order.card.${idx + 1}`}
      className="bg-card border border-border rounded-xl p-4 card-shadow"
    >
      <div className="flex justify-between items-start mb-2">
        <div>
          <p className="text-foreground font-bold text-sm">#{order.id}</p>
          <p className="text-muted-foreground text-xs flex items-center gap-1">
            <Train className="h-3 w-3" /> Coach {order.coachNumber}, Seat{" "}
            {order.seatNumber} | PF {order.platformNumber}
          </p>
        </div>
        <span className="text-primary font-bold text-sm">₹{order.total}</span>
      </div>
      <div className="space-y-0.5 mb-3">
        {order.items.map((ci) => (
          <p key={ci.item.id} className="text-muted-foreground text-xs">
            {ci.item.name} ×{ci.quantity}
          </p>
        ))}
      </div>
      <div className="flex gap-2">
        {order.status === "Pending" && (
          <>
            <Button
              data-ocid={`vendor.accept.button.${idx + 1}`}
              size="sm"
              className="flex-1 bg-green-500/20 border border-green-500/50 text-green-400 hover:bg-green-500/30 h-8 text-xs gap-1"
              onClick={() => {
                updateStatus(order.id, "Accepted" as OrderStatus);
                toast.success(`Order #${order.id} accepted!`);
              }}
            >
              <Check className="h-3 w-3" /> Accept
            </Button>
            <Button
              data-ocid={`vendor.reject.button.${idx + 1}`}
              size="sm"
              className="flex-1 bg-red-500/20 border border-red-500/50 text-red-400 hover:bg-red-500/30 h-8 text-xs gap-1"
              onClick={() => {
                updateStatus(order.id, "Cancelled" as OrderStatus);
                toast.error(`Order #${order.id} rejected`);
              }}
            >
              <X className="h-3 w-3" /> Reject
            </Button>
          </>
        )}
        {(order.status === "Accepted" || order.status === "Preparing") && (
          <Button
            data-ocid={`vendor.ready.button.${idx + 1}`}
            size="sm"
            className="flex-1 gold-gradient text-primary-foreground h-8 text-xs gap-1"
            onClick={() => {
              updateStatus(order.id, "Ready" as OrderStatus);
              toast.success(`Order #${order.id} is Ready!`);
            }}
          >
            <ChefHat className="h-3 w-3" /> Mark Food Ready
          </Button>
        )}
        {order.status === "Ready" && (
          <Badge className="flex-1 justify-center py-1.5 bg-green-500/20 text-green-400 border-green-500/30 text-xs">
            ✓ Ready for Pickup
          </Badge>
        )}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-background pb-8">
      {/* Portal Header */}
      <header className="sticky top-0 z-30 bg-background border-b border-border">
        <div className="max-w-[480px] mx-auto px-4 py-3 flex items-center gap-3">
          <Link
            to="/"
            data-ocid="vendor.back.link"
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
          <div className="flex-1 min-w-0">
            <h1 className="font-display font-bold text-foreground text-base">
              {VENDOR_INFO.name}
            </h1>
            <p className="text-muted-foreground text-xs">
              Platform {VENDOR_INFO.platformNumber} | {VENDOR_INFO.gateEntry}
            </p>
          </div>
          <Badge className="bg-green-500/20 text-green-400 border-green-500/30 text-xs flex-shrink-0">
            Live
          </Badge>
        </div>
      </header>

      <div className="max-w-[480px] mx-auto px-4 pt-4">
        <Tabs defaultValue="new">
          <TabsList className="w-full bg-secondary border border-border">
            <TabsTrigger
              value="new"
              data-ocid="vendor.new.tab"
              className="flex-1 data-[state=active]:gold-gradient data-[state=active]:text-primary-foreground text-xs"
            >
              New ({newOrders.length})
            </TabsTrigger>
            <TabsTrigger
              value="preparing"
              data-ocid="vendor.preparing.tab"
              className="flex-1 data-[state=active]:gold-gradient data-[state=active]:text-primary-foreground text-xs"
            >
              Preparing ({preparing.length})
            </TabsTrigger>
            <TabsTrigger
              value="ready"
              data-ocid="vendor.ready.tab"
              className="flex-1 data-[state=active]:gold-gradient data-[state=active]:text-primary-foreground text-xs"
            >
              Ready ({ready.length})
            </TabsTrigger>
          </TabsList>
          {[
            { val: "new", list: newOrders },
            { val: "preparing", list: preparing },
            { val: "ready", list: ready },
          ].map(({ val, list }) => (
            <TabsContent key={val} value={val} className="mt-4 space-y-3">
              {list.length === 0 ? (
                <div
                  data-ocid="vendor.empty_state"
                  className="text-center py-12 text-muted-foreground"
                >
                  <p>No orders here</p>
                </div>
              ) : (
                list.map((order, idx) => (
                  <OrderCard key={order.id} order={order} idx={idx} />
                ))
              )}
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </div>
  );
}
