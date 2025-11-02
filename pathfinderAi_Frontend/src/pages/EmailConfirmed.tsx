import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, Loader2 } from "lucide-react";

const EmailConfirmed = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [userProfile, setUserProfile] = useState<any>(null);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const handleEmailConfirmation = async () => {
      try {
        // Check if this is a redirect from email confirmation
        const accessToken = searchParams.get('access_token');
        const refreshToken = searchParams.get('refresh_token');
        
        if (accessToken && refreshToken) {
          // Set the session if tokens are present
          const { data: sessionData, error: sessionError } = await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken,
          });
          
          if (sessionError) throw sessionError;
        }

        // Get the current user session
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) throw sessionError;
        
        if (session?.user) {
          // Wait a bit for the profile to be created
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          // Get user profile from database to determine dashboard
          const { data: profile, error: profileError } = await supabase
            .from("profiles")
            .select("*")
            .eq("user_id", session.user.id)
            .single();

          if (profileError) {
            console.error("Profile error:", profileError);
            // If profile not found, try to get from user metadata
            const userMetadata = session.user.user_metadata;
            if (userMetadata) {
              setUserProfile({
                full_name: userMetadata.full_name,
                class_level: userMetadata.class_level_display || userMetadata.class_level,
                email: session.user.email,
              });
            } else {
              setError("Could not find user profile");
            }
          } else {
            setUserProfile(profile);
          }
        } else {
          setError("No user session found");
        }
      } catch (error: any) {
        console.error("Email confirmation error:", error);
        setError(error.message);
      } finally {
        setIsLoading(false);
      }
    };

    handleEmailConfirmation();
  }, [searchParams]);

  const handleContinueToDashboard = () => {
    if (userProfile) {
      let dashboardRoute = "/dashboard/early-stage"; // default

      switch (userProfile.class_level) {
        case "8-10":
        case "early-stage":
          dashboardRoute = "/dashboard/early-stage";
          break;
        case "11-12":
        case "decision-making":
          dashboardRoute = "/dashboard/decision-making";
          break;
        case "College":
        case "college":
          dashboardRoute = "/dashboard/college-admission";
          break;
        case "Graduate/Professional":
        case "professional":
          dashboardRoute = "/dashboard/skill-development";
          break;
      }

      navigate(dashboardRoute);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-muted/20 flex items-center justify-center p-4">
        <div className="w-full max-w-lg">
          <Card className="feature-card">
            <CardContent className="text-center py-8">
              <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-primary" />
              <p className="text-muted-foreground">Confirming your email...</p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-muted/20 flex items-center justify-center p-4">
        <div className="w-full max-w-lg">
          <Card className="feature-card">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl text-red-500">Confirmation Failed</CardTitle>
              <CardDescription>
                There was an issue confirming your email
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center space-y-4">
              <p className="text-muted-foreground">{error}</p>
              <Button 
                onClick={() => navigate("/auth")}
                variant="outline"
                className="w-full"
              >
                Back to Sign In
              </Button>
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
          <CardHeader className="text-center">
            <div className="w-20 h-20 mx-auto mb-4 bg-green-100 rounded-full flex items-center justify-center">
              <CheckCircle className="w-12 h-12 text-green-600" />
            </div>
            <CardTitle className="text-3xl text-green-600">Congratulations!</CardTitle>
            <CardDescription className="text-lg">
              Your email has been confirmed successfully
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center space-y-6">
            {userProfile && (
              <div className="space-y-2">
                <p className="text-lg font-medium">Welcome, {userProfile.full_name}!</p>
                <p className="text-muted-foreground">
                  Your account is now active and ready to use.
                </p>
                <div className="bg-primary/10 rounded-lg p-4 mt-4">
                  <p className="text-sm text-muted-foreground">Your selected level:</p>
                  <p className="font-medium text-primary">
                    {(userProfile.class_level === "8-10" || userProfile.class_level === "early-stage") && "Class 8-10 (Early Stage)"}
                    {(userProfile.class_level === "11-12" || userProfile.class_level === "decision-making") && "Class 11-12 (Decision Making)"}
                    {(userProfile.class_level === "College" || userProfile.class_level === "college") && "College Student"}
                    {(userProfile.class_level === "Graduate/Professional" || userProfile.class_level === "professional") && "Graduate/Professional"}
                  </p>
                </div>
              </div>
            )}
            
            <div className="space-y-3">
              <Button 
                onClick={handleContinueToDashboard}
                className="w-full btn-hero"
              >
                Continue to Dashboard
              </Button>
              <p className="text-sm text-muted-foreground">
                You'll be redirected to your personalized dashboard based on your selected level.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default EmailConfirmed;