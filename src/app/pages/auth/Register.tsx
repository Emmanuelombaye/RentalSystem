import { useState } from "react";
import { useNavigate, Link } from "react-router";
import { supabase } from "../../lib/supabase";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../../components/ui/card";
import { Building2, Lock, Mail, User, ArrowRight, Loader2, Sparkles, AlertCircle, Building } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
          },
        },
      });

      if (error) throw error;
      setSuccess(true);
      setTimeout(() => navigate("/auth/login"), 3000);
    } catch (err: any) {
      setError(err.message || "Could not complete registration");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center space-y-4 max-w-sm"
        >
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <Sparkles className="h-8 w-8 text-primary" />
          </div>
          <h2 className="text-2xl font-bold font-heading">Check your email</h2>
          <p className="text-muted-foreground">
            We've sent a verification link to <span className="font-semibold text-foreground">{email}</span>. Please verify your account to continue.
          </p>
          <Button variant="outline" className="mt-4" onClick={() => navigate("/auth/login")}>
            Back to Login
          </Button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background relative overflow-hidden p-6 md:p-12">
      {/* Background Decor */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-primary/10 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-500/10 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '2s' }} />
      </div>

      <div className="w-full max-w-[440px] relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="inline-flex items-center justify-center p-3 rounded-2xl bg-primary shadow-2xl shadow-primary/20 mb-4">
            <Building2 className="h-8 w-8 text-primary-foreground" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight font-heading mb-2">Join Elite Living</h1>
          <p className="text-muted-foreground">Begin your premium management journey</p>
        </motion.div>

        <Card className="border-glass-border bg-glass backdrop-blur-xl shadow-glass">
          <CardHeader className="space-y-1 pb-6 text-center">
            <CardTitle className="text-2xl font-bold font-heading">Create Account</CardTitle>
            <CardDescription>
              Enter your details to register as a manager
            </CardDescription>
          </CardHeader>

          <form onSubmit={handleRegister}>
            <CardContent className="space-y-4">
              <AnimatePresence mode="wait">
                {error && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-sm font-medium flex items-center gap-2"
                  >
                    <AlertCircle className="h-4 w-4 shrink-0" />
                    {error}
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="space-y-2">
                <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground/70">Full Name</Label>
                <div className="relative group">
                  <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground transition-colors group-focus-within:text-primary" />
                  <Input
                    placeholder="John Wentworth"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="pl-10 h-11 bg-background/40 border-glass-border focus-visible:ring-primary/20 transition-all"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground/70">Email Address</Label>
                <div className="relative group">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground transition-colors group-focus-within:text-primary" />
                  <Input
                    type="email"
                    placeholder="john@eliteliving.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10 h-11 bg-background/40 border-glass-border focus-visible:ring-primary/20 transition-all"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground/70">Secure Password</Label>
                <div className="relative group">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground transition-colors group-focus-within:text-primary" />
                  <Input
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 h-11 bg-background/40 border-glass-border focus-visible:ring-primary/20 transition-all"
                    required
                  />
                </div>
              </div>

              <p className="text-[10px] text-muted-foreground leading-relaxed pt-2">
                By creating an account, you agree to our <a href="#" className="underline decoration-primary/30 underline-offset-2 hover:text-primary transition-colors">Terms of Service</a> and <a href="#" className="underline decoration-primary/30 underline-offset-2 hover:text-primary transition-colors">Privacy Policy</a>.
              </p>
            </CardContent>

            <CardFooter className="flex flex-col gap-4 pt-2 pb-8">
              <Button
                type="submit"
                className="w-full h-11 shadow-xl shadow-primary/20 font-semibold group"
                disabled={loading}
              >
                {loading ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <>
                    Initialize Account
                    <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </>
                )}
              </Button>

              <p className="text-center text-sm text-muted-foreground mt-2">
                Already part of the elite?{" "}
                <Link to="/auth/login" className="font-semibold text-primary hover:underline transition-all underline-offset-4">
                  Sign In
                </Link>
              </p>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
}
