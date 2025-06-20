import React, { useEffect, useState } from 'react';
import { Report } from '../hooks/useReports';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

interface BusinessIntelligencePreviewProps {
  report: Report;
  onClose: () => void;
}

const BusinessIntelligencePreview: React.FC<BusinessIntelligencePreviewProps> = ({ report, onClose }) => {
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

  // Mock business intelligence data based on inventory
  const kpiDashboard = {
    totalRevenue: inventory.reduce((sum, item) => sum + (item.unit_price * item.current_stock), 0),
    totalProducts: inventory.length,
    averageOrderValue: Math.floor(Math.random() * 100) + 150,
    customerSatisfaction: Math.floor(Math.random() * 20) + 80, // 80-100%
    conversionRate: Math.floor(Math.random() * 10) + 15, // 15-25%
  };

  const growthMetrics = {
    revenueGrowth: Math.floor(Math.random() * 30) + 15, // 15-45%
    customerGrowth: Math.floor(Math.random() * 25) + 10, // 10-35%
    productGrowth: Math.floor(Math.random() * 20) + 8, // 8-28%
    marketShare: Math.floor(Math.random() * 15) + 5, // 5-20%
  };

  const profitabilityAnalysis = {
    grossMargin: Math.floor(Math.random() * 20) + 60, // 60-80%
    netProfit: Math.floor(Math.random() * 15) + 25, // 25-40%
    operatingExpenses: Math.floor(Math.random() * 10) + 15, // 15-25%
    roi: Math.floor(Math.random() * 50) + 100, // 100-150%
  };

  const marketTrends = [
    'Growing demand for sustainable products (+25% YoY)',
    'Digital transformation accelerating customer adoption',
    'Premium segment showing strong growth potential',
    'Supply chain optimization reducing costs by 15%',
    'Mobile commerce driving 70% of transactions',
  ];

  const forecasting = {
    nextQuarterRevenue: Math.floor(kpiDashboard.totalRevenue * 1.15), // 15% growth
    nextQuarterCustomers: Math.floor(Math.random() * 100) + 200,
    marketExpansion: 'Entering 3 new markets in Q2',
    productLaunch: '5 new products planned for Q3',
    technologyUpgrade: 'AI-powered analytics platform launch',
  };

  if (loading) {
    return <div className="flex justify-center items-center min-h-40"><div className="animate-spin rounded-full h-8 w-8 border-4 border-blue-500 border-t-transparent"></div></div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <Button onClick={onClose} variant="outline">Close</Button>
      </div>

      {/* KPI Dashboard */}
      <Card>
        <CardHeader>
          <CardTitle>KPI Dashboard</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">${kpiDashboard.totalRevenue.toLocaleString()}</div>
              <div className="text-sm text-gray-600">Total Revenue</div>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">{kpiDashboard.totalProducts}</div>
              <div className="text-sm text-gray-600">Total Products</div>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">${kpiDashboard.averageOrderValue}</div>
              <div className="text-sm text-gray-600">Avg Order Value</div>
            </div>
            <div className="text-center p-4 bg-orange-50 rounded-lg">
              <div className="text-2xl font-bold text-orange-600">{kpiDashboard.customerSatisfaction}%</div>
              <div className="text-sm text-gray-600">Customer Satisfaction</div>
            </div>
            <div className="text-center p-4 bg-red-50 rounded-lg">
              <div className="text-2xl font-bold text-red-600">{kpiDashboard.conversionRate}%</div>
              <div className="text-sm text-gray-600">Conversion Rate</div>
            </div>
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
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">{growthMetrics.revenueGrowth}%</div>
              <div className="text-sm text-gray-600">Revenue Growth</div>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">{growthMetrics.customerGrowth}%</div>
              <div className="text-sm text-gray-600">Customer Growth</div>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">{growthMetrics.productGrowth}%</div>
              <div className="text-sm text-gray-600">Product Growth</div>
            </div>
            <div className="text-center p-4 bg-orange-50 rounded-lg">
              <div className="text-2xl font-bold text-orange-600">{growthMetrics.marketShare}%</div>
              <div className="text-sm text-gray-600">Market Share</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Profitability Analysis */}
      <Card>
        <CardHeader>
          <CardTitle>Profitability Analysis</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">{profitabilityAnalysis.grossMargin}%</div>
              <div className="text-sm text-gray-600">Gross Margin</div>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">{profitabilityAnalysis.netProfit}%</div>
              <div className="text-sm text-gray-600">Net Profit</div>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">{profitabilityAnalysis.operatingExpenses}%</div>
              <div className="text-sm text-gray-600">Operating Expenses</div>
            </div>
            <div className="text-center p-4 bg-orange-50 rounded-lg">
              <div className="text-2xl font-bold text-orange-600">{profitabilityAnalysis.roi}%</div>
              <div className="text-sm text-gray-600">ROI</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Market Trends */}
      <Card>
        <CardHeader>
          <CardTitle>Market Trends</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="list-disc pl-5 space-y-2">
            {marketTrends.map((trend, idx) => (
              <li key={idx}>{trend}</li>
            ))}
          </ul>
        </CardContent>
      </Card>

      {/* Forecasting */}
      <Card>
        <CardHeader>
          <CardTitle>Forecasting</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">${forecasting.nextQuarterRevenue.toLocaleString()}</div>
                <div className="text-sm text-gray-600">Next Quarter Revenue</div>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">{forecasting.nextQuarterCustomers}</div>
                <div className="text-sm text-gray-600">Next Quarter Customers</div>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                <Badge variant="default">Market</Badge>
                <span>{forecasting.marketExpansion}</span>
              </div>
              <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                <Badge variant="secondary">Product</Badge>
                <span>{forecasting.productLaunch}</span>
              </div>
              <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                <Badge variant="outline">Technology</Badge>
                <span>{forecasting.technologyUpgrade}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default BusinessIntelligencePreview; 