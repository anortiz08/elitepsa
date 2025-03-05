import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { Switch, Route } from "wouter";
import { AuthProvider } from "./hooks/use-auth";
import { ThemeProvider } from "./hooks/use-theme";
import { ProtectedRoute } from "./lib/protected-route";
import { Toaster } from "@/components/ui/toaster";

import AuthPage from "@/pages/auth-page";
import CustomerDashboard from "@/pages/customer/dashboard";
import CustomerKnowledge from "@/pages/customer/knowledge";
import AgentDashboard from "@/pages/agent/dashboard";
import AgentKnowledgeManage from "@/pages/agent/knowledge-manage";
import NotFound from "@/pages/not-found";
import ProfilePage from "@/pages/profile";

function Router() {
  return (
    <Switch>
      <Route path="/auth" component={AuthPage} />
      <ProtectedRoute path="/" component={CustomerDashboard} />
      <ProtectedRoute path="/knowledge" component={CustomerKnowledge} />
      <ProtectedRoute path="/agent" component={AgentDashboard} />
      <ProtectedRoute path="/agent/knowledge" component={AgentKnowledgeManage} />
      <ProtectedRoute path="/profile" component={ProfilePage} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ThemeProvider defaultTheme="light" storageKey="ui-theme">
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <Router />
          <Toaster />
        </AuthProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
}

export default App;