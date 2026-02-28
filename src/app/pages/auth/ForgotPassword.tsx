import { useState } from "react";
import { Link } from "react-router";
import { Building2, Mail, ArrowLeft, Check } from "lucide-react";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";

export function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-background">
      <div className="w-full max-w-md space-y-8">
        {/* Logo */}
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-600 to-blue-700 flex items-center justify-center">
            <Building2 className="w-7 h-7 text-white" />
          </div>
        </div>

        {!submitted ? (
          <div className="bg-card border border-border rounded-xl p-8 shadow-sm space-y-6">
            <div className="space-y-2 text-center">
              <h2 className="text-2xl font-bold tracking-tight">Forgot password?</h2>
              <p className="text-muted-foreground">
                No worries, we'll send you reset instructions
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email address</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="john@example.com"
                    className="pl-9"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>

              <Button type="submit" className="w-full" size="lg">
                Reset password
              </Button>
            </form>

            <Link
              to="/auth/login"
              className="flex items-center justify-center gap-2 text-sm text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to login
            </Link>
          </div>
        ) : (
          <div className="bg-card border border-border rounded-xl p-8 shadow-sm space-y-6 text-center">
            <div className="flex justify-center">
              <div className="w-16 h-16 rounded-full bg-green-100 dark:bg-green-900/20 flex items-center justify-center">
                <Check className="h-8 w-8 text-green-600 dark:text-green-400" />
              </div>
            </div>
            <div className="space-y-2">
              <h2 className="text-2xl font-bold">Check your email</h2>
              <p className="text-muted-foreground">
                We sent a password reset link to
                <br />
                <span className="font-medium text-foreground">{email}</span>
              </p>
            </div>
            <div className="space-y-3 pt-4">
              <p className="text-sm text-muted-foreground">
                Didn't receive the email?{" "}
                <button
                  onClick={() => setSubmitted(false)}
                  className="text-primary hover:underline font-medium"
                >
                  Click to resend
                </button>
              </p>
              <Link
                to="/auth/login"
                className="flex items-center justify-center gap-2 text-sm text-muted-foreground hover:text-foreground"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to login
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
