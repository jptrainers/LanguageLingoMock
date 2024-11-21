import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Switch, Route } from "wouter";
import "./index.css";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { Toaster } from "@/components/ui/toaster";
import Home from "./pages/Home";
import Lesson from "./pages/Lesson";
import CreateQuestion from "./pages/CreateQuestion";
import ManageUnits from "./pages/ManageUnits";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/lesson/:unitId" component={Lesson} />
      <Route path="/create" component={CreateQuestion} />
      <Route path="/manage-units" component={ManageUnits} />
      <Route>404 Page Not Found</Route>
    </Switch>
  );
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <Router />
      <Toaster />
    </QueryClientProvider>
  </StrictMode>,
);
