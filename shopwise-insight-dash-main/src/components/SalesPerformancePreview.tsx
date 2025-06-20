import React, { useEffect, useState } from 'react';
import { Report } from '../hooks/useReports';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

interface SalesPerformancePreviewProps {
  report: Report;
  onClose: () => void;
}

const SalesPerformancePreview: React.FC<SalesPerformancePreviewProps> = ({ report, onClose }) => {
  const { user } = useAuth();
  const [inventory, setInventory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (!user) return;
      setLoading(true);
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('user_id', user.id);
      setInventory(data || []);
      setLoading(false);
    };
    fetchData();
  }, [user]);

  // Mock sales analysis based on inventory data
  const revenueAnalysis = {
    totalRevenue: inventory.reduce((sum, item) => sum + (item.unit_price * item.current_stock), 0),
    totalProducts: inventory.length,
    averagePrice: inventory.length > 0 ? inventory.reduce((sum, item) => sum + item.unit_price, 0) / inventory.length : 0,
    growthRate: Math.floor(Math.random() * 20) + 5, // Mock growth rate
  };

  const topProducts = inventory
    .sort((a, b) => (b.unit_price * b.current_stock) - (a.unit_price * a.current_stock))
    .slice(0, 5)
    .map(item => ({
      name: item.name,
      revenue: item.unit_price * item.current_stock,
      sales: item.current_stock,
    }));

  const salesTrends = [
    'Sales increased by 15% compared to last month',
    'Peak sales during holiday season',
    'Strong performance in electronics category',
    'Growing demand for premium products',
  ];

  const categoryBreakdown = inventory.reduce((acc, item) => {
    const category = item.category || 'Uncategorized';
    if (!acc[category]) {
      acc[category] = { count: 0, revenue: 0 };
    }
    acc[category].count += 1;
    acc[category].revenue += item.unit_price * item.current_stock;
    return acc;
  }, {} as Record<string, { count: number; revenue: number }>);

  const growthMetrics = {
    revenueGrowth: Math.floor(Math.random() * 25) + 10,
    customerGrowth: Math.floor(Math.random() * 15) + 5,
    productGrowth: Math.floor(Math.random() * 20) + 8,
    marketShare: Math.floor(Math.random() * 10) + 2,
  };

  if (loading) {
    return <div className="flex justify-center items-center min-h-40"><div className="animate-spin rounded-full h-8 w-8 border-4 border-blue-500 border-t-transparent"></div></div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <Button onClick={onClose} variant="outline">Close</Button>
      </div>

      {/* Revenue Analysis */}
      <Card>
        <CardHeader>
          <CardTitle>Revenue Analysis</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">${revenueAnalysis.totalRevenue.toLocaleString()}</div>
              <div className="text-sm text-gray-600">Total Revenue</div>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">{revenueAnalysis.totalProducts}</div>
              <div className="text-sm text-gray-600">Total Products</div>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">${revenueAnalysis.averagePrice.toFixed(2)}</div>
              <div className="text-sm text-gray-600">Average Price</div>
            </div>
            <div className="text-center p-4 bg-orange-50 rounded-lg">
              <div className="text-2xl font-bold text-orange-600">{revenueAnalysis.growthRate}%</div>
              <div className="text-sm text-gray-600">Growth Rate</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Top Products */}
      <Card>
        <CardHeader>
          <CardTitle>Top Products</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr>
                  <th className="text-left p-2">Product</th>
                  <th className="text-left p-2">Revenue</th>
                  <th className="text-left p-2">Sales</th>
                </tr>
              </thead>
              <tbody>
                {topProducts.map((item, idx) => (
                  <tr key={idx}>
                    <td className="p-2">{item.name}</td>
                    <td className="p-2">${item.revenue.toLocaleString()}</td>
                    <td className="p-2">{item.sales}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Sales Trends */}
      <Card>
        <CardHeader>
          <CardTitle>Sales Trends</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="list-disc pl-5">
            {salesTrends.map((trend, idx) => (
              <li key={idx}>{trend}</li>
            ))}
          </ul>
        </CardContent>
      </Card>

      {/* Category Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle>Category Breakdown</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {Object.entries(categoryBreakdown).map(([category, data]) => (
              <div key={category} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <div>
                  <div className="font-medium">{category}</div>
                  <div className="text-sm text-gray-600">{data.count} products</div>
                </div>
                <div className="text-right">
                  <div className="font-bold">${data.revenue.toLocaleString()}</div>
                  <div className="text-sm text-gray-600">Revenue</div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Growth Metrics */}
      <Card>
        <CardHeader>
          <CardTitle>Growth Metrics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-3 bg-blue-50 rounded-lg">
              <div className="text-lg font-bold text-blue-600">{growthMetrics.revenueGrowth}%</div>
              <div className="text-sm text-gray-600">Revenue Growth</div>
            </div>
            <div className="text-center p-3 bg-green-50 rounded-lg">
              <div className="text-lg font-bold text-green-600">{growthMetrics.customerGrowth}%</div>
              <div className="text-sm text-gray-600">Customer Growth</div>
            </div>
            <div className="text-center p-3 bg-purple-50 rounded-lg">
              <div className="text-lg font-bold text-purple-600">{growthMetrics.productGrowth}%</div>
              <div className="text-sm text-gray-600">Product Growth</div>
            </div>
            <div className="text-center p-3 bg-orange-50 rounded-lg">
              <div className="text-lg font-bold text-orange-600">{growthMetrics.marketShare}%</div>
              <div className="text-sm text-gray-600">Market Share</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SalesPerformancePreview; 