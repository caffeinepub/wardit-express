import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Copy, CreditCard, Gift, LogOut, Plus, Train } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useAuth } from "../contexts/AuthContext";

export function Account() {
  const { user, isLoggedIn, setShowAuthModal, logout, addCredits, updateUser } =
    useAuth();
  const [editCoach, setEditCoach] = useState(user?.coachNumber || "");
  const [editSeat, setEditSeat] = useState(user?.seatNumber || "");

  if (!isLoggedIn || !user) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center pb-24 px-6">
        <Train className="h-16 w-16 text-primary mb-4 opacity-60" />
        <h2 className="font-display font-bold text-foreground text-2xl mb-2">
          Your Account
        </h2>
        <p className="text-muted-foreground text-sm text-center mb-6">
          Sign in to view your wallet, orders, and profile.
        </p>
        <Button
          data-ocid="account.login.button"
          className="gold-gradient text-primary-foreground font-bold px-8 h-11"
          onClick={() => setShowAuthModal(true)}
        >
          Sign In
        </Button>
      </div>
    );
  }

  const initials = user.name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const handleAddCredits = () => {
    addCredits(100);
    toast.success("₹100 credits added to your WARDIT Wallet!");
  };

  const handleCopyReferral = () => {
    navigator.clipboard.writeText(user.referralCode).catch(() => {
      /* ignore */
    });
    toast.success("Referral code copied! Share & earn credits.");
  };

  const handleSavePrefs = () => {
    if (!editCoach || !editSeat) {
      toast.error("Enter both fields");
      return;
    }
    updateUser({ coachNumber: editCoach, seatNumber: editSeat });
    toast.success("Preferences saved!");
  };

  return (
    <div className="min-h-screen bg-background pb-24">
      <header className="sticky top-0 z-30 bg-background border-b border-border">
        <div className="max-w-[480px] mx-auto px-4 py-3">
          <h1 className="font-display font-bold text-foreground text-xl">
            Account
          </h1>
        </div>
      </header>

      <div className="max-w-[480px] mx-auto px-4 pt-4 space-y-4">
        {/* Profile */}
        <div className="bg-card border border-border rounded-xl p-4 flex items-center gap-4">
          <div className="w-14 h-14 rounded-full gold-gradient flex items-center justify-center font-display font-bold text-primary-foreground text-xl">
            {initials}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-foreground font-bold text-base">{user.name}</p>
            <p className="text-muted-foreground text-sm">{user.phone}</p>
            {user.isVerifiedTraveler && (
              <span className="text-[10px] text-green-400 font-medium">
                ✓ Verified Traveler
              </span>
            )}
          </div>
        </div>

        {/* Wallet */}
        <div className="gold-gradient rounded-xl p-4 card-shadow">
          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center gap-2">
              <CreditCard className="h-5 w-5 text-primary-foreground" />
              <span className="text-primary-foreground font-semibold text-sm">
                WARDIT Credits
              </span>
            </div>
            <span className="text-primary-foreground text-[10px] font-medium">
              WALLET
            </span>
          </div>
          <p className="text-primary-foreground font-display font-bold text-3xl">
            ₹{user.walletCredits}
          </p>
          <p className="text-primary-foreground/70 text-xs mb-3">
            Available Balance
          </p>
          <Button
            data-ocid="account.add_credits.button"
            className="bg-primary-foreground text-primary font-bold h-9 text-sm gap-1.5"
            onClick={handleAddCredits}
          >
            <Plus className="h-4 w-4" /> Add ₹100 Credits
          </Button>
        </div>

        {/* BNPL */}
        <div className="bg-card border border-border rounded-xl p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-foreground font-semibold text-sm">
                Buy Now, Pay Later
              </p>
              <p className="text-muted-foreground text-xs mt-0.5">
                For verified frequent travelers
              </p>
            </div>
            <Switch
              data-ocid="account.bnpl.toggle"
              checked={user.isBNPLEnabled}
              onCheckedChange={(v) => {
                updateUser({ isBNPLEnabled: v });
                toast.success(v ? "BNPL enabled!" : "BNPL disabled");
              }}
              className="data-[state=checked]:bg-primary"
            />
          </div>
        </div>

        {/* Referral */}
        <div className="bg-card border border-border rounded-xl p-4">
          <div className="flex items-center gap-2 mb-3">
            <Gift className="h-4 w-4 text-primary" />
            <p className="text-foreground font-semibold text-sm">
              Referral & Earn
            </p>
          </div>
          <div className="flex items-center gap-2 bg-secondary/50 rounded-lg px-3 py-2 mb-3">
            <span className="text-primary font-bold font-mono text-base flex-1 tracking-widest">
              {user.referralCode}
            </span>
            <button
              type="button"
              onClick={handleCopyReferral}
              className="text-muted-foreground hover:text-primary transition-colors"
            >
              <Copy className="h-4 w-4" />
            </button>
          </div>
          <p className="text-muted-foreground text-xs mb-3">
            Share your code and both you & your friend get ₹50 credits when they
            place their first order!
          </p>
          <Button
            data-ocid="account.referral.button"
            variant="outline"
            className="w-full border-primary/50 text-primary hover:bg-primary/10 h-9 text-sm"
            onClick={handleCopyReferral}
          >
            Share & Earn 🎁
          </Button>
        </div>

        {/* Travel Preferences */}
        <div className="bg-card border border-border rounded-xl p-4">
          <div className="flex items-center gap-2 mb-3">
            <Train className="h-4 w-4 text-primary" />
            <p className="text-foreground font-semibold text-sm">
              Travel Preferences
            </p>
          </div>
          <div className="grid grid-cols-2 gap-2 mb-3">
            <div>
              <Label className="text-muted-foreground text-xs mb-1 block">
                Coach Number
              </Label>
              <Input
                value={editCoach}
                onChange={(e) =>
                  setEditCoach(e.target.value.toUpperCase().slice(0, 4))
                }
                placeholder="B1, S4..."
                className="bg-secondary border-border text-foreground gold-glow-focus h-9 text-sm uppercase"
              />
            </div>
            <div>
              <Label className="text-muted-foreground text-xs mb-1 block">
                Seat Number
              </Label>
              <Input
                value={editSeat}
                onChange={(e) => setEditSeat(e.target.value.slice(0, 4))}
                placeholder="24..."
                className="bg-secondary border-border text-foreground gold-glow-focus h-9 text-sm"
              />
            </div>
          </div>
          <Button
            className="w-full gold-gradient text-primary-foreground font-semibold h-9 text-sm"
            onClick={handleSavePrefs}
          >
            Save Preferences
          </Button>
        </div>

        <Separator className="bg-border" />

        <Button
          data-ocid="account.logout.button"
          variant="outline"
          className="w-full border-red-500/40 text-red-400 hover:bg-red-500/10 h-11 font-semibold"
          onClick={() => {
            logout();
            toast.success("Logged out successfully");
          }}
        >
          <LogOut className="h-4 w-4 mr-2" /> Logout
        </Button>

        <footer className="text-center text-muted-foreground text-xs pb-4">
          &copy; {new Date().getFullYear()}. Built with love using{" "}
          <a
            href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:underline"
          >
            caffeine.ai
          </a>
        </footer>
      </div>
    </div>
  );
}
