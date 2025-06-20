import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  TrendingUp, 
  TrendingDown, 
  Package, 
  AlertCircle, 
  DollarSign,
  ShoppingCart,
  Users,
  Calendar
} from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import Layout from '../components/Layout';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '../contexts/AuthContext';

const Dashboard = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [products, setProducts] = useState<any[]>([]);
  const [sales, setSales] = useState<any[]>([]);
  const [alerts, setAlerts] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      if (!user) return;
      setLoading(true);
      setError(null);
      try {
        const [{ data: productsData, error: productsError }, { data: salesData, error: salesError }, { data: alertsData, error: alertsError }] = await Promise.all([
          supabase.from('products').select('*').eq('user_id', user.id),
          supabase.from('sales_data').select('*').eq('user_id', user.id),
          supabase.from('inventory_alerts').select('*').eq('user_id', user.id),
        ]);
        if (productsError || salesError || alertsError) {
          setError(productsError?.message || salesError?.message || alertsError?.message || 'Error fetching data');
          setLoading(false);
          return;
        }
        setProducts(productsData || []);
        setSales(salesData || []);
        setAlerts(alertsData || []);
      } catch (err: any) {
        setError(err.message || 'Unknown error');
      }
      setLoading(false);
    };
    fetchData();
  }, [user]);

  // KPI calculations
  const totalRevenue = sales.reduce((sum, s) => sum + (s.total_amount || 0), 0);
  const totalProducts = products.length;
  const ordersToday = sales.filter(s => new Date(s.sale_date).toDateString() === new Date().toDateString()).length;
  const activeAlerts = alerts.filter(a => !a.is_resolved).length;

  // Sales trend (group by day)
  const salesByDay: Record<string, { sales: number; revenue: number }> = {};
  sales.forEach(s => {
    const day = new Date(s.sale_date).toLocaleDateString('en-US', { weekday: 'short' });
    if (!salesByDay[day]) salesByDay[day] = { sales: 0, revenue: 0 };
    salesByDay[day].sales += s.quantity_sold || 0;
    salesByDay[day].revenue += s.total_amount || 0;
  });
  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const salesData = weekDays.map(day => ({ name: day, sales: salesByDay[day]?.sales || 0, revenue: salesByDay[day]?.revenue || 0 }));

  // Category distribution
  const categoryMap: Record<string, number> = {};
  products.forEach(p => {
    if (!p.category) return;
    categoryMap[p.category] = (categoryMap[p.category] || 0) + 1;
  });
  const categoryColors = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#6366F1', '#F472B6', '#FBBF24'];
  const categoryData = Object.entries(categoryMap).map(([name, value], i) => ({ name, value, color: categoryColors[i % categoryColors.length] }));

  // Top products by sales
  const productSalesMap: Record<string, { name: string; sales: number }> = {};
  sales.forEach(s => {
    if (!productSalesMap[s.product_id]) {
      const prod = products.find(p => p.product_id === s.product_id);
      productSalesMap[s.product_id] = { name: prod?.name || s.product_id, sales: 0 };
    }
    productSalesMap[s.product_id].sales += s.quantity_sold || 0;
  });
  const topProducts = Object.values(productSalesMap).sort((a, b) => b.sales - a.sales).slice(0, 4);

  // Recent alerts (last 5)
  const recentAlerts = alerts.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()).slice(0, 5);

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-96">
          <span className="text-lg text-gray-600">Loading dashboard...</span>
        </div>
      </Layout>
    );
  }
  if (error) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-96">
          <span className="text-lg text-red-600">{error}</span>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-8">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-gray-600 mt-1">Welcome back! Here's what's happening with your business.</p>
          </div>
          <div className="mt-4 sm:mt-0">
            <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
              <Calendar className="mr-2 h-4 w-4" />
              Generate Report
            </Button>
          </div>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Total Revenue</CardTitle>
              <DollarSign className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">₹{totalRevenue.toLocaleString()}</div>
              <div className="flex items-center text-xs text-green-600 mt-1">
                <TrendingUp className="mr-1 h-3 w-3" />
                {/* You can add a trend calculation here */}
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Total Products</CardTitle>
              <Package className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">{totalProducts}</div>
              <div className="flex items-center text-xs text-blue-600 mt-1">
                <TrendingUp className="mr-1 h-3 w-3" />
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Orders Today</CardTitle>
              <ShoppingCart className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-600">{ordersToday}</div>
              <div className="flex items-center text-xs text-purple-600 mt-1">
                <TrendingUp className="mr-1 h-3 w-3" />
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Active Alerts</CardTitle>
              <AlertCircle className="h-4 w-4 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">{activeAlerts}</div>
              <div className="flex items-center text-xs text-red-600 mt-1">
                <TrendingDown className="mr-1 h-3 w-3" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Sales Trend Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Sales Trend</CardTitle>
              <CardDescription>Daily sales performance this week</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={salesData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Line 
                    type="monotone" 
                    dataKey="sales" 
                    stroke="#3B82F6" 
                    strokeWidth={3}
                    dot={{ fill: '#3B82F6', strokeWidth: 2, r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Category Distribution */}
          <Card>
            <CardHeader>
              <CardTitle>Category Distribution</CardTitle>
              <CardDescription>Products by category</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              <div className="grid grid-cols-2 gap-4 mt-4">
                {categoryData.map((category) => (
                  <div key={category.name} className="flex items-center space-x-2">
                    <div 
                      className="w-3 h-3 rounded-full" 
                      style={{ backgroundColor: category.color }}
                    ></div>
                    <span className="text-sm text-gray-600">{category.name}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Bottom Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Top Products */}
          <Card>
            <CardHeader>
              <CardTitle>Top Selling Products</CardTitle>
              <CardDescription>Best performers this week</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {topProducts.length === 0 && <div className="text-gray-500">No sales data yet.</div>}
                {topProducts.map((product, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                        <span className="text-sm font-medium text-blue-600">{index + 1}</span>
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">{product.name}</div>
                        <div className="text-sm text-gray-600">{product.sales} units sold</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Recent Alerts */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Alerts</CardTitle>
              <CardDescription>Important inventory notifications</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentAlerts.length === 0 && <div className="text-gray-500">No alerts yet.</div>}
                {recentAlerts.map((alert) => (
                  <div key={alert.id} className="flex items-start space-x-3 p-3 border border-gray-200 rounded-lg">
                    <AlertCircle className={`h-5 w-5 mt-0.5 ${
                      alert.severity === 'high' ? 'text-red-600' :
                      alert.severity === 'medium' ? 'text-yellow-600' : 'text-gray-600'
                    }`} />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2">
                        <span className="font-medium text-gray-900">{alert.product_name}</span>
                        <Badge variant={
                          alert.severity === 'high' ? 'destructive' :
                          alert.severity === 'medium' ? 'default' : 'secondary'
                        }>
                          {alert.alert_type.replace('_', ' ')}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">{alert.message}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;
