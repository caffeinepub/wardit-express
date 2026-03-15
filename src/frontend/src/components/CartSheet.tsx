import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Switch } from "@/components/ui/switch";
import { Leaf, Minus, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useAuth } from "../contexts/AuthContext";
import { useCart } from "../contexts/CartContext";
import { useOrders } from "../contexts/OrdersContext";
import { MOCK_VENDORS } from "../data/menuData";

export function CartSheet() {
  const {
    items,
    updateQty,
    removeItem,
    clearCart,
    subtotal,
    discount,
    ecoPackaging,
    setEcoPackaging,
    total,
    isOpen,
    closeCart,
    totalItems,
  } = useCart();
  const { user, setShowAuthModal, deductCredits } = useAuth();
  const { addOrder } = useOrders();
  const [placing, setPlacing] = useState(false);

  const handlePlaceOrder = async (method: "wallet" | "upi") => {
    if (!user) {
      setShowAuthModal(true);
      return;
    }
    if (!user.coachNumber || !user.seatNumber) {
      toast.error("Set your Coach & Seat number before ordering!");
      return;
    }
    if (method === "wallet" && user.walletCredits < total) {
      toast.error("Insufficient WARDIT Credits. Add more credits.");
      return;
    }
    setPlacing(true);
    await new Promise((r) => setTimeout(r, 1000));
    if (method === "wallet") deductCredits(total);
    const vendor = MOCK_VENDORS[0];
    const orderId = addOrder({
      items: [...items],
      subtotal,
      discount,
      ecoPackaging,
      total,
      paymentMethod: method === "wallet" ? "WARDIT Wallet" : "UPI",
      coachNumber: user.coachNumber,
      seatNumber: user.seatNumber,
      platformNumber: user.platformNumber || "4",
      trainNumber: "12009",
      vendorId: vendor.id,
      vendorName: vendor.name,
      status: "Pending",
    });
    clearCart();
    closeCart();
    setPlacing(false);
    toast.success(`Order #${orderId} placed! Track in Orders tab.`);
  };

  return (
    <Sheet open={isOpen} onOpenChange={(v) => !v && closeCart()}>
      <SheetContent
        side="bottom"
        className="bg-card border-t border-border rounded-t-2xl max-h-[85vh] overflow-y-auto p-0"
      >
        <SheetHeader className="px-4 pt-4 pb-2">
          <SheetTitle className="text-foreground font-display">
            Your Cart ({totalItems} items)
          </SheetTitle>
        </SheetHeader>

        {items.length === 0 ? (
          <div
            data-ocid="cart.empty_state"
            className="flex flex-col items-center justify-center py-12 text-muted-foreground"
          >
            <span className="text-4xl mb-3">🛒</span>
            <p className="font-medium">Your cart is empty</p>
          </div>
        ) : (
          <div className="px-4 pb-6 space-y-3">
            {items.map((ci, idx) => (
              <div
                key={ci.item.id}
                data-ocid={`cart.item.${idx + 1}`}
                className="flex items-center gap-3 bg-secondary/40 rounded-xl p-3"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5 mb-0.5">
                    <span
                      className={`w-2.5 h-2.5 rounded-sm border-2 flex-shrink-0 ${ci.item.isVeg ? "border-green-500 bg-green-500" : "border-red-500 bg-red-500"}`}
                    />
                    <p className="text-foreground text-sm font-medium truncate">
                      {ci.item.name}
                    </p>
                  </div>
                  <p className="text-primary text-sm font-semibold">
                    ₹{ci.item.price * ci.quantity}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-7 w-7 rounded-full border border-border"
                    onClick={() => updateQty(ci.item.id, ci.quantity - 1)}
                  >
                    <Minus className="h-3 w-3" />
                  </Button>
                  <span className="text-foreground font-bold w-5 text-center text-sm">
                    {ci.quantity}
                  </span>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-7 w-7 rounded-full border border-border"
                    onClick={() => updateQty(ci.item.id, ci.quantity + 1)}
                  >
                    <Plus className="h-3 w-3" />
                  </Button>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-7 w-7 text-destructive"
                    onClick={() => removeItem(ci.item.id)}
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            ))}

            {discount > 0 && (
              <Badge className="w-full justify-center py-2 gold-gradient text-primary-foreground font-semibold text-xs rounded-lg">
                🎉 15% GROUP DISCOUNT APPLIED — SAVING ₹{discount}!
              </Badge>
            )}

            <div className="flex items-center justify-between bg-secondary/40 rounded-xl p-3">
              <div className="flex items-center gap-2">
                <Leaf className="h-4 w-4 text-green-500" />
                <Label
                  data-ocid="cart.eco_toggle"
                  className="text-foreground text-sm cursor-pointer"
                >
                  Eco-friendly packaging (+₹5)
                </Label>
              </div>
              <Switch
                data-ocid="cart.eco_toggle"
                checked={ecoPackaging}
                onCheckedChange={setEcoPackaging}
                className="data-[state=checked]:bg-green-500"
              />
            </div>

            <Separator className="bg-border" />

            <div className="space-y-1.5 text-sm">
              <div className="flex justify-between text-muted-foreground">
                <span>Subtotal</span>
                <span>₹{subtotal}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-green-400">
                  <span>Group Discount (15%)</span>
                  <span>-₹{discount}</span>
                </div>
              )}
              {ecoPackaging && (
                <div className="flex justify-between text-green-400">
                  <span>Eco Packaging</span>
                  <span>+₹5</span>
                </div>
              )}
              <div className="flex justify-between text-foreground font-bold text-base pt-1 border-t border-border">
                <span>Total</span>
                <span>₹{total}</span>
              </div>
            </div>

            <div className="space-y-2 pt-1">
              <Button
                data-ocid="cart.upi_payment.button"
                className="w-full bg-secondary border border-border text-foreground h-11 font-semibold"
                onClick={() => handlePlaceOrder("upi")}
                disabled={placing}
              >
                📱 Pay via UPI — ₹{total}
              </Button>
              <Button
                data-ocid="cart.wallet_payment.button"
                className="w-full gold-gradient text-primary-foreground h-11 font-semibold"
                onClick={() => handlePlaceOrder("wallet")}
                disabled={placing}
              >
                {placing
                  ? "Placing Order..."
                  : `💳 WARDIT Wallet (₹${user?.walletCredits ?? 0}) — ₹${total}`}
              </Button>
              <Button
                data-ocid="cart.place_order.button"
                variant="ghost"
                className="w-full text-muted-foreground text-sm"
                onClick={clearCart}
              >
                Clear Cart
              </Button>
            </div>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
