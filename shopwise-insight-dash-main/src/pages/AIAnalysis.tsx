import Layout from '../components/Layout';
import AIAnalysisBot from '../components/AIAnalysisBot';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Bot, TrendingUp, BarChart3, Lightbulb, Target, MessageSquare } from "lucide-react";
import { useState } from 'react';

const AIAnalysis = () => {
  const [activePrompt, setActivePrompt] = useState<{ query: string, id: number } | null>(null);

  const quickQueries = [
    "How are my sales performing?",
    "What inventory insights do you have?",
    "Give me business recommendations",
    "Show me performance trends"
  ];

  const handleQuickQuery = (query: string) => {
    setActivePrompt({ query, id: Date.now() });
  };

  return (
    <Layout>
      <div className="space-y-8">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center space-x-3 mb-2">
              <div className="p-2 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg">
                <Bot className="h-6 w-6 text-white" />
              </div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                AI Business Analyst
              </h1>
            </div>
            <p className="text-gray-600 mt-1 text-lg">Get intelligent insights and recommendations for your business data.</p>
          </div>
          <div className="mt-4 sm:mt-0">
            <Badge variant="secondary" className="text-sm bg-gradient-to-r from-blue-100 to-purple-100 text-blue-800 border-blue-200">
              <Bot className="mr-1 h-3 w-3" />
              Powered by AI
            </Badge>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="group hover:shadow-xl transition-all duration-300 border-0 bg-gradient-to-br from-blue-50 to-blue-100/50">
            <CardHeader className="pb-3">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-blue-600 rounded-lg group-hover:scale-110 transition-transform duration-300">
                  <TrendingUp className="h-5 w-5 text-white" />
                </div>
                <CardTitle className="text-sm font-semibold text-blue-900">Sales Analysis</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-blue-700 leading-relaxed">
                Understand revenue trends, top products, and sales performance with detailed analytics
              </p>
            </CardContent>
          </Card>

          <Card className="group hover:shadow-xl transition-all duration-300 border-0 bg-gradient-to-br from-green-50 to-green-100/50">
            <CardHeader className="pb-3">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-green-600 rounded-lg group-hover:scale-110 transition-transform duration-300">
                  <BarChart3 className="h-5 w-5 text-white" />
                </div>
                <CardTitle className="text-sm font-semibold text-green-900">Inventory Insights</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-green-700 leading-relaxed">
                Monitor stock levels, category distribution, and restocking needs in real-time
              </p>
            </CardContent>
          </Card>

          <Card className="group hover:shadow-xl transition-all duration-300 border-0 bg-gradient-to-br from-yellow-50 to-yellow-100/50">
            <CardHeader className="pb-3">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-yellow-600 rounded-lg group-hover:scale-110 transition-transform duration-300">
                  <Lightbulb className="h-5 w-5 text-white" />
                </div>
                <CardTitle className="text-sm font-semibold text-yellow-900">Smart Recommendations</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-yellow-700 leading-relaxed">
                Get AI-powered suggestions to optimize your business operations and growth
              </p>
            </CardContent>
          </Card>

          <Card className="group hover:shadow-xl transition-all duration-300 border-0 bg-gradient-to-br from-purple-50 to-purple-100/50">
            <CardHeader className="pb-3">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-purple-600 rounded-lg group-hover:scale-110 transition-transform duration-300">
                  <Target className="h-5 w-5 text-white" />
                </div>
                <CardTitle className="text-sm font-semibold text-purple-900">Performance Tracking</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-purple-700 leading-relaxed">
                Track growth trends and identify improvement opportunities with precision
              </p>
            </CardContent>
          </Card>
        </div>

        {/* AI Chat Interface */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <AIAnalysisBot prompt={activePrompt} />
          </div>
          
          <div className="space-y-6">
            {/* Quick Actions */}
            <Card className="border-0 shadow-lg bg-gradient-to-br from-white to-gray-50/50">
              <CardHeader className="pb-4">
                <div className="flex items-center space-x-2">
                  <MessageSquare className="h-5 w-5 text-blue-600" />
                  <CardTitle className="text-lg font-semibold text-gray-900">Quick Questions</CardTitle>
                </div>
                <CardDescription className="text-gray-600">Try these common queries to get started</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-2">
                  {quickQueries.map((query, index) => (
                    <Button
                      key={index}
                      variant="ghost"
                      className="w-full justify-start text-left p-3 h-auto bg-gray-50 hover:bg-blue-50 hover:text-blue-700 border border-gray-100 hover:border-blue-200 rounded-xl transition-all duration-200 group"
                      onClick={() => handleQuickQuery(query)}
                    >
                      <div className="flex items-start space-x-3">
                        <div className="w-2 h-2 bg-blue-400 rounded-full mt-2 group-hover:scale-125 transition-transform duration-200"></div>
                        <span className="text-sm font-medium leading-relaxed">{query}</span>
                      </div>
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Tips */}
            <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-50 to-purple-50/30">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg font-semibold text-blue-900 flex items-center space-x-2">
                  <span className="text-2xl">💡</span>
                  <span>Pro Tips</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-blue-400 rounded-full mt-2"></div>
                    <p className="text-sm text-blue-800">Ask specific questions for detailed insights</p>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-purple-400 rounded-full mt-2"></div>
                    <p className="text-sm text-purple-800">Use natural language - the AI understands context</p>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-green-400 rounded-full mt-2"></div>
                    <p className="text-sm text-green-800">Request recommendations for actionable advice</p>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-yellow-400 rounded-full mt-2"></div>
                    <p className="text-sm text-yellow-800">Ask about trends to understand patterns</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Stats Card */}
            <Card className="border-0 shadow-lg bg-gradient-to-br from-gray-50 to-white">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg font-semibold text-gray-900">AI Capabilities</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-100">
                    <span className="text-sm font-medium text-gray-700">Analysis Types</span>
                    <Badge variant="secondary" className="bg-blue-100 text-blue-800">4+</Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-100">
                    <span className="text-sm font-medium text-gray-700">Data Sources</span>
                    <Badge variant="secondary" className="bg-green-100 text-green-800">3</Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-100">
                    <span className="text-sm font-medium text-gray-700">Response Time</span>
                    <Badge variant="secondary" className="bg-purple-100 text-purple-800">Instant</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default AIAnalysis; 