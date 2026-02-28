import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { supabase } from "../lib/supabase";
import { Loader2 } from "lucide-react";

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
    const [loading, setLoading] = useState(true);
    const [authenticated, setAuthenticated] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        supabase.auth.getSession().then(({ data: { session } }) => {
            if (session) {
                setAuthenticated(true);
            } else {
                navigate("/auth/login");
            }
            setLoading(false);
        });

        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            if (session) {
                setAuthenticated(true);
            } else {
                setAuthenticated(false);
                navigate("/auth/login");
            }
        });

        return () => subscription.unsubscribe();
    }, [navigate]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    return authenticated ? <>{children}</> : null;
}
