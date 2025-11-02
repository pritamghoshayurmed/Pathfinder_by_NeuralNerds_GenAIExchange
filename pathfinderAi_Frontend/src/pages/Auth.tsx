import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2, Eye, EyeOff, Mail } from "lucide-react";

const Auth = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showEmailConfirmation, setShowEmailConfirmation] = useState(false);
  const [userEmail, setUserEmail] = useState("");
  const [loginForm, setLoginForm] = useState({ email: "", password: "" });
  const [signupForm, setSignupForm] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    fullName: "",
    classLevel: "",
  });
  const [passwordError, setPasswordError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: loginForm.email,
        password: loginForm.password,
      });

      if (error) throw error;

      // Get user profile from database to determine class level
      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("class_level")
        .eq("user_id", data.user.id)
        .single();

      let dashboardRoute = "/dashboard/early-stage"; // default

      if (profile && !profileError) {
        console.log("User profile class_level:", profile.class_level); // Debug log
        
        switch (profile.class_level) {
          case "8-10":
            dashboardRoute = "/dashboard/early-stage";
            break;
          case "11-12":
            dashboardRoute = "/dashboard/decision-making";
            break;
          case "College":
            dashboardRoute = "/dashboard/college-admission";
            break;
          case "Graduate/Professional":
            dashboardRoute = "/dashboard/skill-development";
            break;
          default:
            // If class_level doesn't match expected values, check user metadata
            const userMetadata = data.user.user_metadata;
            if (userMetadata?.class_level) {
              switch (userMetadata.class_level) {
                case "early-stage":
                  dashboardRoute = "/dashboard/early-stage";
                  break;
                case "decision-making":
                  dashboardRoute = "/dashboard/decision-making";
                  break;
                case "college":
                  dashboardRoute = "/dashboard/college-admission";
                  break;
                case "professional":
                  dashboardRoute = "/dashboard/skill-development";
                  break;
              }
            }
        }
      } else {
        // If no profile found, check user metadata
        const userMetadata = data.user.user_metadata;
        console.log("User metadata:", userMetadata); // Debug log
        
        if (userMetadata?.class_level) {
          switch (userMetadata.class_level) {
            case "early-stage":
              dashboardRoute = "/dashboard/early-stage";
              break;
            case "decision-making":
              dashboardRoute = "/dashboard/decision-making";
              break;
            case "college":
              dashboardRoute = "/dashboard/college-admission";
              break;
            case "professional":
              dashboardRoute = "/dashboard/skill-development";
              break;
          }
        }
      }

      console.log("Redirecting to:", dashboardRoute); // Debug log
      navigate(dashboardRoute);
    } catch (error: any) {
      console.error("Login error:", error.message);
      setPasswordError("Login failed. Please check your credentials.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setPasswordError("");

    // Check if passwords match
    if (signupForm.password !== signupForm.confirmPassword) {
      setPasswordError("Passwords do not match!");
      setIsLoading(false);
      return;
    }

    // Check password length
    if (signupForm.password.length < 6) {
      setPasswordError("Password must be at least 6 characters long!");
      setIsLoading(false);
      return;
    }

    try {
      // Map class level values to display text for database storage
      const getClassLevelText = (value: string) => {
        switch (value) {
          case "early-stage":
            return "8-10";
          case "decision-making":
            return "11-12";
          case "college":
            return "College";
          case "professional":
            return "Graduate/Professional";
          default:
            return value;
        }
      };

      const { data, error } = await supabase.auth.signUp({
        email: signupForm.email,
        password: signupForm.password,
        options: {
          emailRedirectTo: `${window.location.origin}/email-confirmed`, // Add this line
          data: {
            full_name: signupForm.fullName,
            class_level: signupForm.classLevel,
            class_level_display: getClassLevelText(signupForm.classLevel),
          },
        },
      });

      if (error) throw error;

      // Insert user details into the Supabase table
      const { error: insertError } = await supabase
        .from("profiles")
        .insert({
          user_id: data.user?.id,
          full_name: signupForm.fullName,
          class_level: getClassLevelText(signupForm.classLevel),
          email: signupForm.email,
        });

      if (insertError) {
        console.error("Insert error:", insertError);
      }

      console.log("User created with class_level:", signupForm.classLevel);
      console.log("Database class_level:", getClassLevelText(signupForm.classLevel));

      // Show email confirmation screen
      setUserEmail(signupForm.email);
      setShowEmailConfirmation(true);

    } catch (error: any) {
      console.error("Sign-up error:", error.message);
      setPasswordError(`Sign-up failed: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  // Clear password error when user types
  const handlePasswordChange = (value: string) => {
    setSignupForm((prev) => ({ ...prev, password: value }));
    setPasswordError("");
  };

  const handleConfirmPasswordChange = (value: string) => {
    setSignupForm((prev) => ({ ...prev, confirmPassword: value }));
    setPasswordError("");
  };

  // Email Confirmation Screen
  if (showEmailConfirmation) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-muted/20 flex items-center justify-center p-4">
        <div className="w-full max-w-lg">
          <Card className="feature-card">
            <CardHeader className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-primary/10 rounded-full flex items-center justify-center">
                <Mail className="w-8 h-8 text-primary" />
              </div>
              <CardTitle className="text-2xl">Check Your Email</CardTitle>
              <CardDescription>
                We've sent a confirmation email to
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center space-y-4">
              <p className="font-medium text-primary">{userEmail}</p>
              <p className="text-muted-foreground">
                Please click the confirmation link in your email to verify your account and complete the sign-up process.
              </p>
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">
                  After confirming your email, you'll be automatically redirected to your dashboard.
                </p>
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowEmailConfirmation(false);
                    setSignupForm({
                      email: "",
                      password: "",
                      confirmPassword: "",
                      fullName: "",
                      classLevel: "",
                    });
                  }}
                  className="w-full"
                >
                  Back to Sign Up
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20 flex items-center justify-center p-4">
      <div className="w-full max-w-lg">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-glow mb-2">SkillAdvisor</h1>
          <p className="text-muted-foreground">Your AI-powered career guidance platform</p>
        </div>

        <Card className="feature-card">
          <CardHeader>
            <CardTitle>Welcome Back</CardTitle>
            <CardDescription>
              Sign in to your account or get started with a new one
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="login" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="login">Sign In</TabsTrigger>
                <TabsTrigger value="get-started">Sign Up</TabsTrigger>
              </TabsList>

              {/* Sign In Tab */}
              <TabsContent value="login">
                <form onSubmit={handleLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="Enter your email"
                      value={loginForm.email}
                      onChange={(e) =>
                        setLoginForm((prev) => ({ ...prev, email: e.target.value }))
                      }
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <div className="relative">
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter your password"
                        value={loginForm.password}
                        onChange={(e) =>
                          setLoginForm((prev) => ({ ...prev, password: e.target.value }))
                        }
                        required
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3 py-2"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                    </div>
                  </div>

                  {passwordError && (
                    <div className="text-red-500 text-sm mt-2">
                      {passwordError}
                    </div>
                  )}

                  <Button type="submit" className="w-full btn-hero" disabled={isLoading}>
                    {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                    Sign In
                  </Button>
                </form>
              </TabsContent>

              {/* Get Started Tab */}
              <TabsContent value="get-started">
                <form onSubmit={handleSignUp} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="fullName">Full Name</Label>
                    <Input
                      id="fullName"
                      type="text"
                      placeholder="Enter your full name"
                      value={signupForm.fullName}
                      onChange={(e) =>
                        setSignupForm((prev) => ({ ...prev, fullName: e.target.value }))
                      }
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="Enter your email"
                      value={signupForm.email}
                      onChange={(e) =>
                        setSignupForm((prev) => ({ ...prev, email: e.target.value }))
                      }
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <div className="relative">
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter your password"
                        value={signupForm.password}
                        onChange={(e) => handlePasswordChange(e.target.value)}
                        required
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3 py-2"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                    </div>
                  </div>

                  {/* Confirm Password Section */}
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirm Password</Label>
                    <div className="relative">
                      <Input
                        id="confirmPassword"
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="Confirm your password"
                        value={signupForm.confirmPassword}
                        onChange={(e) => handleConfirmPasswordChange(e.target.value)}
                        required
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3 py-2"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      >
                        {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                    </div>
                  </div>

                  {/* Error Message */}
                  {passwordError && (
                    <div className="text-red-500 text-sm mt-2">
                      {passwordError}
                    </div>
                  )}

                  <div className="space-y-2">
                    <Label htmlFor="classLevel" className="text-sm font-medium">Class Level</Label>
                    <select
                      id="classLevel"
                      className="w-full p-2 border rounded-md bg-gray-800 text-white backdrop-blur-md"
                      value={signupForm.classLevel}
                      onChange={(e) =>
                        setSignupForm((prev) => ({ ...prev, classLevel: e.target.value }))
                      }
                      required
                    >
                      <option value="">Select your current level</option>
                      <option value="early-stage">Class 8-10 (Early Stage)</option>
                      <option value="decision-making">Class 11-12 (Decision Making)</option>
                      <option value="college">Post-12th</option>
                      <option value="professional">College Students</option>
                    </select>
                  </div>

                  <Button type="submit" className="w-full btn-hero" disabled={isLoading}>
                    {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                    Create Account
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Auth;