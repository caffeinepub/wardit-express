import { Outlet, useRouterState } from "@tanstack/react-router";
import { AuthModal } from "../components/AuthModal";
import { CartSheet } from "../components/CartSheet";
import { CustomerBottomNav } from "../components/CustomerBottomNav";
import { WhatsAppFAB } from "../components/WhatsAppFAB";

export function CustomerPortal() {
  const { pathname } = useRouterState({ select: (s) => s.location });

  // Redirect index to home if exactly /customer
  const _ = pathname;

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-[480px] mx-auto relative">
        <Outlet />
      </div>
      <CustomerBottomNav />
      <WhatsAppFAB />
      <AuthModal />
      <CartSheet />
    </div>
  );
}
