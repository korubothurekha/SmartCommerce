import { useState, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Upload as UploadIcon, FileText, CheckCircle, AlertCircle, Download, Eye } from "lucide-react";
import Layout from '../components/Layout';
import { toast } from "@/hooks/use-toast";
import Papa, { ParseResult } from 'papaparse';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '../contexts/AuthContext';

const Upload = () => {
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const { user } = useAuth();
  const [uploadSummary, setUploadSummary] = useState({ success: 0, failed: 0, errors: [] });
  const [productUploadSummary, setProductUploadSummary] = useState({ created: 0, updated: 0, failed: 0, errors: [] });
  const [uploadType, setUploadType] = useState('sales');

  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;
    setIsUploading(true);
    setUploadProgress(0);
    setUploadSummary({ success: 0, failed: 0, errors: [] });
    setProductUploadSummary({ created: 0, updated: 0, failed: 0, errors: [] });

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: async (results) => {
        const rows = results.data;
        let created = 0;
        let updated = 0;
        let failed = 0;
        let errors = [];

        const { data: existingProducts } = await supabase.from('products').select('product_id').eq('user_id', user.id);
        let productIds = (existingProducts || []).map(p => p.product_id);

        for (let i = 0; i < rows.length; i++) {
          try {
            const row = rows[i];
            const product_id = row.product_id?.trim();
            const name = row.name?.trim();
            if (!product_id || !name) {
              failed++;
              errors.push(`Row ${i + 2}: Missing required fields.`);
              continue;
            }
            const productData = {
              product_id,
              name,
              category: row.category || null,
              unit_price: parseFloat(row.unit_price) || 0,
              cost_price: parseFloat(row.cost_price) || 0,
              current_stock: parseInt(row.current_stock) || 0,
              min_stock_level: parseInt(row.min_stock_level) || 0,
              max_stock_level: parseInt(row.max_stock_level) || null,
              user_id: user.id,
            };

            if (productIds.includes(product_id)) {
              const { error } = await supabase.from('products').update(productData).eq('user_id', user.id).eq('product_id', product_id);
              if (error) {
                failed++;
                errors.push(`Row ${i + 2}: Update failed: ${error.message}`);
              } else {
                updated++;
              }
            } else {
              const { error } = await supabase.from('products').insert([productData]);
              if (error) {
                failed++;
                errors.push(`Row ${i + 2}: Insert failed: ${error.message}`);
              } else {
                created++;
                productIds.push(product_id);
              }
            }
            setUploadProgress(Math.round(((i + 1) / rows.length) * 100));
          } catch (err) {
            failed++;
            errors.push(`Row ${i + 2}: Unexpected error - ${err.message}`);
          }
        }

        setProductUploadSummary({ created, updated, failed, errors });
        setIsUploading(false);
        setUploadedFiles(prev => [
          {
            id: Date.now(),
            name: file.name,
            size: `${(file.size / 1024 / 1024).toFixed(2)} MB`,
            status: 'completed',
            rows: rows.length,
            uploadDate: new Date().toISOString().slice(0, 10),
            anomaliesDetected: failed,
          },
          ...prev,
        ]);

        toast({
          title: 'Upload Complete',
          description: `${created} created, ${updated} updated, ${failed} failed.`,
          variant: failed > 0 ? 'destructive' : 'default',
        });
      },
      error: (err) => {
        setIsUploading(false);
        toast({ title: 'Upload Failed', description: err.message, variant: 'destructive' });
      },
    });
  };

  const handleDragOver = useCallback((event) => {
    event.preventDefault();
  }, []);

  const handleDrop = useCallback((event) => {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    if (file) {
      handleFileUpload({ target: { files: event.dataTransfer.files } });
    }
  }, []);

  return (
    <Layout>
    <div className="space-y-8">
      {/* Enhanced Page Header */}
      <div className="relative overflow-hidden bg-gradient-to-r from-blue-600 via-purple-600 to-cyan-600 rounded-2xl p-8 text-white">
        <div className="relative z-10">
          <div className="flex items-center space-x-3 mb-4">
            <div className="bg-white/20 p-3 rounded-xl">
              <UploadIcon className="h-8 w-8" />
            </div>
            <div>
              <h1 className="text-4xl font-bold">Upload Data</h1>
              <p className="text-blue-100 text-lg">Upload your sales CSV files to generate insights and detect anomalies</p>
            </div>
          </div>
        </div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2"></div>
      </div>

      {/* Enhanced Upload Area */}
      <Card className="border-0 shadow-xl bg-gradient-to-br from-white to-gray-50/50 hover:shadow-2xl transition-all duration-500 group">
        <CardContent className="p-12">
          <div 
            className="text-center"
            onDragOver={handleDragOver}
            onDrop={handleDrop}
          >
            <div className="mx-auto h-20 w-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
              <UploadIcon className="h-10 w-10 text-white" />
            </div>
            
            <h3 className="text-2xl font-bold text-gray-900 mb-3">
              Upload your CSV file
            </h3>
            
            <p className="text-gray-600 mb-8 text-lg">
              Drag and drop your sales data file here, or click to browse
            </p>
            
            <div className="space-y-6">
              <label htmlFor="file-upload">
                <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 px-8 py-3 text-lg font-semibold" asChild>
                  <span className="cursor-pointer">
                    <UploadIcon className="mr-3 h-5 w-5" />
                    Choose File
                  </span>
                </Button>
              </label>
              
              <input
                id="file-upload"
                type="file"
                accept=".csv"
                onChange={handleFileUpload}
                className="hidden"
              />
              
              {isUploading && (
                <div className="max-w-md mx-auto">
                  <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
                    <Progress value={uploadProgress} className="h-4 mb-3" />
                    <p className="text-sm text-gray-600 font-medium">
                      Uploading... {Math.round(uploadProgress)}%
                    </p>
                  </div>
                </div>
              )}
            </div>
            
            <div className="mt-8 text-sm text-gray-500 bg-gray-50 rounded-xl p-4">
              <p className="font-medium mb-1">Supported format: CSV files only</p>
              <p>Maximum file size: 10MB</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Enhanced Sample CSV Format */}
      <Card className="border-0 shadow-xl bg-gradient-to-br from-white to-blue-50/30">
        <CardHeader className="bg-gradient-to-r from-gray-50 to-blue-50/50">
          <CardTitle className="flex items-center space-x-3 text-2xl">
            <div className="bg-blue-600 p-2 rounded-lg">
              <FileText className="h-6 w-6 text-white" />
            </div>
            <span>Expected CSV Format</span>
          </CardTitle>
          <CardDescription className="text-base">
            Your CSV should include the following columns for best results
          </CardDescription>
        </CardHeader>
        <CardContent className="p-8">
          <div className="bg-gradient-to-r from-gray-900 to-gray-800 p-6 rounded-xl font-mono text-sm text-green-400 shadow-lg">
            <div className="text-gray-300 mb-3 font-semibold">Sample format:</div>
            <div className="space-y-2">
              <div className="text-blue-400">product_name,category,quantity_sold,price,date,stock_remaining</div>
              <div className="text-gray-400">Rice 5kg,Groceries,25,250,2024-11-15,150</div>
              <div className="text-gray-400">Milk 1L,Dairy,40,60,2024-11-15,200</div>
              <div className="text-gray-400">Bread,Bakery,15,35,2024-11-15,80</div>
            </div>
          </div>
          
          <div className="mt-6 flex flex-wrap gap-4">
            <Button variant="outline" className="bg-white hover:bg-gray-50 border-2 hover:border-blue-300 transition-all duration-300">
              <Download className="mr-2 h-4 w-4" />
              Download Sample CSV
            </Button>
            <Button variant="outline" className="bg-white hover:bg-gray-50 border-2 hover:border-blue-300 transition-all duration-300">
              <Eye className="mr-2 h-4 w-4" />
              View Documentation
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Enhanced Upload History */}
      <Card className="border-0 shadow-xl bg-gradient-to-br from-white to-gray-50/50">
        <CardHeader className="bg-gradient-to-r from-gray-50 to-gray-100">
          <CardTitle className="text-2xl font-bold">Upload History</CardTitle>
          <CardDescription className="text-base">
            Previously uploaded files and their processing status
          </CardDescription>
        </CardHeader>
        <CardContent className="p-8">
          <div className="space-y-4">
            {uploadedFiles.map((file) => (
              <div key={file.id} className="flex items-center justify-between p-6 border-2 border-gray-100 rounded-xl hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 transition-all duration-300 hover:shadow-lg group">
                <div className="flex items-center space-x-6">
                  <div className="flex-shrink-0">
                    {file.status === 'completed' ? (
                      <div className="bg-green-100 p-3 rounded-xl group-hover:scale-110 transition-transform duration-300">
                        <CheckCircle className="h-8 w-8 text-green-600" />
                      </div>
                    ) : (
                      <div className="bg-yellow-100 p-3 rounded-xl group-hover:scale-110 transition-transform duration-300">
                        <AlertCircle className="h-8 w-8 text-yellow-600" />
                      </div>
                    )}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-3 mb-2">
                      <h4 className="font-bold text-gray-900 truncate text-lg">{file.name}</h4>
                      <Badge variant={file.status === 'completed' ? 'default' : 'secondary'} className="font-semibold">
                        {file.status}
                      </Badge>
                    </div>
                    
                    <div className="flex items-center space-x-6 text-sm text-gray-600">
                      <span className="font-medium">{file.size}</span>
                      <span className="text-gray-400">•</span>
                      <span className="font-medium">{file.rows.toLocaleString()} rows</span>
                      <span className="text-gray-400">•</span>
                      <span className="font-medium">Uploaded on {file.uploadDate}</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-4">
                  {file.anomaliesDetected > 0 && (
                    <Badge variant="destructive" className="flex items-center space-x-2 bg-red-100 text-red-800 border-red-200">
                      <AlertCircle className="h-4 w-4" />
                      <span className="font-semibold">{file.anomaliesDetected} alerts</span>
                    </Badge>
                  )}
                  
                  <Button variant="outline" size="sm" className="bg-white hover:bg-gray-50 border-2 hover:border-blue-300 transition-all duration-300">
                    View Details
                  </Button>
                </div>
              </div>
            ))}
            
            {uploadedFiles.length === 0 && (
              <div className="text-center py-12">
                <div className="bg-gray-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FileText className="h-8 w-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No uploads yet</h3>
                <p className="text-gray-600">Upload your first CSV file to get started</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  </Layout>
  );
};

export default Upload;

