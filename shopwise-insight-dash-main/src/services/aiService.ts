// AI Service for SmartCommerce
// This service can be extended to integrate with external AI APIs like OpenAI, Claude, etc.

export interface AIAnalysisRequest {
  query: string;
  data: {
    products: any[];
    sales: any[];
    alerts: any[];
  };
  context?: string;
}

export interface AIAnalysisResponse {
  analysis: string;
  insights: string[];
  recommendations: string[];
  metrics?: Record<string, any>;
}

export class AIService {
  private static instance: AIService;

  private constructor() {}

  public static getInstance(): AIService {
    if (!AIService.instance) {
      AIService.instance = new AIService();
    }
    return AIService.instance;
  }

  // Main analysis method - currently uses local business logic
  // Can be extended to call external AI APIs
  async analyzeBusinessData(request: AIAnalysisRequest): Promise<AIAnalysisResponse> {
    try {
      // For now, use local business logic
      // In the future, this can be replaced with API calls to OpenAI, Claude, etc.
      const analysis = await this.performLocalAnalysis(request);
      
      return {
        analysis: analysis.analysis,
        insights: analysis.insights,
        recommendations: analysis.recommendations,
        metrics: analysis.metrics
      };
    } catch (error) {
      console.error('AI Analysis error:', error);
      throw new Error('Failed to analyze business data');
    }
  }

  // Local business logic analysis (can be replaced with AI API calls)
  private async performLocalAnalysis(request: AIAnalysisRequest): Promise<AIAnalysisResponse> {
    const { query, data } = request;
    const lowerQuery = query.toLowerCase();
    
    // Calculate key metrics
    const totalRevenue = data.sales.reduce((sum: number, s: any) => sum + (s.total_amount || 0), 0);
    const totalProducts = data.products.length;
    const totalSales = data.sales.length;
    const activeAlerts = data.alerts.filter((a: any) => !a.is_resolved).length;
    const avgOrderValue = totalSales > 0 ? totalRevenue / totalSales : 0;

    // Sales analysis
    if (lowerQuery.includes('sales') || lowerQuery.includes('revenue')) {
      const topProducts = this.getTopProducts(data);
      const salesTrend = this.analyzeSalesTrend(data);
      
      return {
        analysis: `📊 **Sales Analysis:**
• Total Revenue: ₹${totalRevenue.toLocaleString()}
• Total Orders: ${totalSales}
• Average Order Value: ₹${avgOrderValue.toFixed(2)}
• Sales Trend: ${salesTrend}
• Top Selling Products: ${topProducts.slice(0, 3).map(p => p.name).join(', ')}

${totalRevenue > 0 ? '🎯 Your business is generating good revenue! Consider focusing on your top-performing products.' : '💡 Start by adding some sales data to get insights.'}`,
        insights: [
          `Revenue: ₹${totalRevenue.toLocaleString()}`,
          `Orders: ${totalSales}`,
          `Average Order: ₹${avgOrderValue.toFixed(2)}`,
          `Trend: ${salesTrend}`
        ],
        recommendations: [
          'Focus marketing on top-performing products',
          'Consider bundling popular items',
          'Analyze peak sales periods for optimization'
        ],
        metrics: {
          totalRevenue,
          totalSales,
          avgOrderValue,
          salesTrend
        }
      };
    }

    // Inventory analysis
    if (lowerQuery.includes('inventory') || lowerQuery.includes('stock') || lowerQuery.includes('products')) {
      const lowStockProducts = data.products.filter((p: any) => (p.quantity || 0) < 10);
      const categories = this.getCategoryDistribution(data);
      
      return {
        analysis: `📦 **Inventory Analysis:**
• Total Products: ${totalProducts}
• Low Stock Items: ${lowStockProducts.length}
• Active Alerts: ${activeAlerts}
• Categories: ${Object.keys(categories).length}

${lowStockProducts.length > 0 ? `⚠️ **Low Stock Alert:** ${lowStockProducts.slice(0, 3).map(p => p.name).join(', ')} need restocking.` : '✅ Your inventory levels look healthy!'}

**Category Distribution:**
${Object.entries(categories).map(([cat, count]) => `• ${cat}: ${count} products`).join('\n')}`,
        insights: [
          `Products: ${totalProducts}`,
          `Low Stock: ${lowStockProducts.length}`,
          `Categories: ${Object.keys(categories).length}`,
          `Alerts: ${activeAlerts}`
        ],
        recommendations: [
          lowStockProducts.length > 0 ? `Restock ${lowStockProducts.length} low-stock products` : 'Inventory levels are optimal',
          'Consider expanding popular categories',
          'Set up automated reorder points'
        ],
        metrics: {
          totalProducts,
          lowStockCount: lowStockProducts.length,
          categoryCount: Object.keys(categories).length,
          activeAlerts
        }
      };
    }

    // Performance analysis
    if (lowerQuery.includes('performance') || lowerQuery.includes('trend') || lowerQuery.includes('growth')) {
      const salesTrend = this.analyzeSalesTrend(data);
      const revenueGrowth = this.calculateRevenueGrowth(data);
      const highDemandProducts = this.getHighDemandProducts(data);
      
      return {
        analysis: `📈 **Performance Analysis:**
• Sales Trend: ${salesTrend}
• Revenue Growth: ${revenueGrowth > 0 ? '+' : ''}${revenueGrowth.toFixed(1)}%
• Products with High Demand: ${highDemandProducts.slice(0, 3).map(p => p.name).join(', ')}

${revenueGrowth > 0 ? '🚀 Great growth! Your business is expanding well.' : '📉 Consider reviewing your pricing strategy or marketing efforts.'}`,
        insights: [
          `Trend: ${salesTrend}`,
          `Growth: ${revenueGrowth > 0 ? '+' : ''}${revenueGrowth.toFixed(1)}%`,
          `High Demand: ${highDemandProducts.length} products`
        ],
        recommendations: [
          revenueGrowth > 0 ? 'Maintain current growth strategies' : 'Review pricing and marketing strategies',
          'Focus on high-demand products',
          'Consider seasonal trends in planning'
        ],
        metrics: {
          salesTrend,
          revenueGrowth,
          highDemandCount: highDemandProducts.length
        }
      };
    }

    // Default response
    return {
      analysis: `I can help you analyze:
• 📊 **Sales & Revenue** - Understand your sales performance
• 📦 **Inventory** - Check stock levels and product distribution  
• 📈 **Performance** - Track trends and growth
• 💡 **Recommendations** - Get AI-powered business advice

Try asking: "How are my sales performing?" or "What inventory insights do you have?"`,
      insights: [
        `Revenue: ₹${totalRevenue.toLocaleString()}`,
        `Products: ${totalProducts}`,
        `Orders: ${totalSales}`,
        `Alerts: ${activeAlerts}`
      ],
      recommendations: [
        'Ask about specific areas for detailed analysis',
        'Use natural language queries',
        'Request recommendations for actionable insights'
      ],
      metrics: {
        totalRevenue,
        totalProducts,
        totalSales,
        activeAlerts
      }
    };
  }

