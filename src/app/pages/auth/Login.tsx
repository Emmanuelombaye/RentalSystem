import { useState } from "react";
import { useNavigate, Link } from "react-router";
import { supabase } from "../../lib/supabase";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../../components/ui/card";
import { Building2, Lock, Mail, ArrowRight, Loader2, Sparkles, AlertCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;
      if (data.session) {
        navigate("/dashboard");
      }
    } catch (err: any) {
      setError(err.message || "Invalid login credentials");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background relative overflow-hidden p-6 md:p-12">
      {/* Dynamic Background */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-primary/10 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-blue-500/10 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '2s' }} />
      </div>

      <div className="w-full max-w-[420px] relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="text-center mb-8"
        >
          <div className="inline-flex items-center justify-center p-3 rounded-2xl bg-primary shadow-2xl shadow-primary/20 mb-4 transition-transform hover:scale-105 duration-300">
            <Building2 className="h-8 w-8 text-primary-foreground" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight font-heading mb-2">Elite Living</h1>
          <p className="text-muted-foreground">Premier Property Management System</p>
        </motion.div>

        <Card className="border-glass-border bg-glass backdrop-blur-xl shadow-glass overflow-hidden">
          <CardHeader className="space-y-1 pb-6">
            <CardTitle className="text-2xl font-bold font-heading">Welcome Back</CardTitle>
            <CardDescription>
              Sign in to manage your real estate empire
            </CardDescription>
          </CardHeader>

          <form onSubmit={handleLogin}>
            <CardContent className="space-y-4">
              <AnimatePresence mode="wait">
                {error && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="p-3 mb-2 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-sm font-medium flex items-center gap-2">
                      <AlertCircle className="h-4 w-4 shrink-0" />
                      {error}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="space-y-2">
                <Label htmlFor="email" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground/70">Email Address</Label>
                <div className="relative group">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground transition-colors group-focus-within:text-primary" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="admin@eliteliving.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10 h-11 bg-background/40 border-glass-border focus-visible:ring-primary/20 transition-all"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground/70">Password</Label>
                  <Link
                    to="/auth/forgot-password"
                    className="text-xs font-medium text-primary hover:text-primary/80 transition-colors"
                  >
                    Forgot Password?
                  </Link>
                </div>
                <div className="relative group">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground transition-colors group-focus-within:text-primary" />
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 h-11 bg-background/40 border-glass-border focus-visible:ring-primary/20 transition-all"
                    required
                  />
                </div>
              </div>

              <div className="flex items-center space-x-2 pt-1">
                <input
                  type="checkbox"
                  id="remember"
                  className="w-4 h-4 rounded border-glass-border bg-background/40 text-primary focus:ring-primary/20"
                />
                <label htmlFor="remember" className="text-sm text-muted-foreground cursor-pointer select-none">
                  Keep me connected
                </label>
              </div>
            </CardContent>

            <CardFooter className="flex flex-col gap-4 pt-2 pb-8">
              <Button
                type="submit"
                className="w-full h-11 shadow-xl shadow-primary/20 font-semibold group relative overflow-hidden"
                disabled={loading}
              >
                {loading ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <>
                    <span className="relative z-10 flex items-center">
                      Authorize Access
                      <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </span>
                    <div className={`absolute inset-0 bg-gradient-to-r from-primary to-primary-foreground/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
                  </>
                )}
              </Button>

              <p className="text-center text-sm text-muted-foreground mt-2">
                Don't have an elite account?{" "}
                <Link to="/auth/register" className="font-semibold text-primary hover:underline transition-all underline-offset-4">
                  Request Access
                </Link>
              </p>
            </CardFooter>
          </form>
        </Card>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-12 flex flex-col items-center gap-4"
        >
          <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-glass/30 border border-glass-border backdrop-blur-sm shadow-sm transition-all hover:bg-glass/50 cursor-default">
            <Sparkles className="h-4 w-4 text-primary animate-pulse" />
            <span className="text-[10px] font-bold uppercase tracking-[2px] text-muted-foreground/80">AI Insight Protocol v2.4</span>
          </div>

          <div className="flex gap-6 mt-2 opacity-40">
            <div className="h-4 w-12 bg-muted-foreground/20 rounded animate-pulse" />
            <div className="h-4 w-16 bg-muted-foreground/20 rounded animate-pulse" style={{ animationDelay: '0.5s' }} />
            <div className="h-4 w-10 bg-muted-foreground/20 rounded animate-pulse" style={{ animationDelay: '1s' }} />
          </div>
        </motion.div>
      </div>
    </div>
  );
}
