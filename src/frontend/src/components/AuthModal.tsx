import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { Label } from "@/components/ui/label";
import { Loader2, RefreshCw } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { SiGoogle } from "react-icons/si";
import { toast } from "sonner";
import { useAuth, useMakeUser } from "../contexts/AuthContext";

const OTP_TTL = 5 * 60 * 1000;

function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

function formatCountdown(ms: number) {
  const total = Math.max(0, Math.floor(ms / 1000));
  const m = Math.floor(total / 60)
    .toString()
    .padStart(2, "0");
  const s = (total % 60).toString().padStart(2, "0");
  return `${m}:${s}`;
}

export function AuthModal() {
  const { showAuthModal, setShowAuthModal, login } = useAuth();
  const makeUser = useMakeUser();
  const [step, setStep] = useState<"phone" | "otp">("phone");
  const [phone, setPhone] = useState("");
  const [name, setName] = useState("");
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [generatedOtp, setGeneratedOtp] = useState("");
  const [otpExpiry, setOtpExpiry] = useState(0);
  const [remaining, setRemaining] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const isExpired = remaining <= 0;

  useEffect(() => {
    if (step === "otp" && otpExpiry > 0) {
      const tick = () => {
        const r = otpExpiry - Date.now();
        setRemaining(r);
        if (r <= 0 && timerRef.current) clearInterval(timerRef.current);
      };
      tick();
      timerRef.current = setInterval(tick, 500);
      return () => {
        if (timerRef.current) clearInterval(timerRef.current);
      };
    }
  }, [step, otpExpiry]);

  const sendOtp = () => {
    if (phone.length < 10) {
      toast.error("Enter a valid 10-digit phone number");
      return;
    }
    const code = generateOTP();
    const expiry = Date.now() + OTP_TTL;
    setGeneratedOtp(code);
    setOtpExpiry(expiry);
    setRemaining(OTP_TTL);
    setOtp("");
    setStep("otp");
    toast.success("OTP sent to your mobile number!");
  };

  const handleVerifyOtp = async () => {
    if (otp.length !== 6) {
      toast.error("Enter the 6-digit OTP");
      return;
    }
    if (isExpired) {
      toast.error("OTP has expired. Please request a new one.");
      return;
    }
    if (otp !== generatedOtp) {
      toast.error("Incorrect OTP. Please check and try again.");
      return;
    }
    setLoading(true);
    await new Promise((r) => setTimeout(r, 800));
    const user = makeUser(phone, name || "Traveler");
    login(user);
    toast.success("Welcome to WARDIT Express! ₹200 credits added.");
    setLoading(false);
    resetModal();
  };

  const resetModal = () => {
    setStep("phone");
    setPhone("");
    setOtp("");
    setName("");
    setGeneratedOtp("");
    setOtpExpiry(0);
    setRemaining(0);
    if (timerRef.current) clearInterval(timerRef.current);
  };

  const handleGoogle = async () => {
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1000));
    const user = makeUser("9000000001", "Google User");
    login(user);
    toast.success("Signed in with Google! ₹200 credits added.");
    setLoading(false);
  };

  return (
    <Dialog
      open={showAuthModal}
      onOpenChange={(open) => {
        setShowAuthModal(open);
        if (!open) resetModal();
      }}
    >
      <DialogContent className="bg-white border-border max-w-sm mx-auto rounded-2xl p-0 overflow-hidden">
        {/* Blue header bar */}
        <div className="bg-primary px-6 py-5 flex items-center gap-3">
          <div className="bg-white rounded-xl p-1.5">
            <img
              src="/assets/uploads/IMG-20260120-WA0002-1.png"
              alt="WARDIT"
              className="h-10 w-10 object-contain"
            />
          </div>
          <div>
            <h2 className="text-white font-bold text-lg">WARDIT</h2>
            <p className="text-white/80 text-xs">On-Demand Delivery</p>
          </div>
        </div>

        <div className="px-6 py-6">
          <DialogHeader>
            <div className="flex justify-center mb-4">
              <div className="bg-blue-50 rounded-full p-4">
                <svg
                  role="img"
                  aria-label="Delivery box"
                  className="h-8 w-8 text-primary"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                  />
                </svg>
              </div>
            </div>
            <DialogTitle className="text-foreground text-xl font-bold text-center">
              {step === "phone" ? "Welcome Back" : "Verify Your Number"}
            </DialogTitle>
            <p className="text-muted-foreground text-sm text-center">
              {step === "phone"
                ? "Sign in to your account"
                : `OTP sent to +91 XXXXXX${phone.slice(-4)}`}
            </p>
          </DialogHeader>

          <div className="space-y-4 pt-4">
            {step === "phone" ? (
              <>
                <div className="space-y-1.5">
                  <Label className="text-foreground text-sm font-medium">
                    Your Name
                  </Label>
                  <Input
                    data-ocid="auth.phone.input"
                    placeholder="Enter your name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="bg-gray-50 border-border h-11 rounded-xl"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-foreground text-sm font-medium">
                    Mobile Number
                  </Label>
                  <div className="flex">
                    <span className="inline-flex items-center px-3 rounded-l-xl border border-r-0 border-border bg-gray-50 text-muted-foreground text-sm">
                      +91
                    </span>
                    <Input
                      data-ocid="auth.phone.input"
                      type="tel"
                      placeholder="10-digit mobile number"
                      value={phone}
                      onChange={(e) =>
                        setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))
                      }
                      className="bg-gray-50 border-border h-11 rounded-r-xl rounded-l-none flex-1"
                      maxLength={10}
                    />
                  </div>
                </div>
                <Button
                  data-ocid="auth.verify_otp.button"
                  className="w-full bg-primary text-white font-semibold h-11 rounded-xl text-base"
                  onClick={sendOtp}
                >
                  → Sign In
                </Button>
                <p className="text-center text-sm text-muted-foreground">
                  Forgot Password?
                </p>
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-border" />
                  </div>
                  <div className="relative flex justify-center text-xs">
                    <span className="bg-white px-3 text-muted-foreground">
                      or
                    </span>
                  </div>
                </div>
                <Button
                  data-ocid="auth.google.button"
                  variant="outline"
                  className="w-full border-border bg-white text-foreground h-11 gap-2 rounded-xl"
                  onClick={handleGoogle}
                  disabled={loading}
                >
                  {loading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <SiGoogle className="h-4 w-4" />
                  )}
                  Continue with Google
                </Button>
                <p className="text-center text-sm text-primary font-medium cursor-pointer">
                  Don't have an account? Sign up
                </p>
              </>
            ) : (
              <>
                {/* Dev mode OTP */}
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-3 text-center text-sm text-primary">
                  Your OTP (dev mode):{" "}
                  <span className="font-bold tracking-widest text-base">
                    {generatedOtp}
                  </span>
                </div>
                <div className="text-center">
                  {isExpired ? (
                    <span className="text-xs text-destructive font-medium">
                      OTP expired
                    </span>
                  ) : (
                    <span className="text-xs text-muted-foreground">
                      Expires in{" "}
                      <span
                        className={`font-mono font-semibold ${remaining < 60000 ? "text-destructive" : "text-primary"}`}
                      >
                        {formatCountdown(remaining)}
                      </span>
                    </span>
                  )}
                </div>
                <Label className="text-foreground text-sm font-medium block text-center">
                  Enter 6-digit OTP
                </Label>
                <div className="flex justify-center">
                  <InputOTP
                    data-ocid="auth.otp.input"
                    maxLength={6}
                    value={otp}
                    onChange={setOtp}
                    disabled={isExpired}
                  >
                    <InputOTPGroup>
                      <InputOTPSlot index={0} />
                      <InputOTPSlot index={1} />
                      <InputOTPSlot index={2} />
                      <InputOTPSlot index={3} />
                      <InputOTPSlot index={4} />
                      <InputOTPSlot index={5} />
                    </InputOTPGroup>
                  </InputOTP>
                </div>
                <Button
                  data-ocid="auth.verify_otp.button"
                  className="w-full bg-primary text-white font-semibold h-11 rounded-xl"
                  onClick={handleVerifyOtp}
                  disabled={loading || isExpired || otp.length !== 6}
                >
                  {loading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    "Verify & Login"
                  )}
                </Button>
                <div className="flex gap-2">
                  <Button
                    data-ocid="auth.resend_otp.button"
                    variant="outline"
                    className="flex-1 border-border text-muted-foreground gap-1.5 rounded-xl"
                    onClick={sendOtp}
                    disabled={!isExpired}
                  >
                    <RefreshCw className="h-3.5 w-3.5" />
                    Resend OTP
                  </Button>
                  <Button
                    data-ocid="auth.change_number.button"
                    variant="ghost"
                    className="flex-1 text-muted-foreground rounded-xl"
                    onClick={() => setStep("phone")}
                  >
                    Change Number
                  </Button>
                </div>
              </>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