  // Helper methods
  private getTopProducts(data: any): Array<{ name: string; sales: number }> {
    const productSales: Record<string, { name: string; sales: number }> = {};
    data.sales.forEach((s: any) => {
      if (!productSales[s.product_id]) {
        const prod = data.products.find((p: any) => p.product_id === s.product_id);
        productSales[s.product_id] = { name: prod?.name || s.product_id, sales: 0 };
      }
      productSales[s.product_id].sales += s.quantity_sold || 0;
    });
    return Object.values(productSales).sort((a, b) => b.sales - a.sales);
  }

  private getCategoryDistribution(data: any): Record<string, number> {
    const categories: Record<string, number> = {};
    data.products.forEach((p: any) => {
      if (p.category) {
        categories[p.category] = (categories[p.category] || 0) + 1;
      }
    });
    return categories;
  }

  private analyzeSalesTrend(data: any): string {
    if (data.sales.length === 0) return 'No sales data available';
    
    const recentSales = data.sales.slice(-5);
    const olderSales = data.sales.slice(-10, -5);
    
    if (olderSales.length === 0) return 'Insufficient data for trend analysis';
    
    const recentTotal = recentSales.reduce((sum: number, s: any) => sum + (s.total_amount || 0), 0);
    const olderTotal = olderSales.reduce((sum: number, s: any) => sum + (s.total_amount || 0), 0);
    
    if (recentTotal > olderTotal) return '📈 Increasing';
    if (recentTotal < olderTotal) return '📉 Decreasing';
    return '➡️ Stable';
  }

  private calculateRevenueGrowth(data: any): number {
    if (data.sales.length < 2) return 0;
    
    const recentSales = data.sales.slice(-5);
    const olderSales = data.sales.slice(-10, -5);
    
    if (olderSales.length === 0) return 0;
    
    const recentTotal = recentSales.reduce((sum: number, s: any) => sum + (s.total_amount || 0), 0);
    const olderTotal = olderSales.reduce((sum: number, s: any) => sum + (s.total_amount || 0), 0);
    
    if (olderTotal === 0) return recentTotal > 0 ? 100 : 0;
    return ((recentTotal - olderTotal) / olderTotal) * 100;
  }

  private getHighDemandProducts(data: any): Array<{ name: string; sales: number }> {
    return this.getTopProducts(data).filter(p => p.sales > 5);
  }

  // Future: Integration with external AI APIs
  async callExternalAI(prompt: string, data: any): Promise<string> {
    // This method can be implemented to call OpenAI, Claude, or other AI services
    // Example implementation:
    /*
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: 'You are a business analyst helping analyze e-commerce data.'
          },
          {
            role: 'user',
            content: `${prompt}\n\nData: ${JSON.stringify(data)}`
          }
        ]
      })
    });
    
    const result = await response.json();
    return result.choices[0].message.content;
    */
    
    // For now, return a placeholder
    return 'External AI integration coming soon!';
  }
}

export default AIService.getInstance(); 