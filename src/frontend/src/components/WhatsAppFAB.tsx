import { SiWhatsapp } from "react-icons/si";
import { useAuth } from "../contexts/AuthContext";
import { useOrders } from "../contexts/OrdersContext";

export function WhatsAppFAB() {
  const { user } = useAuth();
  const { orders } = useOrders();
  const latestOrder = orders[0];

  const platform = user?.platformNumber || "1";
  const coach = user?.coachNumber || "XX";
  const seat = user?.seatNumber || "XX";
  const orderId = latestOrder?.id || "N/A";

  const message = encodeURIComponent(
    `Hello, I am at Platform ${platform}, Coach ${coach}, Seat ${seat}. Please bring my order #${orderId}.`,
  );
  const href = `https://wa.me/918108600732?text=${message}`;

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-20 right-4 z-50 w-12 h-12 rounded-full flex items-center justify-center shadow-lg transition-transform hover:scale-110 active:scale-95"
      style={{ background: "#25D366" }}
      aria-label="WhatsApp Support"
    >
      <SiWhatsapp className="h-6 w-6 text-white" />
    </a>
  );
}
