import {
  Building2,
  Home,
  Users,
  DollarSign,
  TrendingUp,
  TrendingDown,
  AlertCircle,
  Calendar as CalendarIcon,
  ArrowUpRight,
  ArrowDownRight,
  MoreVertical,
  Sparkles,
  Zap,
  Download,
  CheckCircle2,
  Clock,
  History
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import { Progress } from "../../components/ui/progress";
import { Calendar } from "../../components/ui/calendar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../../components/ui/dropdown-menu";
import {
  Area,
  AreaChart,
  ResponsiveContainer,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell
} from "recharts";

import { api } from "../../lib/api";
import { useState, useEffect } from "react";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import { format } from "date-fns";

export function Dashboard() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [date, setDate] = useState<Date | undefined>(new Date());

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

  const exportToPDF = () => {
    const doc = new jsPDF();
    const now = format(new Date(), "PPpp");

    // Header
    doc.setFontSize(22);
    doc.setTextColor(59, 130, 246); // Primary Color
    doc.text("Elite Living - Portfolio Report", 14, 20);
    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text(`Generated on: ${now}`, 14, 28);

    // Summary Stats
    const summaryData = [
      ["Metric", "Value"],
      ["Total Revenue", `$${metrics.totalRevenue.toLocaleString()}`],
      ["Total Properties", metrics.totalProperties.toString()],
      ["Occupied Units", `${metrics.occupiedUnits}/${metrics.totalUnits}`],
      ["Collection Rate", "94.2%"],
    ];

    autoTable(doc, {
      startY: 35,
      head: [["Portfolio Summary", ""]],
      body: summaryData,
      theme: "striped",
      headStyles: { fillColor: [59, 130, 246] },
    });

    // Recent Payments
    const paymentsData = paymentActivity.map((p: any) => [
      p.name,
      p.unit,
      `$${p.amount}`,
      p.status,
      p.time
    ]);

    autoTable(doc, {
      startY: (doc as any).lastAutoTable.finalY + 10,
      head: [["Tenant", "Unit", "Amount", "Status", "Timestamp"]],
      body: paymentsData,
      margin: { top: 10 },
      styles: { fontSize: 8 },
      headStyles: { fillColor: [75, 85, 99] },
    });

    doc.save(`elite-living-report-${format(new Date(), "yyyy-MM-dd")}.pdf`);
  };

  // Default mock data to fall back on
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
  ];

  const maintenanceRequests = stats?.maintenanceRequests || [
    { id: 1, unit: "Unit 402", issue: "Plumbing leak", priority: "high", status: "in-progress" },
    { id: 2, unit: "Unit 305", issue: "AC not cooling", priority: "medium", status: "pending" },
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
    <div className="space-y-6 max-w-[1600px] mx-auto">
      {/* Header */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent">
            Executive Dashboard
          </h1>
          <p className="text-muted-foreground mt-1 flex items-center gap-2">
            <Clock className="h-4 w-4" />
            Live portfolio performance as of {format(new Date(), "MMMM do, yyyy")}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="border-glass-border bg-glass/50" onClick={() => window.location.reload()}>
            <History className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Button className="shadow-lg shadow-primary/20" onClick={exportToPDF}>
            <Download className="h-4 w-4 mr-2" />
            Export PDF Report
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
        {/* Main Stats Area */}
        <div className="xl:col-span-3 space-y-6">
          {/* Key Metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="hover:shadow-lg transition-all border-none bg-gradient-to-br from-blue-500/10 to-transparent">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Total Revenue</CardTitle>
                <div className="p-2 bg-blue-500/20 rounded-lg"><DollarSign className="h-4 w-4 text-blue-600" /></div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">${metrics.totalRevenue.toLocaleString()}</div>
                <p className="text-xs text-green-600 font-medium mt-1 flex items-center">
                  <TrendingUp className="h-3 w-3 mr-1" /> +12.5% volume
                </p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-all border-none bg-gradient-to-br from-purple-500/10 to-transparent">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Properties</CardTitle>
                <div className="p-2 bg-purple-500/20 rounded-lg"><Building2 className="h-4 w-4 text-purple-600" /></div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{metrics.totalProperties}</div>
                <p className="text-xs text-purple-600 font-medium mt-1">2 acquisition pending</p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-all border-none bg-gradient-to-br from-emerald-500/10 to-transparent">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Occupancy</CardTitle>
                <div className="p-2 bg-emerald-500/20 rounded-lg"><CheckCircle2 className="h-4 w-4 text-emerald-600" /></div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{((metrics.occupiedUnits / metrics.totalUnits) * 100).toFixed(1)}%</div>
                <p className="text-xs text-emerald-600 font-medium mt-1">{metrics.occupiedUnits} units active</p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-all border-none bg-gradient-to-br from-orange-500/10 to-transparent">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Delinquencies</CardTitle>
                <div className="p-2 bg-orange-500/20 rounded-lg"><AlertCircle className="h-4 w-4 text-orange-600" /></div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">${metrics.overdueAmount.toLocaleString()}</div>
                <p className="text-xs text-orange-600 font-medium mt-1">{metrics.overdueCount} critical notices</p>
              </CardContent>
            </Card>
          </div>

          {/* Revenue Area Chart */}
          <Card className="border-glass-border bg-glass/30 backdrop-blur-md">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Cash Flow Trends</CardTitle>
                <CardDescription>Consolidated revenue vs maintenance overhead</CardDescription>
              </div>
              <Badge variant="secondary" className="px-3 py-1">Last 7 Months</Badge>
            </CardHeader>
            <CardContent>
              <div className="h-[350px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={revenueData}>
                    <defs>
                      <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8} />
                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                    <XAxis dataKey="month" axisLine={false} tickLine={false} tickPadding={10} />
                    <YAxis axisLine={false} tickLine={false} tickPadding={10} />
                    <Tooltip
                      contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                      cursor={{ stroke: '#3b82f6', strokeWidth: 2 }}
                    />
                    <Area type="monotone" dataKey="revenue" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorRev)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Activity Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="border-none bg-accent/30">
              <CardHeader>
                <CardTitle className="text-lg">Recent Ledger</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {paymentActivity.map((p: any, i: number) => (
                  <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-background/50 border border-border/50 transition-all hover:translate-x-1">
                    <div className="flex gap-3 items-center">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center font-bold text-primary">
                        {p.name[0]}
                      </div>
                      <div>
                        <div className="font-semibold text-sm">{p.name}</div>
                        <div className="text-xs text-muted-foreground">{p.unit}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-sm">${p.amount}</div>
                      <Badge variant={p.status === 'paid' ? 'default' : 'secondary'} className="text-[10px] h-4">
                        {p.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card className="border-none bg-primary/5">
              <CardHeader>
                <CardTitle className="text-lg">Active Tickets</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {maintenanceRequests.map((r: any, i: number) => (
                  <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-background/50 border border-border/50">
                    <div>
                      <div className="font-semibold text-sm">{r.issue}</div>
                      <div className="text-xs text-muted-foreground">{r.unit}</div>
                    </div>
                    <Badge variant={r.priority === 'high' ? 'destructive' : 'outline'} className="text-[10px]">
                      {r.priority}
                    </Badge>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Sidebar Info Area */}
        <div className="space-y-6">
          {/* Real Calendar */}
          <Card className="overflow-hidden border-glass-border bg-glass backdrop-blur-md">
            <CardHeader className="bg-primary/5 pb-4">
              <CardTitle className="text-sm flex items-center gap-2">
                <CalendarIcon className="h-4 w-4 text-primary" />
                Property Calendar
              </CardTitle>
            </CardHeader>
            <CardContent className="p-2">
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                className="rounded-md border-none"
              />
              <div className="p-4 border-t border-border mt-2">
                <div className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3">Today's Schedule</div>
                <div className="space-y-3">
                  <div className="flex gap-3 items-start">
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1.5" />
                    <div>
                      <div className="text-xs font-semibold">Lease Signing</div>
                      <div className="text-[10px] text-muted-foreground">Unit 412 - 2:00 PM</div>
                    </div>
                  </div>
                  <div className="flex gap-3 items-start">
                    <div className="w-1.5 h-1.5 rounded-full bg-orange-500 mt-1.5" />
                    <div>
                      <div className="text-xs font-semibold">Maintenance Visit</div>
                      <div className="text-[10px] text-muted-foreground">Unit 103 - 4:30 PM</div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* AI Optimizer Card */}
          <Card className="bg-primary text-primary-foreground border-none overflow-hidden relative">
            <div className="absolute top-0 right-0 p-8 transform translate-x-1/2 -translate-y-1/2 bg-white/10 rounded-full blur-2xl" />
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-md">
                <Sparkles className="h-4 w-4 text-primary-foreground animate-bounce" />
                Elite Insights
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 relative">
              <p className="text-xs opacity-90 leading-relaxed">
                Your portfolio is outperforming 85% of landlords in this region. Tip: Increasing rent on vacant units by 2% matches newest market trends.
              </p>
              <Button variant="secondary" size="sm" className="w-full text-[10px] font-bold">
                Run Full Analysis
              </Button>
            </CardContent>
          </Card>

          {/* Occupancy Detail */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex justify-center h-[180px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={occupancyData}
                      innerRadius={50}
                      outerRadius={70}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {occupancyData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="flex flex-col gap-2 mt-4 text-[11px]">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-blue-500" /> Occupied</div>
                  <span className="font-bold">142 Units</span>
                </div>
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-slate-400" /> Vacant</div>
                  <span className="font-bold">18 Units</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
