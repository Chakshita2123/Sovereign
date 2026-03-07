import { createBrowserRouter } from "react-router";
import { DashboardLayout } from "./components/layout/DashboardLayout";
import { OverviewPage } from "./pages/OverviewPage";
import { CredentialVaultPage } from "./pages/CredentialVaultPage";
import { DIDIdentityPage } from "./pages/DIDIdentityPage";
import { IssuerPortalPage } from "./pages/IssuerPortalPage";
import { NotFoundPage } from "./pages/NotFoundPage";
import { LandingPage } from "./pages/LandingPage";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: LandingPage,
  },
  {
    path: "/dashboard",
    Component: DashboardLayout,
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
]);
