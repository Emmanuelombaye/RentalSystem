import React, { useState, useEffect } from "react";
import {
  MessageSquare,
  Zap,
  Shield,
  Home,
  Waves,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Wrench,
  Smartphone,
  ChevronRight,
  Sparkles,
  Camera,
  Activity,
  User,
  MoreHorizontal,
  ArrowUpRight,
  Filter
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import { Progress } from "../../components/ui/progress";
import {
  Area,
  AreaChart,
  ResponsiveContainer,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip as RechartsTooltip,
  BarChart,
  Bar,
  Cell
} from "recharts";
import { api } from "../../lib/api";
import { toast } from "sonner";

// Coastal Theme Colors
const COLORS = {
  teal: "#20B2AA",
  ocean: "#0077BE",
  sand: "#F5F5DC",
  accent: "#FF7F50", // Coral
  deepSea: "#001F3F",
};

export function DianiRentAI() {
  const [isAirbnbMode, setIsAirbnbMode] = useState(false);
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any>({
    stats: null,
    conversations: [],
    riskScores: [],
    predictions: [],
    alerts: []
  });

  const loadData = async () => {
    try {
      const [stats, conversations, riskScores, predictions, alerts] = await Promise.all([
        api.ai.getStats().catch(() => null),
        api.ai.getConversations().catch(() => []),
        api.ai.getRiskScores().catch(() => []),
        api.ai.getPredictions().catch(() => []),
        api.ai.getAlerts().catch(() => [])
      ]);

      setData({
        stats,
        conversations: conversations.length > 0 ? conversations : mockChatFeed,
        riskScores: riskScores.length > 0 ? riskScores : [
          { level: "Low", _count: { id: 14 } },
          { level: "Medium", _count: { id: 3 } },
          { level: "High", _count: { id: 1 } }
        ],
        predictions: predictions.length > 0 ? predictions : maintenanceIssues,
        alerts: alerts.length > 0 ? alerts : [
          { type: "unusual_motion", severity: "low", createdAt: new Date() }
        ]
      });
    } catch (err) {
      console.error("Fetch Error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
    const interval = setInterval(loadData, 30000); // 30s auto-refresh
    return () => clearInterval(interval);
  }, []);

  const handleMpesaPush = async () => {
    try {
      toast.promise(
        api.ai.stkPush({
          amount: 150000,
          phone: "+254700000000",
          tenantId: "alice-mwangi"
        }),
        {
          loading: 'Initiating M-Pesa STK Push...',
          success: 'STK Push sent to Alice Mwangi!',
          error: 'Failed to initiate M-Pesa push.'
        }
      );
    } catch (err) {
      console.error(err);
    }
  };

  const mockChatFeed = [
    { id: 1, tenant: { name: "Tenant (Apt 4B)" }, message: "The sink is leaking in the kitchen.", response: "Logged (High Priority)", type: "maintenance", status: "AI Handled", createdAt: new Date() },
    { id: 2, tenant: { name: "Tenant (Unit 12)" }, message: "I'll pay the rent via M-Pesa tomorrow at 10 AM.", response: "Acknowledged", type: "payment", status: "Logged", createdAt: new Date() },
    { id: 3, tenant: { name: "Guest (Airbnb - Villa 2)" }, message: "What is the WiFi password?", response: "Sent password", type: "guest", status: "Auto-Replied", createdAt: new Date() },
  ];

  const maintenanceIssues = [
    { id: 1, component: "Pump Failure", probability: 0.9, reason: "Excessive vibration pattern", status: "pending" },
    { id: 2, component: "AC Service", probability: 0.75, reason: "Inefficient cooling cycle detected", status: "pending" },
  ];

  if (loading && !data.stats) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center text-[#001F3F]">
        <Waves className="h-16 w-16 animate-bounce text-[#20B2AA] mb-4" />
        <h2 className="text-2xl font-black tracking-tighter">Initializing AI Engine...</h2>
        <p className="opacity-50 font-medium tracking-widest text-[10px] uppercase">Syncing with Diani Operations</p>
      </div>
    );
  }

  const revenueDataMock = [
    { day: "Mon", income: 4200, expenses: 1100 },
    { day: "Tue", income: 3800, expenses: 900 },
    { day: "Wed", income: 5100, expenses: 1400 },
    { day: "Thu", income: 4600, expenses: 1200 },
    { day: "Fri", income: 6200, expenses: 1800 },
    { day: "Sat", income: 7500, expenses: 2100 },
    { day: "Sun", income: 8100, expenses: 2500 },
  ];

  return (
    <div className="min-h-screen bg-[#f8fafc] pb-12">
      {/* Dynamic Header */}
      <div className="bg-gradient-to-r from-[#001F3F] to-[#0077BE] text-white p-8 rounded-b-[2rem] shadow-xl mb-8 border-b-4 border-[#20B2AA]/30">
        <div className="max-w-[1600px] mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center border border-white/20 shadow-inner">
              <Waves className="h-10 w-10 text-[#20B2AA] animate-pulse" />
            </div>
            <div>
              <h1 className="text-4xl font-black tracking-tighter">
                Diani Rent <span className="text-[#20B2AA]">AI</span>
              </h1>
              <p className="opacity-80 flex items-center gap-2 text-sm font-medium">
                <Shield className="h-4 w-4" />
                Live Property Operating System • <span className="text-[#20B2AA]">Nairobi Sync Active</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 bg-white/5 p-2 rounded-2xl backdrop-blur-lg border border-white/10">
            <button
              onClick={() => setIsAirbnbMode(false)}
              className={`px-6 py-2.5 rounded-xl transition-all font-bold text-sm flex items-center gap-2 ${!isAirbnbMode ? 'bg-[#20B2AA] text-white shadow-lg shadow-[#20B2AA]/40' : 'text-white/60 hover:text-white'}`}
            >
              <Home className="h-4 w-4" /> Standard Rental
            </button>
            <button
              onClick={() => setIsAirbnbMode(true)}
              className={`px-6 py-2.5 rounded-xl transition-all font-bold text-sm flex items-center gap-2 ${isAirbnbMode ? 'bg-[#FF7F50] text-white shadow-lg shadow-[#FF7F50]/40' : 'text-white/60 hover:text-white'}`}
            >
              <Waves className="h-4 w-4" /> Airbnb Mode
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-[1600px] mx-auto px-6 space-y-8">

        {/* Core Stats Bar */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { label: "Revenue (KES)", value: data.stats?.revenue ? `${(data.stats.revenue / 1000000).toFixed(1)}M` : "1.2M", change: "+14.2%", icon: TrendingUp, color: "teal" },
            { label: "AI Handled Tasks", value: data.stats?.aiTasks || "842", change: "98% Eff", icon: Sparkles, color: "ocean" },
            { label: "M-Pesa Requests", value: data.stats?.mpesaTransactions || "42", change: "Live", icon: Smartphone, color: "accent" },
            { label: "Active Occupancy", value: "94%", change: "18 Units", icon: CheckCircle2, color: "teal" },
          ].map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              <Card className="border-none shadow-md hover:shadow-xl transition-all cursor-pointer overflow-hidden group">
                <CardContent className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div className={`p-3 rounded-2xl bg-opacity-10 group-hover:scale-110 transition-transform ${stat.color === 'teal' ? 'bg-[#20B2AA] text-[#20B2AA]' : stat.color === 'ocean' ? 'bg-[#0077BE] text-[#0077BE]' : 'bg-[#FF7F50] text-[#FF7F50]'}`}>
                      <stat.icon className="h-6 w-6" />
                    </div>
                    <Badge variant="outline" className="border-green-100 bg-green-50 text-green-700 font-bold">
                      {stat.change}
                    </Badge>
                  </div>
                  <div className="text-3xl font-black text-slate-800">{stat.value}</div>
                  <div className="text-slate-500 text-sm font-semibold">{stat.label}</div>
                </CardContent>
                <div className={`h-1.5 w-full bg-opacity-20 ${stat.color === 'teal' ? 'bg-[#20B2AA]' : stat.color === 'ocean' ? 'bg-[#0077BE]' : 'bg-[#FF7F50]'}`} />
              </Card>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">

          {/* Main Analytics Column */}
          <div className="xl:col-span-2 space-y-8">

            {/* AI Communication Hub */}
            <Card className="border-none shadow-lg overflow-hidden flex flex-col h-[500px]">
              <CardHeader className="bg-white border-b border-slate-100 flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <MessageSquare className="h-5 w-5 text-[#0077BE]" />
                    AI Communication Hub
                  </CardTitle>
                  <CardDescription>Real-time WhatsApp & Web chat monitoring (AI-Managed)</CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex h-2 w-2 rounded-full bg-green-500 animate-ping" />
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Live Engine</span>
                </div>
              </CardHeader>
              <CardContent className="p-0 overflow-y-auto flex-grow bg-slate-50/50">
                <div className="divide-y divide-slate-100">
                  {data.conversations.map((chat: any) => (
                    <div key={chat.id} className="p-4 hover:bg-white transition-all cursor-pointer flex items-center justify-between group">
                      <div className="flex gap-4 items-center">
                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-bold text-lg shadow-sm ${chat.type === 'maintenance' ? 'bg-red-50 text-red-500' : chat.type === 'payment' ? 'bg-green-50 text-green-500' : 'bg-blue-50 text-blue-500'}`}>
                          {chat.tenant?.name?.charAt(0) || chat.user?.charAt(0) || "T"}
                        </div>
                        <div>
                          <div className="font-bold text-slate-800 flex items-center gap-2">
                            {chat.tenant?.name || chat.user || "Tenant"}
                            <Badge variant="secondary" className="text-[9px] h-4 bg-slate-100 uppercase tracking-tighter">
                              {chat.type}
                            </Badge>
                          </div>
                          <div className="text-sm text-slate-600 line-clamp-1 italic">"{chat.message}"</div>
                          <div className="text-[10px] text-slate-400 font-medium mt-1 uppercase">AI: {chat.response || "Logging..."}</div>
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        <Badge className={`${chat.status === 'ai_handled' || chat.status === 'AI Handled' ? 'bg-[#20B2AA]/10 text-[#20B2AA] border-[#20B2AA]/20' : 'bg-blue-50 text-blue-500 border-blue-100'} font-bold text-[10px]`}>
                          {chat.status?.replace('_', ' ') || "ACTIVE"}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
              <div className="p-4 bg-white border-t border-slate-100">
                <Button className="w-full bg-[#0077BE] hover:bg-[#005a91] font-bold py-6 rounded-2xl shadow-lg shadow-blue-500/20">
                  Join Conversations (Manual Override)
                </Button>
              </div>
            </Card>

            {/* Financial Performance */}
            <Card className="border-none shadow-lg">
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Portfolio Yield Analysis</CardTitle>
                  <CardDescription>Daily revenue and maintenance burn rate</CardDescription>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="rounded-xl font-bold"><Filter className="h-4 w-4 mr-2" /> This Week</Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="h-[300px] w-full mt-4">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={revenueDataMock}>
                      <defs>
                        <linearGradient id="colorInc" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#20B2AA" stopOpacity={0.3} />
                          <stop offset="95%" stopColor="#20B2AA" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                      <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
                      <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
                      <RechartsTooltip
                        contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)', padding: '12px' }}
                      />
                      <Area type="monotone" dataKey="income" stroke="#20B2AA" strokeWidth={4} fillOpacity={1} fill="url(#colorInc)" />
                      <Area type="monotone" dataKey="expenses" stroke="#FF7F50" strokeWidth={2} strokeDasharray="5 5" fill="none" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

          </div>

          {/* Side Panels */}
          <div className="space-y-8">

            {/* Rent Collection Scorecard */}
            <Card className="border-none shadow-lg bg-[#001F3F] text-white">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Smartphone className="h-5 w-5 text-[#20B2AA]" />
                  Rent Scorecard
                </CardTitle>
                <CardDescription className="text-white/60">Live M-Pesa tracking & risk levels</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <div className="flex justify-between items-end mb-2">
                    <span className="text-sm font-bold opacity-80 uppercase tracking-widest text-[10px]">Collection Progress</span>
                    <span className="text-2xl font-black text-[#20B2AA]">82%</span>
                  </div>
                  <Progress value={82} className="h-3 bg-white/10" indicatorClassName="bg-[#20B2AA]" />
                </div>

                <div className="space-y-3">
                  {data.riskScores.map((risk: any) => (
                    <div key={risk.level} className="flex items-center justify-between p-3 bg-white/5 rounded-2xl border border-white/10">
                      <div className="flex items-center gap-3">
                        <div className={`w-2 h-2 rounded-full ${risk.level === 'Low' ? 'bg-green-500' : risk.level === 'Medium' ? 'bg-yellow-500' : 'bg-red-500'}`} />
                        <span className="font-bold text-xs">{risk.level} Risk Tenants</span>
                      </div>
                      <span className="font-black text-lg">{risk._count?.id || risk.count || 0}</span>
                    </div>
                  ))}
                </div>

                <Button
                  onClick={handleMpesaPush}
                  className="w-full bg-[#20B2AA] hover:bg-[#1a938c] text-white font-black py-6 rounded-2xl"
                >
                  Send Rent Alert (Alice)
                </Button>
              </CardContent>
            </Card>

            {/* Maintenance & Dispatch */}
            <Card className="border-none shadow-lg">
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="text-lg">AI Maintenance</CardTitle>
                  <CardDescription>Auto-categorized & Priority</CardDescription>
                </div>
                <Zap className="h-5 w-5 text-[#FF7F50]" />
              </CardHeader>
              <CardContent className="space-y-4">
                {data.predictions.map((issue: any, idx: number) => (
                  <div key={issue.id || idx} className="p-4 rounded-2xl border border-slate-100 hover:border-[#20B2AA]/40 transition-all cursor-pointer group">
                    <div className="flex justify-between items-start mb-2">
                      <div className="font-black text-slate-800">{issue.component || issue.issue}</div>
                      <Badge className={issue.probability > 0.8 ? 'bg-red-500' : 'bg-[#FF7F50]'}>
                        {Math.round((issue.probability || 0.9) * 100)}% Risk
                      </Badge>
                    </div>
                    <div className="text-xs text-slate-500 font-bold uppercase tracking-wider mb-2">
                      {issue.reason || "High vibration detected"}
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-[9px] uppercase">{issue.status || "PENDING"}</Badge>
                      </div>
                      <span className="text-[10px] text-slate-400 font-bold">Predicted Action</span>
                    </div>
                  </div>
                ))}
                <Button variant="outline" className="w-full border-dashed border-2 py-6 rounded-2xl text-slate-400 hover:text-[#0077BE] hover:border-[#0077BE]">
                  View Service Marketplace
                </Button>
              </CardContent>
            </Card>

            {/* AI Security (Premium) */}
            <Card className="border-none shadow-lg bg-gradient-to-br from-slate-800 to-slate-900 text-white overflow-hidden relative">
              <div className="absolute top-0 right-0 p-4 opacity-50">
                <Activity className="h-12 w-12 text-[#20B2AA]" />
              </div>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Camera className="h-5 w-5 text-[#20B2AA]" />
                  Live Monitoring
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="aspect-video bg-black/40 rounded-2xl flex items-center justify-center border border-white/10 mb-4 overflow-hidden relative group">
                  <div className="text-[10px] uppercase tracking-widest font-black opacity-30 flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-red-600 animate-pulse" />
                    Diani Entrance Cam
                  </div>
                </div>
                <div className="space-y-2">
                  {data.alerts.map((alert: any, idx: number) => (
                    <div key={idx} className="flex items-center justify-between text-[10px] font-bold py-1 border-b border-white/5 last:border-0">
                      <span className="text-red-400 capitalize">{alert.type?.replace('_', ' ')}</span>
                      <span className="opacity-50">{new Date(alert.createdAt).toLocaleTimeString()}</span>
                    </div>
                  ))}
                </div>
                <Button size="sm" className="w-full mt-4 bg-white/10 hover:bg-white/20 text-white border-white/10 font-bold rounded-xl">
                  Inspect All Feeds
                </Button>
              </CardContent>
            </Card>

          </div>
        </div>
      </div>
    </div>
  );
}
