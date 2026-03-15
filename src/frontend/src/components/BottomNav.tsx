import { Link, useRouterState } from "@tanstack/react-router";
import { Home, MoreHorizontal, ShoppingBag, User } from "lucide-react";
import { useCart } from "../contexts/CartContext";

const NAV_ITEMS = [
  { to: "/", label: "Home", icon: Home, ocid: "nav.home.link" },
  {
    to: "/orders",
    label: "Orders",
    icon: ShoppingBag,
    ocid: "nav.orders.link",
  },
  { to: "/account", label: "Account", icon: User, ocid: "nav.account.link" },
  { to: "/more", label: "More", icon: MoreHorizontal, ocid: "nav.more.link" },
];

export function BottomNav() {
  const { pathname } = useRouterState({ select: (s) => s.location });
  const { totalItems } = useCart();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-background border-t border-border bottom-safe">
      <div className="max-w-[480px] mx-auto flex">
        {NAV_ITEMS.map(({ to, label, icon: Icon, ocid }) => {
          const isActive =
            to === "/" ? pathname === "/" : pathname.startsWith(to);
          return (
            <Link
              key={to}
              to={to}
              data-ocid={ocid}
              className={`flex-1 flex flex-col items-center gap-0.5 py-2 transition-colors ${
                isActive ? "text-primary" : "text-muted-foreground"
              }`}
            >
              <div className="relative">
                <Icon className="h-5 w-5" />
                {label === "Orders" && totalItems > 0 && (
                  <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                    {totalItems}
                  </span>
                )}
              </div>
              <span
                className={`text-[10px] font-medium ${isActive ? "text-primary" : ""}`}
              >
                {label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
