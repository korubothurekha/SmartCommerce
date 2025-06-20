import React, { useEffect, useState } from 'react';
import { Report } from '../hooks/useReports';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

interface CustomerInsightsPreviewProps {
  report: Report;
  onClose: () => void;
}

const CustomerInsightsPreview: React.FC<CustomerInsightsPreviewProps> = ({ report, onClose }) => {
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

  // Mock customer insights based on inventory data
  const customerSegments = [
    { name: 'Premium Customers', count: Math.floor(Math.random() * 50) + 20, value: 'High-value, frequent buyers' },
    { name: 'Regular Customers', count: Math.floor(Math.random() * 100) + 50, value: 'Consistent monthly purchases' },
    { name: 'Occasional Buyers', count: Math.floor(Math.random() * 200) + 100, value: 'Seasonal or occasional purchases' },
    { name: 'New Customers', count: Math.floor(Math.random() * 30) + 10, value: 'First-time buyers' },
  ];

  const buyingPatterns = [
    'Peak purchasing hours: 2-4 PM and 7-9 PM',
    'Most popular category: Electronics (35% of sales)',
    'Average order value: $125',
    'Preferred payment method: Credit Card (60%)',
    'Mobile vs Desktop: 65% mobile purchases',
  ];

  const loyaltyAnalysis = {
    repeatCustomers: Math.floor(Math.random() * 40) + 60, // 60-100%
    averageLoyaltyScore: Math.floor(Math.random() * 20) + 80, // 80-100
    topLoyaltyTier: 'Gold Members',
    retentionRate: Math.floor(Math.random() * 15) + 85, // 85-100%
  };

  const churnPrediction = [
    { risk: 'High Risk', count: Math.floor(Math.random() * 20) + 5, percentage: Math.floor(Math.random() * 10) + 5 },
    { risk: 'Medium Risk', count: Math.floor(Math.random() * 40) + 20, percentage: Math.floor(Math.random() * 15) + 10 },
    { risk: 'Low Risk', count: Math.floor(Math.random() * 100) + 50, percentage: Math.floor(Math.random() * 20) + 60 },
  ];

  const ltvAnalysis = {
    averageLTV: Math.floor(Math.random() * 500) + 1000, // $1000-1500
    topLTVSegment: 'Premium Electronics Buyers',
    ltvGrowth: Math.floor(Math.random() * 20) + 10, // 10-30%
    predictedLTV: Math.floor(Math.random() * 200) + 1200, // $1200-1400
  };

  if (loading) {
    return <div className="flex justify-center items-center min-h-40"><div className="animate-spin rounded-full h-8 w-8 border-4 border-blue-500 border-t-transparent"></div></div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <Button onClick={onClose} variant="outline">Close</Button>
      </div>

      {/* Customer Segmentation */}
      <Card>
        <CardHeader>
          <CardTitle>Customer Segmentation</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {customerSegments.map((segment, idx) => (
              <div key={idx} className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                <div>
                  <div className="font-medium">{segment.name}</div>
                  <div className="text-sm text-gray-600">{segment.value}</div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold">{segment.count}</div>
                  <div className="text-sm text-gray-600">customers</div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Buying Patterns */}
      <Card>
        <CardHeader>
          <CardTitle>Buying Patterns</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="list-disc pl-5 space-y-2">
            {buyingPatterns.map((pattern, idx) => (
              <li key={idx}>{pattern}</li>
            ))}
          </ul>
        </CardContent>
      </Card>

      {/* Loyalty Analysis */}
      <Card>
        <CardHeader>
          <CardTitle>Loyalty Analysis</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">{loyaltyAnalysis.repeatCustomers}%</div>
              <div className="text-sm text-gray-600">Repeat Customers</div>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">{loyaltyAnalysis.averageLoyaltyScore}</div>
              <div className="text-sm text-gray-600">Avg Loyalty Score</div>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <div className="text-lg font-bold text-purple-600">{loyaltyAnalysis.topLoyaltyTier}</div>
              <div className="text-sm text-gray-600">Top Tier</div>
            </div>
            <div className="text-center p-4 bg-orange-50 rounded-lg">
              <div className="text-2xl font-bold text-orange-600">{loyaltyAnalysis.retentionRate}%</div>
              <div className="text-sm text-gray-600">Retention Rate</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Churn Prediction */}
      <Card>
        <CardHeader>
          <CardTitle>Churn Prediction</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {churnPrediction.map((prediction, idx) => (
              <div key={idx} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <Badge variant={prediction.risk === 'High Risk' ? 'destructive' : prediction.risk === 'Medium Risk' ? 'default' : 'secondary'}>
                    {prediction.risk}
                  </Badge>
                  <span className="font-medium">{prediction.count} customers</span>
                </div>
                <div className="text-right">
                  <div className="font-bold">{prediction.percentage}%</div>
                  <div className="text-sm text-gray-600">of total</div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* LTV Analysis */}
      <Card>
        <CardHeader>
          <CardTitle>LTV Analysis</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">${ltvAnalysis.averageLTV}</div>
              <div className="text-sm text-gray-600">Average LTV</div>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-lg font-bold text-green-600">{ltvAnalysis.topLTVSegment}</div>
              <div className="text-sm text-gray-600">Top Segment</div>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">{ltvAnalysis.ltvGrowth}%</div>
              <div className="text-sm text-gray-600">LTV Growth</div>
            </div>
            <div className="text-center p-4 bg-orange-50 rounded-lg">
              <div className="text-2xl font-bold text-orange-600">${ltvAnalysis.predictedLTV}</div>
              <div className="text-sm text-gray-600">Predicted LTV</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CustomerInsightsPreview; 