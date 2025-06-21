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
    const topProducts = this.getTopProducts(data);
    const bestSellingCategories = this.getBestSellingCategories(data);
    const customerInsights = this.analyzeCustomerBehavior(data);
    const repeatCustomers = this.getRepeatCustomers(data);
    const customerSegments = this.getCustomerSegments(data);
    const salesTrend = this.analyzeSalesTrend(data);
    const revenueGrowth = this.calculateRevenueGrowth(data);
    const highDemandProducts = this.getHighDemandProducts(data);
    const seasonalTrends = this.analyzeSeasonalTrends(data);
    const lowStockProducts = data.products.filter((p: any) => (p.quantity || 0) < 10);
    const outOfStockProducts = data.products.filter((p: any) => (p.quantity || 0) === 0);
    const categories = this.getCategoryDistribution(data);
    const inventoryValue = this.calculateInventoryValue(data);
    const profitabilityMetrics = this.analyzeProfitability(data);
    const highMarginProducts = this.getHighMarginProducts(data);
    const pricingInsights = this.getPricingInsights(data);
    const recommendations = this.getBusinessRecommendations(data);
    const opportunities = this.identifyOpportunities(data);

    // --- SALES ---
    if (lowerQuery.includes('top-selling product')) {
      return {
        analysis: `🏆 **Top-Selling Products:**\n${topProducts.slice(0, 5).map((p, i) => `${i + 1}. ${p.name} - ${p.sales} units`).join('\n')}`,
        insights: [
          `Top Product: ${topProducts[0]?.name || 'N/A'}`
        ],
        recommendations: [
          'Promote your best sellers for higher revenue',
          'Consider bundling top products'
        ],
        metrics: { topProducts: topProducts.slice(0, 5) }
      };
    }
    if (lowerQuery.includes('average order value')) {
      return {
        analysis: `💸 **Average Order Value:**\nYour average order value is ₹${avgOrderValue.toFixed(2)}.`,
        insights: [
          `Average Order Value: ₹${avgOrderValue.toFixed(2)}`
        ],
        recommendations: [
          'Upsell or cross-sell to increase order value',
          'Offer free shipping above a threshold'
        ],
        metrics: { avgOrderValue }
      };
    }
    if (lowerQuery.includes('revenue trend') || lowerQuery.includes('revenue growth')) {
      return {
        analysis: `📈 **Revenue Trend:**\n${salesTrend}\nGrowth: ${revenueGrowth > 0 ? '+' : ''}${revenueGrowth.toFixed(1)}%`,
        insights: [
          `Trend: ${salesTrend}`,
          `Growth: ${revenueGrowth.toFixed(1)}%`
        ],
        recommendations: [
          revenueGrowth > 0 ? 'Maintain current growth strategies' : 'Review pricing and marketing',
        ],
        metrics: { salesTrend, revenueGrowth }
      };
    }
    if (lowerQuery.includes('categories generate the most revenue') || lowerQuery.includes('best selling categories')) {
      return {
        analysis: `🏷️ **Best Selling Categories:**\n${bestSellingCategories.slice(0, 3).map(cat => `• ${cat.category}: ₹${cat.revenue.toLocaleString()}`).join('\n')}`,
        insights: [
          ...bestSellingCategories.slice(0, 3).map(cat => `${cat.category}: ₹${cat.revenue.toLocaleString()}`)
        ],
        recommendations: [
          'Expand popular categories',
          'Promote best-selling categories'
        ],
        metrics: { bestSellingCategories: bestSellingCategories.slice(0, 3) }
      };
    }
    if (lowerQuery.includes('sales performing')) {
      return {
        analysis: `📊 **Sales Performance:**\nTotal Revenue: ₹${totalRevenue.toLocaleString()}\nTotal Orders: ${totalSales}\nTrend: ${salesTrend}`,
        insights: [
          `Revenue: ₹${totalRevenue.toLocaleString()}`,
          `Orders: ${totalSales}`,
          `Trend: ${salesTrend}`
        ],
        recommendations: [
          'Focus on top-performing products',
          'Analyze peak sales periods'
        ],
        metrics: { totalRevenue, totalSales, salesTrend }
      };
    }

    // --- INVENTORY ---
    if (lowerQuery.includes('need restocking') || lowerQuery.includes('low stock alert')) {
      return {
        analysis: `⚠️ **Low Stock Products:**\n${lowStockProducts.length > 0 ? lowStockProducts.slice(0, 5).map(p => `${p.name} (${p.quantity})`).join(', ') : 'No products need restocking.'}`,
        insights: [
          `Low Stock: ${lowStockProducts.length}`
        ],
        recommendations: [
          'Restock low inventory items',
          'Set up automated reorder points'
        ],
        metrics: { lowStockProducts: lowStockProducts.slice(0, 5) }
      };
    }
    if (lowerQuery.includes('out of stock')) {
      return {
        analysis: `🚨 **Out of Stock Products:**\n${outOfStockProducts.length > 0 ? outOfStockProducts.slice(0, 5).map(p => p.name).join(', ') : 'No products are out of stock.'}`,
        insights: [
          `Out of Stock: ${outOfStockProducts.length}`
        ],
        recommendations: [
          'Urgently restock out-of-stock items'
        ],
        metrics: { outOfStockProducts: outOfStockProducts.slice(0, 5) }
      };
    }
    if (lowerQuery.includes('inventory value')) {
      return {
        analysis: `💰 **Total Inventory Value:**\n₹${inventoryValue.toLocaleString()}`,
        insights: [
          `Inventory Value: ₹${inventoryValue.toLocaleString()}`
        ],
        recommendations: [
          'Monitor inventory value for cash flow management'
        ],
        metrics: { inventoryValue }
      };
    }
    if (lowerQuery.includes('category distribution') || lowerQuery.includes('categories have the most products')) {
      return {
        analysis: `📦 **Category Distribution:**\n${Object.entries(categories).map(([cat, count]) => `• ${cat}: ${count} products`).join('\n')}`,
        insights: [
          ...Object.entries(categories).map(([cat, count]) => `${cat}: ${count} products`)
        ],
        recommendations: [
          'Expand popular categories',
          'Analyze slow-moving categories'
        ],
        metrics: { categories }
      };
    }
    if (lowerQuery.includes('inventory insights')) {
      return {
        analysis: `📦 **Inventory Overview:**\nTotal Products: ${totalProducts}\nLow Stock: ${lowStockProducts.length}\nOut of Stock: ${outOfStockProducts.length}`,
        insights: [
          `Products: ${totalProducts}`,
          `Low Stock: ${lowStockProducts.length}`,
          `Out of Stock: ${outOfStockProducts.length}`
        ],
        recommendations: [
          'Restock low and out-of-stock items',
          'Monitor inventory regularly'
        ],
        metrics: { totalProducts, lowStock: lowStockProducts.length, outOfStock: outOfStockProducts.length }
      };
    }

    // --- CUSTOMERS ---
    if (lowerQuery.includes('customer retention')) {
      return {
        analysis: `🔄 **Customer Retention Rate:**\n${customerInsights.retentionRate.toFixed(1)}%`,
        insights: [
          `Retention Rate: ${customerInsights.retentionRate.toFixed(1)}%`
        ],
        recommendations: [
          'Implement loyalty programs',
          'Engage repeat customers'
        ],
        metrics: { retentionRate: customerInsights.retentionRate }
      };
    }
    if (lowerQuery.includes('top customers')) {
      return {
        analysis: `👑 **Top Customers:**\n${customerInsights.topCustomers.slice(0, 3).map((c, i) => `${i + 1}. ${c.name || 'Customer ' + c.id}: ₹${c.totalSpent.toLocaleString()}`).join('\n')}`,
        insights: [
          ...customerInsights.topCustomers.slice(0, 3).map(c => `${c.name || 'Customer ' + c.id}: ₹${c.totalSpent.toLocaleString()}`)
        ],
        recommendations: [
          'Reward top customers',
          'Personalize offers for high-value clients'
        ],
        metrics: { topCustomers: customerInsights.topCustomers.slice(0, 3) }
      };
    }
    if (lowerQuery.includes('customer segment')) {
      return {
        analysis: `📊 **Customer Segments:**\n${customerSegments.map(segment => `• ${segment.type}: ${segment.count} customers (${segment.percentage.toFixed(1)}%)`).join('\n')}`,
        insights: [
          ...customerSegments.map(segment => `${segment.type}: ${segment.count} (${segment.percentage.toFixed(1)}%)`)
        ],
        recommendations: [
          'Target marketing by segment',
          'Develop offers for high-value segments'
        ],
        metrics: { customerSegments }
      };
    }
    if (lowerQuery.includes('customer behavior')) {
      return {
        analysis: `👥 **Customer Behavior:**\nTotal Customers: ${customerInsights.totalCustomers}\nRepeat Customers: ${customerInsights.repeatCustomers}`,
        insights: [
          `Total Customers: ${customerInsights.totalCustomers}`,
          `Repeat Customers: ${customerInsights.repeatCustomers}`
        ],
        recommendations: [
          'Analyze repeat purchase patterns',
          'Engage new customers for retention'
        ],
        metrics: { totalCustomers: customerInsights.totalCustomers, repeatCustomers: customerInsights.repeatCustomers }
      };
    }
    if (lowerQuery.includes('customer loyalty')) {
      return {
        analysis: `💎 **Customer Loyalty:**\nRepeat Customers: ${customerInsights.repeatCustomers}\nRetention Rate: ${customerInsights.retentionRate.toFixed(1)}%`,
        insights: [
          `Repeat Customers: ${customerInsights.repeatCustomers}`,
          `Retention Rate: ${customerInsights.retentionRate.toFixed(1)}%`
        ],
        recommendations: [
          'Launch loyalty programs',
          'Reward frequent buyers'
        ],
        metrics: { repeatCustomers: customerInsights.repeatCustomers, retentionRate: customerInsights.retentionRate }
      };
    }

    // --- PERFORMANCE ---
    if (lowerQuery.includes('seasonal pattern')) {
      return {
        analysis: `📅 **Seasonal Pattern:**\n${seasonalTrends}`,
        insights: [
          `Seasonal Pattern: ${seasonalTrends}`
        ],
        recommendations: [
          'Plan inventory for peak/off seasons',
          'Adjust marketing for seasonal trends'
        ],
        metrics: { seasonalTrends }
      };
    }
    if (lowerQuery.includes('growth opportunity')) {
      return {
        analysis: `🚀 **Growth Opportunities:**\n${opportunities.join('\n')}`,
        insights: opportunities,
        recommendations: [
          'Focus on identified opportunities',
          'Invest in growth areas'
        ],
        metrics: { opportunities }
      };
    }
    if (lowerQuery.includes('business performing')) {
      return {
        analysis: `📈 **Business Performance:**\nRevenue: ₹${totalRevenue.toLocaleString()}\nOrders: ${totalSales}\nTrend: ${salesTrend}`,
        insights: [
          `Revenue: ₹${totalRevenue.toLocaleString()}`,
          `Orders: ${totalSales}`,
          `Trend: ${salesTrend}`
        ],
        recommendations: [
          'Review performance regularly',
          'Optimize for growth'
        ],
        metrics: { totalRevenue, totalSales, salesTrend }
      };
    }
    if (lowerQuery.includes('growth trend')) {
      return {
        analysis: `📈 **Growth Trend:**\n${salesTrend}\nGrowth: ${revenueGrowth.toFixed(1)}%`,
        insights: [
          `Trend: ${salesTrend}`,
          `Growth: ${revenueGrowth.toFixed(1)}%`
        ],
        recommendations: [
          'Capitalize on positive trends',
          'Address negative trends quickly'
        ],
        metrics: { salesTrend, revenueGrowth }
      };
    }
    if (lowerQuery.includes('performance analysis')) {
      return {
        analysis: `📊 **Performance Analysis:**\nTrend: ${salesTrend}\nHigh Demand Products: ${highDemandProducts.slice(0, 3).map(p => p.name).join(', ')}`,
        insights: [
          `Trend: ${salesTrend}`,
          `High Demand: ${highDemandProducts.length}`
        ],
        recommendations: [
          'Focus on high-demand products',
          'Monitor performance regularly'
        ],
        metrics: { salesTrend, highDemandProducts: highDemandProducts.slice(0, 3) }
      };
    }

    // --- PROFITABILITY ---
    if (lowerQuery.includes('profit margin')) {
      return {
        analysis: `💰 **Profit Margin:**\nGross Margin: ${profitabilityMetrics.grossMargin.toFixed(1)}%\nNet Profit: ₹${profitabilityMetrics.netProfit.toLocaleString()}`,
        insights: [
          `Gross Margin: ${profitabilityMetrics.grossMargin.toFixed(1)}%`,
          `Net Profit: ₹${profitabilityMetrics.netProfit.toLocaleString()}`
        ],
        recommendations: [
          'Review pricing and costs',
          'Focus on high-margin products'
        ],
        metrics: { grossMargin: profitabilityMetrics.grossMargin, netProfit: profitabilityMetrics.netProfit }
      };
    }
    if (lowerQuery.includes('most profitable')) {
      return {
        analysis: `💎 **Most Profitable Products:**\n${highMarginProducts.slice(0, 3).map(p => `${p.name}: ${p.margin.toFixed(1)}% margin`).join('\n')}`,
        insights: [
          ...highMarginProducts.slice(0, 3).map(p => `${p.name}: ${p.margin.toFixed(1)}%`)
        ],
        recommendations: [
          'Promote high-margin products',
          'Negotiate supplier costs'
        ],
        metrics: { highMarginProducts: highMarginProducts.slice(0, 3) }
      };
    }
    if (lowerQuery.includes('cost structure')) {
      return {
        analysis: `💸 **Cost Structure:**\nCOGS: ₹${profitabilityMetrics.cogs.toLocaleString()}`,
        insights: [
          `COGS: ₹${profitabilityMetrics.cogs.toLocaleString()}`
        ],
        recommendations: [
          'Reduce costs where possible',
          'Negotiate with suppliers'
        ],
        metrics: { cogs: profitabilityMetrics.cogs }
      };
    }
    if (lowerQuery.includes('pricing insight')) {
      return {
        analysis: `🏷️ **Pricing Insights:**\n${pricingInsights}`,
        insights: [
          pricingInsights
        ],
        recommendations: [
          'Optimize pricing for better margins',
          'Monitor competitor pricing'
        ],
        metrics: { pricingInsights }
      };
    }
    if (lowerQuery.includes('profitability')) {
      return {
        analysis: `💰 **Profitability Overview:**\nGross Margin: ${profitabilityMetrics.grossMargin.toFixed(1)}%\nNet Profit: ₹${profitabilityMetrics.netProfit.toLocaleString()}`,
        insights: [
          `Gross Margin: ${profitabilityMetrics.grossMargin.toFixed(1)}%`,
          `Net Profit: ₹${profitabilityMetrics.netProfit.toLocaleString()}`
        ],
        recommendations: [
          'Review pricing and costs',
          'Focus on high-margin products'
        ],
        metrics: { grossMargin: profitabilityMetrics.grossMargin, netProfit: profitabilityMetrics.netProfit }
      };
    }

    // --- RECOMMENDATIONS ---
    if (lowerQuery.includes('business recommendation') || lowerQuery.includes('immediate action') || lowerQuery.includes('focus on to grow') || lowerQuery.includes('biggest opportunities') || lowerQuery.includes('optimize my operations')) {
      return {
        analysis: `💡 **Business Recommendations:**\nImmediate: ${recommendations.immediate.join('; ')}\nStrategic: ${recommendations.strategic.join('; ')}\nRisks: ${recommendations.risks.join('; ')}\nOpportunities: ${opportunities.join('; ')}`,
        insights: [
          ...recommendations.immediate,
          ...recommendations.strategic,
          ...opportunities
        ],
        recommendations: [
          ...recommendations.immediate,
          ...recommendations.strategic
        ],
        metrics: { recommendations, opportunities }
      };
    }

    // Fallback to broad category
    // (existing broad category logic here)
    // ... existing code ...
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

  private getMonthlyRevenue(data: any): Array<{ month: string; revenue: number }> {
    const monthlyData: Record<string, number> = {};
    data.sales.forEach((s: any) => {
      const date = new Date(s.sale_date || s.created_at);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      monthlyData[monthKey] = (monthlyData[monthKey] || 0) + (s.total_amount || 0);
    });
    return Object.entries(monthlyData)
      .map(([month, revenue]) => ({ month, revenue }))
      .sort((a, b) => a.month.localeCompare(b.month));
  }

  private getBestSellingCategories(data: any): Array<{ category: string; revenue: number }> {
    const categoryRevenue: Record<string, number> = {};
    data.sales.forEach((s: any) => {
      const prod = data.products.find((p: any) => p.product_id === s.product_id);
      if (prod?.category) {
        categoryRevenue[prod.category] = (categoryRevenue[prod.category] || 0) + (s.total_amount || 0);
      }
    });
    return Object.entries(categoryRevenue)
      .map(([category, revenue]) => ({ category, revenue }))
      .sort((a, b) => b.revenue - a.revenue);
  }

  private calculateInventoryValue(data: any): number {
    return data.products.reduce((total: number, p: any) => {
      return total + ((p.quantity || 0) * (p.price || 0));
    }, 0);
  }

  private analyzeSeasonalTrends(data: any): string {
    if (data.sales.length === 0) return 'No sales data available for seasonal analysis';
    
    const monthlyRevenue = this.getMonthlyRevenue(data);
    if (monthlyRevenue.length < 3) return 'Insufficient data for seasonal analysis';
    
    const recentMonths = monthlyRevenue.slice(-3);
    const avgRecent = recentMonths.reduce((sum, m) => sum + m.revenue, 0) / recentMonths.length;
    const avgOverall = monthlyRevenue.reduce((sum, m) => sum + m.revenue, 0) / monthlyRevenue.length;
    
    if (avgRecent > avgOverall * 1.2) return '📈 Peak season detected - sales are above average';
    if (avgRecent < avgOverall * 0.8) return '📉 Off-season detected - sales are below average';
    return '➡️ Stable seasonal pattern - no significant peaks or valleys';
  }

  private analyzeCustomerBehavior(data: any): any {
    const customers: Record<string, { id: string; name?: string; orders: number; totalSpent: number; lastOrder: Date }> = {};
    
    data.sales.forEach((s: any) => {
      const customerId = s.customer_id || s.customer_name || 'Unknown';
      if (!customers[customerId]) {
        customers[customerId] = {
          id: customerId,
          name: s.customer_name,
          orders: 0,
          totalSpent: 0,
          lastOrder: new Date(s.sale_date || s.created_at)
        };
      }
      customers[customerId].orders += 1;
      customers[customerId].totalSpent += s.total_amount || 0;
      const orderDate = new Date(s.sale_date || s.created_at);
      if (orderDate > customers[customerId].lastOrder) {
        customers[customerId].lastOrder = orderDate;
      }
    });

    const customerList = Object.values(customers);
    const totalCustomers = customerList.length;
    const repeatCustomers = customerList.filter(c => c.orders > 1).length;
    const retentionRate = totalCustomers > 0 ? (repeatCustomers / totalCustomers) * 100 : 0;
    const avgCustomerValue = totalCustomers > 0 ? customerList.reduce((sum, c) => sum + c.totalSpent, 0) / totalCustomers : 0;
    const topCustomers = customerList.sort((a, b) => b.totalSpent - a.totalSpent);

    return {
      totalCustomers,
      repeatCustomers,
      retentionRate,
      avgCustomerValue,
      topCustomers: topCustomers.slice(0, 5)
    };
  }

  private getRepeatCustomers(data: any): Array<any> {
    const customerBehavior = this.analyzeCustomerBehavior(data);
    return customerBehavior.topCustomers.filter(c => c.orders > 1);
  }

  private getCustomerSegments(data: any): Array<{ type: string; count: number; percentage: number }> {
    const customerBehavior = this.analyzeCustomerBehavior(data);
    const customers = customerBehavior.topCustomers;
    
    const segments = [
      { type: 'High Value', count: customers.filter(c => c.totalSpent > 1000).length, percentage: 0 },
      { type: 'Medium Value', count: customers.filter(c => c.totalSpent > 500 && c.totalSpent <= 1000).length, percentage: 0 },
      { type: 'Low Value', count: customers.filter(c => c.totalSpent <= 500).length, percentage: 0 }
    ];

    const total = customers.length;
    segments.forEach(segment => {
      segment.percentage = total > 0 ? (segment.count / total) * 100 : 0;
    });

    return segments;
  }

  private analyzeProfitability(data: any): any {
    const totalRevenue = data.sales.reduce((sum: number, s: any) => sum + (s.total_amount || 0), 0);
    const totalCost = data.sales.reduce((sum: number, s: any) => {
      const prod = data.products.find((p: any) => p.product_id === s.product_id);
      const cost = (prod?.cost_price || prod?.price * 0.6) * (s.quantity_sold || 0);
      return sum + cost;
    }, 0);
    
    const grossProfit = totalRevenue - totalCost;
    const grossMargin = totalRevenue > 0 ? (grossProfit / totalRevenue) * 100 : 0;
    const netProfit = grossProfit * 0.8; // Assuming 20% operating expenses
    const avgProductMargin = data.products.length > 0 ? 
      data.products.reduce((sum: number, p: any) => {
        const margin = p.price > 0 ? ((p.price - (p.cost_price || p.price * 0.6)) / p.price) * 100 : 0;
        return sum + margin;
      }, 0) / data.products.length : 0;

    return {
      grossMargin,
      netProfit,
      avgProductMargin,
      cogs: totalCost
    };
  }

  private getHighMarginProducts(data: any): Array<{ name: string; margin: number }> {
    return data.products
      .map((p: any) => {
        const margin = p.price > 0 ? ((p.price - (p.cost_price || p.price * 0.6)) / p.price) * 100 : 0;
        return { name: p.name, margin };
      })
      .filter(p => p.margin > 30)
      .sort((a, b) => b.margin - a.margin);
  }

  private getPricingInsights(data: any): string {
    const products = data.products;
    if (products.length === 0) return 'No product data available for pricing analysis';
    
    const avgPrice = products.reduce((sum: number, p: any) => sum + (p.price || 0), 0) / products.length;
    const priceRange = products.reduce((range: any, p: any) => {
      const price = p.price || 0;
      if (price < range.min) range.min = price;
      if (price > range.max) range.max = price;
      return range;
    }, { min: Infinity, max: 0 });

    return `Average Price: ₹${avgPrice.toFixed(2)}\nPrice Range: ₹${priceRange.min.toFixed(2)} - ₹${priceRange.max.toFixed(2)}`;
  }

  private getBusinessRecommendations(data: any): any {
    const totalRevenue = data.sales.reduce((sum: number, s: any) => sum + (s.total_amount || 0), 0);
    const lowStockProducts = data.products.filter((p: any) => (p.quantity || 0) < 10);
    const outOfStockProducts = data.products.filter((p: any) => (p.quantity || 0) === 0);
    const customerBehavior = this.analyzeCustomerBehavior(data);

    const immediate = [
      outOfStockProducts.length > 0 ? `Restock ${outOfStockProducts.length} out-of-stock products immediately` : 'Inventory levels are adequate',
      lowStockProducts.length > 0 ? `Monitor ${lowStockProducts.length} low-stock products` : 'All products have sufficient stock',
      'Review and update pricing strategies',
      'Analyze customer feedback and satisfaction'
    ].filter(Boolean);

    const strategic = [
      'Develop a customer loyalty program',
      'Implement automated inventory management',
      'Create targeted marketing campaigns',
      'Expand product categories based on demand',
      'Optimize pricing for better margins'
    ];

    const risks = [
      outOfStockProducts.length > 0 ? 'Risk of losing sales due to stockouts' : 'Low stockout risk',
      customerBehavior.retentionRate < 50 ? 'Customer retention needs improvement' : 'Good customer retention',
      totalRevenue < 10000 ? 'Revenue growth opportunities available' : 'Strong revenue performance'
    ].filter(Boolean);

    return { immediate, strategic, risks };
  }

  private identifyOpportunities(data: any): string[] {
    const opportunities = [];
    const totalRevenue = data.sales.reduce((sum: number, s: any) => sum + (s.total_amount || 0), 0);
    const customerBehavior = this.analyzeCustomerBehavior(data);
    const topProducts = this.getTopProducts(data);

    if (totalRevenue < 50000) {
      opportunities.push('Expand marketing efforts to increase sales volume');
    }
    if (customerBehavior.retentionRate < 60) {
      opportunities.push('Implement customer retention strategies');
    }
    if (topProducts.length > 0 && topProducts[0].sales > 10) {
      opportunities.push('Scale up production of top-selling products');
    }
    if (data.products.length < 20) {
      opportunities.push('Diversify product portfolio');
    }

    return opportunities.length > 0 ? opportunities : ['Focus on operational efficiency improvements'];
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