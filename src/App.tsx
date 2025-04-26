
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider } from "next-themes";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Auth from "./pages/Auth";
import Menu from "./pages/Menu";
import Profile from "./pages/Profile";
import DirectMessages from "./pages/DirectMessages";
import Onboarding from "./pages/Onboarding";
import { ChatProvider } from "@/context/ChatContext";
import { AuthProvider } from "@/context/AuthContext";
import { RequireAuth } from "@/components/auth/RequireAuth";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

const App = () => (
  <QueryClientProvider client={queryClient}>
    <BrowserRouter>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        <AuthProvider>
          <ChatProvider>
            <TooltipProvider>
              <Sonner position="top-right" />
              <Routes>
                <Route path="/" element={<Navigate to="/auth" replace />} />
                <Route path="/auth" element={<Auth />} />
                <Route path="/onboarding" element={<Onboarding />} />
                
                {/* Protected routes for authenticated members */}
                <Route 
                  path="/menu" 
                  element={
                    <RequireAuth allowedRoles={['member', 'moderator', 'admin']}>
                      <Menu />
                    </RequireAuth>
                  } 
                />
                
                <Route 
                  path="/profile" 
                  element={
                    <RequireAuth allowedRoles={['member', 'moderator', 'admin']}>
                      <Profile />
                    </RequireAuth>
                  } 
                />
                
                <Route 
                  path="/chat/:channelId" 
                  element={
                    <RequireAuth allowedRoles={['member', 'moderator', 'admin']}>
                      <Index />
                    </RequireAuth>
                  } 
                />
                
                <Route 
                  path="/direct-messages/:friendId" 
                  element={
                    <RequireAuth allowedRoles={['member', 'moderator', 'admin']}>
                      <DirectMessages />
                    </RequireAuth>
                  } 
                />
                
                {/* Admin routes */}
                <Route 
                  path="/admin/*" 
                  element={
                    <RequireAuth allowedRoles={['admin']}>
                      {/* We'll implement the admin layout later */}
                      <div>Admin Dashboard</div>
                    </RequireAuth>
                  } 
                />
                
                <Route path="*" element={<NotFound />} />
              </Routes>
            </TooltipProvider>
          </ChatProvider>
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  </QueryClientProvider>
);

export default App;
