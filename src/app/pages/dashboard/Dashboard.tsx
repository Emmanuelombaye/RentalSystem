import {
  Building2,
  Home,
  Users,
  DollarSign,
  TrendingUp,
  TrendingDown,
  AlertCircle,
  Calendar,
  ArrowUpRight,
  ArrowDownRight,
  MoreVertical,
  Sparkles,
  Zap
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import { Progress } from "../../components/ui/progress";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../../components/ui/dropdown-menu";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  Area,
  AreaChart,
} from "recharts";

import { api } from "../../lib/api";
import { useState, useEffect } from "react";

export function Dashboard() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadDashboard() {
      try {
        const data = await api.dashboard.getStats();
        setStats(data);
      } catch (err: any) {
        console.error("Dashboard Fetch Error:", err);
        setError("Failed to sync with live database.");
      } finally {
        setLoading(false);
      }
    }
    loadDashboard();
  }, []);

  // Default mock data to fall back on or show during initial load
  const revenueData = stats?.revenueData || [
    { month: "Jan", revenue: 45000, expenses: 28000 },
    { month: "Feb", revenue: 52000, expenses: 31000 },
    { month: "Mar", revenue: 48000, expenses: 29000 },
    { month: "Apr", revenue: 61000, expenses: 34000 },
    { month: "May", revenue: 55000, expenses: 32000 },
    { month: "Jun", revenue: 67000, expenses: 36000 },
    { month: "Jul", revenue: 72000, expenses: 38000 },
  ];

  const occupancyData = stats?.occupancyData || [
    { name: "Occupied", value: 142, color: "#3b82f6" },
    { name: "Vacant", value: 18, color: "#94a3b8" },
    { name: "Maintenance", value: 8, color: "#f59e0b" },
  ];

  const paymentActivity = stats?.paymentActivity || [
    { name: "John Doe", unit: "Unit 305", amount: 1200, status: "paid", time: "2 hours ago" },
    { name: "Sarah Smith", unit: "Unit 412", amount: 1450, status: "pending", time: "5 hours ago" },
    { name: "Mike Johnson", unit: "Unit 201", amount: 1100, status: "overdue", time: "1 day ago" },
    { name: "Emily Davis", unit: "Unit 508", amount: 1350, status: "paid", time: "1 day ago" },
    { name: "Robert Brown", unit: "Unit 103", amount: 1250, status: "paid", time: "2 days ago" },
  ];

  const maintenanceRequests = stats?.maintenanceRequests || [
    { id: 1, unit: "Unit 402", issue: "Plumbing leak", priority: "high", status: "in-progress" },
    { id: 2, unit: "Unit 305", issue: "AC not cooling", priority: "medium", status: "pending" },
    { id: 3, unit: "Unit 201", issue: "Light fixture", priority: "low", status: "pending" },
    { id: 4, unit: "Unit 509", issue: "Water heater", priority: "high", status: "completed" },
  ];

  const metrics = stats?.metrics || {
    totalRevenue: 72450,
    totalProperties: 24,
    totalUnits: 168,
    occupiedUnits: 142,
    vacantUnits: 26,
    overdueAmount: 8250,
    overdueCount: 6
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground mt-1">
            Welcome back! Here's what's happening with your properties.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Calendar className="h-4 w-4 mr-2" />
            <span className="hidden sm:inline">Last 30 days</span>
            <span className="sm:hidden">30d</span>
          </Button>
          <Button size="sm">
            Export Report
          </Button>
        </div>
      </div>

      {/* AI Insights Banner */}
      <div className="relative overflow-hidden rounded-xl border border-glass-border bg-glass p-6 shadow-glass backdrop-blur-md">
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-blue-600/10 flex items-center justify-center">
              <Sparkles className="h-5 w-5 text-blue-600 animate-pulse" />
            </div>
            <div>
              <h2 className="text-lg font-bold">AI Property Assistant</h2>
              <p className="text-sm text-muted-foreground">
                Predictive analysis ready for your portfolio.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full md:w-auto">
            <div className="flex items-center gap-3 p-3 rounded-lg bg-background/50 border border-border/50">
              <Zap className="h-4 w-4 text-orange-500" />
              <div>
                <div className="text-xs text-muted-foreground uppercase font-semibold">Revenue Forecast</div>
                <div className="text-sm font-bold text-green-600">+$4.2k <span className="text-muted-foreground font-normal ml-1">next month</span></div>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 rounded-lg bg-background/50 border border-border/50">
              <TrendingUp className="h-4 w-4 text-blue-500" />
              <div>
                <div className="text-xs text-muted-foreground uppercase font-semibold">Optimization</div>
                <div className="text-sm font-bold">98% <span className="text-muted-foreground font-normal ml-1">efficiency score</span></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Revenue
            </CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${metrics.totalRevenue.toLocaleString()}</div>
            <div className="flex items-center text-xs mt-1">
              <TrendingUp className="h-3 w-3 text-green-600 mr-1" />
              <span className="text-green-600 font-medium">+12.5%</span>
              <span className="text-muted-foreground ml-1">from last month</span>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Properties
            </CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.totalProperties}</div>
            <div className="flex items-center text-xs mt-1">
              <TrendingUp className="h-3 w-3 text-green-600 mr-1" />
              <span className="text-green-600 font-medium">+2</span>
              <span className="text-muted-foreground ml-1">new this month</span>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Units
            </CardTitle>
            <Home className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.totalUnits}</div>
            <div className="flex items-center gap-2 mt-1">
              <Badge variant="secondary" className="text-xs">
                {metrics.occupiedUnits} Occupied
              </Badge>
              <Badge variant="outline" className="text-xs">
                {metrics.vacantUnits} Vacant
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow border-orange-200 dark:border-orange-900">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Overdue Rent
            </CardTitle>
            <AlertCircle className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${metrics.overdueAmount.toLocaleString()}</div>
            <div className="flex items-center text-xs mt-1">
              <TrendingDown className="h-3 w-3 text-orange-600 mr-1" />
              <span className="text-orange-600 font-medium">{metrics.overdueCount} tenants</span>
              <span className="text-muted-foreground ml-1">need attention</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-7 gap-6">
        {/* Revenue Chart */}
        <Card className="lg:col-span-4">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Revenue vs Expenses</CardTitle>
                <p className="text-sm text-muted-foreground mt-1">
                  Monthly comparison for last 7 months
                </p>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>Download CSV</DropdownMenuItem>
                  <DropdownMenuItem>Download PDF</DropdownMenuItem>
                  <DropdownMenuItem>View Details</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={revenueData}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorExpenses" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
                  </linearGradient>
                </defs>
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
                <Legend />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  stroke="#3b82f6"
                  fillOpacity={1}
                  fill="url(#colorRevenue)"
                  name="Revenue"
                />
                <Area
                  type="monotone"
                  dataKey="expenses"
                  stroke="#f59e0b"
                  fillOpacity={1}
                  fill="url(#colorExpenses)"
                  name="Expenses"
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Occupancy Chart */}
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle>Occupancy Rate</CardTitle>
            <p className="text-sm text-muted-foreground mt-1">
              Current unit distribution
            </p>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={occupancyData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {occupancyData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="grid grid-cols-3 gap-4 mt-4">
              {occupancyData.map((item) => (
                <div key={item.name} className="text-center">
                  <div className="flex items-center justify-center gap-2 mb-1">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: item.color }}
                    />
                    <span className="text-xs text-muted-foreground">{item.name}</span>
                  </div>
                  <div className="text-lg font-bold">{item.value}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Activity and Maintenance */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Payment Activity */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Recent Payment Activity</CardTitle>
                <p className="text-sm text-muted-foreground mt-1">
                  Latest rent payments and status
                </p>
              </div>
              <Button variant="ghost" size="sm">
                View All
                <ArrowUpRight className="h-4 w-4 ml-1" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {paymentActivity.map((payment, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 rounded-lg bg-accent/50 hover:bg-accent transition-colors"
                >
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                      <Users className="h-5 w-5 text-primary" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="font-medium truncate">{payment.name}</div>
                      <div className="text-sm text-muted-foreground">{payment.unit}</div>
                    </div>
                  </div>
                  <div className="text-right ml-3">
                    <div className="font-semibold">${payment.amount.toLocaleString()}</div>
                    <Badge
                      variant={
                        payment.status === "paid"
                          ? "default"
                          : payment.status === "pending"
                            ? "secondary"
                            : "destructive"
                      }
                      className="text-xs mt-1"
                    >
                      {payment.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Maintenance Requests */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Maintenance Requests</CardTitle>
                <p className="text-sm text-muted-foreground mt-1">
                  Active and pending requests
                </p>
              </div>
              <Button variant="ghost" size="sm">
                View All
                <ArrowUpRight className="h-4 w-4 ml-1" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {maintenanceRequests.map((request) => (
                <div
                  key={request.id}
                  className="flex items-center justify-between p-3 rounded-lg border border-border hover:border-primary/50 transition-colors"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium truncate">{request.unit}</span>
                      <Badge
                        variant={
                          request.priority === "high"
                            ? "destructive"
                            : request.priority === "medium"
                              ? "default"
                              : "secondary"
                        }
                        className="text-xs shrink-0"
                      >
                        {request.priority}
                      </Badge>
                    </div>
                    <div className="text-sm text-muted-foreground truncate">
                      {request.issue}
                    </div>
                  </div>
                  <Badge
                    variant={request.status === "completed" ? "default" : "outline"}
                    className="ml-3 shrink-0"
                  >
                    {request.status}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Financial Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Monthly Profit
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$34,200</div>
            <Progress value={75} className="mt-2" />
            <p className="text-xs text-muted-foreground mt-2">75% profit margin</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Collection Rate
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">94.2%</div>
            <Progress value={94.2} className="mt-2" />
            <p className="text-xs text-muted-foreground mt-2">Above target (90%)</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Avg. Rent/Unit
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$1,285</div>
            <Progress value={68} className="mt-2" />
            <p className="text-xs text-muted-foreground mt-2">Market avg: $1,450</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Maintenance Cost
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$5,680</div>
            <Progress value={45} className="mt-2 [&>div]:bg-orange-500" />
            <p className="text-xs text-muted-foreground mt-2">8% of revenue</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
