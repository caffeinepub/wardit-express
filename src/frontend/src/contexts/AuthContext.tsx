import {
  type ReactNode,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

export interface AuthUser {
  id: string;
  name: string;
  phone: string;
  coachNumber: string;
  seatNumber: string;
  walletCredits: number;
  referralCode: string;
  isBNPLEnabled: boolean;
  isVerifiedTraveler: boolean;
  platformNumber: string;
}

interface AuthContextValue {
  user: AuthUser | null;
  isLoggedIn: boolean;
  showAuthModal: boolean;
  setShowAuthModal: (v: boolean) => void;
  login: (user: AuthUser) => void;
  logout: () => void;
  updateUser: (partial: Partial<AuthUser>) => void;
  addCredits: (amount: number) => void;
  deductCredits: (amount: number) => boolean;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function makeAuthUser(phone: string, name: string): AuthUser {
  return {
    id: `user_${phone}`,
    name,
    phone,
    coachNumber: "",
    seatNumber: "",
    walletCredits: 200,
    referralCode: `WRD${phone.slice(-4).toUpperCase()}${Math.floor(Math.random() * 100)}`,
    isBNPLEnabled: false,
    isVerifiedTraveler: true,
    platformNumber: "4",
  };
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(() => {
    try {
      const stored = localStorage.getItem("wardit_user");
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });
  const [showAuthModal, setShowAuthModal] = useState(false);

  useEffect(() => {
    if (user) {
      localStorage.setItem("wardit_user", JSON.stringify(user));
    } else {
      localStorage.removeItem("wardit_user");
    }
  }, [user]);

  const login = useCallback((u: AuthUser) => {
    setUser(u);
    setShowAuthModal(false);
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem("wardit_user");
  }, []);

  const updateUser = useCallback((partial: Partial<AuthUser>) => {
    setUser((prev) => (prev ? { ...prev, ...partial } : prev));
  }, []);

  const addCredits = useCallback((amount: number) => {
    setUser((prev) =>
      prev ? { ...prev, walletCredits: prev.walletCredits + amount } : prev,
    );
  }, []);

  const deductCredits = useCallback((amount: number): boolean => {
    let success = false;
    setUser((prev) => {
      if (!prev || prev.walletCredits < amount) return prev;
      success = true;
      return { ...prev, walletCredits: prev.walletCredits - amount };
    });
    return success;
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoggedIn: !!user,
        showAuthModal,
        setShowAuthModal,
        login,
        logout,
        updateUser,
        addCredits,
        deductCredits,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}

/** Hook that returns a factory function to create an AuthUser */
export function useMakeUser() {
  return makeAuthUser;
}
