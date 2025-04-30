import React, { useState, useRef, useEffect } from "react";
import { ArrowLeft,Bot } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { otpVerify } from "../../api/Auth/opt-verify";

export default function OtpVerification() {
  const [otp, setOtp] = useState<string[]>(Array(6).fill(""));
  const [loading, setLoading] = useState(false);
  const inputsRef = useRef<HTMLInputElement[]>([]);
  const navigate = useNavigate();

  // Get email from localStorage (set it in ForgotPassword page)
  const [email, setEmail] = useState("");

  useEffect(() => {
    const storedEmail = localStorage.getItem("reset_email");
    if (!storedEmail) {
      toast.error("No email found. Please restart the process.");
      navigate("/forgot-password");
    } else {
      setEmail(storedEmail);
    }
  }, []);

  const handleChange = (value: string, index: number) => {
    if (!/^[0-9]?$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 5) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    index: number
  ) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const otpCode = otp.join("");

    if (otpCode.length !== 6) {
      toast.error("Please enter all 6 digits");
      return;
    }

    setLoading(true);
    try {
      const response = await otpVerify({ email, otp: otpCode });
      console.log("OTP verification response:", response);
      toast.success("OTP verified successfully!");
      navigate("/changePassword");
    } catch (error: any) {
      toast.error(error?.message || "OTP verification failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white px-8 py-5 rounded-lg shadow-md">
        <div>
          <div className="flex justify-center">
            <Bot className="h-16 w-16 text-blue-600 mb-4" />
          </div>
          <h2 className="mt-2 text-center text-3xl font-extrabold text-gray-900">
            Enter OTP Code
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            We sent a 6-digit OTP to your email. Please enter it below to
            continue.
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="flex justify-center gap-2">
            {otp.map((digit, i) => (
              <input
                key={i}
                ref={(el) => {
                  if (el) inputsRef.current[i] = el;
                }}
                type="text"
                maxLength={1}
                value={digit}
                onChange={(e) => handleChange(e.target.value, i)}
                onKeyDown={(e) => handleKeyDown(e, i)}
                className="w-12 h-12 text-center text-lg border border-gray-300 rounded-md outline-none focus:ring-2 focus:ring-blue-500"
              />
            ))}
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Verifying..." : "Verify OTP"}
            </button>
          </div>

          <div className="text-center">
            <Link
              to="/forgot-password"
              className="font-medium text-blue-600 hover:text-blue-500 flex items-center justify-center"
            >
              <ArrowLeft className="h-5 w-5 mr-2" />
              Back to reset
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
