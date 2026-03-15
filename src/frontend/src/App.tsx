import { Toaster } from "@/components/ui/sonner";
import {
  Outlet,
  RouterProvider,
  createRootRoute,
  createRoute,
  createRouter,
} from "@tanstack/react-router";
import { ThemeProvider } from "next-themes";
import { AuthProvider } from "./contexts/AuthContext";
import { CartProvider } from "./contexts/CartContext";
import { OrdersProvider } from "./contexts/OrdersContext";
import { Account } from "./pages/Account";
import { Admin } from "./pages/Admin";
import { CustomerPortal } from "./pages/CustomerPortal";
import { Home } from "./pages/Home";
import { Landing } from "./pages/Landing";
import { Orders } from "./pages/Orders";
import { Rider } from "./pages/Rider";
import { Vendor } from "./pages/Vendor";

function RootLayout() {
  return (
    <ThemeProvider attribute="class" defaultTheme="light" forcedTheme="light">
      <AuthProvider>
        <CartProvider>
          <OrdersProvider>
            <div className="min-h-screen bg-background">
              <Outlet />
            </div>
            <Toaster richColors position="top-center" />
          </OrdersProvider>
        </CartProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

const rootRoute = createRootRoute({ component: RootLayout });

const landingRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: Landing,
});

const customerPortalRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/customer",
  component: CustomerPortal,
});

const customerHomeRoute = createRoute({
  getParentRoute: () => customerPortalRoute,
  path: "/",
  component: Home,
});

const customerOrdersRoute = createRoute({
  getParentRoute: () => customerPortalRoute,
  path: "/orders",
  component: Orders,
});

const customerAccountRoute = createRoute({
  getParentRoute: () => customerPortalRoute,
  path: "/account",
  component: Account,
});

const riderRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/rider",
  component: Rider,
});

const vendorRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/vendor",
  component: Vendor,
});

const adminRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/admin",
  component: Admin,
});

const routeTree = rootRoute.addChildren([
  landingRoute,
  customerPortalRoute.addChildren([
    customerHomeRoute,
    customerOrdersRoute,
    customerAccountRoute,
  ]),
  riderRoute,
  vendorRoute,
  adminRoute,
]);

const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return <RouterProvider router={router} />;
}
