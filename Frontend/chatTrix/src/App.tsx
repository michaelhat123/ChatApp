import { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "@/components/ui/theme-provider";

// Pages
import Login from "./pages/Login";
import Register from "./pages/Register";
import Feed from "./pages/Feed";
import Profile from "./pages/Profile";
import Search from "./pages/Search";
import Reels from "./pages/Reels";
import Chat from "./pages/Chat";
import Messenger from "./pages/Messenger";
import Likes from "./pages/Likes";
import Follows from "./pages/Follows";
import NotFound from "./pages/NotFound";
import ResetPassword from "./components/reset/reset";
import SettingsLayout from "./components/ui/SettingsLayout";
import NotificationsPopover from "./pages/Notifications";
import EditProfile from "./components/settings/EditProfile";


// Layout
import MainLayout from "./components/layout/MainLayout";

// Auth Context
import { AuthProvider, useAuth } from "./contexts/AuthContext";

const queryClient = new QueryClient();

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="h-screen flex items-center justify-center">Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  return <>{children}</>;
};

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="light" storageKey="instagram-theme">
        <AuthProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/reset-password" element={<ResetPassword />} />
                <Route path="/register" element={<Register />} />
                <Route path="/" element={<ProtectedRoute><MainLayout><Feed /></MainLayout></ProtectedRoute>} />
                <Route path="/profile/:username" element={<ProtectedRoute><MainLayout><Profile /></MainLayout></ProtectedRoute>} />
                <Route path="/search" element={<ProtectedRoute><MainLayout><Search /></MainLayout></ProtectedRoute>} />
                <Route path="/likes" element={<ProtectedRoute><MainLayout><Likes /></MainLayout></ProtectedRoute>} />
                <Route path="/follows" element={<ProtectedRoute><MainLayout><Follows /></MainLayout></ProtectedRoute>} />
                <Route path="/Edit" element={<ProtectedRoute><MainLayout><EditProfile /></MainLayout></ProtectedRoute>} />
                <Route path="/reels" element={<ProtectedRoute><MainLayout><Reels /></MainLayout></ProtectedRoute>} />
                <Route path="/notifications" element={<ProtectedRoute><MainLayout><NotificationsPopover /></MainLayout></ProtectedRoute>} />
                <Route path="/settings" element={<ProtectedRoute><MainLayout><SettingsLayout /></MainLayout></ProtectedRoute>} />
                <Route path="/chat" element={<ProtectedRoute><MainLayout><Chat /></MainLayout></ProtectedRoute>} />
                <Route path="/direct/inbox/:conversationId?" element={<ProtectedRoute><MainLayout><Messenger /></MainLayout></ProtectedRoute>} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </TooltipProvider>
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
};

export default App;
