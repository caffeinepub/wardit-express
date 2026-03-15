import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link } from "@tanstack/react-router";
import {
  ArrowLeft,
  Bell,
  ChevronRight,
  Clock,
  MapPin,
  Plus,
  RefreshCw,
  Search,
  Star,
  Train,
} from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useAuth } from "../contexts/AuthContext";
import { useCart } from "../contexts/CartContext";
import {
  CATEGORIES,
  MOCK_MENU,
  MOCK_TRAIN,
  type MenuItemLocal,
  getMenuFromLocalStorage,
  getPNRHistory,
  saveMenuToLocalStorage,
  savePNRHistory,
} from "../data/menuData";

export function Home() {
  const { user, setShowAuthModal, updateUser } = useAuth();
  const { addItem, totalItems, openCart } = useCart();
  const [searchPNR, setSearchPNR] = useState("");
  const [showTrain, setShowTrain] = useState(false);
  const [pnrHistory, setPnrHistory] = useState<string[]>(getPNRHistory());
  const [activeCategory, setActiveCategory] = useState("all");
  const [coach, setCoach] = useState(user?.coachNumber || "");
  const [seat, setSeat] = useState(user?.seatNumber || "");
  const [coachSeatSet, setCoachSeatSet] = useState(
    !!(user?.coachNumber && user?.seatNumber),
  );
  const [menuItems] = useState<MenuItemLocal[]>(
    () => getMenuFromLocalStorage() || MOCK_MENU,
  );

  useEffect(() => {
    saveMenuToLocalStorage();
  }, []);

  const filteredItems =
    activeCategory === "all"
      ? menuItems
      : menuItems.filter((m) => m.category === activeCategory);

  const handlePNRSearch = () => {
    const pnr = searchPNR.trim();
    if (!pnr) return;
    savePNRHistory(pnr);
    setPnrHistory(getPNRHistory());
    setShowTrain(true);
    toast.success(`Train status loaded for: ${pnr}`);
  };

  const handleSetCoachSeat = () => {
    if (!coach || !seat) {
      toast.error("Enter both Coach and Seat number");
      return;
    }
    if (!user) {
      setShowAuthModal(true);
      return;
    }
    updateUser({ coachNumber: coach, seatNumber: seat });
    setCoachSeatSet(true);
    toast.success(`Coach ${coach}, Seat ${seat} saved!`);
  };

  const handleAddToCart = (item: MenuItemLocal) => {
    if (!user) {
      setShowAuthModal(true);
      return;
    }
    if (!coachSeatSet) {
      toast.error("Please set your Coach & Seat number first!");
      return;
    }
    addItem(item);
    toast.success(`${item.name} added to cart`);
  };

  const greeting = () => {
    const h = new Date().getHours();
    if (h < 12) return "Good Morning";
    if (h < 17) return "Good Afternoon";
    return "Good Evening";
  };

  return (
    <div className="min-h-screen bg-[#f0f4f8] pb-32">
      {/* Blue Header like screenshot */}
      <header className="sticky top-0 z-30 bg-primary">
        <div className="max-w-[480px] mx-auto px-4 py-3 flex items-center gap-3">
          <Link to="/" data-ocid="home.back.link" className="flex-shrink-0">
            <div className="bg-white rounded-xl p-1.5">
              <img
                src="/assets/uploads/IMG-20260120-WA0002-1.png"
                alt="WARDIT"
                className="h-9 w-9 object-contain"
              />
            </div>
          </Link>
          <div className="flex-1 min-w-0">
            <p className="text-white/80 text-xs">{greeting()}</p>
            <p className="text-white font-bold text-base truncate">
              {user ? user.name : "Guest"} 👋
            </p>
          </div>
          <button
            type="button"
            className="p-2 text-white/80 hover:text-white"
            onClick={() => setShowAuthModal(true)}
          >
            <RefreshCw className="h-5 w-5" />
          </button>
          <button type="button" className="p-2 text-white/80 hover:text-white">
            <Bell className="h-5 w-5" />
          </button>
        </div>
      </header>

      <div className="max-w-[480px] mx-auto px-4 space-y-4 pt-4">
        {/* App Download Banner */}
        <div className="bg-blue-50 border border-blue-100 rounded-2xl p-3 flex items-center gap-3">
          <div className="bg-blue-100 rounded-xl p-2">
            <MapPin className="h-5 w-5 text-primary" />
          </div>
          <div className="flex-1">
            <p className="text-foreground font-semibold text-sm">
              Order Food on Train
            </p>
            <p className="text-muted-foreground text-xs">
              Delivered to your seat
            </p>
          </div>
          <Button
            size="sm"
            className="bg-primary text-white text-xs h-8 px-3 rounded-xl font-semibold"
            onClick={() => setShowAuthModal(true)}
          >
            Order Now
          </Button>
        </div>

        {/* PNR Search */}
        <div>
          <h2 className="font-bold text-foreground text-lg mb-2">
            Track Your Train
          </h2>
          <p className="text-muted-foreground text-sm mb-3">
            Enter PNR or train number
          </p>
          <div className="bg-primary rounded-2xl p-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                data-ocid="home.pnr_search_input"
                placeholder="Enter PNR or Train Number..."
                value={searchPNR}
                onChange={(e) => setSearchPNR(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handlePNRSearch()}
                className="pl-9 pr-20 bg-white border-0 h-11 text-foreground placeholder:text-muted-foreground rounded-xl"
              />
              <Button
                type="button"
                className="absolute right-1 top-1/2 -translate-y-1/2 bg-primary text-white text-xs h-8 px-3 font-semibold rounded-lg"
                onClick={handlePNRSearch}
              >
                Track
              </Button>
            </div>
          </div>
        </div>

        {/* PNR History Chips */}
        {pnrHistory.length > 0 && (
          <div className="flex gap-2 overflow-x-auto scrollbar-hide">
            {pnrHistory.map((p) => (
              <button
                key={p}
                type="button"
                data-ocid="home.category.tab"
                className="flex-shrink-0 text-xs px-3 py-1 rounded-full border border-border bg-white text-muted-foreground hover:border-primary hover:text-primary transition-colors"
                onClick={() => {
                  setSearchPNR(p);
                  setShowTrain(true);
                }}
              >
                {p}
              </button>
            ))}
          </div>
        )}

        {/* Train Status Card */}
        {showTrain && (
          <div className="bg-white border border-border rounded-2xl p-4 card-shadow">
            <div className="flex items-start justify-between mb-3">
              <div>
                <h3 className="font-bold text-foreground text-base">
                  {MOCK_TRAIN.trainName}
                </h3>
                <p className="text-muted-foreground text-xs">
                  {MOCK_TRAIN.from} → {MOCK_TRAIN.to}
                </p>
              </div>
              <Badge
                className={`text-xs font-semibold ${
                  MOCK_TRAIN.delay === "On Time"
                    ? "bg-green-100 text-green-700 border-green-200"
                    : "bg-red-100 text-red-700"
                }`}
              >
                {MOCK_TRAIN.delay}
              </Badge>
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div className="bg-gray-50 rounded-xl p-2 text-center">
                <p className="text-[10px] text-muted-foreground uppercase">
                  Current
                </p>
                <p className="text-xs font-semibold text-foreground mt-0.5">
                  {MOCK_TRAIN.currentStation}
                </p>
              </div>
              <div className="bg-blue-50 border border-blue-100 rounded-xl p-2 text-center">
                <p className="text-[10px] text-primary uppercase">ETA ADI</p>
                <p className="text-sm font-bold text-primary mt-0.5">
                  {MOCK_TRAIN.etaADI}
                </p>
              </div>
              <div className="bg-gray-50 rounded-xl p-2 text-center">
                <p className="text-[10px] text-muted-foreground uppercase">
                  Platform
                </p>
                <p className="text-sm font-bold text-foreground mt-0.5">
                  PF {MOCK_TRAIN.platform}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Coach & Seat Banner */}
        {!coachSeatSet ? (
          <div className="bg-primary rounded-2xl p-4">
            <p className="text-white font-semibold text-sm mb-2">
              Set Coach & Seat to Order
            </p>
            <div className="flex gap-2">
              <Input
                data-ocid="home.search_input"
                placeholder="Coach (e.g. B1)"
                value={coach}
                onChange={(e) =>
                  setCoach(e.target.value.toUpperCase().slice(0, 4))
                }
                className="bg-white/20 border-white/30 text-white placeholder:text-white/60 flex-1 h-9 text-sm font-semibold uppercase rounded-xl"
              />
              <Input
                data-ocid="home.search_input"
                placeholder="Seat (e.g. 24)"
                value={seat}
                onChange={(e) => setSeat(e.target.value.slice(0, 4))}
                className="bg-white/20 border-white/30 text-white placeholder:text-white/60 flex-1 h-9 text-sm rounded-xl"
              />
              <Button
                type="button"
                className="bg-white text-primary font-bold h-9 px-3 text-sm rounded-xl"
                onClick={handleSetCoachSeat}
              >
                Set
              </Button>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-between bg-white border border-border rounded-2xl px-4 py-2.5 card-shadow">
            <div className="flex items-center gap-2">
              <Train className="h-4 w-4 text-primary" />
              <span className="text-foreground text-sm font-medium">
                Coach{" "}
                <span className="text-primary font-bold">
                  {user?.coachNumber}
                </span>{" "}
                | Seat{" "}
                <span className="text-primary font-bold">
                  {user?.seatNumber}
                </span>
              </span>
            </div>
            <button
              type="button"
              className="text-muted-foreground text-xs underline"
              onClick={() => {
                setCoachSeatSet(false);
                setCoach(user?.coachNumber || "");
                setSeat(user?.seatNumber || "");
              }}
            >
              Edit
            </button>
          </div>
        )}

        {/* Category Scroll */}
        <div className="flex gap-2 overflow-x-auto scrollbar-hide -mx-4 px-4">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              type="button"
              data-ocid="home.category.tab"
              onClick={() => setActiveCategory(cat.id)}
              className={`flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium transition-colors border ${
                activeCategory === cat.id
                  ? "bg-primary text-white border-transparent"
                  : "bg-white border-border text-muted-foreground hover:border-primary/50"
              }`}
            >
              <span>{cat.emoji}</span>
              <span>{cat.label}</span>
            </button>
          ))}
        </div>

        {/* Food Items Grid */}
        <div className="grid grid-cols-2 gap-3">
          {filteredItems.map((item, idx) => (
            <div
              key={item.id}
              data-ocid={`home.food_item.card.${idx + 1}`}
              className="bg-white border border-border rounded-2xl overflow-hidden card-shadow"
            >
              <div className="relative h-28 overflow-hidden">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
                <div className="absolute top-2 left-2">
                  <span
                    className={`inline-block w-3 h-3 rounded-sm border-2 ${
                      item.isVeg
                        ? "border-green-500 bg-green-500"
                        : "border-red-500 bg-red-500"
                    }`}
                  />
                </div>
                {item.category === "Emergency Supplies" && (
                  <div className="absolute top-2 right-2">
                    <Badge className="bg-orange-500/90 text-white text-[9px] px-1 py-0">
                      SUPPLY
                    </Badge>
                  </div>
                )}
              </div>
              <div className="p-2.5">
                <p className="text-foreground text-xs font-semibold leading-tight line-clamp-2">
                  {item.name}
                </p>
                <div className="flex items-center gap-1 mt-1 mb-2">
                  <Star className="h-2.5 w-2.5 text-yellow-400 fill-yellow-400" />
                  <span className="text-[10px] text-muted-foreground">
                    {item.rating}
                  </span>
                  <Clock className="h-2.5 w-2.5 text-muted-foreground ml-1" />
                  <span className="text-[10px] text-muted-foreground">
                    {item.prepTime}m
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-primary font-bold text-sm">
                    ₹{item.price}
                  </span>
                  <button
                    type="button"
                    className="w-6 h-6 rounded-full bg-primary flex items-center justify-center"
                    onClick={() => handleAddToCart(item)}
                    aria-label={`Add ${item.name} to cart`}
                  >
                    <Plus className="h-3.5 w-3.5 text-white" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <footer className="text-center text-muted-foreground text-xs py-4">
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

      {/* Sticky View Cart Button */}
      {totalItems > 0 && (
        <div className="fixed bottom-16 left-0 right-0 z-30 px-4">
          <div className="max-w-[480px] mx-auto">
            <Button
              type="button"
              className="w-full bg-primary text-white font-bold h-12 rounded-xl shadow text-base"
              onClick={openCart}
            >
              <span className="flex-1 text-left">
                View Cart ({totalItems} items)
              </span>
              <ChevronRight className="h-5 w-5" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
