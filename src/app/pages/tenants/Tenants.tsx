import { useState } from "react";
import { Link } from "react-router";
import { Plus, Search, Filter, Users, Mail, Phone, MoreVertical } from "lucide-react";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Card, CardContent } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import { Avatar, AvatarFallback } from "../../components/ui/avatar";
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

const tenants = [
  { id: 1, name: "John Doe", email: "john@example.com", phone: "(555) 123-4567", unit: "Unit 305", property: "Sunset Apartments", rent: 1200, balance: 0, status: "active" },
  { id: 2, name: "Jane Smith", email: "jane@example.com", phone: "(555) 234-5678", unit: "Unit 412", property: "Oak Street", rent: 1450, balance: -1450, status: "overdue" },
  { id: 3, name: "Mike Johnson", email: "mike@example.com", phone: "(555) 345-6789", unit: "Unit 201", property: "Downtown Lofts", rent: 1100, balance: 0, status: "active" },
  { id: 4, name: "Sarah Williams", email: "sarah@example.com", phone: "(555) 456-7890", unit: "Unit 508", property: "Riverside Condos", rent: 1350, balance: 0, status: "active" },
  { id: 5, name: "Robert Brown", email: "robert@example.com", phone: "(555) 567-8901", unit: "Unit 103", property: "Park View", rent: 1250, balance: -625, status: "overdue" },
];

export function Tenants() {
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "table">("grid");

  const filteredTenants = tenants.filter(
    (tenant) =>
      tenant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tenant.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tenant.unit.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Tenants</h1>
          <p className="text-muted-foreground mt-1">
            Manage your tenant directory
          </p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Add Tenant
        </Button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-sm text-muted-foreground mb-1">Total Tenants</div>
            <div className="text-2xl font-bold">{tenants.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-sm text-muted-foreground mb-1">Active</div>
            <div className="text-2xl font-bold">
              {tenants.filter((t) => t.status === "active").length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-sm text-muted-foreground mb-1">Overdue</div>
            <div className="text-2xl font-bold text-orange-600">
              {tenants.filter((t) => t.status === "overdue").length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-sm text-muted-foreground mb-1">Total Owed</div>
            <div className="text-2xl font-bold">
              ${Math.abs(tenants.reduce((sum, t) => sum + t.balance, 0)).toLocaleString()}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search tenants..."
                className="pl-9"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              <Select defaultValue="all">
                <SelectTrigger className="w-full sm:w-[150px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="overdue">Overdue</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" size="icon">
                <Filter className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {filteredTenants.map((tenant) => (
          <Card key={tenant.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <Avatar className="h-12 w-12">
                    <AvatarFallback>{getInitials(tenant.name)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <Link to={`/tenants/${tenant.id}`}>
                      <h3 className="font-semibold hover:text-primary transition-colors">
                        {tenant.name}
                      </h3>
                    </Link>
                    <p className="text-sm text-muted-foreground">{tenant.unit}</p>
                  </div>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>View Profile</DropdownMenuItem>
                    <DropdownMenuItem>Send Message</DropdownMenuItem>
                    <DropdownMenuItem>Edit Details</DropdownMenuItem>
                    <DropdownMenuItem className="text-destructive">
                      Remove Tenant
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              <div className="space-y-2 mb-4">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Mail className="h-4 w-4" />
                  <span className="truncate">{tenant.email}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Phone className="h-4 w-4" />
                  <span>{tenant.phone}</span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t">
                <div>
                  <div className="text-sm text-muted-foreground">Monthly Rent</div>
                  <div className="font-semibold">${tenant.rent.toLocaleString()}</div>
                </div>
                {tenant.balance < 0 ? (
                  <Badge variant="destructive">
                    Owes ${Math.abs(tenant.balance).toLocaleString()}
                  </Badge>
                ) : (
                  <Badge>Paid</Badge>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
