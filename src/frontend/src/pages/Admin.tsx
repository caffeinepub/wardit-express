import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Link } from "@tanstack/react-router";
import {
  ArrowLeft,
  BarChart3,
  Edit2,
  Package,
  Plus,
  ShieldCheck,
  Store,
  Trash2,
  Users,
  Utensils,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useOrders } from "../contexts/OrdersContext";
import {
  MOCK_MENU,
  MOCK_VENDORS,
  type MenuItemLocal,
  type VendorLocal,
} from "../data/menuData";

const ADMIN_CREDS = { phone: "9999999999", password: "admin123" };

type AdminTab = "overview" | "menu" | "vendors" | "orders" | "users";

const STATUS_COLORS: Record<string, string> = {
  Pending: "bg-yellow-500/20 text-yellow-400",
  Accepted: "bg-blue-500/20 text-blue-400",
  Preparing: "bg-orange-500/20 text-orange-400",
  Ready: "bg-green-500/20 text-green-400",
  Delivered: "bg-secondary text-muted-foreground",
  Cancelled: "bg-red-500/20 text-red-400",
};

export function Admin() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [phone, setPhone] = useState("");
  const [pass, setPass] = useState("");
  const [activeTab, setActiveTab] = useState<AdminTab>("overview");
  const [menuItems, setMenuItems] = useState<MenuItemLocal[]>(MOCK_MENU);
  const [vendors] = useState<VendorLocal[]>(MOCK_VENDORS);
  const [editItem, setEditItem] = useState<MenuItemLocal | null>(null);
  const [showAddMenu, setShowAddMenu] = useState(false);
  const [newItem, setNewItem] = useState({
    name: "",
    price: "",
    category: "",
    isVeg: true,
  });
  const { orders } = useOrders();

  const handleLogin = () => {
    if (phone === ADMIN_CREDS.phone && pass === ADMIN_CREDS.password) {
      setLoggedIn(true);
      toast.success("Admin access granted");
    } else {
      toast.error("Invalid credentials. Use 9999999999 / admin123");
    }
  };

  if (!loggedIn) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        {/* Portal Header */}
        <header className="sticky top-0 z-30 bg-background border-b border-border">
          <div className="max-w-[480px] mx-auto px-4 py-3 flex items-center gap-3">
            <Link
              to="/"
              data-ocid="admin.back.link"
              className="p-1.5 rounded-lg hover:bg-secondary transition-colors"
            >
              <ArrowLeft className="h-5 w-5 text-muted-foreground" />
            </Link>
            <div className="bg-white rounded-lg px-3 py-1">
              <img
                src="/assets/uploads/IMG-20260120-WA0002-1.png"
                alt="WARDIT"
                className="h-7 object-contain"
              />
            </div>
            <span className="text-foreground font-bold text-base font-display">
              Admin Panel
            </span>
          </div>
        </header>

        <div className="flex-1 flex flex-col items-center justify-center px-6">
          <ShieldCheck className="h-12 w-12 text-primary mb-4" />
          <h1 className="font-display font-bold text-foreground text-2xl mb-1">
            Admin Login
          </h1>
          <p className="text-muted-foreground text-sm mb-6">
            9999999999 / admin123
          </p>
          <div className="w-full max-w-sm space-y-3">
            <div>
              <Label className="text-muted-foreground text-xs mb-1 block">
                Admin Phone
              </Label>
              <Input
                data-ocid="admin.phone.input"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="9999999999"
                className="bg-card border-border text-foreground gold-glow-focus"
              />
            </div>
            <div>
              <Label className="text-muted-foreground text-xs mb-1 block">
                Password
              </Label>
              <Input
                data-ocid="admin.password.input"
                type="password"
                value={pass}
                onChange={(e) => setPass(e.target.value)}
                placeholder="admin123"
                className="bg-card border-border text-foreground gold-glow-focus"
                onKeyDown={(e) => e.key === "Enter" && handleLogin()}
              />
            </div>
            <Button
              data-ocid="admin.login.submit_button"
              className="w-full gold-gradient text-primary-foreground font-bold h-11"
              onClick={handleLogin}
            >
              Login as Admin
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const totalRevenue = orders
    .filter((o) => o.status === "Delivered")
    .reduce((s, o) => s + o.total, 0);

  const handleDeleteItem = (id: string) => {
    setMenuItems((prev) => prev.filter((m) => m.id !== id));
    toast.success("Item removed");
  };

  const handleAddItem = () => {
    if (!newItem.name || !newItem.price || !newItem.category) {
      toast.error("Fill all fields");
      return;
    }
    const item: MenuItemLocal = {
      id: `m${Date.now()}`,
      name: newItem.name,
      category: newItem.category,
      price: Number.parseInt(newItem.price),
      isVeg: newItem.isVeg,
      rating: 4.0,
      prepTime: 15,
      description: newItem.name,
      image: "/assets/generated/meal-thali.dim_400x300.jpg",
    };
    setMenuItems((prev) => [item, ...prev]);
    setShowAddMenu(false);
    setNewItem({ name: "", price: "", category: "", isVeg: true });
    toast.success("Menu item added!");
  };

  return (
    <div className="min-h-screen bg-background pb-8">
      {/* Portal Header */}
      <header className="sticky top-0 z-30 bg-background border-b border-border">
        <div className="max-w-[480px] mx-auto px-4 py-3 flex items-center gap-3">
          <Link
            to="/"
            data-ocid="admin.back.link"
            className="p-1.5 rounded-lg hover:bg-secondary transition-colors"
          >
            <ArrowLeft className="h-5 w-5 text-muted-foreground" />
          </Link>
          <div className="bg-white rounded-lg px-3 py-1">
            <img
              src="/assets/uploads/IMG-20260120-WA0002-1.png"
              alt="WARDIT"
              className="h-7 object-contain"
            />
          </div>
          <div className="flex-1">
            <h1 className="font-display font-bold text-foreground text-base">
              Admin Panel
            </h1>
            <p className="text-muted-foreground text-xs">WARDIT Express</p>
          </div>
          <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/30 text-xs">
            Admin
          </Badge>
        </div>
      </header>

      <div className="max-w-[480px] mx-auto px-4 pt-4">
        <Tabs
          value={activeTab}
          onValueChange={(v) => setActiveTab(v as AdminTab)}
        >
          <TabsList className="w-full bg-secondary border border-border grid grid-cols-5">
            <TabsTrigger
              data-ocid="admin.overview.tab"
              value="overview"
              className="data-[state=active]:gold-gradient data-[state=active]:text-primary-foreground p-1"
            >
              <BarChart3 className="h-3.5 w-3.5" />
            </TabsTrigger>
            <TabsTrigger
              data-ocid="admin.menu.tab"
              value="menu"
              className="data-[state=active]:gold-gradient data-[state=active]:text-primary-foreground p-1"
            >
              <Utensils className="h-3.5 w-3.5" />
            </TabsTrigger>
            <TabsTrigger
              data-ocid="admin.vendors.tab"
              value="vendors"
              className="data-[state=active]:gold-gradient data-[state=active]:text-primary-foreground p-1"
            >
              <Store className="h-3.5 w-3.5" />
            </TabsTrigger>
            <TabsTrigger
              data-ocid="admin.orders.tab"
              value="orders"
              className="data-[state=active]:gold-gradient data-[state=active]:text-primary-foreground p-1"
            >
              <Package className="h-3.5 w-3.5" />
            </TabsTrigger>
            <TabsTrigger
              value="users"
              className="data-[state=active]:gold-gradient data-[state=active]:text-primary-foreground p-1"
            >
              <Users className="h-3.5 w-3.5" />
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="mt-4">
            <div className="grid grid-cols-2 gap-3">
              {[
                {
                  label: "Total Orders",
                  value: orders.length,
                  icon: Package,
                  color: "text-blue-400",
                },
                {
                  label: "Revenue",
                  value: `\u20b9${totalRevenue}`,
                  icon: BarChart3,
                  color: "text-primary",
                },
                {
                  label: "Active Vendors",
                  value: vendors.filter((v) => v.isActive).length,
                  icon: Store,
                  color: "text-green-400",
                },
                {
                  label: "Menu Items",
                  value: menuItems.length,
                  icon: Utensils,
                  color: "text-purple-400",
                },
              ].map(({ label, value, icon: Icon, color }) => (
                <div
                  key={label}
                  className="bg-card border border-border rounded-xl p-4"
                >
                  <Icon className={`h-5 w-5 ${color} mb-2`} />
                  <p className="text-foreground font-bold text-xl">{value}</p>
                  <p className="text-muted-foreground text-xs">{label}</p>
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="menu" className="mt-4 space-y-3">
            <Button
              data-ocid="admin.menu.open_modal_button"
              className="w-full gold-gradient text-primary-foreground font-semibold h-10 gap-2"
              onClick={() => setShowAddMenu(true)}
            >
              <Plus className="h-4 w-4" /> Add Menu Item
            </Button>
            {menuItems.map((item, idx) => (
              <div
                key={item.id}
                data-ocid={`admin.menu.item.${idx + 1}`}
                className="bg-card border border-border rounded-xl p-3 flex items-center gap-3"
              >
                <span
                  className={`w-2.5 h-2.5 rounded-sm border-2 flex-shrink-0 ${item.isVeg ? "border-green-500 bg-green-500" : "border-red-500 bg-red-500"}`}
                />
                <div className="flex-1 min-w-0">
                  <p className="text-foreground text-sm font-medium truncate">
                    {item.name}
                  </p>
                  <p className="text-muted-foreground text-xs">
                    \u20b9{item.price} | {item.category}
                  </p>
                </div>
                <div className="flex items-center gap-1.5">
                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-7 w-7"
                    onClick={() => setEditItem(item)}
                  >
                    <Edit2 className="h-3 w-3 text-muted-foreground" />
                  </Button>
                  <Button
                    data-ocid={`admin.menu.delete_button.${idx + 1}`}
                    size="icon"
                    variant="ghost"
                    className="h-7 w-7"
                    onClick={() => handleDeleteItem(item.id)}
                  >
                    <Trash2 className="h-3 w-3 text-red-400" />
                  </Button>
                </div>
              </div>
            ))}
          </TabsContent>

          <TabsContent value="vendors" className="mt-4 space-y-3">
            {vendors.map((v, idx) => (
              <div
                key={v.id}
                data-ocid={`admin.vendors.item.${idx + 1}`}
                className="bg-card border border-border rounded-xl p-4"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-foreground font-semibold text-sm">
                      {v.name}
                    </p>
                    <p className="text-muted-foreground text-xs">
                      Platform {v.platformNumber} | {v.gateEntry}
                    </p>
                  </div>
                  <Badge
                    className={
                      v.isActive
                        ? "bg-green-500/20 text-green-400"
                        : "bg-secondary text-muted-foreground"
                    }
                  >
                    {v.isActive ? "Active" : "Inactive"}
                  </Badge>
                </div>
              </div>
            ))}
          </TabsContent>

          <TabsContent value="orders" className="mt-4 space-y-3">
            {orders.length === 0 ? (
              <div
                data-ocid="admin.orders.empty_state"
                className="text-center py-12 text-muted-foreground"
              >
                <p>No orders yet</p>
              </div>
            ) : (
              orders.map((o, idx) => (
                <div
                  key={o.id}
                  data-ocid={`admin.orders.row.${idx + 1}`}
                  className="bg-card border border-border rounded-xl p-3"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-foreground font-bold text-sm">
                        #{o.id}
                      </p>
                      <p className="text-muted-foreground text-xs">
                        {o.items.length} item(s) | Coach {o.coachNumber}
                      </p>
                    </div>
                    <div className="text-right">
                      <Badge
                        className={`text-xs ${STATUS_COLORS[o.status] || ""}`}
                      >
                        {o.status}
                      </Badge>
                      <p className="text-primary font-bold text-sm mt-1">
                        \u20b9{o.total}
                      </p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </TabsContent>

          <TabsContent value="users" className="mt-4">
            <div
              data-ocid="admin.users.section"
              className="bg-card border border-border rounded-xl p-4"
            >
              <p className="text-muted-foreground text-sm text-center">
                User data synced from ICP backend
              </p>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Add Menu Dialog */}
      <Dialog open={showAddMenu} onOpenChange={setShowAddMenu}>
        <DialogContent className="bg-card border-border max-w-sm mx-auto">
          <DialogHeader>
            <DialogTitle className="text-foreground">Add Menu Item</DialogTitle>
          </DialogHeader>
          <div className="space-y-3 py-2">
            <div>
              <Label className="text-muted-foreground text-xs mb-1 block">
                Item Name
              </Label>
              <Input
                value={newItem.name}
                onChange={(e) =>
                  setNewItem((p) => ({ ...p, name: e.target.value }))
                }
                placeholder="e.g. Pav Bhaji"
                className="bg-secondary border-border text-foreground"
              />
            </div>
            <div>
              <Label className="text-muted-foreground text-xs mb-1 block">
                Price (\u20b9)
              </Label>
              <Input
                type="number"
                value={newItem.price}
                onChange={(e) =>
                  setNewItem((p) => ({ ...p, price: e.target.value }))
                }
                placeholder="60"
                className="bg-secondary border-border text-foreground"
              />
            </div>
            <div>
              <Label className="text-muted-foreground text-xs mb-1 block">
                Category
              </Label>
              <Input
                value={newItem.category}
                onChange={(e) =>
                  setNewItem((p) => ({ ...p, category: e.target.value }))
                }
                placeholder="Local Specials"
                className="bg-secondary border-border text-foreground"
              />
            </div>
            <div className="flex items-center gap-2">
              <Switch
                checked={newItem.isVeg}
                onCheckedChange={(v) => setNewItem((p) => ({ ...p, isVeg: v }))}
                className="data-[state=checked]:bg-green-500"
              />
              <Label className="text-foreground text-sm">Vegetarian</Label>
            </div>
          </div>
          <DialogFooter className="gap-2">
            <Button
              data-ocid="admin.addmenu.cancel_button"
              variant="ghost"
              onClick={() => setShowAddMenu(false)}
            >
              Cancel
            </Button>
            <Button
              data-ocid="admin.addmenu.confirm_button"
              className="gold-gradient text-primary-foreground"
              onClick={handleAddItem}
            >
              Add Item
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      {editItem && (
        <Dialog open={!!editItem} onOpenChange={() => setEditItem(null)}>
          <DialogContent className="bg-card border-border max-w-sm mx-auto">
            <DialogHeader>
              <DialogTitle className="text-foreground">
                Edit: {editItem.name}
              </DialogTitle>
            </DialogHeader>
            <div className="py-2 space-y-3">
              <div className="flex items-center justify-between">
                <Label className="text-foreground text-sm">Available</Label>
                <Switch
                  checked={true}
                  onCheckedChange={() => {
                    setEditItem(null);
                    toast.success("Availability updated");
                  }}
                  className="data-[state=checked]:bg-primary"
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                data-ocid="admin.edit.close_button"
                variant="ghost"
                onClick={() => setEditItem(null)}
              >
                Close
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
