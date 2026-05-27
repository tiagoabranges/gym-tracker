import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Router as WouterRouter, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import { WorkoutProvider } from "./contexts/WorkoutContext";
import { Layout } from "./components/Layout";
import Dashboard from "./pages/Dashboard";
import Register from "./pages/Register";
import History from "./pages/History";
import Evolution from "./pages/Evolution";

function Router() {
  return (
    <Switch>
      <Route path={"/"} component={Dashboard} />
      <Route path={"/register"} component={Register} />
      <Route path={"/history"} component={History} />
      <Route path={"/evolution"} component={Evolution} />
      <Route path={"/404"} component={NotFound} />
      {/* Final fallback route */}
      <Route component={NotFound} />
    </Switch>
  );
}

// NOTE: About Theme
// - First choose a default theme according to your design style (dark or light bg), than change color palette in index.css
//   to keep consistent foreground/background color across components
// - If you want to make theme switchable, pass `switchable` ThemeProvider and use `useTheme` hook

function App() {
  const routerBase = import.meta.env.BASE_URL.replace(/\/$/, "");

  return (
    <ErrorBoundary>
      <ThemeProvider
        defaultTheme="light"
        // switchable
      >
        <WorkoutProvider>
          <TooltipProvider>
            <Toaster />
            <WouterRouter base={routerBase || undefined}>
              <Layout>
                <Router />
              </Layout>
            </WouterRouter>
          </TooltipProvider>
        </WorkoutProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
