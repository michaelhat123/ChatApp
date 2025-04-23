import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext'; 
import { Link, useNavigate } from 'react-router-dom';
import { useTheme } from '../components/ui/theme-provider.tsx';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Moon, Sun } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { theme, setTheme } = useTheme();

  // Use the login function from AuthContext
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); // Prevent the default form submission behavior
    setLoading(true);

    try {
      console.log('📤 Attempting login with:', { email, password }); // Debugging log
      await login(email, password);

      toast({
        title: '✨Welcome Back!',
        description: '✅You Have Successfully Logged In.',
        variant: 'default',
      });

      // Navigate to the home page only on successful login
      console.log('✅ Login successful, navigating to home page...');
      navigate('/');
    } catch (error: any) {
      console.error('❌ Login failed:', error.message);

      // Show error message without navigating
      toast({
        title: 'Login error',
        description: error.message || 'Invalid email or password.',
        variant: 'destructive',
      });

      // Ensure no navigation occurs on error
      console.log('⛔ Login failed, staying on the login page.');
    } finally {
      setLoading(false);
    }
  };

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Button
        variant="ghost"
        size="icon"
        className="absolute top-4 right-4"
        onClick={toggleTheme}
      >
        {theme === 'dark' ? <Sun className="h-6 w-6" /> : <Moon className="h-6 w-6" />}
      </Button>

      <Card className="w-full max-w-md border-2 border-blue-800 shadow-[0_0_10px_rgba(30,64,175,0.6)]">
        <CardHeader className="space-y-2 text-center">
          <CardTitle className="text-3xl font-bold text-blue-800 drop-shadow-[0_1px_1px_rgba(0,0,0,0.5)] transition-all duration-300 hover:scale-105 hover:drop-shadow-[0_0_10px_rgba(59,130,246,0.8)]">
            ChatTrix
          </CardTitle>
          <CardDescription className="text-muted-foreground">
            Sign in to your account to continue
          </CardDescription>
        </CardHeader>

        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-blue-700 font-medium">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="border focus-visible:outline-none focus-visible:ring-0 focus-visible:border-blue-800 focus-visible:shadow-[0_0_0_3px_rgba(12,30,91,0.7)] transition-shadow"
              />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between">
                <Label htmlFor="password" className="text-blue-700 font-medium">Password</Label>
                <Link
                  to="/reset-password"
                  className="text-sm text-blue-800 hover:underline"
                >
                  Forgot password?
                </Link>
              </div>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="border focus-visible:outline-none focus-visible:ring-0 focus-visible:border-blue-800 focus-visible:shadow-[0_0_0_3px_rgba(12,30,91,0.7)] transition-shadow"
              />
            </div>
          </CardContent>

          <CardFooter className="flex flex-col space-y-4">
            <Button
              type="submit"
              className="w-full bg-[#0c1e5b] hover:scale-105 hover:drop-shadow-[0_0_5px_rgba(59,130,246,0.8)]"
              disabled={loading}
            >
              {loading ? 'Signing in...' : 'Sign in'}
            </Button>

            <div className="text-center text-sm text-muted-foreground">
              Don&apos;t have an account?{' '}
              <Link to="/register" className="text-blue-800 hover:underline">
                Sign up
              </Link>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default Login;