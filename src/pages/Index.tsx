import { useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Check } from "lucide-react";

const Index = () => {
  const navigate = useNavigate();
  const featuresRef = useRef<HTMLDivElement>(null); // Create a ref for the features section
  
  useEffect(() => {
    // Check if user is already logged in
    const isAuthenticated = localStorage.getItem("isAuthenticated") === "true";
    if (isAuthenticated) {
      navigate("/dashboard");
    }
  }, [navigate]);

  const handleLearnMoreClick = () => {
    featuresRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted">
      <header className="container mx-auto px-4 py-6 flex justify-between items-center">
        <div className="flex items-center">
          <h1 className="text-2xl font-bold text-primary">Smart Diet Planner</h1>
        </div>
        <div>
          <Button variant="ghost" onClick={() => navigate("/login")}>Login</Button>
          <Button onClick={() => navigate("/login")}>Get Started</Button>
        </div>
      </header>

      <main>
        {/* Hero Section */}
        <section className="container mx-auto px-4 py-20 flex flex-col lg:flex-row items-center gap-12">
          <div className="lg:w-1/2 space-y-6">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight">
              Your <span className="text-primary">AI-Powered</span> Nutrition Assistant
            </h1>
            <p className="text-xl text-muted-foreground">
              Smart Diet Planner creates personalized meal plans based on your preferences,
              dietary needs, and fitness goals - helping you eat better and feel great.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Button size="lg" onClick={() => navigate("/login")} className="gap-2">
                Start Your Journey <ArrowRight className="h-4 w-4" />
              </Button>
              <Button size="lg" variant="outline" onClick={handleLearnMoreClick}>Learn More</Button>
            </div>
          </div>
          <div className="lg:w-1/2">
            <img 
              src="/placeholder.svg" 
              alt="Healthy food arrangement" 
              className="rounded-lg shadow-xl w-full h-auto object-cover"
            />
          </div>
        </section>

        {/* Features Section */}
        <section ref={featuresRef} className="bg-card py-20"> {/* Attach the ref here */}
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold mb-4">Powerful Features for Your Nutrition Goals</h2>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                Our comprehensive tools make healthy eating simple, enjoyable, and tailored to your lifestyle
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="bg-background p-6 rounded-lg shadow">
                <div className="h-12 w-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-2">AI-Powered Meal Planning</h3>
                <p className="text-muted-foreground">
                  Get personalized meal plans based on your BMI, activity level, and nutritional goals that adapt to your progress.
                </p>
              </div>
              
              <div className="bg-background p-6 rounded-lg shadow">
                <div className="h-12 w-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-2">Food Database Integration</h3>
                <p className="text-muted-foreground">
                  Access comprehensive nutrition information from global sources for informed meal choices.
                </p>
              </div>
              
              <div className="bg-background p-6 rounded-lg shadow">
                <div className="h-12 w-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-2">Dietary Customization</h3>
                <p className="text-muted-foreground">
                  Tailor your meal plans for specific dietary needs including vegan, keto, diabetic-friendly, and more.
                </p>
              </div>
              
              <div className="bg-background p-6 rounded-lg shadow">
                <div className="h-12 w-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-2">Grocery List Generator</h3>
                <p className="text-muted-foreground">
                  Automatically create shopping lists from your meal plan to save time and reduce food waste.
                </p>
              </div>
              
              <div className="bg-background p-6 rounded-lg shadow">
                <div className="h-12 w-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-2">Progress Tracker</h3>
                <p className="text-muted-foreground">
                  Track your weight, calorie intake, and fitness goals to stay motivated on your health journey.
                </p>
              </div>
              
              <div className="bg-background p-6 rounded-lg shadow">
                <div className="h-12 w-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-2">Budget-Friendly Options</h3>
                <p className="text-muted-foreground">
                  Find cost-effective meal options that don't compromise on nutrition or taste.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold mb-4">How Smart Diet Planner Works</h2>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                A simple three-step process to your personalized nutrition plan
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              <div className="text-center">
                <div className="h-16 w-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-6 text-white text-2xl font-bold">1</div>
                <h3 className="text-xl font-semibold mb-4">Create Your Profile</h3>
                <p className="text-muted-foreground">
                  Input your preferences, dietary needs, and health goals to customize your experience.
                </p>
              </div>
              
              <div className="text-center">
                <div className="h-16 w-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-6 text-white text-2xl font-bold">2</div>
                <h3 className="text-xl font-semibold mb-4">Get Your Plan</h3>
                <p className="text-muted-foreground">
                  Our AI generates a personalized meal plan tailored specifically to your needs.
                </p>
              </div>
              
              <div className="text-center">
                <div className="h-16 w-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-6 text-white text-2xl font-bold">3</div>
                <h3 className="text-xl font-semibold mb-4">Track & Improve</h3>
                <p className="text-muted-foreground">
                  Follow your plan, track your progress, and watch as the system adapts to your feedback.
                </p>
              </div>
            </div>
            
            <div className="mt-16 text-center">
              <Button size="lg" onClick={() => navigate("/login")}>
                Start Your Free Plan
              </Button>
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section className="bg-card py-20">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold mb-4">What Our Users Say</h2>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                Join thousands of satisfied users who transformed their eating habits
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-background p-6 rounded-lg shadow">
                <div className="flex items-center mb-4">
                  <div className="h-12 w-12 rounded-full bg-primary/20 flex items-center justify-center mr-4">
                    <span className="text-primary font-bold">AK</span>
                  </div>
                  <div>
                    <h4 className="font-semibold">Ananya Kumar</h4>
                    <p className="text-sm text-muted-foreground">Lost 15kg in 3 months</p>
                  </div>
                </div>
                <p className="text-muted-foreground">
                  "The meal planning made everything so simple. I no longer stress about what to eat and I've seen amazing results!"
                </p>
                <div className="flex text-yellow-400 mt-4">
                  ★★★★★
                </div>
              </div>
              
              <div className="bg-background p-6 rounded-lg shadow">
                <div className="flex items-center mb-4">
                  <div className="h-12 w-12 rounded-full bg-primary/20 flex items-center justify-center mr-4">
                    <span className="text-primary font-bold">RS</span>
                  </div>
                  <div>
                    <h4 className="font-semibold">Rohan Sharma</h4>
                    <p className="text-sm text-muted-foreground">Manages diabetes effectively</p>
                  </div>
                </div>
                <p className="text-muted-foreground">
                  "As someone with type 2 diabetes, finding proper meal plans was always difficult. This app has been a life-changer for managing my condition."
                </p>
                <div className="flex text-yellow-400 mt-4">
                  ★★★★★
                </div>
              </div>
              
              <div className="bg-background p-6 rounded-lg shadow">
                <div className="flex items-center mb-4">
                  <div className="h-12 w-12 rounded-full bg-primary/20 flex items-center justify-center mr-4">
                    <span className="text-primary font-bold">PK</span>
                  </div>
                  <div>
                    <h4 className="font-semibold">Priya Kapoor</h4>
                    <p className="text-sm text-muted-foreground">Fitness enthusiast</p>
                  </div>
                </div>
                <p className="text-muted-foreground">
                  "The nutrition tracking combined with workout integration has helped me optimize my performance and recovery. Highly recommended!"
                </p>
                <div className="flex text-yellow-400 mt-4">
                  ★★★★★
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-primary/10">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-6">Ready to Transform Your Nutrition?</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
              Join Smart Diet Planner today and take the first step toward healthier eating habits and achieving your wellness goals.
            </p>
            <Button size="lg" className="gap-2" onClick={() => navigate("/login")}>
              Get Started Now <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </section>
      </main>

      <footer className="bg-card py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-4">Smart Diet Planner</h3>
              <p className="text-muted-foreground">
                Your personal AI-powered nutrition assistant for healthier living.
              </p>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">Features</h3>
              <ul className="space-y-2 text-muted-foreground">
                <li>AI Meal Planning</li>
                <li>Food Database</li>
                <li>Grocery Lists</li>
                <li>Progress Tracking</li>
                <li>Recipe Suggestions</li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">Resources</h3>
              <ul className="space-y-2 text-muted-foreground">
                <li>Blog</li>
                <li>Nutrition Guides</li>
                <li>Recipe Collection</li>
                <li>Fitness Tips</li>
                <li>User Stories</li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">Company</h3>
              <ul className="space-y-2 text-muted-foreground">
                <li>About Us</li>
                <li>Contact</li>
                <li>Privacy Policy</li>
                <li>Terms of Service</li>
                <li>Careers</li>
              </ul>
            </div>
          </div>
          
          <div className="mt-12 pt-8 border-t border-muted text-center">
            <p className="text-muted-foreground">
              &copy; {new Date().getFullYear()} Smart Diet Planner. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;