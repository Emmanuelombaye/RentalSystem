import { useParams, Link } from "react-router";
import { ArrowLeft, Mail, Phone, MapPin, Calendar, DollarSign, FileText } from "lucide-react";
import { Button } from "../../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import { Avatar, AvatarFallback } from "../../components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../components/ui/table";

const paymentHistory = [
  { date: "2026-02-01", amount: 1200, status: "paid", method: "Bank Transfer" },
  { date: "2026-01-01", amount: 1200, status: "paid", method: "Credit Card" },
  { date: "2025-12-01", amount: 1200, status: "paid", method: "Bank Transfer" },
  { date: "2025-11-01", amount: 1200, status: "paid", method: "Cash" },
];

export function TenantProfile() {
  const { id } = useParams();

  return (
    <div className="space-y-6">
      <Link to="/dashboard/tenants">
        <Button variant="ghost" size="sm">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Tenants
        </Button>
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-1">
          <CardContent className="p-6">
            <div className="flex flex-col items-center text-center mb-6">
              <Avatar className="h-24 w-24 mb-4">
                <AvatarFallback className="text-2xl">JD</AvatarFallback>
              </Avatar>
              <h2 className="text-2xl font-bold mb-1">John Doe</h2>
              <Badge>Active Tenant</Badge>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-3 text-sm">
                <Mail className="h-4 w-4 text-muted-foreground shrink-0" />
                <span className="break-all">john@example.com</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Phone className="h-4 w-4 text-muted-foreground shrink-0" />
                <span>(555) 123-4567</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <MapPin className="h-4 w-4 text-muted-foreground shrink-0" />
                <span>Unit 305, Sunset Apartments</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Calendar className="h-4 w-4 text-muted-foreground shrink-0" />
                <span>Move-in: Jan 1, 2024</span>
              </div>
            </div>

            <div className="mt-6 pt-6 border-t space-y-2">
              <Button className="w-full">Send Message</Button>
              <Button variant="outline" className="w-full">
                Edit Profile
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="lg:col-span-2 space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Monthly Rent
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">$1,200</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Balance
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">$0</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Lease Expires
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">Dec 31</div>
              </CardContent>
            </Card>
          </div>

          <Tabs defaultValue="payments">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="payments">Payments</TabsTrigger>
              <TabsTrigger value="lease">Lease</TabsTrigger>
              <TabsTrigger value="maintenance">Maintenance</TabsTrigger>
            </TabsList>

            <TabsContent value="payments">
              <Card>
                <CardHeader>
                  <CardTitle>Payment History</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Date</TableHead>
                          <TableHead>Amount</TableHead>
                          <TableHead>Method</TableHead>
                          <TableHead>Status</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {paymentHistory.map((payment, index) => (
                          <TableRow key={index}>
                            <TableCell>{payment.date}</TableCell>
                            <TableCell className="font-medium">
                              ${payment.amount.toLocaleString()}
                            </TableCell>
                            <TableCell>{payment.method}</TableCell>
                            <TableCell>
                              <Badge>Paid</Badge>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="lease">
              <Card>
                <CardHeader>
                  <CardTitle>Lease Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <div className="text-sm text-muted-foreground mb-1">Start Date</div>
                      <div className="font-medium">January 1, 2024</div>
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground mb-1">End Date</div>
                      <div className="font-medium">December 31, 2026</div>
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground mb-1">Rent Amount</div>
                      <div className="font-medium">$1,200/month</div>
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground mb-1">Security Deposit</div>
                      <div className="font-medium">$2,400</div>
                    </div>
                  </div>
                  <Button variant="outline" className="w-full">
                    <FileText className="h-4 w-4 mr-2" />
                    Download Lease Agreement
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="maintenance">
              <Card>
                <CardHeader>
                  <CardTitle>Maintenance Requests</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="p-3 rounded-lg border">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-medium">AC not cooling</span>
                        <Badge variant="outline">Completed</Badge>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Submitted on Feb 10, 2026
                      </div>
                    </div>
                    <div className="p-3 rounded-lg border">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-medium">Leaky faucet</span>
                        <Badge variant="outline">Completed</Badge>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Submitted on Jan 5, 2026
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}