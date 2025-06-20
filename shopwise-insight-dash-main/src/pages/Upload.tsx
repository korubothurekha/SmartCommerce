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
  const [uploadType, setUploadType] = useState('sales');
  const [productUploadSummary, setProductUploadSummary] = useState({ created: 0, updated: 0, failed: 0, errors: [] });

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
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Upload Data</h1>
        <p className="text-gray-600 mt-1">Upload your sales CSV files to generate insights and detect anomalies.</p>
      </div>

      {/* Upload Area */}
      <Card className="border-2 border-dashed border-gray-300 hover:border-blue-400 transition-colors">
        <CardContent className="p-8">
          <div 
            className="text-center"
            onDragOver={handleDragOver}
            onDrop={handleDrop}
          >
            <div className="mx-auto h-16 w-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
              <UploadIcon className="h-8 w-8 text-blue-600" />
            </div>
            
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Upload your CSV file
            </h3>
            
            <p className="text-gray-600 mb-6">
              Drag and drop your sales data file here, or click to browse
            </p>
            
            <div className="space-y-4">
              <label htmlFor="file-upload">
                <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700" asChild>
                  <span className="cursor-pointer">
                    <UploadIcon className="mr-2 h-4 w-4" />
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
                  <Progress value={uploadProgress} className="h-3" />
                  <p className="text-sm text-gray-600 mt-2">
                    Uploading... {Math.round(uploadProgress)}%
                  </p>
                </div>
              )}
            </div>
            
            <div className="mt-6 text-sm text-gray-500">
              <p>Supported format: CSV files only</p>
              <p>Maximum file size: 10MB</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Sample CSV Format */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <FileText className="h-5 w-5" />
            <span>Expected CSV Format</span>
          </CardTitle>
          <CardDescription>
            Your CSV should include the following columns for best results
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="bg-gray-50 p-4 rounded-lg font-mono text-sm">
            <div className="text-gray-600 mb-2">Sample format:</div>
            <div className="space-y-1">
              <div>product_name,category,quantity_sold,price,date,stock_remaining</div>
              <div className="text-gray-500">Rice 5kg,Groceries,25,250,2024-11-15,150</div>
              <div className="text-gray-500">Milk 1L,Dairy,40,60,2024-11-15,200</div>
              <div className="text-gray-500">Bread,Bakery,15,35,2024-11-15,80</div>
            </div>
          </div>
          
          <div className="mt-4">
            <Button variant="outline" className="mr-4">
              <Download className="mr-2 h-4 w-4" />
              Download Sample CSV
            </Button>
            <Button variant="outline">
              <Eye className="mr-2 h-4 w-4" />
              View Documentation
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Upload History */}
      <Card>
        <CardHeader>
          <CardTitle>Upload History</CardTitle>
          <CardDescription>
            Previously uploaded files and their processing status
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {uploadedFiles.map((file) => (
              <div key={file.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                <div className="flex items-center space-x-4">
                  <div className="flex-shrink-0">
                    {file.status === 'completed' ? (
                      <CheckCircle className="h-8 w-8 text-green-600" />
                    ) : (
                      <AlertCircle className="h-8 w-8 text-yellow-600" />
                    )}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2 mb-1">
                      <h4 className="font-medium text-gray-900 truncate">{file.name}</h4>
                      <Badge variant={file.status === 'completed' ? 'default' : 'secondary'}>
                        {file.status}
                      </Badge>
                    </div>
                    
                    <div className="flex items-center space-x-4 text-sm text-gray-600">
                      <span>{file.size}</span>
                      <span>•</span>
                      <span>{file.rows.toLocaleString()} rows</span>
                      <span>•</span>
                      <span>Uploaded on {file.uploadDate}</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-4">
                  {file.anomaliesDetected > 0 && (
                    <Badge variant="destructive" className="flex items-center space-x-1">
                      <AlertCircle className="h-3 w-3" />
                      <span>{file.anomaliesDetected} alerts</span>
                    </Badge>
                  )}
                  
                  <Button variant="outline" size="sm">
                    View Details
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  </Layout>
  );
};

export default Upload;

