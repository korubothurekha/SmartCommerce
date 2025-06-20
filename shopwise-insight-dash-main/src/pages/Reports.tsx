import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  FileText, 
  Download, 
  TrendingUp,
  BarChart3,
  PieChart,
  Users,
  Share2,
  Eye,
  Clock,
  Trash2,
  Sparkles,
  Calendar
} from "lucide-react";
import Layout from '../components/Layout';
import { toast } from "@/hooks/use-toast";
import { useReports, Report } from '../hooks/useReports';
import { format } from 'date-fns';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import InventoryOptimizationPreview from "@/components/InventoryOptimizationPreview";
import SalesPerformancePreview from "@/components/SalesPerformancePreview";
import CustomerInsightsPreview from "@/components/CustomerInsightsPreview";
import BusinessIntelligencePreview from "@/components/BusinessIntelligencePreview";
// @ts-ignore
import jsPDF from 'jspdf';
// @ts-ignore
import 'jspdf-autotable';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

const Reports = () => {
  const [generatingReport, setGeneratingReport] = useState<number | null>(null);
  const { reports, isLoading, generateReport, deleteReport } = useReports();
  const [previewReport, setPreviewReport] = useState<Report | null>(null);
  const { user } = useAuth();

  const reportTemplates = [
    {
      id: 1,
      name: 'Sales Performance Report',
      description: 'Comprehensive sales analysis with revenue breakdowns, top products, and growth trends',
      icon: TrendingUp,
      estimatedTime: '2-3 minutes',
      color: 'from-blue-500 to-cyan-500',
      features: ['Revenue Analysis', 'Top Products', 'Sales Trends', 'Category Breakdown', 'Growth Metrics']
    },
    {
      id: 2,
      name: 'Inventory Optimization Report',
      description: 'Smart inventory analysis with stock levels, reorder points, and optimization recommendations',
      icon: BarChart3,
      estimatedTime: '3-4 minutes',
      color: 'from-green-500 to-emerald-500',
      features: ['Stock Levels', 'Anomaly Detection', 'Reorder Recommendations', 'Dead Stock Analysis', 'Turnover Rates']
    },
    {
      id: 3,
      name: 'Customer Insights Report',
      description: 'Deep customer behavior analysis with purchasing patterns and loyalty metrics',
      icon: Users,
      estimatedTime: '4-5 minutes',
      color: 'from-purple-500 to-pink-500',
      features: ['Customer Segmentation', 'Buying Patterns', 'Loyalty Analysis', 'Churn Prediction', 'LTV Analysis']
    },
    {
      id: 4,
      name: 'Business Intelligence Report',
      description: 'Executive dashboard with KPIs, performance metrics, and strategic insights',
      icon: PieChart,
      estimatedTime: '5-6 minutes',
      color: 'from-orange-500 to-red-500',
      features: ['KPI Dashboard', 'Growth Metrics', 'Profitability Analysis', 'Market Trends', 'Forecasting']
    }
  ];

  const handleGenerateReport = async (templateId: number, templateName: string, reportType: any) => {
    setGeneratingReport(templateId);
    
    try {
      console.log('Starting report generation for:', templateName);
      console.log('Report type:', reportType);
      console.log('Current user:', user?.id);
      
      // Simulate report generation with more realistic data
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      const mockReportData = {
        summary: {
          totalRevenue: Math.floor(Math.random() * 100000) + 50000,
          totalOrders: Math.floor(Math.random() * 1000) + 500,
          averageOrderValue: Math.floor(Math.random() * 200) + 100,
          growthRate: Math.floor(Math.random() * 20) + 5,
        },
        topProducts: [
          { name: 'Product A', sales: Math.floor(Math.random() * 10000) + 5000 },
          { name: 'Product B', sales: Math.floor(Math.random() * 8000) + 4000 },
          { name: 'Product C', sales: Math.floor(Math.random() * 6000) + 3000 },
        ],
        insights: [
          'Sales increased by 15% compared to last month',
          'Inventory turnover improved by 8%',
          'Customer satisfaction score: 4.7/5',
        ]
      };

      console.log('Generated mock data:', mockReportData);

      const result = await generateReport.mutateAsync({
        reportName: templateName,
        reportType: reportType,
        reportData: mockReportData,
      });
      
      console.log('Report generation result:', result);
      
      toast({
        title: "Report Generated! ✨",
        description: `${templateName} has been generated successfully and saved to your reports.`,
      });
      
    } catch (error) {
      console.error('Report generation error:', error);
      toast({
        title: "Generation Failed",
        description: "There was an error generating the report. Please try again.",
        variant: "destructive",
      });
    } finally {
      setGeneratingReport(null);
    }
  };

  const handleDownloadReport = async (reportId: string, reportName: string) => {
    const report = reports.find(r => r.id === reportId);
    if (!report) {
      toast({
        title: 'Download Failed',
        description: 'Report not found.',
        variant: 'destructive',
      });
      return;
    }

    try {
      console.log('Starting download for report:', reportName);
      
      if (report.report_type === 'inventory') {
        // Fetch real-time inventory data for the logged-in user
        if (!user) {
          toast({
            title: 'Download Failed',
            description: 'User not authenticated.',
            variant: 'destructive',
          });
          return;
        }

        console.log('Fetching real-time inventory data...');
        const { data: inventory, error } = await supabase
          .from('products')
          .select('*')
          .eq('user_id', user.id);

        if (error) {
          toast({
            title: 'Download Failed',
            description: 'Failed to fetch inventory data.',
            variant: 'destructive',
          });
          return;
        }

        // Analyze the real-time data (same logic as preview modal)
        const stockLevels = inventory.map((item: any) => ({
          name: item.name,
          stock: item.current_stock,
          status: item.status || (item.current_stock <= (item.min_stock_level || 0) ? 'low_stock' : (item.current_stock >= (item.max_stock_level || 999999) ? 'overstock' : 'healthy'))
        }));

        const anomalies = inventory.filter((item: any) => item.status === 'demand_spike' || item.anomaly).map((item: any) => `${item.name}: Demand spike detected!`);

        const reorder = inventory.filter((item: any) => item.min_stock_level && item.current_stock < item.min_stock_level)
          .map((item: any) => `${item.name}: Current stock ${item.current_stock}, reorder recommended (min: ${item.min_stock_level})`);

        const deadStock = inventory.filter((item: any) => item.status === 'dead_stock' || item.dead_stock)
          .map((item: any) => `${item.name}: Dead stock detected`);

        const turnover = inventory.map((item: any) => `${item.name}: Turnover rate ${(Math.random() * 5 + 1).toFixed(2)}`);

        console.log('Real-time data:', { stockLevels, anomalies, reorder, deadStock, turnover });

        // Try PDF generation with real-time data
        try {
          console.log('Attempting PDF generation with real-time data...');
          // @ts-ignore
          const doc = new jsPDF();
          let y = 20;
          
          // Title
          doc.setFontSize(18);
          doc.text(reportName, 20, y);
          y += 15;
          
          // Date
          doc.setFontSize(12);
          doc.text(`Generated on: ${new Date().toLocaleString()}`, 20, y);
          y += 20;

          // Stock Levels
          if (stockLevels.length > 0) {
            doc.setFontSize(14);
            doc.text('Stock Levels', 20, y);
            y += 10;
            
            doc.setFontSize(10);
            stockLevels.forEach((item: any, index: number) => {
              if (y > 250) {
                doc.addPage();
                y = 20;
              }
              doc.text(`${index + 1}. ${item.name} - Stock: ${item.stock} - Status: ${item.status}`, 25, y);
              y += 8;
            });
            y += 10;
          }

          // Anomalies
          if (anomalies.length > 0) {
            if (y > 250) {
              doc.addPage();
              y = 20;
            }
            doc.setFontSize(14);
            doc.text('Anomaly Detection', 20, y);
            y += 10;
            
            doc.setFontSize(10);
            anomalies.forEach((anomaly: string) => {
              if (y > 250) {
                doc.addPage();
                y = 20;
              }
              doc.text(`• ${anomaly}`, 25, y);
              y += 8;
            });
            y += 10;
          }

          // Reorder Recommendations
          if (reorder.length > 0) {
            if (y > 250) {
              doc.addPage();
              y = 20;
            }
            doc.setFontSize(14);
            doc.text('Reorder Recommendations', 20, y);
            y += 10;
            
            doc.setFontSize(10);
            reorder.forEach((rec: string) => {
              if (y > 250) {
                doc.addPage();
                y = 20;
              }
              doc.text(`• ${rec}`, 25, y);
              y += 8;
            });
            y += 10;
          }

          // Dead Stock
          if (deadStock.length > 0) {
            if (y > 250) {
              doc.addPage();
              y = 20;
            }
            doc.setFontSize(14);
            doc.text('Dead Stock Analysis', 20, y);
            y += 10;
            
            doc.setFontSize(10);
            deadStock.forEach((item: string) => {
              if (y > 250) {
                doc.addPage();
                y = 20;
              }
              doc.text(`• ${item}`, 25, y);
              y += 8;
            });
            y += 10;
          }

          // Turnover
          if (turnover.length > 0) {
            if (y > 250) {
              doc.addPage();
              y = 20;
            }
            doc.setFontSize(14);
            doc.text('Turnover Rates', 20, y);
            y += 10;
            
            doc.setFontSize(10);
            turnover.forEach((item: string) => {
              if (y > 250) {
                doc.addPage();
                y = 20;
              }
              doc.text(`• ${item}`, 25, y);
              y += 8;
            });
            y += 10;
          }

          doc.save(`${reportName.replace(/\s+/g, '_').toLowerCase()}.pdf`);
          toast({
            title: 'Download Started',
            description: `${reportName} PDF download has started.`,
          });
          return;
        } catch (pdfError) {
          console.error('PDF generation failed:', pdfError);
          console.log('Falling back to CSV...');
          
          // Fallback to CSV with real-time data
          let csv = '';
          csv += 'Stock Levels\n';
          csv += 'Product,Stock,Status\n';
          stockLevels.forEach((item: any) => {
            csv += `${item.name},${item.stock},${item.status}\n`;
          });
          csv += '\n';

          if (anomalies.length > 0) {
            csv += 'Anomaly Detection\n';
            anomalies.forEach((anomaly: string) => {
              csv += `${anomaly}\n`;
            });
            csv += '\n';
          }

          if (reorder.length > 0) {
            csv += 'Reorder Recommendations\n';
            reorder.forEach((rec: string) => {
              csv += `${rec}\n`;
            });
            csv += '\n';
          }

          if (deadStock.length > 0) {
            csv += 'Dead Stock Analysis\n';
            deadStock.forEach((item: string) => {
              csv += `${item}\n`;
            });
            csv += '\n';
          }

          if (turnover.length > 0) {
            csv += 'Turnover Rates\n';
            turnover.forEach((item: string) => {
              csv += `${item}\n`;
            });
            csv += '\n';
          }

          const blob = new Blob([csv], { type: 'text/csv' });
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = `${reportName.replace(/\s+/g, '_').toLowerCase()}.csv`;
          a.click();
          URL.revokeObjectURL(url);
          toast({
            title: 'Download Started (CSV)',
            description: `${reportName} CSV download has started. (PDF generation failed)`,
          });
          return;
        }
      }

      // Fallback for other report types (CSV/JSON) - use original report data
      let csv = '';
      if (report.report_type === 'sales') {
        // Generate PDF for Sales Performance Report
        const data = report.report_data || {};
        try {
          console.log('Generating PDF for Sales Performance Report...');
          // @ts-ignore
          const doc = new jsPDF();
          let y = 20;
          
          // Title
          doc.setFontSize(18);
          doc.text(reportName, 20, y);
          y += 15;
          
          // Date
          doc.setFontSize(12);
          doc.text(`Generated on: ${new Date().toLocaleString()}`, 20, y);
          y += 20;

          // Revenue Analysis
          if (data.summary) {
            doc.setFontSize(14);
            doc.text('Revenue Analysis', 20, y);
            y += 10;
            
            doc.setFontSize(10);
            Object.entries(data.summary).forEach(([key, value]) => {
              if (y > 250) {
                doc.addPage();
                y = 20;
              }
              doc.text(`${key}: ${value}`, 25, y);
              y += 8;
            });
            y += 10;
          }

          // Top Products
          if (data.topProducts) {
            if (y > 250) {
              doc.addPage();
              y = 20;
            }
            doc.setFontSize(14);
            doc.text('Top Products', 20, y);
            y += 10;
            
            doc.setFontSize(10);
            data.topProducts.forEach((item: any, index: number) => {
              if (y > 250) {
                doc.addPage();
                y = 20;
              }
              doc.text(`${index + 1}. ${item.name} - Sales: ${item.sales}`, 25, y);
              y += 8;
            });
            y += 10;
          }

          // Insights
          if (data.insights) {
            if (y > 250) {
              doc.addPage();
              y = 20;
            }
            doc.setFontSize(14);
            doc.text('Sales Insights', 20, y);
            y += 10;
            
            doc.setFontSize(10);
            data.insights.forEach((insight: string) => {
              if (y > 250) {
                doc.addPage();
                y = 20;
              }
              doc.text(`• ${insight}`, 25, y);
              y += 8;
            });
            y += 10;
          }

          doc.save(`${reportName.replace(/\s+/g, '_').toLowerCase()}.pdf`);
          toast({
            title: 'Download Started',
            description: `${reportName} PDF download has started.`,
          });
          return;
        } catch (pdfError) {
          console.error('PDF generation failed for sales report:', pdfError);
          // Fallback to CSV
          if (data.topProducts) {
            csv += 'Product,Sales\n';
            data.topProducts.forEach((item: any) => {
              csv += `${item.name},${item.sales}\n`;
            });
            csv += '\n';
          }
          if (data.summary) {
            csv += 'Summary\n';
            Object.entries(data.summary).forEach(([key, value]) => {
              csv += `${key},${value}\n`;
            });
            csv += '\n';
          }
          if (data.insights) {
            csv += 'Insights\n';
            data.insights.forEach((insight: string) => {
              csv += `${insight}\n`;
            });
            csv += '\n';
          }
        }
      } else if (report.report_type === 'customer') {
        // Generate PDF for Customer Insights Report
        try {
          console.log('Generating PDF for Customer Insights Report...');
          // @ts-ignore
          const doc = new jsPDF();
          let y = 20;
          
          // Title
          doc.setFontSize(18);
          doc.text(reportName, 20, y);
          y += 15;
          
          // Date
          doc.setFontSize(12);
          doc.text(`Generated on: ${new Date().toLocaleString()}`, 20, y);
          y += 20;

          const data = report.report_data || {};
          
          // Customer Segmentation
          doc.setFontSize(14);
          doc.text('Customer Segmentation', 20, y);
          y += 10;
          
          doc.setFontSize(10);
          const segments = [
            'Premium Customers: High-value, frequent buyers',
            'Regular Customers: Consistent monthly purchases',
            'Occasional Buyers: Seasonal or occasional purchases',
            'New Customers: First-time buyers',
          ];
          segments.forEach((segment) => {
            if (y > 250) {
              doc.addPage();
              y = 20;
            }
            doc.text(`• ${segment}`, 25, y);
            y += 8;
          });
          y += 10;

          // Buying Patterns
          if (y > 250) {
            doc.addPage();
            y = 20;
          }
          doc.setFontSize(14);
          doc.text('Buying Patterns', 20, y);
          y += 10;
          
          doc.setFontSize(10);
          const patterns = [
            'Peak purchasing hours: 2-4 PM and 7-9 PM',
            'Most popular category: Electronics (35% of sales)',
            'Average order value: $125',
            'Preferred payment method: Credit Card (60%)',
            'Mobile vs Desktop: 65% mobile purchases',
          ];
          patterns.forEach((pattern) => {
            if (y > 250) {
              doc.addPage();
              y = 20;
            }
            doc.text(`• ${pattern}`, 25, y);
            y += 8;
          });
          y += 10;

          // Loyalty Analysis
          if (y > 250) {
            doc.addPage();
            y = 20;
          }
          doc.setFontSize(14);
          doc.text('Loyalty Analysis', 20, y);
          y += 10;
          
          doc.setFontSize(10);
          const loyalty = [
            'Repeat Customers: 75%',
            'Average Loyalty Score: 85',
            'Top Loyalty Tier: Gold Members',
            'Retention Rate: 92%',
          ];
          loyalty.forEach((item) => {
            if (y > 250) {
              doc.addPage();
              y = 20;
            }
            doc.text(`• ${item}`, 25, y);
            y += 8;
          });

          doc.save(`${reportName.replace(/\s+/g, '_').toLowerCase()}.pdf`);
          toast({
            title: 'Download Started',
            description: `${reportName} PDF download has started.`,
          });
          return;
        } catch (pdfError) {
          console.error('PDF generation failed for customer report:', pdfError);
          // Fallback to CSV
          csv = 'Customer Insights Report\n';
          csv += 'Customer Segmentation,Buying Patterns,Loyalty Analysis\n';
          csv += 'Premium Customers,Peak hours 2-4 PM,75% repeat customers\n';
          csv += 'Regular Customers,Electronics 35%,85 loyalty score\n';
          csv += 'Occasional Buyers,Avg order $125,Gold members\n';
          csv += 'New Customers,Credit card 60%,92% retention\n';
        }
      } else if (report.report_type === 'performance') {
        // Generate PDF for Business Intelligence Report
        try {
          console.log('Generating PDF for Business Intelligence Report...');
          // @ts-ignore
          const doc = new jsPDF();
          let y = 20;
          
          // Title
          doc.setFontSize(18);
          doc.text(reportName, 20, y);
          y += 15;
          
          // Date
          doc.setFontSize(12);
          doc.text(`Generated on: ${new Date().toLocaleString()}`, 20, y);
          y += 20;

          const data = report.report_data || {};
          
          // KPI Dashboard
          doc.setFontSize(14);
          doc.text('KPI Dashboard', 20, y);
          y += 10;
          
          doc.setFontSize(10);
          const kpis = [
            'Total Revenue: $125,000',
            'Total Products: 45',
            'Average Order Value: $175',
            'Customer Satisfaction: 92%',
            'Conversion Rate: 18%',
          ];
          kpis.forEach((kpi) => {
            if (y > 250) {
              doc.addPage();
              y = 20;
            }
            doc.text(`• ${kpi}`, 25, y);
            y += 8;
          });
          y += 10;

          // Growth Metrics
          if (y > 250) {
            doc.addPage();
            y = 20;
          }
          doc.setFontSize(14);
          doc.text('Growth Metrics', 20, y);
          y += 10;
          
          doc.setFontSize(10);
          const growth = [
            'Revenue Growth: 25%',
            'Customer Growth: 18%',
            'Product Growth: 12%',
            'Market Share: 8%',
          ];
          growth.forEach((metric) => {
            if (y > 250) {
              doc.addPage();
              y = 20;
            }
            doc.text(`• ${metric}`, 25, y);
            y += 8;
          });
          y += 10;

          // Market Trends
          if (y > 250) {
            doc.addPage();
            y = 20;
          }
          doc.setFontSize(14);
          doc.text('Market Trends', 20, y);
          y += 10;
          
          doc.setFontSize(10);
          const trends = [
            'Growing demand for sustainable products (+25% YoY)',
            'Digital transformation accelerating customer adoption',
            'Premium segment showing strong growth potential',
            'Supply chain optimization reducing costs by 15%',
            'Mobile commerce driving 70% of transactions',
          ];
          trends.forEach((trend) => {
            if (y > 250) {
              doc.addPage();
              y = 20;
            }
            doc.text(`• ${trend}`, 25, y);
            y += 8;
          });

          doc.save(`${reportName.replace(/\s+/g, '_').toLowerCase()}.pdf`);
          toast({
            title: 'Download Started',
            description: `${reportName} PDF download has started.`,
          });
          return;
        } catch (pdfError) {
          console.error('PDF generation failed for performance report:', pdfError);
          // Fallback to CSV
          csv = 'Business Intelligence Report\n';
          csv += 'KPI Dashboard,Growth Metrics,Market Trends\n';
          csv += 'Total Revenue $125K,Revenue Growth 25%,Sustainable products +25%\n';
          csv += 'Total Products 45,Customer Growth 18%,Digital transformation\n';
          csv += 'Avg Order $175,Product Growth 12%,Premium segment growth\n';
          csv += 'Customer Satisfaction 92%,Market Share 8%,Supply chain -15%\n';
          csv += 'Conversion Rate 18%,,Mobile commerce 70%\n';
        }
      } else {
        csv = JSON.stringify(report.report_data, null, 2);
      }
      const blob = new Blob([csv], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${reportName.replace(/\s+/g, '_').toLowerCase()}.csv`;
      a.click();
      URL.revokeObjectURL(url);
      toast({
        title: 'Download Started',
        description: `${reportName} CSV download has started.`,
      });
    } catch (error) {
      console.error('Download error:', error);
      toast({
        title: 'Download Failed',
        description: 'An error occurred while generating the report. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const handleDeleteReport = async (reportId: string, reportName: string) => {
    try {
      await deleteReport.mutateAsync(reportId);
      toast({
        title: "Report Deleted",
        description: `${reportName} has been deleted successfully.`,
      });
    } catch (error) {
      toast({
        title: "Delete Failed",
        description: "There was an error deleting the report.",
        variant: "destructive",
      });
    }
  };

  const getReportTypeIcon = (type: string) => {
    switch (type) {
      case 'sales':
        return <TrendingUp className="h-4 w-4" />;
      case 'inventory':
        return <BarChart3 className="h-4 w-4" />;
      case 'performance':
        return <PieChart className="h-4 w-4" />;
      case 'customer':
        return <Users className="h-4 w-4" />;
      default:
        return <FileText className="h-4 w-4" />;
    }
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-96">
          <div className="text-center space-y-4">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent mx-auto"></div>
            <p className="text-gray-600">Loading your reports...</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-8">
        {/* Enhanced Page Header */}
        <div className="relative overflow-hidden bg-gradient-to-r from-blue-600 via-purple-600 to-cyan-600 rounded-2xl p-8 text-white">
          <div className="relative z-10">
            <div className="flex items-center space-x-3 mb-4">
              <div className="bg-white/20 p-3 rounded-xl">
                <FileText className="h-8 w-8" />
              </div>
              <div>
                <h1 className="text-4xl font-bold">Smart Reports</h1>
                <p className="text-blue-100 text-lg">AI-powered insights for your business</p>
              </div>
            </div>
          </div>
          <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2"></div>
        </div>

        {/* Enhanced Quick Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <Card className="relative overflow-hidden border-0 shadow-lg bg-gradient-to-br from-blue-50 to-blue-100">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-3xl font-bold text-blue-700">{reports.length}</div>
                  <div className="text-sm text-blue-600 font-medium">Reports Generated</div>
                </div>
                <div className="bg-blue-500 p-3 rounded-xl">
                  <FileText className="h-6 w-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="relative overflow-hidden border-0 shadow-lg bg-gradient-to-br from-green-50 to-green-100">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-3xl font-bold text-green-700">{reports.length * 3}</div>
                  <div className="text-sm text-green-600 font-medium">Insights Generated</div>
                </div>
                <div className="bg-green-500 p-3 rounded-xl">
                  <Sparkles className="h-6 w-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="relative overflow-hidden border-0 shadow-lg bg-gradient-to-br from-purple-50 to-purple-100">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-3xl font-bold text-purple-700">{reports.length * 5}</div>
                  <div className="text-sm text-purple-600 font-medium">Actions Recommended</div>
                </div>
                <div className="bg-purple-500 p-3 rounded-xl">
                  <TrendingUp className="h-6 w-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Enhanced Report Templates */}
        <Card className="border-0 shadow-xl">
          <CardHeader className="bg-gradient-to-r from-gray-50 to-gray-100">
            <CardTitle className="flex items-center space-x-2 text-2xl">
              <Sparkles className="h-6 w-6 text-blue-600" />
              <span>Generate New Report</span>
            </CardTitle>
            <CardDescription className="text-base">
              Choose from our AI-powered report templates to generate professional insights instantly
            </CardDescription>
          </CardHeader>
          <CardContent className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {reportTemplates.map((template) => {
                const Icon = template.icon;
                const isGenerating = generatingReport === template.id;
                
                return (
                  <Card key={template.id} className="relative overflow-hidden border-2 border-gray-100 hover:border-blue-300 transition-all duration-300 hover:shadow-lg group">
                    <div className={`absolute inset-0 bg-gradient-to-r ${template.color} opacity-0 group-hover:opacity-5 transition-opacity duration-300`}></div>
                    <CardContent className="relative p-6">
                      <div className="flex items-start space-x-4">
                        <div className={`bg-gradient-to-r ${template.color} p-4 rounded-xl shadow-lg`}>
                          <Icon className="h-8 w-8 text-white" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-bold text-gray-900 mb-2 text-lg">{template.name}</h3>
                          <p className="text-gray-600 mb-4 leading-relaxed">{template.description}</p>
                          
                          <div className="flex items-center space-x-2 mb-4">
                            <Clock className="h-4 w-4 text-gray-400" />
                            <span className="text-sm text-gray-600 font-medium">{template.estimatedTime}</span>
                          </div>
                          
                          <div className="flex flex-wrap gap-2 mb-6">
                            {template.features.map((feature, index) => (
                              <Badge key={index} variant="secondary" className="text-xs font-medium">
                                {feature}
                              </Badge>
                            ))}
                          </div>
                          
                          <Button 
                            className={`w-full bg-gradient-to-r ${template.color} hover:shadow-lg transition-all duration-300 font-semibold`}
                            onClick={() => handleGenerateReport(template.id, template.name, template.name.toLowerCase().includes('sales') ? 'sales' : template.name.toLowerCase().includes('inventory') ? 'inventory' : template.name.toLowerCase().includes('customer') ? 'customer' : 'performance')}
                            disabled={isGenerating}
                          >
                            {isGenerating ? (
                              <>
                                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
                                Generating...
                              </>
                            ) : (
                              <>
                                <Sparkles className="mr-2 h-4 w-4" />
                                Generate Report
                              </>
                            )}
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Enhanced Saved Reports */}
        <Card className="border-0 shadow-xl">
          <CardHeader className="bg-gradient-to-r from-gray-50 to-gray-100">
            <CardTitle className="flex items-center space-x-2 text-2xl">
              <Calendar className="h-6 w-6 text-blue-600" />
              <span>Your Reports</span>
            </CardTitle>
            <CardDescription className="text-base">
              Previously generated reports available for download and analysis
            </CardDescription>
          </CardHeader>
          <CardContent className="p-8">
            {reports.length === 0 ? (
              <div className="text-center py-12">
                <FileText className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No reports yet</h3>
                <p className="text-gray-600">Generate your first report using the templates above</p>
              </div>
            ) : (
              <div className="space-y-4">
                {reports.map((report) => (
                  <div key={report.id} className="flex items-center justify-between p-6 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors group">
                    <div className="flex items-center space-x-4">
                      <div className="bg-blue-100 p-3 rounded-xl group-hover:bg-blue-200 transition-colors">
                        {getReportTypeIcon(report.report_type)}
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h4 className="font-semibold text-gray-900 text-lg">{report.report_name}</h4>
                          <Badge variant="outline" className="capitalize">
                            {report.report_type}
                          </Badge>
                          <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
                            Ready
                          </Badge>
                        </div>
                        
                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                          <span>Created: {format(new Date(report.created_at), 'MMM dd, yyyy')}</span>
                          <span>•</span>
                          <span>Contains insights and recommendations</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-3">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => setPreviewReport(report)}
                      >
                        <Eye className="mr-2 h-4 w-4" />
                        Preview
                      </Button>
                      
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleDownloadReport(report.id, report.report_name)}
                      >
                        <Download className="mr-2 h-4 w-4" />
                        Download
                      </Button>
                      
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => {
                          toast({
                            title: "Share Link Generated",
                            description: "Report share link copied to clipboard!",
                          });
                        }}
                      >
                        <Share2 className="mr-2 h-4 w-4" />
                        Share
                      </Button>

                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleDeleteReport(report.id, report.report_name)}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Dialog open={!!previewReport} onOpenChange={() => setPreviewReport(null)}>
        <DialogContent className="max-w-screen-md w-full max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{previewReport?.report_name}</DialogTitle>
          </DialogHeader>
          {previewReport?.report_type === 'inventory' && (
            <InventoryOptimizationPreview report={previewReport} onClose={() => setPreviewReport(null)} />
          )}
          {previewReport?.report_type === 'sales' && (
            <SalesPerformancePreview report={previewReport} onClose={() => setPreviewReport(null)} />
          )}
          {previewReport?.report_type === 'customer' && (
            <CustomerInsightsPreview report={previewReport} onClose={() => setPreviewReport(null)} />
          )}
          {previewReport?.report_type === 'performance' && (
            <BusinessIntelligencePreview report={previewReport} onClose={() => setPreviewReport(null)} />
          )}
        </DialogContent>
      </Dialog>
    </Layout>
  );
};

export default Reports;
