import { Plus, Calendar, AlertCircle } from "lucide-react";
import { Button } from "../../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../components/ui/table";

const leases = [
  { id: 1, tenant: "John Doe", unit: "Unit 305", start: "2024-01-01", end: "2026-12-31", rent: 1200, status: "active", daysToExpiry: 307 },
  { id: 2, tenant: "Jane Smith", unit: "Unit 412", start: "2025-06-01", end: "2026-05-31", rent: 1450, status: "active", daysToExpiry: 92 },
  { id: 3, tenant: "Mike Johnson", unit: "Unit 201", start: "2024-03-01", end: "2027-02-28", rent: 1100, status: "active", daysToExpiry: 365 },
  { id: 4, tenant: "Sarah Williams", unit: "Unit 508", start: "2025-01-01", end: "2026-03-31", rent: 1350, status: "expiring", daysToExpiry: 31 },
];

export function Leases() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Leases</h1>
          <p className="text-muted-foreground mt-1">
            Manage lease agreements and renewals
          </p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          New Lease
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Active Leases
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{leases.filter(l => l.status === "active").length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Expiring Soon
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">
              {leases.filter(l => l.daysToExpiry <= 60).length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Avg. Lease Term
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">24 months</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Value
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${(leases.reduce((sum, l) => sum + l.rent, 0)).toLocaleString()}/mo
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="border-orange-200 dark:border-orange-900 bg-orange-50/50 dark:bg-orange-950/20">
        <CardContent className="flex items-start gap-3 p-4">
          <AlertCircle className="h-5 w-5 text-orange-600 shrink-0 mt-0.5" />
          <div>
            <h3 className="font-medium mb-1">1 lease expiring in 30 days</h3>
            <p className="text-sm text-muted-foreground">
              Review and initiate renewal process for Unit 508
            </p>
          </div>
          <Button size="sm" variant="outline" className="ml-auto shrink-0">
            Review
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>All Leases</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Tenant</TableHead>
                  <TableHead className="hidden sm:table-cell">Unit</TableHead>
                  <TableHead className="hidden md:table-cell">Start Date</TableHead>
                  <TableHead className="hidden md:table-cell">End Date</TableHead>
                  <TableHead className="hidden lg:table-cell">Rent</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Days to Expiry</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {leases.map((lease) => (
                  <TableRow key={lease.id}>
                    <TableCell className="font-medium">{lease.tenant}</TableCell>
                    <TableCell className="hidden sm:table-cell">{lease.unit}</TableCell>
                    <TableCell className="hidden md:table-cell">{lease.start}</TableCell>
                    <TableCell className="hidden md:table-cell">{lease.end}</TableCell>
                    <TableCell className="hidden lg:table-cell">
                      ${lease.rent.toLocaleString()}
                    </TableCell>
                    <TableCell>
                      <Badge variant={lease.daysToExpiry <= 60 ? "destructive" : "default"}>
                        {lease.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      {lease.daysToExpiry} days
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
