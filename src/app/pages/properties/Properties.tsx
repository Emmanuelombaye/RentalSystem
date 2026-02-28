import { useEffect, useState } from "react";
import { Link } from "react-router";
import {
  Building2,
  Plus,
  Search,
  Filter,
  Grid3x3,
  List,
  MapPin,
  TrendingUp,
  MoreVertical,
  Edit,
  Trash2,
  Eye,
  Loader2
} from "lucide-react";
import { api } from "../../lib/api";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../../components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";
import { Progress } from "../../components/ui/progress";
import { ImageWithFallback } from "../../components/figma/ImageWithFallback";

export function Properties() {
  const [properties, setProperties] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const data = await api.properties.getAll();
        setProperties(data);
      } catch (err) {
        setError("Failed to fetch properties. Please ensure the backend is running.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchProperties();
  }, []);

  const filteredProperties = properties.filter((property) =>
    property.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    property.address.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalProperties = properties.length;
  // Calculate stats from real data
  const totalUnits = properties.reduce((sum, p) => sum + (p.units?.length || 0), 0);
  const totalOccupied = properties.reduce((sum, p) =>
    sum + (p.units?.filter((u: any) => u.status === 'occupied').length || 0), 0);
  const totalRevenue = properties.reduce((sum, p) =>
    sum + (p.units?.reduce((uSum: number, u: any) => uSum + (u.rent || 0), 0) || 0), 0);

  if (loading) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 text-center bg-destructive/5 rounded-2xl border border-destructive/10">
        <p className="text-destructive font-semibold">{error}</p>
        <Button onClick={() => window.location.reload()} variant="outline" className="mt-4">Retry</Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Properties</h1>
          <p className="text-muted-foreground mt-1">
            Manage and monitor all your properties
          </p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Add Property
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Properties
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalProperties}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Units
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalUnits}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Occupancy Rate
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {totalUnits > 0 ? ((totalOccupied / totalUnits) * 100).toFixed(1) : "0"}%
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Revenue
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${totalRevenue.toLocaleString()}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search properties..."
                className="pl-9"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              <Select defaultValue="all">
                <SelectTrigger className="w-full sm:w-[150px]">
                  <SelectValue placeholder="Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="apartment">Apartment</SelectItem>
                  <SelectItem value="condo">Condo</SelectItem>
                  <SelectItem value="loft">Loft</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" size="icon">
                <Filter className="h-4 w-4" />
              </Button>
              <div className="flex gap-1 border rounded-lg p-1">
                <Button
                  variant={viewMode === "grid" ? "secondary" : "ghost"}
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => setViewMode("grid")}
                >
                  <Grid3x3 className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === "list" ? "secondary" : "ghost"}
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => setViewMode("list")}
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Properties Grid/List */}
      {viewMode === "grid" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredProperties.map((property) => {
            const unitsTotal = property.units?.length || 0;
            const unitsOccupied = property.units?.filter((u: any) => u.status === 'occupied').length || 0;
            const occupancyRate = unitsTotal > 0 ? (unitsOccupied / unitsTotal) * 100 : 0;
            const propertyRevenue = property.units?.reduce((sum: number, u: any) => sum + (u.rent || 0), 0) || 0;

            return (
              <Card
                key={property.id}
                className="overflow-hidden hover:shadow-lg transition-shadow group"
              >
                <div className="relative aspect-video overflow-hidden bg-muted">
                  <ImageWithFallback
                    src={`https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&q=80`}
                    alt={property.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <Badge className="absolute top-3 left-3">{property.status}</Badge>
                  <div className="absolute top-3 right-3">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="secondary"
                          size="icon"
                          className="h-8 w-8 bg-background/80 backdrop-blur-sm"
                        >
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>
                          <Eye className="h-4 w-4 mr-2" />
                          View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Edit className="h-4 w-4 mr-2" />
                          Edit Property
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive">
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
                <CardContent className="p-4">
                  <Link to={`/dashboard/properties/${property.id}`}>
                    <h3 className="font-semibold text-lg mb-1 hover:text-primary transition-colors">
                      {property.name}
                    </h3>
                  </Link>
                  <div className="flex items-start gap-1 text-sm text-muted-foreground mb-4">
                    <MapPin className="h-4 w-4 shrink-0 mt-0.5" />
                    <span className="line-clamp-1">{property.address}</span>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Occupancy</span>
                      <span className="font-medium">
                        {unitsOccupied}/{unitsTotal} units
                      </span>
                    </div>
                    <Progress value={occupancyRate} className="h-2" />

                    <div className="flex items-center justify-between pt-2 border-t">
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <TrendingUp className="h-4 w-4" />
                        <span>Revenue</span>
                      </div>
                      <span className="font-semibold">
                        ${propertyRevenue.toLocaleString()}/mo
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      ) : (
        <Card>
          <CardContent className="p-0">
            <div className="divide-y">
              {filteredProperties.map((property) => {
                const unitsTotal = property.units?.length || 0;
                const unitsOccupied = property.units?.filter((u: any) => u.status === 'occupied').length || 0;
                const occupancyRate = unitsTotal > 0 ? (unitsOccupied / unitsTotal) * 100 : 0;
                const propertyRevenue = property.units?.reduce((sum: number, u: any) => sum + (u.rent || 0), 0) || 0;

                return (
                  <div
                    key={property.id}
                    className="flex flex-col sm:flex-row gap-4 p-4 hover:bg-accent/50 transition-colors"
                  >
                    <div className="sm:w-48 aspect-video rounded-lg overflow-hidden bg-muted shrink-0">
                      <ImageWithFallback
                        src={`https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=400&q=80`}
                        alt={property.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0 space-y-3">
                      <div className="flex items-start justify-between gap-4">
                        <div className="min-w-0 flex-1">
                          <Link to={`/dashboard/properties/${property.id}`}>
                            <h3 className="font-semibold text-lg hover:text-primary transition-colors">
                              {property.name}
                            </h3>
                          </Link>
                          <div className="flex items-center gap-2 mt-1">
                            <MapPin className="h-4 w-4 text-muted-foreground shrink-0" />
                            <span className="text-sm text-muted-foreground truncate">
                              {property.address}
                            </span>
                          </div>
                        </div>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>
                              <Eye className="h-4 w-4 mr-2" />
                              View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Edit className="h-4 w-4 mr-2" />
                              Edit Property
                            </DropdownMenuItem>
                            <DropdownMenuItem className="text-destructive">
                              <Trash2 className="h-4 w-4 mr-2" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>

                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                        <div>
                          <div className="text-xs text-muted-foreground mb-1">Status</div>
                          <Badge variant="secondary">{property.status}</Badge>
                        </div>
                        <div>
                          <div className="text-xs text-muted-foreground mb-1">Units</div>
                          <div className="font-medium">{unitsTotal}</div>
                        </div>
                        <div>
                          <div className="text-xs text-muted-foreground mb-1">Occupied</div>
                          <div className="font-medium">
                            {unitsOccupied} ({occupancyRate.toFixed(0)}%)
                          </div>
                        </div>
                        <div>
                          <div className="text-xs text-muted-foreground mb-1">Revenue</div>
                          <div className="font-medium">
                            ${propertyRevenue.toLocaleString()}/mo
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
