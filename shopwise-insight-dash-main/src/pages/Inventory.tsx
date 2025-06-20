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
    const { name, category, current_stock, unit_price, product_id, cost_price, min_stock_level, max_stock_level } = addForm;
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
        updated_at: new Date().toISOString(),
      },
    ]);
    setAddLoading(false);
    if (error) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    } else {
      toast({ title: 'Product added', description: 'Product created successfully.' });
      setShowAddModal(false);
      setAddForm({ name: '', category: '', current_stock: '', unit_price: '', product_id: '', cost_price: '', min_stock_level: '', max_stock_level: '' });
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
    const { name, category, current_stock, unit_price, product_id, cost_price, min_stock_level, max_stock_level } = editForm;
    const { error } = await supabase.from('products').update({
      name,
      category,
      current_stock: Number(current_stock),
      unit_price: Number(unit_price),
      product_id,
      cost_price: cost_price ? Number(cost_price) : null,
      min_stock_level: min_stock_level ? Number(min_stock_level) : null,
      max_stock_level: max_stock_level ? Number(max_stock_level) : null,
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

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-96">
          <span className="text-lg text-gray-600">Loading inventory...</span>
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
            <h1 className="text-3xl font-bold text-gray-900">Inventory Management</h1>
            <p className="text-gray-600 mt-1">Monitor stock levels and get alerts for anomalies.</p>
          </div>
          <div className="mt-4 sm:mt-0 flex space-x-3">
            <Button variant="outline" onClick={() => setShowAddModal(true)}>
              + Add Product
            </Button>
            <Button variant="outline">
              <RefreshCw className="mr-2 h-4 w-4" />
              Refresh
            </Button>
            <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
              <Download className="mr-2 h-4 w-4" />
              Export
            </Button>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Total Products</CardTitle>
              <Package className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">{summaryStats.totalProducts}</div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Healthy Stock</CardTitle>
              <TrendingUp className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{summaryStats.healthyProducts}</div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Active Alerts</CardTitle>
              <AlertTriangle className="h-4 w-4 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">{summaryStats.alertProducts}</div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Low Stock</CardTitle>
              <TrendingDown className="h-4 w-4 text-orange-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">{summaryStats.lowStockProducts}</div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card>
          <CardHeader>
            <CardTitle>Inventory Filters</CardTitle>
            <CardDescription>Filter and search your inventory</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Search products..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              
              <Select value={filterCategory} onValueChange={setFilterCategory}>
                <SelectTrigger className="w-full sm:w-48">
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
                <SelectTrigger className="w-full sm:w-48">
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

        {/* Inventory Table */}
        <Card>
          <CardHeader>
            <CardTitle>Inventory Details</CardTitle>
            <CardDescription>
              Showing {filteredData.length} of {inventoryData.length} products
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 font-medium text-gray-600">Name</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-600">Category</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-600">Product ID</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-600">Stock</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-600">Unit Price</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-600">Cost Price</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-600">Min Stock</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-600">Max Stock</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-600">Created</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-600">Updated</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-600">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredData.map((item) => (
                    <tr key={item.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-4 px-4">{item.name}</td>
                      <td className="py-4 px-4">{item.category}</td>
                      <td className="py-4 px-4">{item.product_id}</td>
                      <td className="py-4 px-4">{item.current_stock}</td>
                      <td className="py-4 px-4">₹{item.unit_price}</td>
                      <td className="py-4 px-4">{item.cost_price !== null ? `₹${item.cost_price}` : '-'}</td>
                      <td className="py-4 px-4">{item.min_stock_level ?? '-'}</td>
                      <td className="py-4 px-4">{item.max_stock_level ?? '-'}</td>
                      <td className="py-4 px-4 text-xs text-gray-500">{item.created_at ? new Date(item.created_at).toLocaleDateString() : '-'}</td>
                      <td className="py-4 px-4 text-xs text-gray-500">{item.updated_at ? new Date(item.updated_at).toLocaleDateString() : '-'}</td>
                      <td className="py-4 px-4">
                        <Button size="icon" variant="ghost" onClick={() => openEditModal(item)}><Pencil className="w-4 h-4" /></Button>
                        <Button size="icon" variant="ghost" onClick={() => setShowDeleteId(item.id)}><Trash2 className="w-4 h-4 text-red-600" /></Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Add Product Modal */}
        <Dialog open={showAddModal} onOpenChange={setShowAddModal}>
          <DialogContent className="max-w-md w-full mx-auto overflow-y-auto max-h-[80vh]">
            <DialogHeader>
              <DialogTitle>Add New Product</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleAddProduct} className="space-y-4">
              <div className="flex flex-col gap-4">
                <div>
                  <Label htmlFor="name">Name</Label>
                  <Input id="name" name="name" value={addForm.name} onChange={handleAddChange} required className="w-full" />
                </div>
                <div>
                  <Label htmlFor="category">Category</Label>
                  <Input id="category" name="category" value={addForm.category} onChange={handleAddChange} required className="w-full" />
                </div>
                <div>
                  <Label htmlFor="product_id">Product ID</Label>
                  <Input id="product_id" name="product_id" value={addForm.product_id} onChange={handleAddChange} required className="w-full" />
                </div>
                <div>
                  <Label htmlFor="current_stock">Current Stock</Label>
                  <Input id="current_stock" name="current_stock" type="number" value={addForm.current_stock} onChange={handleAddChange} required className="w-full" />
                </div>
                <div>
                  <Label htmlFor="unit_price">Unit Price</Label>
                  <Input id="unit_price" name="unit_price" type="number" value={addForm.unit_price} onChange={handleAddChange} required className="w-full" />
                </div>
                <div>
                  <Label htmlFor="cost_price">Cost Price</Label>
                  <Input id="cost_price" name="cost_price" type="number" value={addForm.cost_price} onChange={handleAddChange} className="w-full" />
                </div>
                <div>
                  <Label htmlFor="min_stock_level">Min Stock Level</Label>
                  <Input id="min_stock_level" name="min_stock_level" type="number" value={addForm.min_stock_level} onChange={handleAddChange} className="w-full" />
                </div>
                <div>
                  <Label htmlFor="max_stock_level">Max Stock Level</Label>
                  <Input id="max_stock_level" name="max_stock_level" type="number" value={addForm.max_stock_level} onChange={handleAddChange} className="w-full" />
                </div>
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setShowAddModal(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={addLoading}>
                  {addLoading ? 'Adding...' : 'Add Product'}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>

        {/* Edit Product Modal */}
        <Dialog open={!!editProduct} onOpenChange={v => { if (!v) setEditProduct(null); }}>
          <DialogContent className="max-w-md w-full mx-auto overflow-y-auto max-h-[80vh]">
            <DialogHeader>
              <DialogTitle>Edit Product</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleEditProduct} className="space-y-4">
              <div className="flex flex-col gap-4">
                <div>
                  <Label htmlFor="edit_name">Name</Label>
                  <Input id="edit_name" name="name" value={editForm.name} onChange={handleEditChange} required className="w-full" />
                </div>
                <div>
                  <Label htmlFor="edit_category">Category</Label>
                  <Input id="edit_category" name="category" value={editForm.category} onChange={handleEditChange} required className="w-full" />
                </div>
                <div>
                  <Label htmlFor="edit_product_id">Product ID</Label>
                  <Input id="edit_product_id" name="product_id" value={editForm.product_id} onChange={handleEditChange} required className="w-full" />
                </div>
                <div>
                  <Label htmlFor="edit_current_stock">Current Stock</Label>
                  <Input id="edit_current_stock" name="current_stock" type="number" value={editForm.current_stock} onChange={handleEditChange} required className="w-full" />
                </div>
                <div>
                  <Label htmlFor="edit_unit_price">Unit Price</Label>
                  <Input id="edit_unit_price" name="unit_price" type="number" value={editForm.unit_price} onChange={handleEditChange} required className="w-full" />
                </div>
                <div>
                  <Label htmlFor="edit_cost_price">Cost Price</Label>
                  <Input id="edit_cost_price" name="cost_price" type="number" value={editForm.cost_price} onChange={handleEditChange} className="w-full" />
                </div>
                <div>
                  <Label htmlFor="edit_min_stock_level">Min Stock Level</Label>
                  <Input id="edit_min_stock_level" name="min_stock_level" type="number" value={editForm.min_stock_level} onChange={handleEditChange} className="w-full" />
                </div>
                <div>
                  <Label htmlFor="edit_max_stock_level">Max Stock Level</Label>
                  <Input id="edit_max_stock_level" name="max_stock_level" type="number" value={editForm.max_stock_level} onChange={handleEditChange} className="w-full" />
                </div>
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setEditProduct(null)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={editLoading}>
                  {editLoading ? 'Saving...' : 'Save Changes'}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>

        {/* Delete Confirmation Dialog */}
        <Dialog open={!!showDeleteId} onOpenChange={v => { if (!v) setShowDeleteId(null); }}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Delete Product</DialogTitle>
            </DialogHeader>
            <div>Are you sure you want to delete this product? This action cannot be undone.</div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setShowDeleteId(null)}>
                Cancel
              </Button>
              <Button type="button" variant="destructive" onClick={handleDeleteProduct} disabled={deleteLoading}>
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
