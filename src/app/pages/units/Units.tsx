import { useState } from "react";
import { Plus, Search, Filter, Home, Building2, MoreVertical } from "lucide-react";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Card, CardContent } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
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

const units = [
  { id: 1, number: "101", property: "Sunset Apartments", type: "1BR", rent: 1200, status: "occupied", tenant: "John Doe" },
  { id: 2, number: "102", property: "Sunset Apartments", type: "1BR", rent: 1200, status: "occupied", tenant: "Jane Smith" },
  { id: 3, number: "103", property: "Sunset Apartments", type: "2BR", rent: 1500, status: "vacant", tenant: null },
  { id: 4, number: "201", property: "Oak Street Residences", type: "2BR", rent: 1400, status: "occupied", tenant: "Mike Johnson" },
  { id: 5, number: "202", property: "Oak Street Residences", type: "1BR", rent: 1100, status: "maintenance", tenant: null },
  { id: 6, number: "305", property: "Downtown Lofts", type: "Studio", rent: 950, status: "occupied", tenant: "Sarah Williams" },
];

export function Units() {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredUnits = units.filter(
    (unit) =>
      unit.number.toLowerCase().includes(searchQuery.toLowerCase()) ||
      unit.property.toLowerCase().includes(searchQuery.toLowerCase()) ||
      unit.tenant?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "occupied":
        return <Badge>Occupied</Badge>;
      case "vacant":
        return <Badge variant="secondary">Vacant</Badge>;
      case "maintenance":
        return <Badge variant="outline">Maintenance</Badge>;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Units</h1>
          <p className="text-muted-foreground mt-1">
            Manage all units across your properties
          </p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Add Unit
        </Button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-sm text-muted-foreground mb-1">Total Units</div>
            <div className="text-2xl font-bold">{units.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-sm text-muted-foreground mb-1">Occupied</div>
            <div className="text-2xl font-bold">
              {units.filter((u) => u.status === "occupied").length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-sm text-muted-foreground mb-1">Vacant</div>
            <div className="text-2xl font-bold">
              {units.filter((u) => u.status === "vacant").length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-sm text-muted-foreground mb-1">Maintenance</div>
            <div className="text-2xl font-bold">
              {units.filter((u) => u.status === "maintenance").length}
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
                placeholder="Search units..."
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
                  <SelectItem value="occupied">Occupied</SelectItem>
                  <SelectItem value="vacant">Vacant</SelectItem>
                  <SelectItem value="maintenance">Maintenance</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" size="icon">
                <Filter className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Unit #</TableHead>
                  <TableHead className="hidden md:table-cell">Property</TableHead>
                  <TableHead className="hidden sm:table-cell">Type</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="hidden lg:table-cell">Tenant</TableHead>
                  <TableHead className="text-right">Rent</TableHead>
                  <TableHead className="w-[50px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUnits.map((unit) => (
                  <TableRow key={unit.id}>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2">
                        <Home className="h-4 w-4 text-muted-foreground" />
                        {unit.number}
                      </div>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      <div className="flex items-center gap-2">
                        <Building2 className="h-4 w-4 text-muted-foreground" />
                        {unit.property}
                      </div>
                    </TableCell>
                    <TableCell className="hidden sm:table-cell">{unit.type}</TableCell>
                    <TableCell>{getStatusBadge(unit.status)}</TableCell>
                    <TableCell className="hidden lg:table-cell">
                      {unit.tenant || <span className="text-muted-foreground">—</span>}
                    </TableCell>
                    <TableCell className="text-right font-medium">
                      ${unit.rent.toLocaleString()}
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>View Details</DropdownMenuItem>
                          <DropdownMenuItem>Edit Unit</DropdownMenuItem>
                          <DropdownMenuItem>Assign Tenant</DropdownMenuItem>
                          <DropdownMenuItem className="text-destructive">
                            Delete
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
    </div>
  );
}
