import { useState } from "react";
import { Plus, Filter, Wrench } from "lucide-react";
import { Button } from "../../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";

const requests = [
  { id: 1, unit: "Unit 402", issue: "Plumbing leak", description: "Kitchen sink is leaking", priority: "high", status: "in-progress", tenant: "John Doe", created: "2 hours ago" },
  { id: 2, unit: "Unit 305", issue: "AC not cooling", description: "Air conditioner not working properly", priority: "medium", status: "pending", tenant: "Jane Smith", created: "5 hours ago" },
  { id: 3, unit: "Unit 201", issue: "Light fixture", description: "Bedroom light not working", priority: "low", status: "pending", tenant: "Mike Johnson", created: "1 day ago" },
  { id: 4, unit: "Unit 509", issue: "Water heater", description: "No hot water", priority: "high", status: "completed", tenant: "Sarah Williams", created: "3 days ago" },
  { id: 5, unit: "Unit 103", issue: "Door lock", description: "Front door lock is jammed", priority: "medium", status: "in-progress", tenant: "Robert Brown", created: "1 day ago" },
];

export function Maintenance() {
  const [filterStatus, setFilterStatus] = useState("all");

  const filteredRequests = filterStatus === "all" 
    ? requests 
    : requests.filter(r => r.status === filterStatus);

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case "high":
        return <Badge variant="destructive">High</Badge>;
      case "medium":
        return <Badge>Medium</Badge>;
      case "low":
        return <Badge variant="secondary">Low</Badge>;
      default:
        return null;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return <Badge>Completed</Badge>;
      case "in-progress":
        return <Badge variant="default">In Progress</Badge>;
      case "pending":
        return <Badge variant="outline">Pending</Badge>;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
            Maintenance
          </h1>
          <p className="text-muted-foreground mt-1">
            Track and manage maintenance requests
          </p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          New Request
        </Button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Requests
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{requests.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Pending
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {requests.filter((r) => r.status === "pending").length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              In Progress
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {requests.filter((r) => r.status === "in-progress").length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Completed
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {requests.filter((r) => r.status === "completed").length}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-full sm:w-[200px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Requests</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="in-progress">In Progress</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" size="icon" className="shrink-0">
              <Filter className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="space-y-4">
          <h3 className="font-semibold flex items-center gap-2">
            <Badge variant="outline">Pending</Badge>
            <span className="text-muted-foreground text-sm">
              {requests.filter((r) => r.status === "pending").length} requests
            </span>
          </h3>
          {requests
            .filter((r) => r.status === "pending")
            .map((request) => (
              <RequestCard key={request.id} request={request} />
            ))}
        </div>

        <div className="space-y-4">
          <h3 className="font-semibold flex items-center gap-2">
            <Badge>In Progress</Badge>
            <span className="text-muted-foreground text-sm">
              {requests.filter((r) => r.status === "in-progress").length} requests
            </span>
          </h3>
          {requests
            .filter((r) => r.status === "in-progress")
            .map((request) => (
              <RequestCard key={request.id} request={request} />
            ))}
        </div>

        <div className="space-y-4">
          <h3 className="font-semibold flex items-center gap-2">
            <Badge>Completed</Badge>
            <span className="text-muted-foreground text-sm">
              {requests.filter((r) => r.status === "completed").length} requests
            </span>
          </h3>
          {requests
            .filter((r) => r.status === "completed")
            .map((request) => (
              <RequestCard key={request.id} request={request} />
            ))}
        </div>
      </div>
    </div>
  );
}

function RequestCard({ request }: { request: typeof requests[0] }) {
  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case "high":
        return <Badge variant="destructive" className="text-xs">High</Badge>;
      case "medium":
        return <Badge className="text-xs">Medium</Badge>;
      case "low":
        return <Badge variant="secondary" className="text-xs">Low</Badge>;
      default:
        return null;
    }
  };

  return (
    <Card className="cursor-pointer hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-2">
            <Wrench className="h-4 w-4 text-muted-foreground" />
            <span className="font-semibold">{request.unit}</span>
          </div>
          {getPriorityBadge(request.priority)}
        </div>
        <h4 className="font-medium mb-1">{request.issue}</h4>
        <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
          {request.description}
        </p>
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">{request.tenant}</span>
          <span className="text-muted-foreground text-xs">{request.created}</span>
        </div>
      </CardContent>
    </Card>
  );
}
