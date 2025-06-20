
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, BarChart3, TrendingUp, AlertCircle, FileText } from "lucide-react";
import { Link } from "react-router-dom";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <header className="px-6 py-4 flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <BarChart3 className="h-8 w-8 text-blue-600" />
          <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            SmartCommerce
          </span>
        </div>
        <Link to="/login">
          <Button variant="outline" className="hover:bg-blue-50">
            Sign In
          </Button>
        </Link>
      </header>

      {/* Hero Section */}
      <section className="px-6 py-20 text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
            Transform Your Business
            <br />
            <span className="text-4xl md:text-5xl">with Smart Analytics</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Stop guessing what to stock. Our AI-powered dashboard helps small businesses like yours 
            identify dead stock, predict demand spikes, and optimize inventory effortlessly.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            <Link to="/login">
              <Button size="lg" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-6 text-lg">
                Start Free Trial
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Button variant="outline" size="lg" className="px-8 py-6 text-lg hover:bg-gray-50">
              Watch Demo
            </Button>
          </div>

          {/* Hero Image Placeholder */}
          <div className="relative">
            <div className="bg-gradient-to-r from-blue-100 to-purple-100 rounded-2xl p-8 shadow-2xl">
              <div className="bg-white rounded-xl p-6 shadow-lg">
                <div className="grid grid-cols-3 gap-4 mb-6">
                  <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                    <TrendingUp className="h-8 w-8 text-green-600 mb-2" />
                    <div className="text-sm text-gray-600">Total Sales</div>
                    <div className="text-2xl font-bold text-green-600">₹2,45,000</div>
                  </div>
                  <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                    <BarChart3 className="h-8 w-8 text-blue-600 mb-2" />
                    <div className="text-sm text-gray-600">Products</div>
                    <div className="text-2xl font-bold text-blue-600">1,247</div>
                  </div>
                  <div className="bg-red-50 p-4 rounded-lg border border-red-200">
                    <AlertCircle className="h-8 w-8 text-red-600 mb-2" />
                    <div className="text-sm text-gray-600">Alerts</div>
                    <div className="text-2xl font-bold text-red-600">23</div>
                  </div>
                </div>
                <div className="h-32 bg-gradient-to-r from-blue-200 to-purple-200 rounded-lg flex items-center justify-center">
                  <span className="text-gray-600 font-medium">📊 Beautiful Charts & Analytics</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="px-6 py-20 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-16 text-gray-800">
            Everything You Need to Win
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="p-6 hover:shadow-lg transition-shadow border-0 shadow-md">
              <CardContent className="p-0">
                <div className="bg-blue-100 p-3 rounded-lg w-fit mb-4">
                  <FileText className="h-8 w-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Smart CSV Upload</h3>
                <p className="text-gray-600">
                  Upload your sales data and get instant insights. Our system automatically 
                  detects patterns and anomalies in your inventory.
                </p>
              </CardContent>
            </Card>

            <Card className="p-6 hover:shadow-lg transition-shadow border-0 shadow-md">
              <CardContent className="p-0">
                <div className="bg-red-100 p-3 rounded-lg w-fit mb-4">
                  <AlertCircle className="h-8 w-8 text-red-600" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Anomaly Detection</h3>
                <p className="text-gray-600">
                  Get alerts for dead stock, overstock situations, and demand spikes. 
                  Never miss an opportunity or waste money again.
                </p>
              </CardContent>
            </Card>

            <Card className="p-6 hover:shadow-lg transition-shadow border-0 shadow-md">
              <CardContent className="p-0">
                <div className="bg-green-100 p-3 rounded-lg w-fit mb-4">
                  <TrendingUp className="h-8 w-8 text-green-600" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Beautiful Reports</h3>
                <p className="text-gray-600">
                  Generate professional reports for your accountant or investors. 
                  Export to PDF with one click.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="px-6 py-20 bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-4 text-gray-800">
            Simple, Transparent Pricing
          </h2>
          <p className="text-xl text-gray-600 mb-12">
            Start free, scale as you grow
          </p>
          
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="p-6 border-2 border-gray-200 hover:border-blue-300 transition-colors">
              <CardContent className="p-0 text-center">
                <h3 className="text-2xl font-bold mb-2">Free</h3>
                <div className="text-4xl font-bold text-blue-600 mb-4">₹0</div>
                <ul className="space-y-2 text-left mb-6">
                  <li>✅ 100 products</li>
                  <li>✅ Basic analytics</li>
                  <li>✅ 1 user</li>
                  <li>❌ Advanced alerts</li>
                </ul>
                <Button className="w-full" variant="outline">
                  Get Started
                </Button>
              </CardContent>
            </Card>

            <Card className="p-6 border-2 border-blue-500 relative overflow-hidden">
              <div className="absolute top-0 right-0 bg-blue-500 text-white px-4 py-1 text-sm font-medium">
                Most Popular
              </div>
              <CardContent className="p-0 text-center">
                <h3 className="text-2xl font-bold mb-2">Pro</h3>
                <div className="text-4xl font-bold text-blue-600 mb-4">₹999<span className="text-lg">/mo</span></div>
                <ul className="space-y-2 text-left mb-6">
                  <li>✅ 10,000 products</li>
                  <li>✅ Advanced analytics</li>
                  <li>✅ 5 users</li>
                  <li>✅ Smart alerts</li>
                </ul>
                <Button className="w-full bg-blue-600 hover:bg-blue-700">
                  Start Pro Trial
                </Button>
              </CardContent>
            </Card>

            <Card className="p-6 border-2 border-gray-200 hover:border-purple-300 transition-colors">
              <CardContent className="p-0 text-center">
                <h3 className="text-2xl font-bold mb-2">Business</h3>
                <div className="text-4xl font-bold text-purple-600 mb-4">₹2,999<span className="text-lg">/mo</span></div>
                <ul className="space-y-2 text-left mb-6">
                  <li>✅ Unlimited products</li>
                  <li>✅ Custom reports</li>
                  <li>✅ Unlimited users</li>
                  <li>✅ API access</li>
                </ul>
                <Button className="w-full bg-purple-600 hover:bg-purple-700">
                  Contact Sales
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-6 py-12 bg-gray-900 text-white">
        <div className="max-w-6xl mx-auto text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <BarChart3 className="h-8 w-8 text-blue-400" />
            <span className="text-2xl font-bold">SmartCommerce</span>
          </div>
          <p className="text-gray-400 mb-4">
            Built for the future of small business analytics
          </p>
          <div className="text-sm text-gray-500">
          © CodeForge. Built with passion, tailored for small business growth.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
