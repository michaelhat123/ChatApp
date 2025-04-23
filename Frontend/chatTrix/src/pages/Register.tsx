import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../components/ui/theme-provider.tsx';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Moon, Sun } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

const Register = () => {
  const [email, setEmail] = useState('');
  const [fullName, setFullName] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();
  const { theme, setTheme } = useTheme();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); // Prevent the default form submission behavior

    // Check if passwords match
    if (password !== confirmPassword) {
      toast({
        title: "Error",
        description: "Passwords don't match",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      console.log('📤 Sending registration request:', { email, fullName, username, password }); // Debugging log
      await register(email, fullName, username, password);

      toast({
        title: "Account created",
        description: "Your account has been successfully created.",
        variant: "default",
      });

      // Navigate to the home page after successful registration
      console.log('✅ Registration successful, navigating to home page...');
      navigate('/');
    } catch (error: any) {
      console.error('❌ Registration failed:', error.message); // Debugging log

      // Show error message
      const errorMessage = error.message || "Could not create account";
      toast({
        title: "Registration failed",
        description: errorMessage,
        variant: "destructive",
      });
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
      
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-2 text-center">
          <CardTitle className="text-3xl font-bold text-blue-800 drop-shadow-[0_1px_1px_rgba(0,0,0,0.5)] transition-all duration-300 hover:scale-105 hover:drop-shadow-[0_0_10px_rgba(59,130,246,0.8)]">Create Account</CardTitle>
          <CardDescription>
            Sign Up To See Photos And Videos From Your Friends
          </CardDescription>
        </CardHeader>
        
        <form onSubmit={handleSubmit} noValidate>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-blue-700 font-medium">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder=""
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="fullName" className="text-blue-700 font-medium">Full Name</Label>
              <Input
                id="fullName"
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder=""
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="username" className="text-blue-700 font-medium">Username</Label>
              <Input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder=""
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password" className="text-blue-700 font-medium">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder=""
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="confirmPassword" className="text-blue-700 font-medium">Confirm Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder=""
                required
              />
            </div>
          </CardContent>
          
          <CardFooter className="flex flex-col space-y-4">
            <Button 
              type="submit" 
              className="w-full bg-[#0c1e5b] hover:scale-105 hover:drop-shadow-[0_0_5px_rgba(59,130,246,0.8)]" 
              disabled={loading}
            >
              {loading ? "Creating account..." : "Sign up"}
            </Button>
            
            <div className="text-center text-sm">
              <span className='text-muted-foreground'>Already have an account?{" "}</span>
              <Link to="/login" className="text-primary hover:underline">
                Log in
              </Link>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default Register;
