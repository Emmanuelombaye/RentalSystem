import { useState } from "react";
import { DollarSign, TrendingUp, CreditCard, Calendar, Filter, Download } from "lucide-react";
import { Button } from "../../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import { Input } from "../../components/ui/input";
import { Progress } from "../../components/ui/progress";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs";

const payments = [
  { id: 1, tenant: "John Doe", unit: "Unit 305", amount: 1200, dueDate: "2026-03-01", status: "paid", paidDate: "2026-02-28" },
  { id: 2, tenant: "Jane Smith", unit: "Unit 412", amount: 1450, dueDate: "2026-03-01", status: "pending", paidDate: null },
  { id: 3, tenant: "Mike Johnson", unit: "Unit 201", amount: 1100, dueDate: "2026-02-15", status: "overdue", paidDate: null },
  { id: 4, tenant: "Sarah Williams", unit: "Unit 508", amount: 1350, dueDate: "2026-03-01", status: "paid", paidDate: "2026-03-01" },
  { id: 5, tenant: "Robert Brown", unit: "Unit 103", amount: 1250, dueDate: "2026-02-20", status: "overdue", paidDate: null },
];

export function RentCollection() {
  const [selectedMonth, setSelectedMonth] = useState("march-2026");

  const totalExpected = payments.reduce((sum, p) => sum + p.amount, 0);
  const totalCollected = payments
    .filter(p => p.status === "paid")
    .reduce((sum, p) => sum + p.amount, 0);
  const collectionRate = (totalCollected / totalExpected) * 100;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
            Rent Collection
          </h1>
          <p className="text-muted-foreground mt-1">
            Track and manage rent payments
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </Button>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button>Record Payment</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Expected This Month
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${totalExpected.toLocaleString()}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Collected
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              ${totalCollected.toLocaleString()}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Outstanding
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">
              ${(totalExpected - totalCollected).toLocaleString()}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Collection Rate
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{collectionRate.toFixed(1)}%</div>
            <Progress value={collectionRate} className="mt-2" />
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row gap-4 sm:items-center sm:justify-between">
            <CardTitle>Payment Status</CardTitle>
            <Select value={selectedMonth} onValueChange={setSelectedMonth}>
              <SelectTrigger className="w-full sm:w-[200px]">
                <Calendar className="h-4 w-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="march-2026">March 2026</SelectItem>
                <SelectItem value="february-2026">February 2026</SelectItem>
                <SelectItem value="january-2026">January 2026</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="all">
            <TabsList className="mb-4">
              <TabsTrigger value="all">All ({payments.length})</TabsTrigger>
              <TabsTrigger value="paid">
                Paid ({payments.filter(p => p.status === "paid").length})
              </TabsTrigger>
              <TabsTrigger value="pending">
                Pending ({payments.filter(p => p.status === "pending").length})
              </TabsTrigger>
              <TabsTrigger value="overdue">
                Overdue ({payments.filter(p => p.status === "overdue").length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="all">
              <PaymentTable payments={payments} />
            </TabsContent>
            <TabsContent value="paid">
              <PaymentTable payments={payments.filter(p => p.status === "paid")} />
            </TabsContent>
            <TabsContent value="pending">
              <PaymentTable payments={payments.filter(p => p.status === "pending")} />
            </TabsContent>
            <TabsContent value="overdue">
              <PaymentTable payments={payments.filter(p => p.status === "overdue")} />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}

function PaymentTable({ payments }: { payments: typeof payments }) {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "paid":
        return <Badge>Paid</Badge>;
      case "pending":
        return <Badge variant="secondary">Pending</Badge>;
      case "overdue":
        return <Badge variant="destructive">Overdue</Badge>;
      default:
        return null;
    }
  };

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Tenant</TableHead>
            <TableHead className="hidden sm:table-cell">Unit</TableHead>
            <TableHead className="hidden md:table-cell">Due Date</TableHead>
            <TableHead className="text-right">Amount</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="hidden lg:table-cell">Paid Date</TableHead>
            <TableHead className="text-right">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {payments.map((payment) => (
            <TableRow key={payment.id}>
              <TableCell className="font-medium">{payment.tenant}</TableCell>
              <TableCell className="hidden sm:table-cell">{payment.unit}</TableCell>
              <TableCell className="hidden md:table-cell">{payment.dueDate}</TableCell>
              <TableCell className="text-right font-semibold">
                ${payment.amount.toLocaleString()}
              </TableCell>
              <TableCell>{getStatusBadge(payment.status)}</TableCell>
              <TableCell className="hidden lg:table-cell">
                {payment.paidDate || <span className="text-muted-foreground">—</span>}
              </TableCell>
              <TableCell className="text-right">
                {payment.status !== "paid" && (
                  <Button size="sm" variant="outline">
                    Record Payment
                  </Button>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
