import { Link } from "@tanstack/react-router";
import { Bike, ChevronRight, ShieldCheck, Store } from "lucide-react";

const LINKS = [
  {
    to: "/vendor",
    icon: Store,
    label: "Vendor Dashboard",
    desc: "Manage incoming orders",
    color: "text-blue-400",
  },
  {
    to: "/rider",
    icon: Bike,
    label: "Rider App",
    desc: "View delivery assignments",
    color: "text-green-400",
  },
  {
    to: "/admin",
    icon: ShieldCheck,
    label: "Admin Panel",
    desc: "Platform management",
    color: "text-purple-400",
  },
];

export function More() {
  return (
    <div className="min-h-screen bg-background pb-24">
      <header className="sticky top-0 z-30 bg-background border-b border-border">
        <div className="max-w-[480px] mx-auto px-4 py-3">
          <h1 className="font-display font-bold text-foreground text-xl">
            More
          </h1>
        </div>
      </header>
      <div className="max-w-[480px] mx-auto px-4 pt-4 space-y-3">
        {LINKS.map(({ to, icon: Icon, label, desc, color }) => (
          <Link
            key={to}
            to={to}
            className="flex items-center gap-4 bg-card border border-border rounded-xl p-4 card-shadow hover:border-primary/50 transition-colors"
          >
            <div className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center">
              <Icon className={`h-5 w-5 ${color}`} />
            </div>
            <div className="flex-1">
              <p className="text-foreground font-semibold text-sm">{label}</p>
              <p className="text-muted-foreground text-xs">{desc}</p>
            </div>
            <ChevronRight className="h-4 w-4 text-muted-foreground" />
          </Link>
        ))}
      </div>
    </div>
  );
}
