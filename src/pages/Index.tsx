import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Leaf, Utensils, Scale, Heart, CheckCircle2 } from "lucide-react";
import { Link } from "react-router-dom";

const Index = () => {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative w-full h-[70vh] bg-gradient-to-r from-green-500 to-blue-500 flex items-center justify-center text-center text-white p-4">
        <div className="z-10 max-w-4xl">
          <h1 className="text-5xl md:text-6xl font-extrabold leading-tight mb-6">
            Your Personalized Journey to Healthier Eating
          </h1>
          <p className="text-xl md:text-2xl mb-8 opacity-90">
            Achieve your diet goals with smart meal planning, nutrition tracking, and expert insights.
          </p>
          <Button asChild size="lg" className="bg-white text-green-600 hover:bg-gray-100 text-lg px-8 py-3 rounded-full shadow-lg transition-all duration-300">
            <Link to="/dashboard">Start Your Free Plan</Link>
          </Button>
        </div>
        <div className="absolute inset-0 bg-black opacity-30"></div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-12 text-gray-800">Why Choose Smart Diet Planner?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="p-6 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardHeader>
                <Leaf className="h-12 w-12 text-green-600 mx-auto mb-4" />
                <CardTitle className="text-2xl font-semibold">Personalized Meal Plans</CardTitle>
              </CardHeader>
              <CardContent className="text-gray-600">
                Get custom meal plans tailored to your dietary needs, preferences, and health goals.
              </CardContent>
            </Card>
            <Card className="p-6 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardHeader>
                <Utensils className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                <CardTitle className="text-2xl font-semibold">Nutrition Tracking</CardTitle>
              </CardHeader>
              <CardContent className="text-gray-600">
                Easily log your food intake and track calories, macros, and micronutrients.
              </CardContent>
            </Card>
            <Card className="p-6 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardHeader>
                <Scale className="h-12 w-12 text-yellow-600 mx-auto mb-4" />
                <CardTitle className="text-2xl font-semibold">Progress Monitoring</CardTitle>
              </CardHeader>
              <CardContent className="text-gray-600">
                Monitor your weight, water intake, and other key metrics to stay motivated.
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-12 text-gray-800">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
            <div className="flex flex-col items-center text-center">
              <div className="flex items-center justify-center h-16 w-16 rounded-full bg-green-100 text-green-600 text-3xl font-bold mb-4">
                1
              </div>
              <h3 className="text-xl font-semibold mb-2">Set Your Goals</h3>
              <p className="text-gray-600">Define your health objectives, dietary restrictions, and food preferences.</p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="flex items-center justify-center h-16 w-16 rounded-full bg-blue-100 text-blue-600 text-3xl font-bold mb-4">
                2
              </div>
              <h3 className="text-xl font-semibold mb-2">Get Your Plan</h3>
              <p className="text-gray-600">Receive a personalized meal plan and grocery list generated just for you.</p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="flex items-center justify-center h-16 w-16 rounded-full bg-yellow-100 text-yellow-600 text-3xl font-bold mb-4">
                3
              </div>
              <h3 className="text-xl font-semibold mb-2">Track & Achieve</h3>
              <p className="text-gray-600">L og your meals, track your progress, and reach your health goals faster.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 bg-gray-100">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">What Our Users Say</h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Join these satisfied users who transformed their eating habits
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-12">
            <Card className="p-6 shadow-md">
              <CardContent className="text-gray-700 italic">
                "Smart Diet Planner made healthy eating so easy! I've lost weight and feel more energetic than ever."
              </CardContent>
              <CardHeader className="mt-4">
                <CardTitle className="text-lg font-semibold">- Jane Doe</CardTitle>
                <p className="text-sm text-gray-500">Health Enthusiast</p>
              </CardHeader>
            </Card>
            <Card className="p-6 shadow-md">
              <CardContent className="text-gray-700 italic">
                "The personalized meal plans are a game-changer. No more guessing what to eat!"
              </CardContent>
              <CardHeader className="mt-4">
                <CardTitle className="text-lg font-semibold">- John Smith</CardTitle>
                <p className="text-sm text-gray-500">Busy Professional</p>
              </CardHeader>
            </Card>
            <Card className="p-6 shadow-md">
              <CardContent className="text-gray-700 italic">
                "I love how I can track everything in one place. It keeps me accountable and motivated."
              </CardContent>
              <CardHeader className="mt-4">
                <CardTitle className="text-lg font-semibold">- Emily White</CardTitle>
                <p className="text-sm text-gray-500">Fitness Lover</p>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="py-16 bg-green-600 text-white text-center">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold mb-6">Ready to Transform Your Health?</h2>
          <p className="text-xl mb-8 opacity-90">
            Sign up today and take the first step towards a healthier, happier you!
          </p>
          <Button asChild size="lg" className="bg-white text-green-600 hover:bg-gray-100 text-lg px-8 py-3 rounded-full shadow-lg transition-all duration-300">
            <Link to="/dashboard">Get Started Now</Link>
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-8">
        <div className="container mx-auto px-4 text-center">
          <div className="flex flex-col md:flex-row justify-between items-center mb-6">
            <div className="mb-4 md:mb-0">
              <h3 className="text-2xl font-bold">Smart Diet Planner</h3>
              <p className="text-sm text-gray-400">Your partner in healthy living</p>
            </div>
            <nav className="flex space-x-6">
              <Link to="/" className="hover:text-green-400 transition-colors duration-300">Home</Link>
              <Link to="/about" className="hover:text-green-400 transition-colors duration-300">About</Link>
              <Link to="/contact" className="hover:text-green-400 transition-colors duration-300">Contact</Link>
              <Link to="/privacy" className="hover:text-green-400 transition-colors duration-300">Privacy</Link>
            </nav>
          </div>
          <Separator className="bg-gray-700 my-6" />
          <p className="text-sm text-gray-400">&copy; {new Date().getFullYear()} Smart Diet Planner. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;