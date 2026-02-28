import { CreditCard, Crown, Zap, CheckCircle2 } from "lucide-react";
import { Button } from "../../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import { Progress } from "../../components/ui/progress";
import { Switch } from "../../components/ui/switch";
import { Label } from "../../components/ui/label";

const plans = [
  {
    name: "Free",
    price: 0,
    features: [
      "Up to 5 properties",
      "Basic reporting",
      "Email support",
      "Mobile app access",
    ],
    current: false,
  },
  {
    name: "Professional",
    price: 49,
    features: [
      "Up to 50 properties",
      "Advanced analytics",
      "Priority support",
      "API access",
      "Custom branding",
      "Automated workflows",
    ],
    current: true,
  },
  {
    name: "Enterprise",
    price: 199,
    features: [
      "Unlimited properties",
      "White-label solution",
      "Dedicated support",
      "Advanced integrations",
      "Multi-branch management",
      "Custom development",
    ],
    current: false,
  },
];

export function Billing() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
            Billing & Subscription
          </h1>
          <p className="text-muted-foreground mt-1">
            Manage your subscription and billing information
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Current Plan</CardTitle>
              <Badge className="bg-gradient-to-r from-blue-600 to-blue-700">
                <Crown className="h-3 w-3 mr-1" />
                Professional
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-3xl font-bold">$49.00</div>
                <div className="text-sm text-muted-foreground">per month</div>
              </div>
              <Button>Upgrade Plan</Button>
            </div>

            <div className="pt-4 border-t space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm">Next billing date</span>
                <span className="font-medium">March 28, 2026</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Payment method</span>
                <div className="flex items-center gap-2">
                  <CreditCard className="h-4 w-4" />
                  <span className="font-medium">•••• 4242</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="auto-renew">Auto-renew</Label>
                <Switch id="auto-renew" defaultChecked />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Usage This Month</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm">Properties</span>
                <span className="text-sm font-medium">24 / 50</span>
              </div>
              <Progress value={48} />
            </div>
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm">Units</span>
                <span className="text-sm font-medium">168 / 500</span>
              </div>
              <Progress value={33.6} />
            </div>
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm">API Calls</span>
                <span className="text-sm font-medium">3.2K / 10K</span>
              </div>
              <Progress value={32} />
            </div>
          </CardContent>
        </Card>
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-4">Available Plans</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {plans.map((plan) => (
            <Card
              key={plan.name}
              className={`relative ${
                plan.current
                  ? "border-primary shadow-lg"
                  : "hover:border-primary/50 transition-colors"
              }`}
            >
              {plan.current && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <Badge className="bg-gradient-to-r from-blue-600 to-blue-700">
                    Current Plan
                  </Badge>
                </div>
              )}
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>{plan.name}</span>
                  {plan.name === "Professional" && (
                    <Zap className="h-5 w-5 text-primary" />
                  )}
                </CardTitle>
                <div className="mt-4">
                  <span className="text-4xl font-bold">${plan.price}</span>
                  <span className="text-muted-foreground">/month</span>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 mb-6">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <CheckCircle2 className="h-5 w-5 text-green-600 shrink-0 mt-0.5" />
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
                {plan.current ? (
                  <Button variant="outline" className="w-full" disabled>
                    Current Plan
                  </Button>
                ) : (
                  <Button
                    variant={plan.name === "Enterprise" ? "default" : "outline"}
                    className="w-full"
                  >
                    {plan.price === 0 ? "Downgrade" : "Upgrade"}
                  </Button>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Billing History</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[
              { date: "Feb 28, 2026", amount: 49, status: "Paid" },
              { date: "Jan 28, 2026", amount: 49, status: "Paid" },
              { date: "Dec 28, 2025", amount: 49, status: "Paid" },
            ].map((invoice, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 rounded-lg border"
              >
                <div className="flex items-center gap-3">
                  <CreditCard className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <div className="font-medium">{invoice.date}</div>
                    <Badge variant="default" className="text-xs mt-1">
                      {invoice.status}
                    </Badge>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <span className="font-semibold">${invoice.amount}.00</span>
                  <Button variant="ghost" size="sm">
                    Download
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
