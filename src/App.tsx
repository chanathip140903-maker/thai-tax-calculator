import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import NotFound from '@/pages/not-found';
import { Route, Switch, Router as WouterRouter } from 'wouter';
import { Home } from './pages/Home';
import { Form91 } from './pages/Form91';
import { Form90 } from './pages/Form90';
import { Form94 } from './pages/Form94';
import { TestSuite } from './pages/TestSuite';

import { useEffect, useState } from 'react';

// Custom hook to support hash-based routing (e.g. /#/test-suite) to fix GitHub Pages SPA 404 errors on reload
const currentLoc = () => {
  const hash = window.location.hash;
  if (!hash) return "/";
  return hash.replace(/^#/, "");
};

export const useHashLocation = () => {
  const [loc, setLoc] = useState(currentLoc);

  useEffect(() => {
    const handler = () => setLoc(currentLoc());
    window.addEventListener("hashchange", handler);
    return () => window.removeEventListener("hashchange", handler);
  }, []);

  const navigate = (to: string) => {
    window.location.hash = to;
  };

  return [loc, navigate] as [string, (to: string) => void];
};

const queryClient = new QueryClient();

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/90" component={Form90} />
      <Route path="/91" component={Form91} />
      <Route path="/94" component={Form94} />
      <Route path="/test-suite" component={TestSuite} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter hook={useHashLocation}>
          <Router />
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
