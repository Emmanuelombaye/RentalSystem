import { DollarSign, FileText, MessageSquare, Wrench, Bell, Download } from "lucide-react";
import { Button } from "../../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import { Progress } from "../../components/ui/progress";
import { Textarea } from "../../components/ui/textarea";
import { Label } from "../../components/ui/label";

export function TenantPortal() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
            Tenant Portal
          </h1>
          <p className="text-muted-foreground mt-1">
            Self-service portal for tenant management
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 space-y-6">
          <CardHeader>
            <CardTitle>Current Lease</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <div className="text-sm text-muted-foreground mb-1">Unit</div>
                <div className="font-medium">Unit 305, Sunset Apartments</div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground mb-1">Lease Term</div>
                <div className="font-medium">Jan 1, 2024 - Dec 31, 2026</div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground mb-1">Monthly Rent</div>
                <div className="font-medium text-lg">$1,200</div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground mb-1">Next Payment Due</div>
                <div className="font-medium">March 1, 2026</div>
              </div>
            </div>
            <Button className="w-full" size="lg">
              <FileText className="h-4 w-4 mr-2" />
              View Lease Agreement
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Rent Balance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="text-sm text-muted-foreground mb-1">Current Balance</div>
                <div className="text-3xl font-bold text-green-600">$0.00</div>
                <Badge variant="default" className="mt-2">Paid</Badge>
              </div>
              <Button className="w-full" size="lg">
                <DollarSign className="h-4 w-4 mr-2" />
                Pay Rent
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Submit Maintenance Request</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Issue Description</Label>
              <Textarea
                placeholder="Describe the maintenance issue..."
                rows={4}
              />
            </div>
            <div className="space-y-2">
              <Label>Priority Level</Label>
              <select className="w-full rounded-lg border border-input bg-background px-3 py-2">
                <option>Low</option>
                <option>Medium</option>
                <option>High</option>
                <option>Emergency</option>
              </select>
            </div>
            <Button className="w-full">
              <Wrench className="h-4 w-4 mr-2" />
              Submit Request
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Payments</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[
                { date: "Feb 1, 2026", amount: 1200, status: "Paid" },
                { date: "Jan 1, 2026", amount: 1200, status: "Paid" },
                { date: "Dec 1, 2025", amount: 1200, status: "Paid" },
              ].map((payment, index) => (
                <div key={index} className="flex items-center justify-between p-3 rounded-lg border">
                  <div>
                    <div className="font-medium">{payment.date}</div>
                    <Badge variant="default" className="text-xs mt-1">
                      {payment.status}
                    </Badge>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold">${payment.amount.toLocaleString()}</div>
                    <Button variant="ghost" size="sm" className="text-xs">
                      <Download className="h-3 w-3 mr-1" />
                      Receipt
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Active Maintenance Requests</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="p-4 rounded-lg border">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <h4 className="font-medium">AC not cooling properly</h4>
                  <p className="text-sm text-muted-foreground">Submitted on Feb 10, 2026</p>
                </div>
                <Badge>In Progress</Badge>
              </div>
              <Progress value={60} className="mb-2" />
              <p className="text-sm text-muted-foreground">
                Technician assigned. Estimated completion: Feb 29, 2026
              </p>
            </div>
            <div className="text-center py-8 text-muted-foreground">
              No other active requests
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
