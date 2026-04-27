import { createBrowserRouter } from "react-router";
import { AuthLayout } from "./components/layout/AuthLayout";
import { DashboardLayout } from "./components/layout/DashboardLayout";
import { ProtectedRoute } from "./components/layout/ProtectedRoute";
import { OverviewPage } from "./pages/OverviewPage";
import { CredentialVaultPage } from "./pages/CredentialVaultPage";
import { DIDIdentityPage } from "./pages/DIDIdentityPage";
import { IssuerPortalPage } from "./pages/IssuerPortalPage";
import { NotFoundPage } from "./pages/NotFoundPage";
import { LandingPage } from "./pages/LandingPage";
import { LoginPage } from "./pages/LoginPage";

export const router = createBrowserRouter([
  {
    Component: AuthLayout,
    children: [
      {
        path: "/",
        Component: LandingPage,
      },
      {
        path: "/login",
        Component: LoginPage,
      },
      {
        path: "/dashboard",
        element: <ProtectedRoute><DashboardLayout /></ProtectedRoute>,
        children: [
          { index: true, Component: OverviewPage },
          { path: "vault", Component: CredentialVaultPage },
          { path: "identity", Component: DIDIdentityPage },
          { path: "issuer", Component: IssuerPortalPage },
          { path: "*", Component: NotFoundPage },
        ],
      },
      {
        path: "*",
        Component: NotFoundPage,
      },
    ],
  },
]);
