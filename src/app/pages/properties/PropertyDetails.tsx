import { useParams, Link } from "react-router";
import { 
  ArrowLeft, 
  MapPin, 
  Edit, 
  TrendingUp, 
  Home, 
  Users,
  DollarSign,
  Calendar,
  Wrench,
  MoreVertical
} from "lucide-react";
import { Button } from "../../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import { Progress } from "../../components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../../components/ui/dropdown-menu";
import { ImageWithFallback } from "../../components/figma/ImageWithFallback";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const revenueHistory = [
  { month: "Jan", amount: 28500 },
  { month: "Feb", amount: 29200 },
  { month: "Mar", amount: 28800 },
  { month: "Apr", amount: 30100 },
  { month: "May", amount: 31500 },
  { month: "Jun", amount: 28800 },
];

const units = [
  { id: "101", status: "occupied", rent: 1200, tenant: "John Doe" },
  { id: "102", status: "occupied", rent: 1200, tenant: "Jane Smith" },
  { id: "103", status: "vacant", rent: 1200, tenant: null },
  { id: "201", status: "occupied", rent: 1400, tenant: "Mike Johnson" },
  { id: "202", status: "maintenance", rent: 1400, tenant: null },
  { id: "203", status: "occupied", rent: 1400, tenant: "Sarah Williams" },
];

const expenses = [
  { category: "Maintenance", amount: 3200, percentage: 35 },
  { category: "Utilities", amount: 2800, percentage: 30 },
  { category: "Insurance", amount: 1500, percentage: 16 },
  { category: "Property Tax", amount: 1200, percentage: 13 },
  { category: "Other", amount: 500, percentage: 6 },
];

export function PropertyDetails() {
  const { id } = useParams();

  return (
    <div className="space-y-6">
      {/* Back button */}
      <Link to="/dashboard/properties">
        <Button variant="ghost" size="sm">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Properties
        </Button>
      </Link>

      {/* Property Header */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Image Gallery */}
          <div className="aspect-video rounded-xl overflow-hidden bg-muted">
            <ImageWithFallback
              src="https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=1200&q=80"
              alt="Property"
              className="w-full h-full object-cover"
            />
          </div>

          {/* Property Info */}
          <Card>
            <CardHeader>
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <CardTitle className="text-2xl mb-2">Sunset Apartments</CardTitle>
                  <div className="flex items-start gap-2 text-muted-foreground">
                    <MapPin className="h-4 w-4 shrink-0 mt-1" />
                    <span>123 Main St, San Francisco, CA 94102</span>
                  </div>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="icon">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>
                      <Edit className="h-4 w-4 mr-2" />
                      Edit Property
                    </DropdownMenuItem>
                    <DropdownMenuItem>Export Report</DropdownMenuItem>
                    <DropdownMenuItem className="text-destructive">
                      Archive Property
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div>
                  <div className="text-sm text-muted-foreground mb-1">Type</div>
                  <Badge>Apartment</Badge>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground mb-1">Year Built</div>
                  <div className="font-medium">2015</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground mb-1">Square Feet</div>
                  <div className="font-medium">24,000 sq ft</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground mb-1">Parking</div>
                  <div className="font-medium">32 Spaces</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Stats Sidebar */}
        <div className="space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Monthly Revenue
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold mb-1">$28,800</div>
              <div className="flex items-center text-sm text-green-600">
                <TrendingUp className="h-4 w-4 mr-1" />
                +8.5% from last month
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Occupancy
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold mb-2">91.7%</div>
              <Progress value={91.7} className="mb-2" />
              <div className="text-sm text-muted-foreground">
                22 of 24 units occupied
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Active Leases
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold mb-1">22</div>
              <div className="text-sm text-muted-foreground">
                3 expiring in 60 days
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Maintenance Requests
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold mb-1">4</div>
              <div className="flex gap-2">
                <Badge variant="destructive" className="text-xs">2 High</Badge>
                <Badge variant="secondary" className="text-xs">2 Low</Badge>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Detailed Tabs */}
      <Tabs defaultValue="units" className="space-y-4">
        <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4 lg:w-auto">
          <TabsTrigger value="units">Units</TabsTrigger>
          <TabsTrigger value="financials">Financials</TabsTrigger>
          <TabsTrigger value="maintenance">Maintenance</TabsTrigger>
          <TabsTrigger value="documents">Documents</TabsTrigger>
        </TabsList>

        <TabsContent value="units" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Unit List</CardTitle>
                <Button size="sm">Add Unit</Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {units.map((unit) => (
                  <Card key={unit.id} className="border-2">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <Home className="h-5 w-5 text-muted-foreground" />
                          <span className="font-semibold">Unit {unit.id}</span>
                        </div>
                        <Badge
                          variant={
                            unit.status === "occupied"
                              ? "default"
                              : unit.status === "vacant"
                              ? "secondary"
                              : "outline"
                          }
                        >
                          {unit.status}
                        </Badge>
                      </div>
                      <div className="space-y-2 text-sm">
                        {unit.tenant && (
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <Users className="h-4 w-4" />
                            <span>{unit.tenant}</span>
                          </div>
                        )}
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <DollarSign className="h-4 w-4" />
                          <span>${unit.rent}/month</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="financials" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Revenue History</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={250}>
                  <LineChart data={revenueHistory}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                    <XAxis dataKey="month" className="text-xs" />
                    <YAxis className="text-xs" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "hsl(var(--card))",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "8px",
                      }}
                    />
                    <Line
                      type="monotone"
                      dataKey="amount"
                      stroke="#3b82f6"
                      strokeWidth={2}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Expense Breakdown</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {expenses.map((expense) => (
                    <div key={expense.category}>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium">{expense.category}</span>
                        <span className="text-sm font-semibold">
                          ${expense.amount.toLocaleString()}
                        </span>
                      </div>
                      <Progress value={expense.percentage} />
                    </div>
                  ))}
                  <div className="pt-4 border-t">
                    <div className="flex items-center justify-between">
                      <span className="font-medium">Total Expenses</span>
                      <span className="text-lg font-bold">$9,200</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="maintenance">
          <Card>
            <CardHeader>
              <CardTitle>Recent Maintenance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between p-3 rounded-lg border"
                  >
                    <div className="flex items-center gap-3">
                      <Wrench className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <div className="font-medium">AC Repair - Unit 305</div>
                        <div className="text-sm text-muted-foreground">
                          Completed 2 days ago
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold">$350</div>
                      <Badge variant="outline" className="text-xs">
                        Completed
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="documents">
          <Card>
            <CardHeader>
              <CardTitle>Property Documents</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {["Property Deed", "Insurance Policy", "Tax Records", "Inspection Report"].map(
                  (doc) => (
                    <div
                      key={doc}
                      className="flex items-center justify-between p-3 rounded-lg border hover:bg-accent cursor-pointer"
                    >
                      <span className="font-medium">{doc}</span>
                      <Button variant="ghost" size="sm">
                        Download
                      </Button>
                    </div>
                  )
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}