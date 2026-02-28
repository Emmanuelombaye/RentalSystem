import { createBrowserRouter, Navigate } from "react-router";
import { RootLayout } from "./layouts/RootLayout";
import { DashboardLayout } from "./layouts/DashboardLayout";
import { Login } from "./pages/auth/Login";
import { Register } from "./pages/auth/Register";
import { ForgotPassword } from "./pages/auth/ForgotPassword";
import { Dashboard } from "./pages/dashboard/Dashboard";
import { Properties } from "./pages/properties/Properties";
import { PropertyDetails } from "./pages/properties/PropertyDetails";
import { Units } from "./pages/units/Units";
import { Tenants } from "./pages/tenants/Tenants";
import { TenantProfile } from "./pages/tenants/TenantProfile";
import { Leases } from "./pages/leases/Leases";
import { RentCollection } from "./pages/rent/RentCollection";
import { Financials } from "./pages/financials/Financials";
import { Maintenance } from "./pages/maintenance/Maintenance";
import { TenantPortal } from "./pages/tenant-portal/TenantPortal";
import { Billing } from "./pages/billing/Billing";
import { Settings } from "./pages/settings/Settings";
import { NotFound } from "./pages/NotFound";
import { ProtectedRoute } from "./components/ProtectedRoute";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: RootLayout,
    children: [
      {
        path: "auth",
        children: [
          { path: "login", Component: Login },
          { path: "register", Component: Register },
          { path: "forgot-password", Component: ForgotPassword },
        ],
      },
      {
        path: "dashboard",
        element: (
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        ),
        children: [
          { index: true, Component: Dashboard },
          { path: "properties", Component: Properties },
          { path: "properties/:id", Component: PropertyDetails },
          { path: "units", Component: Units },
          { path: "tenants", Component: Tenants },
          { path: "tenants/:id", Component: TenantProfile },
          { path: "leases", Component: Leases },
          { path: "rent-collection", Component: RentCollection },
          { path: "financials", Component: Financials },
          { path: "maintenance", Component: Maintenance },
          { path: "tenant-portal", Component: TenantPortal },
          { path: "billing", Component: Billing },
          { path: "settings", Component: Settings },
        ],
      },
      {
        index: true,
        element: <Navigate to="/dashboard" replace />,
      },
      { path: "*", Component: NotFound },
    ],
  },
]);