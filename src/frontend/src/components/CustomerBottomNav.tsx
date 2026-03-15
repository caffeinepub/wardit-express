import { Link, useRouterState } from "@tanstack/react-router";
import { Home, ShoppingBag, User } from "lucide-react";
import { useCart } from "../contexts/CartContext";

const NAV_ITEMS = [
  {
    to: "/customer",
    label: "Home",
    icon: Home,
    ocid: "customer.nav.home.link",
    exact: true,
  },
  {
    to: "/customer/orders",
    label: "Orders",
    icon: ShoppingBag,
    ocid: "customer.nav.orders.link",
    exact: false,
  },
  {
    to: "/customer/account",
    label: "Account",
    icon: User,
    ocid: "customer.nav.account.link",
    exact: false,
  },
];

export function CustomerBottomNav() {
  const { pathname } = useRouterState({ select: (s) => s.location });
  const { totalItems } = useCart();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-border bottom-safe shadow-sm">
      <div className="max-w-[480px] mx-auto flex">
        {NAV_ITEMS.map(({ to, label, icon: Icon, ocid, exact }) => {
          const isActive = exact
            ? pathname === to || pathname === "/customer/"
            : pathname.startsWith(to);
          return (
            <Link
              key={to}
              to={to}
              data-ocid={ocid}
              className={`flex-1 flex flex-col items-center gap-0.5 py-3 transition-colors ${
                isActive ? "text-primary" : "text-muted-foreground"
              }`}
            >
              <div className="relative">
                <Icon className="h-5 w-5" />
                {label === "Orders" && totalItems > 0 && (
                  <span className="absolute -top-1 -right-1 bg-primary text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                    {totalItems}
                  </span>
                )}
              </div>
              <span
                className={`text-[10px] font-medium ${isActive ? "text-primary font-semibold" : ""}`}
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
