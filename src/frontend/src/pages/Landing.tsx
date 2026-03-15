import { Link } from "@tanstack/react-router";
import { Bike, ChevronRight, Shield, ShoppingBag, Store } from "lucide-react";
import { motion } from "motion/react";

const PORTALS = [
  {
    to: "/customer",
    label: "Customer Portal",
    description: "Order food, track your train & manage wallet",
    icon: ShoppingBag,
    ocid: "landing.customer.link",
    iconBg: "bg-blue-100",
    iconColor: "text-blue-600",
    badge: "For Passengers",
  },
  {
    to: "/rider",
    label: "Rider Portal",
    description: "Manage deliveries, view assignments & platform map",
    icon: Bike,
    ocid: "landing.rider.link",
    iconBg: "bg-green-100",
    iconColor: "text-green-600",
    badge: "For Delivery Riders",
  },
  {
    to: "/vendor",
    label: "Vendor Portal",
    description: "Accept orders, manage kitchen & track revenue",
    icon: Store,
    ocid: "landing.vendor.link",
    iconBg: "bg-orange-100",
    iconColor: "text-orange-600",
    badge: "For Food Vendors",
  },
  {
    to: "/admin",
    label: "Admin Panel",
    description: "Full platform oversight, analytics & management",
    icon: Shield,
    ocid: "landing.admin.link",
    iconBg: "bg-purple-100",
    iconColor: "text-purple-600",
    badge: "Admin Only",
  },
];

export function Landing() {
  return (
    <div className="min-h-screen bg-[#f0f4f8] flex flex-col">
      {/* Blue header */}
      <div className="bg-primary px-6 pt-10 pb-8">
        <div className="max-w-[480px] mx-auto flex items-center gap-4">
          <div className="bg-white rounded-2xl p-2">
            <img
              src="/assets/uploads/IMG-20260120-WA0002-1.png"
              alt="WARDIT"
              className="h-14 w-14 object-contain"
            />
          </div>
          <div>
            <h1 className="text-white font-bold text-2xl tracking-tight">
              WARDIT
            </h1>
            <p className="text-white/80 text-sm">On-Demand Train Delivery</p>
          </div>
        </div>
      </div>

      <div className="flex-1 px-4 py-6 max-w-[480px] mx-auto w-full">
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mb-5"
        >
          <h2 className="font-bold text-foreground text-xl">
            Choose Your Portal
          </h2>
          <p className="text-muted-foreground text-sm mt-0.5">
            Select the portal that matches your role
          </p>
        </motion.div>

        <div className="space-y-3">
          {PORTALS.map(
            (
              {
                to,
                label,
                description,
                icon: Icon,
                ocid,
                iconBg,
                iconColor,
                badge,
              },
              idx,
            ) => (
              <motion.div
                key={to}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, delay: 0.05 + idx * 0.07 }}
              >
                <Link
                  to={to}
                  data-ocid={ocid}
                  className="flex items-center gap-4 w-full bg-white border border-border rounded-2xl px-4 py-4 transition-all duration-150 hover:shadow-md active:scale-[0.99] card-shadow"
                >
                  <div
                    className={`w-12 h-12 rounded-xl ${iconBg} flex items-center justify-center flex-shrink-0`}
                  >
                    <Icon className={`h-6 w-6 ${iconColor}`} />
                  </div>
                  <div className="flex-1 min-w-0 text-left">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="text-foreground font-bold text-base">
                        {label}
                      </span>
                      <span className="text-[10px] text-muted-foreground bg-gray-100 px-2 py-0.5 rounded-full">
                        {badge}
                      </span>
                    </div>
                    <p className="text-muted-foreground text-xs leading-snug">
                      {description}
                    </p>
                  </div>
                  <ChevronRight className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                </Link>
              </motion.div>
            ),
          )}
        </div>
      </div>

      <footer className="text-center text-muted-foreground text-xs pb-8 pt-2">
        &copy; {new Date().getFullYear()}. Built with ♥ using{" "}
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
  );
}
