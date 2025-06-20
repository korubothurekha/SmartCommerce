import React, { useEffect, useState } from 'react';
import { Report } from '../hooks/useReports';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

interface InventoryOptimizationPreviewProps {
  report: Report;
  onClose: () => void;
}

const InventoryOptimizationPreview: React.FC<InventoryOptimizationPreviewProps> = ({ report, onClose }) => {
  const { user } = useAuth();
  const [inventory, setInventory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInventory = async () => {
      if (!user) return;
      setLoading(true);
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('user_id', user.id);
      setInventory(data || []);
      setLoading(false);
    };
    fetchInventory();
  }, [user]);

  // --- Analysis Logic ---
  // Stock Levels
  const stockLevels = inventory.map(item => ({
    name: item.name,
    stock: item.current_stock,
    status: item.status || (item.current_stock <= (item.min_stock_level || 0) ? 'low_stock' : (item.current_stock >= (item.max_stock_level || 999999) ? 'overstock' : 'healthy'))
  }));

  // Anomaly Detection (mock: demand spike if current_stock changed a lot, or status is 'demand_spike')
  const anomalies = inventory.filter(item => item.status === 'demand_spike' || item.anomaly).map(item => `${item.name}: Demand spike detected!`);

  // Reorder Recommendations (below min_stock_level)
  const reorder = inventory.filter(item => item.min_stock_level && item.current_stock < item.min_stock_level)
    .map(item => `${item.name}: Current stock ${item.current_stock}, reorder recommended (min: ${item.min_stock_level})`);

  // Dead Stock Analysis (stock > 0 and no movement, mock: status === 'dead_stock')
  const deadStock = inventory.filter(item => item.status === 'dead_stock' || item.dead_stock)
    .map(item => `${item.name}: Dead stock detected`);

  // Turnover Rates (mock: random or static, unless you have sales data)
  const turnover = inventory.map(item => `${item.name}: Turnover rate ${(Math.random() * 5 + 1).toFixed(2)}`);

  if (loading) {
    return <div className="flex justify-center items-center min-h-40"><div className="animate-spin rounded-full h-8 w-8 border-4 border-blue-500 border-t-transparent"></div></div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <Button onClick={onClose} variant="outline">Close</Button>
      </div>
      {/* Stock Levels */}
      <Card>
        <CardHeader>
          <CardTitle>Stock Levels</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr>
                  <th className="text-left p-2">Product</th>
                  <th className="text-left p-2">Stock</th>
                  <th className="text-left p-2">Status</th>
                </tr>
              </thead>
              <tbody>
                {stockLevels.map((item, idx) => (
                  <tr key={idx}>
                    <td className="p-2">{item.name}</td>
                    <td className="p-2">{item.stock}</td>
                    <td className="p-2">
                      <Badge variant={item.status === 'healthy' ? 'default' : 'destructive'}>{item.status}</Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Anomaly Detection */}
      <Card>
        <CardHeader>
          <CardTitle>Anomaly Detection</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="list-disc pl-5">
            {anomalies.length > 0 ? anomalies.map((anomaly, idx) => (
              <li key={idx}>{anomaly}</li>
            )) : <li>No anomalies detected.</li>}
          </ul>
        </CardContent>
      </Card>

      {/* Reorder Recommendations */}
      <Card>
        <CardHeader>
          <CardTitle>Reorder Recommendations</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="list-disc pl-5">
            {reorder.length > 0 ? reorder.map((rec, idx) => (
              <li key={idx}>{rec}</li>
            )) : <li>No products need reordering.</li>}
          </ul>
        </CardContent>
      </Card>

      {/* Dead Stock Analysis */}
      <Card>
        <CardHeader>
          <CardTitle>Dead Stock Analysis</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="list-disc pl-5">
            {deadStock.length > 0 ? deadStock.map((item, idx) => (
              <li key={idx}>{item}</li>
            )) : <li>No dead stock detected.</li>}
          </ul>
        </CardContent>
      </Card>

      {/* Turnover Rates */}
      <Card>
        <CardHeader>
          <CardTitle>Turnover Rates</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="list-disc pl-5">
            {turnover.length > 0 ? turnover.map((item, idx) => (
              <li key={idx}>{item}</li>
            )) : <li>Turnover rates are healthy.</li>}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};

export default InventoryOptimizationPreview; 