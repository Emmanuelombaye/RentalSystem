import { useState, useEffect } from "react";
import { Plus, Search, Filter, Home, Building2, MoreVertical, Loader2 } from "lucide-react";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Card, CardContent } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import { api } from "../../lib/api";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../../components/ui/dropdown-menu";

export function Units() {
  const [units, setUnits] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    async function fetchUnits() {
      try {
        const data = await api.units.getAll();
        setUnits(data || []);
      } catch (err) {
        console.error("Fetch Units Error:", err);
        setError("Failed to sync units with database.");
      } finally {
        setLoading(false);
      }
    }
    fetchUnits();
  }, []);

  const filteredUnits = units.filter(
    (unit) =>
      unit.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (unit.property?.name || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      (unit.tenant?.name || "").toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case "occupied":
        return <Badge className="bg-blue-500 hover:bg-blue-600">Occupied</Badge>;
      case "vacant":
        return <Badge variant="secondary">Vacant</Badge>;
      case "maintenance":
        return <Badge variant="outline" className="border-orange-500 text-orange-500">Maintenance</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
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
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Units</h1>
          <p className="text-muted-foreground mt-1">
            Real-time unit management across your portfolio
          </p>
        </div>
        <Button className="shadow-lg shadow-primary/20">
          <Plus className="h-4 w-4 mr-2" />
          Add Unit
        </Button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Card className="border-none bg-accent/30 tracking-tight">
          <CardContent className="p-4">
            <div className="text-xs font-bold uppercase text-muted-foreground/70 mb-1">Total Inventory</div>
            <div className="text-2xl font-bold">{units.length}</div>
          </CardContent>
        </Card>
        <Card className="border-none bg-blue-500/5">
          <CardContent className="p-4">
            <div className="text-xs font-bold uppercase text-blue-600/70 mb-1">Revenue Active</div>
            <div className="text-2xl font-bold text-blue-600">
              {units.filter((u) => u.status.toLowerCase() === "occupied").length}
            </div>
          </CardContent>
        </Card>
        <Card className="border-none bg-orange-500/5">
          <CardContent className="p-4">
            <div className="text-xs font-bold uppercase text-orange-600/70 mb-1">Vacant</div>
            <div className="text-2xl font-bold text-orange-600">
              {units.filter((u) => u.status.toLowerCase() === "vacant").length}
            </div>
          </CardContent>
        </Card>
        <Card className="border-none bg-accent/30">
          <CardContent className="p-4">
            <div className="text-xs font-bold uppercase text-muted-foreground/70 mb-1">Yield</div>
            <div className="text-2xl font-bold">
              {units.length > 0 ? ((units.filter(u => u.status === 'occupied').length / units.length) * 100).toFixed(0) : 0}%
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="border-glass-border bg-glass/30 backdrop-blur-md">
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search unit label, property, or tenant..."
                className="pl-9 bg-background/50 border-glass-border"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              <Select defaultValue="all">
                <SelectTrigger className="w-full sm:w-[150px] bg-background/50 border-glass-border text-xs">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="occupied">Occupied</SelectItem>
                  <SelectItem value="vacant">Vacant</SelectItem>
                  <SelectItem value="maintenance">Maintenance</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" size="icon" className="border-glass-border">
                <Filter className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border-glass-border overflow-hidden">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-muted/50">
                <TableRow>
                  <TableHead className="font-bold text-xs">Unit</TableHead>
                  <TableHead className="hidden md:table-cell font-bold text-xs text-center">Property Asset</TableHead>
                  <TableHead className="font-bold text-xs text-center">Status</TableHead>
                  <TableHead className="hidden lg:table-cell font-bold text-xs">Current Resident</TableHead>
                  <TableHead className="text-right font-bold text-xs uppercase tracking-wider">Base Rent</TableHead>
                  <TableHead className="w-[50px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUnits.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-12 text-muted-foreground">
                      No units found in database.
                    </TableCell>
                  </TableRow>
                ) : filteredUnits.map((unit) => (
                  <TableRow key={unit.id} className="hover:bg-accent/30 transition-colors">
                    <TableCell className="font-semibold">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                          <Home className="h-4 w-4 text-primary" />
                        </div>
                        {unit.label}
                      </div>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      <div className="flex items-center justify-center gap-2">
                        <Building2 className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">{unit.property?.name || "Independent asset"}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-center">{getStatusBadge(unit.status)}</TableCell>
                    <TableCell className="hidden lg:table-cell">
                      {unit.tenant ? (
                        <div className="flex flex-col">
                          <span className="font-medium text-sm">{unit.tenant.name}</span>
                          <span className="text-[10px] text-muted-foreground">{unit.tenant.email}</span>
                        </div>
                      ) : (
                        <span className="text-muted-foreground italic text-xs">Market Ready</span>
                      )}
                    </TableCell>
                    <TableCell className="text-right font-bold">
                      ${unit.rent.toLocaleString()}
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="hover:bg-primary/10 hover:text-primary">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="border-glass-border">
                          <DropdownMenuItem className="cursor-pointer">Inventory Management</DropdownMenuItem>
                          <DropdownMenuItem className="cursor-pointer">Adjust Rent Rate</DropdownMenuItem>
                          <DropdownMenuItem className="cursor-pointer">Tenant Matching</DropdownMenuItem>
                          <DropdownMenuItem className="text-destructive cursor-pointer">
                            Decommission Unit
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {error && (
        <div className="p-4 rounded-lg bg-destructive/10 text-destructive text-sm text-center font-medium">
          {error}
        </div>
      )}
    </div>
  );
}
