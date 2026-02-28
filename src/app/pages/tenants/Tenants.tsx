import { useState, useEffect } from "react";
import { Link } from "react-router";
import { Plus, Search, Filter, Users, Mail, Phone, MoreVertical, Loader2, ShieldCheck, AlertTriangle } from "lucide-react";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import { Avatar, AvatarFallback } from "../../components/ui/avatar";
import { api } from "../../lib/api";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../../components/ui/dropdown-menu";

export function Tenants() {
  const [tenants, setTenants] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "table">("grid");

  useEffect(() => {
    async function fetchTenants() {
      try {
        const data = await api.tenants.getAll();
        setTenants(data || []);
      } catch (err) {
        console.error("Fetch Tenants Error:", err);
        setError("Database synchronization error.");
      } finally {
        setLoading(false);
      }
    }
    fetchTenants();
  }, []);

  const filteredTenants = tenants.filter(
    (tenant) =>
      tenant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tenant.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (tenant.units?.[0]?.label || "").toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  if (loading) return (
    <div className="min-h-[400px] flex items-center justify-center">
      <Loader2 className="h-8 w-8 animate-spin text-primary" />
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight">Tenant Portfolio</h1>
          <p className="text-muted-foreground mt-1 text-sm font-medium">
            Manage leases and resident relations in real-time
          </p>
        </div>
        <Button className="shadow-lg shadow-primary/20 font-bold group">
          <Plus className="h-4 w-4 mr-2 group-hover:rotate-90 transition-transform" />
          Onboard Tenant
        </Button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Card className="border-none bg-gradient-to-br from-primary/10 to-transparent">
          <CardContent className="p-4">
            <div className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-1">Active Residents</div>
            <div className="text-2xl font-black">{tenants.length}</div>
          </CardContent>
        </Card>
        <Card className="border-none bg-emerald-500/5">
          <CardContent className="p-4">
            <div className="text-[10px] font-bold uppercase tracking-widest text-emerald-600 mb-1">Status: OK</div>
            <div className="text-2xl font-black text-emerald-600">
              {tenants.filter((t) => t.status === "active").length}
            </div>
          </CardContent>
        </Card>
        <Card className="border-none bg-orange-500/5">
          <CardContent className="p-4">
            <div className="text-[10px] font-bold uppercase tracking-widest text-orange-600 mb-1">Critical Issues</div>
            <div className="text-2xl font-black text-orange-600">
              {tenants.filter((t) => t.status === "overdue").length}
            </div>
          </CardContent>
        </Card>
        <Card className="border-none bg-accent/30">
          <CardContent className="p-4">
            <div className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-1">Portfolio Age</div>
            <div className="text-2xl font-black">2.4<span className="text-xs font-normal">y</span></div>
          </CardContent>
        </Card>
      </div>

      <Card className="border-glass-border bg-glass backdrop-blur-md">
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search tenant, email, or unit asset..."
                className="pl-9 h-11 bg-background/50 border-glass-border"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              <Select defaultValue="all">
                <SelectTrigger className="w-full sm:w-[150px] h-11 bg-background/50 border-glass-border">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="overdue">Overdue</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" size="icon" className="h-11 w-11 border-glass-border">
                <Filter className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredTenants.length === 0 ? (
          <div className="col-span-full py-12 text-center text-muted-foreground">No tenants found in database.</div>
        ) : filteredTenants.map((tenant) => (
          <Card key={tenant.id} className="hover:shadow-xl transition-all border-glass-border group relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
              <Users className="h-24 w-24 -mr-8 -mt-8 rotate-12" />
            </div>

            <CardContent className="p-6 relative z-10">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <Avatar className="h-14 w-14 ring-2 ring-primary/20 ring-offset-2">
                    <AvatarFallback className="bg-primary/10 text-primary font-black uppercase">{getInitials(tenant.name)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <Link to={`/dashboard/tenants/${tenant.id}`}>
                      <h3 className="font-extrabold text-lg group-hover:text-primary transition-colors">
                        {tenant.name}
                      </h3>
                    </Link>
                    <div className="px-2 py-0.5 rounded-full bg-accent text-[10px] font-bold uppercase tracking-tight inline-block mt-1">
                      {tenant.units?.[0]?.label || "Float Tenant"}
                    </div>
                  </div>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-primary/10">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="border-glass-border bg-glass backdrop-blur-lg">
                    <DropdownMenuItem className="cursor-pointer font-medium">Full Profile</DropdownMenuItem>
                    <DropdownMenuItem className="cursor-pointer font-medium">Send Communication</DropdownMenuItem>
                    <DropdownMenuItem className="cursor-pointer font-medium text-destructive focus:bg-destructive/10">Eviction Protocol</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              <div className="space-y-3 mb-6">
                <div className="flex items-center gap-3 text-sm text-muted-foreground bg-accent/30 p-2 rounded-lg">
                  <Mail className="h-4 w-4 text-primary/50" />
                  <span className="truncate font-medium">{tenant.email}</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-muted-foreground bg-accent/30 p-2 rounded-lg">
                  <Phone className="h-4 w-4 text-primary/50" />
                  <span className="font-medium">{tenant.phone || "No contact"}</span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-glass-border">
                <div className="flex flex-col gap-1 text-xs">
                  <span className="font-bold text-muted-foreground uppercase opacity-70">Resident Since</span>
                  <span className="font-black">2024.Q1</span>
                </div>
                {tenant.status === "overdue" ? (
                  <Badge variant="destructive" className="flex items-center gap-1.5 h-8 px-3">
                    <AlertTriangle className="h-3 w-3" />
                    Overdue
                  </Badge>
                ) : (
                  <Badge className="bg-emerald-500 hover:bg-emerald-600 flex items-center gap-1.5 h-8 px-3">
                    <ShieldCheck className="h-3 w-3" />
                    Verified
                  </Badge>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-destructive/10 text-destructive text-sm text-center font-bold">
          {error} - Checking backend connectivity...
        </div>
      )}
    </div>
  );
}
