import Layout from '../components/Layout';
import AIAnalysisBot from '../components/AIAnalysisBot';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Bot, TrendingUp, BarChart3, Lightbulb, Target, MessageSquare, Users, DollarSign, Package, ChartLine, Zap } from "lucide-react";
import { useState } from 'react';

const AIAnalysis = () => {
  const [activePrompt, setActivePrompt] = useState<{ query: string, id: number } | null>(null);

  const quickQueries = {
    sales: [
      "How are my sales performing this month?",
      "What are my top-selling products?",
      "Show me revenue trends and growth",
      "Which categories generate the most revenue?",
      "What's my average order value?"
    ],
    inventory: [
      "What inventory insights do you have?",
      "Which products need restocking?",
      "Show me low stock alerts",
      "What's my total inventory value?",
      "Which categories have the most products?"
    ],
    customers: [
      "Analyze my customer behavior",
      "Who are my top customers?",
      "What's my customer retention rate?",
      "Show me customer segments",
      "How can I improve customer loyalty?"
    ],
    performance: [
      "Give me business performance analysis",
      "Show me growth trends",
      "What are the seasonal patterns?",
      "Identify growth opportunities",
      "How is my business performing overall?"
    ],
    profitability: [
      "Analyze my profit margins",
      "Which products are most profitable?",
      "What's my cost structure?",
      "How can I improve profitability?",
      "Show me pricing insights"
    ],
    recommendations: [
      "Give me business recommendations",
      "What should I focus on to grow?",
      "Identify immediate action items",
      "What are the biggest opportunities?",
      "How can I optimize my operations?"
    ]
  };

  const handleQuickQuery = (query: string) => {
    setActivePrompt({ query, id: Date.now() });
  };

  return (
    <Layout>
      <div className="space-y-8">
        {/* Enhanced Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center space-x-3 mb-2">
              <div className="p-3 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl shadow-lg">
                <Bot className="h-7 w-7 text-white" />
              </div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                AI Business Analyst
              </h1>
            </div>
            <p className="text-gray-600 mt-2 text-xl">Get intelligent insights and recommendations for your business data.</p>
          </div>
          <div className="mt-4 sm:mt-0">
            <Badge variant="secondary" className="text-lg bg-gradient-to-r from-blue-100 to-purple-100 text-blue-800 border-blue-200 px-4 py-2">
              <Bot className="mr-2 h-4 w-4" />
              Powered by AI
            </Badge>
          </div>
        </div>

        {/* Enhanced Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="group hover:shadow-2xl transition-all duration-500 border-0 bg-gradient-to-br from-blue-50 to-blue-100/50 transform hover:scale-105">
            <CardHeader className="pb-3">
              <div className="flex items-center space-x-3">
                <div className="p-3 bg-blue-600 rounded-xl group-hover:scale-110 transition-transform duration-300 shadow-lg">
                  <TrendingUp className="h-6 w-6 text-white" />
                </div>
                <CardTitle className="text-lg font-bold text-blue-900">Sales Analysis</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-blue-700 leading-relaxed">
                Understand revenue trends, top products, and sales performance with detailed analytics
              </p>
            </CardContent>
          </Card>

          <Card className="group hover:shadow-2xl transition-all duration-500 border-0 bg-gradient-to-br from-green-50 to-green-100/50 transform hover:scale-105">
            <CardHeader className="pb-3">
              <div className="flex items-center space-x-3">
                <div className="p-3 bg-green-600 rounded-xl group-hover:scale-110 transition-transform duration-300 shadow-lg">
                  <Package className="h-6 w-6 text-white" />
                </div>
                <CardTitle className="text-lg font-bold text-green-900">Inventory Insights</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-green-700 leading-relaxed">
                Monitor stock levels, category distribution, and restocking needs in real-time
              </p>
            </CardContent>
          </Card>

          <Card className="group hover:shadow-2xl transition-all duration-500 border-0 bg-gradient-to-br from-purple-50 to-purple-100/50 transform hover:scale-105">
            <CardHeader className="pb-3">
              <div className="flex items-center space-x-3">
                <div className="p-3 bg-purple-600 rounded-xl group-hover:scale-110 transition-transform duration-300 shadow-lg">
                  <Users className="h-6 w-6 text-white" />
                </div>
                <CardTitle className="text-lg font-bold text-purple-900">Customer Analysis</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-purple-700 leading-relaxed">
                Analyze customer behavior, segments, and retention patterns for better engagement
              </p>
            </CardContent>
          </Card>

          <Card className="group hover:shadow-2xl transition-all duration-500 border-0 bg-gradient-to-br from-yellow-50 to-yellow-100/50 transform hover:scale-105">
            <CardHeader className="pb-3">
              <div className="flex items-center space-x-3">
                <div className="p-3 bg-yellow-600 rounded-xl group-hover:scale-110 transition-transform duration-300 shadow-lg">
                  <DollarSign className="h-6 w-6 text-white" />
                </div>
                <CardTitle className="text-lg font-bold text-yellow-900">Profitability</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-yellow-700 leading-relaxed">
                Review margins, costs, and pricing strategies to optimize profitability
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
              <CardContent className="space-y-4">
                {/* Sales Queries */}
                <div>
                  <div className="flex items-center space-x-2 mb-3">
                    <TrendingUp className="h-4 w-4 text-blue-600" />
                    <h4 className="font-semibold text-blue-900">Sales & Revenue</h4>
                  </div>
                  <div className="space-y-2">
                    {quickQueries.sales.map((query, index) => (
                      <Button
                        key={index}
                        variant="ghost"
                        className="w-full justify-start text-left p-3 h-auto bg-blue-50 hover:bg-blue-100 hover:text-blue-700 border border-blue-100 hover:border-blue-200 rounded-xl transition-all duration-200 group"
                        onClick={() => handleQuickQuery(query)}
                      >
                        <div className="flex items-start space-x-3">
                          <div className="w-2 h-2 bg-blue-400 rounded-full mt-2 group-hover:scale-125 transition-transform duration-200"></div>
                          <span className="text-sm font-medium leading-relaxed">{query}</span>
                        </div>
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Inventory Queries */}
                <div>
                  <div className="flex items-center space-x-2 mb-3">
                    <Package className="h-4 w-4 text-green-600" />
                    <h4 className="font-semibold text-green-900">Inventory</h4>
                  </div>
                  <div className="space-y-2">
                    {quickQueries.inventory.map((query, index) => (
                      <Button
                        key={index}
                        variant="ghost"
                        className="w-full justify-start text-left p-3 h-auto bg-green-50 hover:bg-green-100 hover:text-green-700 border border-green-100 hover:border-green-200 rounded-xl transition-all duration-200 group"
                        onClick={() => handleQuickQuery(query)}
                      >
                        <div className="flex items-start space-x-3">
                          <div className="w-2 h-2 bg-green-400 rounded-full mt-2 group-hover:scale-125 transition-transform duration-200"></div>
                          <span className="text-sm font-medium leading-relaxed">{query}</span>
                        </div>
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Customer Queries */}
                <div>
                  <div className="flex items-center space-x-2 mb-3">
                    <Users className="h-4 w-4 text-purple-600" />
                    <h4 className="font-semibold text-purple-900">Customers</h4>
                  </div>
                  <div className="space-y-2">
                    {quickQueries.customers.map((query, index) => (
                      <Button
                        key={index}
                        variant="ghost"
                        className="w-full justify-start text-left p-3 h-auto bg-purple-50 hover:bg-purple-100 hover:text-purple-700 border border-purple-100 hover:border-purple-200 rounded-xl transition-all duration-200 group"
                        onClick={() => handleQuickQuery(query)}
                      >
                        <div className="flex items-start space-x-3">
                          <div className="w-2 h-2 bg-purple-400 rounded-full mt-2 group-hover:scale-125 transition-transform duration-200"></div>
                          <span className="text-sm font-medium leading-relaxed">{query}</span>
                        </div>
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Performance Queries */}
                <div>
                  <div className="flex items-center space-x-2 mb-3">
                    <ChartLine className="h-4 w-4 text-orange-600" />
                    <h4 className="font-semibold text-orange-900">Performance</h4>
                  </div>
                  <div className="space-y-2">
                    {quickQueries.performance.map((query, index) => (
                      <Button
                        key={index}
                        variant="ghost"
                        className="w-full justify-start text-left p-3 h-auto bg-orange-50 hover:bg-orange-100 hover:text-orange-700 border border-orange-100 hover:border-orange-200 rounded-xl transition-all duration-200 group"
                        onClick={() => handleQuickQuery(query)}
                      >
                        <div className="flex items-start space-x-3">
                          <div className="w-2 h-2 bg-orange-400 rounded-full mt-2 group-hover:scale-125 transition-transform duration-200"></div>
                          <span className="text-sm font-medium leading-relaxed">{query}</span>
                        </div>
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Profitability Queries */}
                <div>
                  <div className="flex items-center space-x-2 mb-3">
                    <DollarSign className="h-4 w-4 text-yellow-600" />
                    <h4 className="font-semibold text-yellow-900">Profitability</h4>
                  </div>
                  <div className="space-y-2">
                    {quickQueries.profitability.map((query, index) => (
                      <Button
                        key={index}
                        variant="ghost"
                        className="w-full justify-start text-left p-3 h-auto bg-yellow-50 hover:bg-yellow-100 hover:text-yellow-700 border border-yellow-100 hover:border-yellow-200 rounded-xl transition-all duration-200 group"
                        onClick={() => handleQuickQuery(query)}
                      >
                        <div className="flex items-start space-x-3">
                          <div className="w-2 h-2 bg-yellow-400 rounded-full mt-2 group-hover:scale-125 transition-transform duration-200"></div>
                          <span className="text-sm font-medium leading-relaxed">{query}</span>
                        </div>
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Recommendations */}
                <div>
                  <div className="flex items-center space-x-2 mb-3">
                    <Zap className="h-4 w-4 text-indigo-600" />
                    <h4 className="font-semibold text-indigo-900">Recommendations</h4>
                  </div>
                  <div className="space-y-2">
                    {quickQueries.recommendations.map((query, index) => (
                      <Button
                        key={index}
                        variant="ghost"
                        className="w-full justify-start text-left p-3 h-auto bg-indigo-50 hover:bg-indigo-100 hover:text-indigo-700 border border-indigo-100 hover:border-indigo-200 rounded-xl transition-all duration-200 group"
                        onClick={() => handleQuickQuery(query)}
                      >
                        <div className="flex items-start space-x-3">
                          <div className="w-2 h-2 bg-indigo-400 rounded-full mt-2 group-hover:scale-125 transition-transform duration-200"></div>
                          <span className="text-sm font-medium leading-relaxed">{query}</span>
                        </div>
                      </Button>
                    ))}
                  </div>
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
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-indigo-400 rounded-full mt-2"></div>
                    <p className="text-sm text-indigo-800">Explore customer behavior for growth opportunities</p>
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
                    <Badge variant="secondary" className="bg-blue-100 text-blue-800">6+</Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-100">
                    <span className="text-sm font-medium text-gray-700">Data Sources</span>
                    <Badge variant="secondary" className="bg-green-100 text-green-800">3</Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-100">
                    <span className="text-sm font-medium text-gray-700">Quick Queries</span>
                    <Badge variant="secondary" className="bg-purple-100 text-purple-800">30+</Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-100">
                    <span className="text-sm font-medium text-gray-700">Response Time</span>
                    <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">Instant</Badge>
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