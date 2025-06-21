
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { BarChart3, TrendingUp, Shield, Zap } from "lucide-react";
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { toast } from "@/hooks/use-toast";

const Auth = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const { login, signup } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    const formData = new FormData(e.currentTarget);
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    const { error } = await login(email, password);
    
    if (error) {
      setError(error);
      setIsLoading(false);
    } else {
      toast({
        title: "Welcome back!",
        description: "You have successfully logged in.",
      });
      navigate('/dashboard');
    }
  };

  const handleSignup = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    const formData = new FormData(e.currentTarget);
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;
    const fullName = formData.get('fullName') as string;

    const { error } = await signup(email, password, fullName);
    
    if (error) {
      setError(error);
      setIsLoading(false);
    } else {
      toast({
        title: "Account created!",
        description: "Please check your email for verification.",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
      <div className="w-full max-w-6xl grid lg:grid-cols-2 gap-12 items-center">
        {/* Left side - Enhanced Branding */}
        <div className="hidden lg:block space-y-10">
          <div className="space-y-6">
            <div className="flex items-center space-x-4">
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-4 rounded-2xl shadow-xl">
                <BarChart3 className="h-16 w-16 text-white" />
              </div>
              <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Smart-Commerce
              </h1>
            </div>
            <p className="text-2xl text-gray-700 leading-relaxed">
              Transform your business data into actionable insights with AI-powered analytics
            </p>
          </div>

          <div className="space-y-8">
            <div className="flex items-start space-x-6 group">
              <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-4 rounded-2xl shadow-lg group-hover:scale-110 transition-transform duration-300">
                <TrendingUp className="h-8 w-8 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Smart Analytics</h3>
                <p className="text-gray-600 text-lg leading-relaxed">Get real-time insights from your sales data with advanced anomaly detection</p>
              </div>
            </div>

            <div className="flex items-start space-x-6 group">
              <div className="bg-gradient-to-r from-purple-500 to-purple-600 p-4 rounded-2xl shadow-lg group-hover:scale-110 transition-transform duration-300">
                <Shield className="h-8 w-8 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Secure & Reliable</h3>
                <p className="text-gray-600 text-lg leading-relaxed">Enterprise-grade security with automatic backups and data protection</p>
              </div>
            </div>

            <div className="flex items-start space-x-6 group">
              <div className="bg-gradient-to-r from-green-500 to-green-600 p-4 rounded-2xl shadow-lg group-hover:scale-110 transition-transform duration-300">
                <Zap className="h-8 w-8 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Lightning Fast</h3>
                <p className="text-gray-600 text-lg leading-relaxed">Process thousands of records in seconds with our optimized engine</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right side - Enhanced Auth Forms */}
        <Card className="w-full max-w-md mx-auto shadow-2xl border-0 bg-gradient-to-br from-white to-gray-50/50">
          <CardHeader className="text-center pb-8 bg-gradient-to-r from-blue-50 to-purple-50 rounded-t-xl">
            <div className="mx-auto bg-gradient-to-r from-blue-600 to-purple-600 w-20 h-20 rounded-2xl flex items-center justify-center mb-6 shadow-xl">
              <BarChart3 className="h-10 w-10 text-white" />
            </div>
            <CardTitle className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Welcome to Smart-Commerce</CardTitle>
            <CardDescription className="text-lg mt-2">
              Start your analytics journey today
            </CardDescription>
          </CardHeader>
          
          <CardContent className="p-8">
            <Tabs defaultValue="login" className="space-y-8">
              <TabsList className="grid w-full grid-cols-2 h-14 bg-gray-100 p-1 rounded-xl">
                <TabsTrigger value="login" className="rounded-lg text-base font-semibold data-[state=active]:bg-white data-[state=active]:shadow-md data-[state=active]:text-blue-600 transition-all duration-300">Sign In</TabsTrigger>
                <TabsTrigger value="signup" className="rounded-lg text-base font-semibold data-[state=active]:bg-white data-[state=active]:shadow-md data-[state=active]:text-purple-600 transition-all duration-300">Sign Up</TabsTrigger>
              </TabsList>

              {error && (
                <Alert variant="destructive" className="border-red-200 bg-red-50">
                  <AlertDescription className="text-red-800 font-medium">{error}</AlertDescription>
                </Alert>
              )}

              <TabsContent value="login">
                <form onSubmit={handleLogin} className="space-y-6">
                  <div className="space-y-3">
                    <Label htmlFor="login-email" className="text-sm font-semibold text-gray-700">Email</Label>
                    <Input
                      id="login-email"
                      name="email"
                      type="email"
                      placeholder="Enter your email"
                      required
                      className="h-14 text-lg border-2 border-gray-200 focus:border-blue-500 transition-all duration-300 rounded-xl"
                    />
                  </div>
                  
                  <div className="space-y-3">
                    <Label htmlFor="login-password" className="text-sm font-semibold text-gray-700">Password</Label>
                    <Input
                      id="login-password"
                      name="password"
                      type="password"
                      placeholder="Enter your password"
                      required
                      className="h-14 text-lg border-2 border-gray-200 focus:border-blue-500 transition-all duration-300 rounded-xl"
                    />
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full h-14 text-lg font-semibold bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 rounded-xl"
                    disabled={isLoading}
                  >
                    {isLoading ? "Signing in..." : "Sign In"}
                  </Button>
                </form>
              </TabsContent>

              <TabsContent value="signup">
                <form onSubmit={handleSignup} className="space-y-6">
                  <div className="space-y-3">
                    <Label htmlFor="signup-name" className="text-sm font-semibold text-gray-700">Full Name</Label>
                    <Input
                      id="signup-name"
                      name="fullName"
                      type="text"
                      placeholder="Enter your full name"
                      required
                      className="h-14 text-lg border-2 border-gray-200 focus:border-purple-500 transition-all duration-300 rounded-xl"
                    />
                  </div>

                  <div className="space-y-3">
                    <Label htmlFor="signup-email" className="text-sm font-semibold text-gray-700">Email</Label>
                    <Input
                      id="signup-email"
                      name="email"
                      type="email"
                      placeholder="Enter your email"
                      required
                      className="h-14 text-lg border-2 border-gray-200 focus:border-purple-500 transition-all duration-300 rounded-xl"
                    />
                  </div>
                  
                  <div className="space-y-3">
                    <Label htmlFor="signup-password" className="text-sm font-semibold text-gray-700">Password</Label>
                    <Input
                      id="signup-password"
                      name="password"
                      type="password"
                      placeholder="Create a password"
                      required
                      className="h-14 text-lg border-2 border-gray-200 focus:border-purple-500 transition-all duration-300 rounded-xl"
                    />
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full h-14 text-lg font-semibold bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 rounded-xl"
                    disabled={isLoading}
                  >
                    {isLoading ? "Creating account..." : "Create Account"}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>

            <div className="mt-8 text-center">
              <p className="text-sm text-gray-600">
                By signing up, you agree to our Terms of Service and Privacy Policy
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Auth;
