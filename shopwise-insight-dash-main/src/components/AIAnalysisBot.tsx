import { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Bot, Send, User, Sparkles, Loader2 } from "lucide-react";
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import aiService from '../services/aiService';

interface Message {
  id: string;
  type: 'user' | 'bot';
  content: string;
  timestamp: Date;
  analysis?: any;
}

interface AIAnalysisBotProps {
  prompt?: { query: string; id: number } | null;
}

const AIAnalysisBot = ({ prompt }: AIAnalysisBotProps) => {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState<any>({});
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  // Initialize with welcome message
  useEffect(() => {
    if (messages.length === 0) {
      setMessages([{
        id: '1',
        type: 'bot',
        content: "Hello! I'm your AI business analyst. I can help you understand your sales data, inventory trends, and provide actionable insights. What would you like to know about your business?",
        timestamp: new Date()
      }]);
    }
  }, []);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages]);

  // Handle incoming prompt from props
  useEffect(() => {
    if (prompt) {
      handleSendMessage(prompt.query);
    }
  }, [prompt]);

  // Fetch data when component mounts
  useEffect(() => {
    if (user) {
      fetchBusinessData();
    }
  }, [user]);

  const fetchBusinessData = async () => {
    try {
      const [{ data: productsData }, { data: salesData }, { data: alertsData }] = await Promise.all([
        supabase.from('products').select('*').eq('user_id', user?.id),
        supabase.from('sales_data').select('*').eq('user_id', user?.id),
        supabase.from('inventory_alerts').select('*').eq('user_id', user?.id),
      ]);

      setData({
        products: productsData || [],
        sales: salesData || [],
        alerts: alertsData || []
      });
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleSendMessage = async (queryOverride?: string) => {
    const query = (queryOverride || input).trim();
    if (!query || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: query,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    if (!queryOverride) {
      setInput('');
    }
    setIsLoading(true);

    try {
      // Use the AI service for analysis
      const response = await aiService.analyzeBusinessData({
        query: query,
        data: data
      });

      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'bot',
        content: response.analysis,
        timestamp: new Date(),
        analysis: response
      };

      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'bot',
        content: 'Sorry, I encountered an error while analyzing your data. Please try again.',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    }

    setIsLoading(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <Card className="w-full h-[600px] flex flex-col bg-gradient-to-br from-white to-blue-50/30 border-0 shadow-xl">
      <CardHeader className="flex flex-row items-center space-y-0 pb-4 border-b border-gray-100 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-t-lg">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-white/20 rounded-full">
            <Bot className="h-5 w-5 text-white" />
          </div>
          <div>
            <CardTitle className="text-lg font-semibold text-white">AI Business Analyst</CardTitle>
            <p className="text-xs text-blue-100 mt-1">Powered by intelligent insights</p>
          </div>
        </div>
        <Badge variant="secondary" className="ml-auto bg-white/20 text-white border-white/30">
          <Sparkles className="h-3 w-3 mr-1" />
          Smart Insights
        </Badge>
      </CardHeader>
      
      <CardContent className="flex-1 flex flex-col p-0 bg-white">
        <ScrollArea className="flex-1 px-6 py-4" ref={scrollAreaRef}>
          <div className="space-y-6 pb-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl px-4 py-3 shadow-sm ${
                    message.type === 'user'
                      ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white'
                      : 'bg-gray-50 text-gray-900 border border-gray-100'
                  }`}
                >
                  <div className="flex items-center space-x-2 mb-2">
                    {message.type === 'user' ? (
                      <div className="flex items-center space-x-2">
                        <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center">
                          <User className="h-3 w-3 text-white" />
                        </div>
                        <span className="text-xs opacity-80 font-medium">You</span>
                      </div>
                    ) : (
                      <div className="flex items-center space-x-2">
                        <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
                          <Bot className="h-3 w-3 text-blue-600" />
                        </div>
                        <span className="text-xs text-gray-500 font-medium">AI Analyst</span>
                      </div>
                    )}
                    <span className="text-xs opacity-60">
                      {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <div className="whitespace-pre-wrap text-sm leading-relaxed">
                    {message.content}
                  </div>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-gray-50 rounded-2xl px-4 py-3 border border-gray-100 shadow-sm">
                  <div className="flex items-center space-x-3">
                    <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
                      <Bot className="h-3 w-3 text-blue-600" />
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-xs text-gray-500 font-medium">AI Analyst</span>
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                        <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </ScrollArea>
        
        <div className="border-t border-gray-100 p-4 bg-gray-50/50">
          <div className="flex space-x-3">
            <div className="flex-1 relative">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask about your business data..."
                className="w-full pl-4 pr-12 py-3 bg-white border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 placeholder:text-gray-400"
                disabled={isLoading}
              />
              <Button
                onClick={() => handleSendMessage()}
                disabled={!input.trim() || isLoading}
                size="icon"
                className="absolute right-2 top-1/2 transform -translate-y-1/2 w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Send className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>
          <div className="mt-3 text-xs text-gray-500 text-center">
            Press Enter to send • Shift + Enter for new line
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AIAnalysisBot; 