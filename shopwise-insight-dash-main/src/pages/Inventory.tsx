import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Search, 
  Filter, 
  AlertTriangle, 
  TrendingDown, 
  TrendingUp,
  Package,
  Download,
  RefreshCw,
  Pencil,
  Trash2
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Layout from '../components/Layout';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '../contexts/AuthContext';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { toast } from '@/hooks/use-toast';

const Inventory = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [inventoryData, setInventoryData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();
  const [showAddModal, setShowAddModal] = useState(false);
  const [addForm, setAddForm] = useState({
    name: '',
    category: '',
    current_stock: '',
    unit_price: '',
    product_id: '',
    cost_price: '',
    min_stock_level: '',
    max_stock_level: '',
    total_products_sold: '',
  });
  const [addLoading, setAddLoading] = useState(false);
  const [addErrors, setAddErrors] = useState<any>({});
  const [editProduct, setEditProduct] = useState<any | null>(null);
  const [editForm, setEditForm] = useState({
    name: '',
    category: '',
    current_stock: '',
    unit_price: '',
    product_id: '',
    id: '',
    cost_price: '',
    min_stock_level: '',
    max_stock_level: '',
    total_products_sold: '',
  });
  const [editLoading, setEditLoading] = useState(false);
  const [editErrors, setEditErrors] = useState<any>({});
  const [showDeleteId, setShowDeleteId] = useState<string | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  useEffect(() => {
    const fetchInventory = async () => {
      if (!user) return;
      setLoading(true);
      setError(null);
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('user_id', user.id);
      if (error) {
        setError(error.message);
        setInventoryData([]);
      } else {
        setInventoryData(data || []);
      }
      setLoading(false);
    };
    fetchInventory();
  }, [user]);

  const getStatusBadge = (status: string) => {
    
    switch (status) {
      case 'overstock':
        
        return <Badge variant="destructive">Overstock</Badge>;
      case 'low_stock':
        return <Badge variant="destructive">Low Stock</Badge>;
      case 'demand_spike':
        return <Badge className="bg-orange-500 hover:bg-orange-600">Demand Spike</Badge>;
      case 'dead_stock':
        return <Badge variant="secondary">Dead Stock</Badge>;
      case 'healthy':
        return <Badge className="bg-green-500 hover:bg-green-600">Healthy</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  const getSeverityIcon = (severity: string | null) => {
    if (!severity) return null;
    
    switch (severity) {
      case 'high':
        return <AlertTriangle className="h-4 w-4 text-red-600" />;
      case 'medium':
        return <AlertTriangle className="h-4 w-4 text-yellow-600" />;
      case 'low':
        return <AlertTriangle className="h-4 w-4 text-gray-600" />;
      default:
        return null;
    }
  };

  const filteredData = inventoryData.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.category.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = filterCategory === 'all' || 
                           item.category.toLowerCase().includes(filterCategory.toLowerCase());
    
    const matchesStatus = filterStatus === 'all' || item.status === filterStatus;
    
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const summaryStats = {
    totalProducts: inventoryData.length,
    healthyProducts: inventoryData.filter(item => item.status === 'healthy').length,
    alertProducts: inventoryData.filter(item => item.anomaly).length,
    lowStockProducts: inventoryData.filter(item => item.status === 'low_stock').length
  };

  const handleAddChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAddForm({ ...addForm, [e.target.name]: e.target.value });
  };

  const validateProductForm = (form: any) => {
    const errors: any = {};
    if (!form.name) errors.name = 'Name is required';
    if (!form.category) errors.category = 'Category is required';
    if (!form.product_id) errors.product_id = 'Product ID is required';
    if (!form.current_stock || isNaN(Number(form.current_stock)) || Number(form.current_stock) < 0) errors.current_stock = 'Stock must be 0 or more';
    if (!form.unit_price || isNaN(Number(form.unit_price)) || Number(form.unit_price) < 0) errors.unit_price = 'Unit price must be 0 or more';
    if (form.cost_price && (isNaN(Number(form.cost_price)) || Number(form.cost_price) < 0)) errors.cost_price = 'Cost price must be 0 or more';
    if (form.min_stock_level && (isNaN(Number(form.min_stock_level)) || Number(form.min_stock_level) < 0)) errors.min_stock_level = 'Min stock must be 0 or more';
    if (form.max_stock_level && (isNaN(Number(form.max_stock_level)) || Number(form.max_stock_level) < 0)) errors.max_stock_level = 'Max stock must be 0 or more';
    return errors;
  };

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    const errors = validateProductForm(addForm);
    setAddErrors(errors);
    if (Object.keys(errors).length > 0) return;
    setAddLoading(true);
    const { name, category, current_stock, unit_price, product_id, cost_price, min_stock_level, max_stock_level, total_products_sold } = addForm;
    const { error } = await supabase.from('products').insert([
      {
        name,
        category,
        current_stock: Number(current_stock),
        unit_price: Number(unit_price),
        product_id,
        user_id: user.id,
        cost_price: cost_price ? Number(cost_price) : null,
        min_stock_level: min_stock_level ? Number(min_stock_level) : null,
        max_stock_level: max_stock_level ? Number(max_stock_level) : null,
        total_products_sold: total_products_sold ? Number(total_products_sold) : 0,
        updated_at: new Date().toISOString(),
      },
    ]);
    setAddLoading(false);
    if (error) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    } else {
      toast({ title: 'Product added', description: 'Product created successfully.' });
      setShowAddModal(false);
      setAddForm({ name: '', category: '', current_stock: '', unit_price: '', product_id: '', cost_price: '', min_stock_level: '', max_stock_level: '', total_products_sold: '' });
      setAddErrors({});
      // Refresh inventory
      if (user) {
        setLoading(true);
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .eq('user_id', user.id);
        if (!error) setInventoryData(data || []);
        setLoading(false);
      }
    }
  };

  const openEditModal = (product: any) => {
    setEditProduct(product);
    setEditForm({
      name: product.name || '',
      category: product.category || '',
      current_stock: product.current_stock?.toString() || '',
      unit_price: product.unit_price?.toString() || '',
      product_id: product.product_id || '',
      id: product.id,
      cost_price: product.cost_price?.toString() || '',
      min_stock_level: product.min_stock_level?.toString() || '',
      max_stock_level: product.max_stock_level?.toString() || '',
      total_products_sold: product.total_products_sold || '',
    });
    setEditErrors({});
  };

  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditForm({ ...editForm, [e.target.name]: e.target.value });
  };

  const handleEditProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !editForm.id) return;
    const errors = validateProductForm(editForm);
    setEditErrors(errors);
    if (Object.keys(errors).length > 0) return;
    setEditLoading(true);
    const { name, category, current_stock, unit_price, product_id, cost_price, min_stock_level, max_stock_level, total_products_sold } = editForm;
    const { error } = await supabase.from('products').update({
      name,
      category,
      current_stock: Number(current_stock),
      unit_price: Number(unit_price),
      product_id,
      cost_price: cost_price ? Number(cost_price) : null,
      min_stock_level: min_stock_level ? Number(min_stock_level) : null,
      max_stock_level: max_stock_level ? Number(max_stock_level) : null,
      total_products_sold: total_products_sold ? Number(total_products_sold) : 0,
      updated_at: new Date().toISOString(),
    }).eq('id', editForm.id);
    setEditLoading(false);
    if (error) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    } else {
      toast({ title: 'Product updated', description: 'Product updated successfully.' });
      setEditProduct(null);
      setEditErrors({});
      // Refresh inventory
      if (user) {
        setLoading(true);
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .eq('user_id', user.id);
        if (!error) setInventoryData(data || []);
        setLoading(false);
      }
    }
  };

  const handleDeleteProduct = async () => {
    if (!user || !showDeleteId) return;
    setDeleteLoading(true);
    const { error } = await supabase.from('products').delete().eq('id', showDeleteId);
    setDeleteLoading(false);
    if (error) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    } else {
      toast({ title: 'Product deleted', description: 'Product deleted successfully.' });
      setShowDeleteId(null);
      // Refresh inventory
      if (user) {
        setLoading(true);
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .eq('user_id', user.id);
        if (!error) setInventoryData(data || []);
        setLoading(false);
      }
    }
  };

  const handleExportInventory = () => {
    if (inventoryData.length === 0) {
      toast({ title: 'No Data', description: 'No inventory data to export.', variant: 'destructive' });
      return;
    }

    // Create CSV content
    const headers = [
      'Name',
      'Category', 
      'Product ID',
      'Current Stock',
      'Unit Price',
      'Cost Price',
      'Total Products Sold',
      'Min Stock Level',
      'Max Stock Level',
      'Created Date',
      'Updated Date'
    ];

    const csvContent = [
      headers.join(','),
      ...inventoryData.map(item => [
        `"${item.name}"`,
        `"${item.category}"`,
        `"${item.product_id}"`,
        item.current_stock,
        item.unit_price,
        item.cost_price || '',
        item.total_products_sold || 0,
        item.min_stock_level || '',
        item.max_stock_level || '',
        item.created_at ? new Date(item.created_at).toLocaleDateString() : '',
        item.updated_at ? new Date(item.updated_at).toLocaleDateString() : ''
      ].join(','))
    ].join('\n');

    // Create and download file
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `inventory_export_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    toast({ 
      title: 'Export Successful', 
      description: `Inventory data exported successfully. ${inventoryData.length} products included.` 
    });
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-96">
          <div className="text-center space-y-4">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent mx-auto"></div>
            <p className="text-lg text-gray-600">Loading inventory...</p>
          </div>
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
        {/* Enhanced Page Header */}
        <div className="relative overflow-hidden bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 rounded-2xl p-8 text-white">
          <div className="relative z-10">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
              <div>
                <div className="flex items-center space-x-3 mb-4">
                  <div className="bg-white/20 p-3 rounded-xl">
                    <Package className="h-8 w-8" />
                  </div>
                  <div>
                    <h1 className="text-4xl font-bold">Inventory Management</h1>
                    <p className="text-green-100 text-lg">Monitor stock levels and get alerts for anomalies.</p>
                  </div>
                </div>
              </div>
              <div className="mt-4 sm:mt-0 flex space-x-3">
                <Button variant="outline" onClick={() => setShowAddModal(true)} className="bg-white/20 border-white/30 text-white hover:bg-white/30 transition-all duration-300">
                  + Add Product
                </Button>
                <Button variant="outline" className="bg-white/20 border-white/30 text-white hover:bg-white/30 transition-all duration-300">
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Refresh
                </Button>
                <Button className="bg-white text-green-700 hover:bg-gray-100 shadow-lg hover:shadow-xl transition-all duration-300" onClick={handleExportInventory}>
                  <Download className="mr-2 h-4 w-4" />
                  Export
                </Button>
              </div>
            </div>
          </div>
          <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2"></div>
        </div>

        {/* Enhanced Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="hover:shadow-xl transition-all duration-500 border-0 bg-gradient-to-br from-blue-50 to-blue-100/50 group">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
              <CardTitle className="text-sm font-semibold text-blue-900">Total Products</CardTitle>
              <div className="bg-blue-600 p-3 rounded-xl group-hover:scale-110 transition-transform duration-300">
                <Package className="h-5 w-5 text-white" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-blue-700">{summaryStats.totalProducts}</div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-xl transition-all duration-500 border-0 bg-gradient-to-br from-green-50 to-green-100/50 group">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
              <CardTitle className="text-sm font-semibold text-green-900">Healthy Stock</CardTitle>
              <div className="bg-green-600 p-3 rounded-xl group-hover:scale-110 transition-transform duration-300">
                <TrendingUp className="h-5 w-5 text-white" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-700">{summaryStats.healthyProducts}</div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-xl transition-all duration-500 border-0 bg-gradient-to-br from-red-50 to-red-100/50 group">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
              <CardTitle className="text-sm font-semibold text-red-900">Active Alerts</CardTitle>
              <div className="bg-red-600 p-3 rounded-xl group-hover:scale-110 transition-transform duration-300">
                <AlertTriangle className="h-5 w-5 text-white" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-red-700">{summaryStats.alertProducts}</div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-xl transition-all duration-500 border-0 bg-gradient-to-br from-orange-50 to-orange-100/50 group">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
              <CardTitle className="text-sm font-semibold text-orange-900">Low Stock</CardTitle>
              <div className="bg-orange-600 p-3 rounded-xl group-hover:scale-110 transition-transform duration-300">
                <TrendingDown className="h-5 w-5 text-white" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-orange-700">{summaryStats.lowStockProducts}</div>
            </CardContent>
          </Card>
        </div>

        {/* Enhanced Filters */}
        <Card className="border-0 shadow-xl bg-gradient-to-br from-white to-gray-50/50">
          <CardHeader className="bg-gradient-to-r from-gray-50 to-blue-50/30">
            <CardTitle className="text-2xl">Inventory Filters</CardTitle>
            <CardDescription className="text-base">Filter and search your inventory</CardDescription>
          </CardHeader>
          <CardContent className="p-8">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <Input
                    placeholder="Search products..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-12 h-12 text-lg border-2 border-gray-200 focus:border-blue-500 transition-all duration-300"
                  />
                </div>
              </div>
              
              <Select value={filterCategory} onValueChange={setFilterCategory}>
                <SelectTrigger className="w-full sm:w-48 h-12 text-lg border-2 border-gray-200 focus:border-blue-500 transition-all duration-300">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="groceries">Groceries</SelectItem>
                  <SelectItem value="dairy">Dairy</SelectItem>
                  <SelectItem value="packaged">Packaged Food</SelectItem>
                  <SelectItem value="healthcare">Healthcare</SelectItem>
                  <SelectItem value="clothing">Clothing</SelectItem>
                  <SelectItem value="bakery">Bakery</SelectItem>
                </SelectContent>
              </Select>

              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-full sm:w-48 h-12 text-lg border-2 border-gray-200 focus:border-blue-500 transition-all duration-300">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="healthy">Healthy</SelectItem>
                  <SelectItem value="low_stock">Low Stock</SelectItem>
                  <SelectItem value="overstock">Overstock</SelectItem>
                  <SelectItem value="dead_stock">Dead Stock</SelectItem>
                  <SelectItem value="demand_spike">Demand Spike</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Enhanced Inventory Table */}
        <Card className="border-0 shadow-xl bg-gradient-to-br from-white to-gray-50/50">
          <CardHeader className="bg-gradient-to-r from-gray-50 to-green-50/30">
            <CardTitle className="text-2xl">Inventory Details</CardTitle>
            <CardDescription className="text-base">
              Showing {filteredData.length} of {inventoryData.length} products
            </CardDescription>
          </CardHeader>
          <CardContent className="p-8">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b-2 border-gray-200">
                    <th className="text-left py-4 px-4 font-semibold text-gray-700 text-lg">Name</th>
                    <th className="text-left py-4 px-4 font-semibold text-gray-700 text-lg">Category</th>
                    <th className="text-left py-4 px-4 font-semibold text-gray-700 text-lg">Product ID</th>
                    <th className="text-left py-4 px-4 font-semibold text-gray-700 text-lg">Stock</th>
                    <th className="text-left py-4 px-4 font-semibold text-gray-700 text-lg">Unit Price</th>
                    <th className="text-left py-4 px-4 font-semibold text-gray-700 text-lg">Cost Price</th>
                    <th className="text-left py-4 px-4 font-semibold text-gray-700 text-lg">Total Sold</th>
                    <th className="text-left py-4 px-4 font-semibold text-gray-700 text-lg">Min Stock</th>
                    <th className="text-left py-4 px-4 font-semibold text-gray-700 text-lg">Max Stock</th>
                    <th className="text-left py-4 px-4 font-semibold text-gray-700 text-lg">Created</th>
                    <th className="text-left py-4 px-4 font-semibold text-gray-700 text-lg">Updated</th>
                    <th className="text-left py-4 px-4 font-semibold text-gray-700 text-lg">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredData.map((item) => (
                    <tr key={item.id} className="border-b border-gray-100 hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 transition-all duration-300">
                      <td className="py-4 px-4 font-medium">{item.name}</td>
                      <td className="py-4 px-4">{item.category}</td>
                      <td className="py-4 px-4 font-mono text-sm">{item.product_id}</td>
                      <td className="py-4 px-4 font-semibold">{item.current_stock}</td>
                      <td className="py-4 px-4 font-semibold text-green-700">₹{item.unit_price}</td>
                      <td className="py-4 px-4">{item.cost_price !== null ? `₹${item.cost_price}` : '-'}</td>
                      <td className="py-4 px-4 font-semibold text-blue-700">{item.total_products_sold}</td>
                      <td className="py-4 px-4">{item.min_stock_level ?? '-'}</td>
                      <td className="py-4 px-4">{item.max_stock_level ?? '-'}</td>
                      <td className="py-4 px-4 text-xs text-gray-500">{item.created_at ? new Date(item.created_at).toLocaleDateString() : '-'}</td>
                      <td className="py-4 px-4 text-xs text-gray-500">{item.updated_at ? new Date(item.updated_at).toLocaleDateString() : '-'}</td>
                      <td className="py-4 px-4">
                        <div className="flex space-x-2">
                          <Button size="icon" variant="ghost" onClick={() => openEditModal(item)} className="hover:bg-blue-100 hover:text-blue-700 transition-all duration-300">
                            <Pencil className="w-4 h-4" />
                          </Button>
                          <Button size="icon" variant="ghost" onClick={() => setShowDeleteId(item.id)} className="hover:bg-red-100 hover:text-red-700 transition-all duration-300">
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Enhanced Add Product Modal */}
        <Dialog open={showAddModal} onOpenChange={setShowAddModal}>
          <DialogContent className="max-w-md w-full mx-auto overflow-y-auto max-h-[80vh] border-0 shadow-2xl">
            <DialogHeader className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-t-lg">
              <DialogTitle className="text-2xl font-bold text-gray-900">Add New Product</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleAddProduct} className="space-y-6 p-6">
              <div className="grid grid-cols-1 gap-6">
                <div>
                  <Label htmlFor="name" className="text-sm font-semibold text-gray-700">Name</Label>
                  <Input id="name" name="name" value={addForm.name} onChange={handleAddChange} required className="w-full h-12 text-lg border-2 border-gray-200 focus:border-blue-500 transition-all duration-300" />
                </div>
                <div>
                  <Label htmlFor="category" className="text-sm font-semibold text-gray-700">Category</Label>
                  <Input id="category" name="category" value={addForm.category} onChange={handleAddChange} required className="w-full h-12 text-lg border-2 border-gray-200 focus:border-blue-500 transition-all duration-300" />
                </div>
                <div>
                  <Label htmlFor="product_id" className="text-sm font-semibold text-gray-700">Product ID</Label>
                  <Input id="product_id" name="product_id" value={addForm.product_id} onChange={handleAddChange} required className="w-full h-12 text-lg border-2 border-gray-200 focus:border-blue-500 transition-all duration-300" />
                </div>
                <div>
                  <Label htmlFor="current_stock" className="text-sm font-semibold text-gray-700">Current Stock</Label>
                  <Input id="current_stock" name="current_stock" type="number" value={addForm.current_stock} onChange={handleAddChange} required className="w-full h-12 text-lg border-2 border-gray-200 focus:border-blue-500 transition-all duration-300" />
                </div>
                <div>
                  <Label htmlFor="unit_price" className="text-sm font-semibold text-gray-700">Unit Price</Label>
                  <Input id="unit_price" name="unit_price" type="number" value={addForm.unit_price} onChange={handleAddChange} required className="w-full h-12 text-lg border-2 border-gray-200 focus:border-blue-500 transition-all duration-300" />
                </div>
                <div>
                  <Label htmlFor="cost_price" className="text-sm font-semibold text-gray-700">Cost Price</Label>
                  <Input id="cost_price" name="cost_price" type="number" value={addForm.cost_price} onChange={handleAddChange} className="w-full h-12 text-lg border-2 border-gray-200 focus:border-blue-500 transition-all duration-300" />
                </div>
                <div>
                  <Label htmlFor="total_products_sold" className="text-sm font-semibold text-gray-700">Total Products Sold</Label>
                  <Input id="total_products_sold" name="total_products_sold" type="number" value={addForm.total_products_sold} onChange={handleAddChange} className="w-full h-12 text-lg border-2 border-gray-200 focus:border-blue-500 transition-all duration-300" />
                </div>
                <div>
                  <Label htmlFor="min_stock_level" className="text-sm font-semibold text-gray-700">Min Stock Level</Label>
                  <Input id="min_stock_level" name="min_stock_level" type="number" value={addForm.min_stock_level} onChange={handleAddChange} className="w-full h-12 text-lg border-2 border-gray-200 focus:border-blue-500 transition-all duration-300" />
                </div>
                <div>
                  <Label htmlFor="max_stock_level" className="text-sm font-semibold text-gray-700">Max Stock Level</Label>
                  <Input id="max_stock_level" name="max_stock_level" type="number" value={addForm.max_stock_level} onChange={handleAddChange} className="w-full h-12 text-lg border-2 border-gray-200 focus:border-blue-500 transition-all duration-300" />
                </div>
              </div>
              <DialogFooter className="pt-6">
                <Button type="button" variant="outline" onClick={() => setShowAddModal(false)} className="h-12 px-6 text-lg">
                  Cancel
                </Button>
                <Button type="submit" disabled={addLoading} className="h-12 px-6 text-lg bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                  {addLoading ? 'Adding...' : 'Add Product'}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>

        {/* Enhanced Edit Product Modal */}
        <Dialog open={!!editProduct} onOpenChange={v => { if (!v) setEditProduct(null); }}>
          <DialogContent className="max-w-md w-full mx-auto overflow-y-auto max-h-[80vh] border-0 shadow-2xl">
            <DialogHeader className="bg-gradient-to-r from-green-50 to-blue-50 p-6 rounded-t-lg">
              <DialogTitle className="text-2xl font-bold text-gray-900">Edit Product</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleEditProduct} className="space-y-6 p-6">
              <div className="grid grid-cols-1 gap-6">
                <div>
                  <Label htmlFor="edit_name" className="text-sm font-semibold text-gray-700">Name</Label>
                  <Input id="edit_name" name="name" value={editForm.name} onChange={handleEditChange} required className="w-full h-12 text-lg border-2 border-gray-200 focus:border-blue-500 transition-all duration-300" />
                </div>
                <div>
                  <Label htmlFor="edit_category" className="text-sm font-semibold text-gray-700">Category</Label>
                  <Input id="edit_category" name="category" value={editForm.category} onChange={handleEditChange} required className="w-full h-12 text-lg border-2 border-gray-200 focus:border-blue-500 transition-all duration-300" />
                </div>
                <div>
                  <Label htmlFor="edit_product_id" className="text-sm font-semibold text-gray-700">Product ID</Label>
                  <Input id="edit_product_id" name="product_id" value={editForm.product_id} onChange={handleEditChange} required className="w-full h-12 text-lg border-2 border-gray-200 focus:border-blue-500 transition-all duration-300" />
                </div>
                <div>
                  <Label htmlFor="edit_current_stock" className="text-sm font-semibold text-gray-700">Current Stock</Label>
                  <Input id="edit_current_stock" name="current_stock" type="number" value={editForm.current_stock} onChange={handleEditChange} required className="w-full h-12 text-lg border-2 border-gray-200 focus:border-blue-500 transition-all duration-300" />
                </div>
                <div>
                  <Label htmlFor="edit_unit_price" className="text-sm font-semibold text-gray-700">Unit Price</Label>
                  <Input id="edit_unit_price" name="unit_price" type="number" value={editForm.unit_price} onChange={handleEditChange} required className="w-full h-12 text-lg border-2 border-gray-200 focus:border-blue-500 transition-all duration-300" />
                </div>
                <div>
                  <Label htmlFor="edit_cost_price" className="text-sm font-semibold text-gray-700">Cost Price</Label>
                  <Input id="edit_cost_price" name="cost_price" type="number" value={editForm.cost_price} onChange={handleEditChange} className="w-full h-12 text-lg border-2 border-gray-200 focus:border-blue-500 transition-all duration-300" />
                </div>
                <div>
                  <Label htmlFor="edit_total_products_sold" className="text-sm font-semibold text-gray-700">Total Products Sold</Label>
                  <Input id="edit_total_products_sold" name="total_products_sold" type="number" value={editForm.total_products_sold} onChange={handleEditChange} className="w-full h-12 text-lg border-2 border-gray-200 focus:border-blue-500 transition-all duration-300" />
                </div>
                <div>
                  <Label htmlFor="edit_min_stock_level" className="text-sm font-semibold text-gray-700">Min Stock Level</Label>
                  <Input id="edit_min_stock_level" name="min_stock_level" type="number" value={editForm.min_stock_level} onChange={handleEditChange} className="w-full h-12 text-lg border-2 border-gray-200 focus:border-blue-500 transition-all duration-300" />
                </div>
                <div>
                  <Label htmlFor="edit_max_stock_level" className="text-sm font-semibold text-gray-700">Max Stock Level</Label>
                  <Input id="edit_max_stock_level" name="max_stock_level" type="number" value={editForm.max_stock_level} onChange={handleEditChange} className="w-full h-12 text-lg border-2 border-gray-200 focus:border-blue-500 transition-all duration-300" />
                </div>
              </div>
              <DialogFooter className="pt-6">
                <Button type="button" variant="outline" onClick={() => setEditProduct(null)} className="h-12 px-6 text-lg">
                  Cancel
                </Button>
                <Button type="submit" disabled={editLoading} className="h-12 px-6 text-lg bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700">
                  {editLoading ? 'Saving...' : 'Save Changes'}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>

        {/* Enhanced Delete Confirmation Dialog */}
        <Dialog open={!!showDeleteId} onOpenChange={v => { if (!v) setShowDeleteId(null); }}>
          <DialogContent className="border-0 shadow-2xl">
            <DialogHeader className="bg-gradient-to-r from-red-50 to-pink-50 p-6 rounded-t-lg">
              <DialogTitle className="text-2xl font-bold text-red-900">Delete Product</DialogTitle>
            </DialogHeader>
            <div className="p-6 text-lg text-gray-700">Are you sure you want to delete this product? This action cannot be undone.</div>
            <DialogFooter className="p-6">
              <Button type="button" variant="outline" onClick={() => setShowDeleteId(null)} className="h-12 px-6 text-lg">
                Cancel
              </Button>
              <Button type="button" variant="destructive" onClick={handleDeleteProduct} disabled={deleteLoading} className="h-12 px-6 text-lg bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700">
                {deleteLoading ? 'Deleting...' : 'Delete'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </Layout>
  );
};

export default Inventory;
