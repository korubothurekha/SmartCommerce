import { useState, useEffect, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Search, ArrowUpDown, Download, Package, DollarSign, TrendingUp } from "lucide-react";
import Layout from '../components/Layout';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '../contexts/AuthContext';
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
} from '@tanstack/react-table';
import { toast } from '@/hooks/use-toast';
import Papa from 'papaparse';

const Sales = () => {
  const { user } = useAuth();
  const [sorting, setSorting] = useState<SortingState>([]);
  const [globalFilter, setGlobalFilter] = useState('');

  const { data: productsData, isLoading, error } = useQuery({
    queryKey: ['productsData', user?.id],
    queryFn: async () => {
      if (!user) return [];
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
      if (error) throw new Error(error.message);
      return data || [];
    },
    enabled: !!user,
  });

  const columns: ColumnDef<any>[] = useMemo(
    () => [
      {
        accessorKey: 'product_id',
        header: ({ column }) => (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          >
            Product ID
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        ),
      },
      {
        accessorKey: 'name',
        header: 'Product Name',
      },
      {
        accessorKey: 'category',
        header: 'Category',
        cell: ({ row }) => (
          <Badge variant="outline">{row.getValue('category') || 'N/A'}</Badge>
        ),
      },
      {
        accessorKey: 'current_stock',
        header: 'Stock',
        cell: ({ row }) => {
          const stock = row.getValue('current_stock') as number;
          const minStock = row.original.min_stock_level;
          return (
            <div className="flex items-center space-x-2">
              <span>{stock}</span>
              {minStock && stock < minStock && (
                <Badge variant="destructive" className="text-xs">Low</Badge>
              )}
            </div>
          );
        },
      },
      {
        accessorKey: 'unit_price',
        header: 'Unit Price',
        cell: ({ row }) => `₹${row.getValue('unit_price')?.toLocaleString() || 0}`,
      },
      {
        accessorKey: 'inventory_value',
        header: 'Inventory Value',
        cell: ({ row }) => {
          const stock = row.original.current_stock || 0;
          const price = row.original.unit_price || 0;
          return `₹${(stock * price).toLocaleString()}`;
        },
      },
      {
        accessorKey: 'total_products_sold',
        header: 'Total Sold',
        cell: ({ row }) => row.getValue('total_products_sold') || 0,
      },
      {
        accessorKey: 'created_at',
        header: 'Added Date',
        cell: ({ row }) => {
          const date = row.getValue('created_at') as string;
          return date ? new Date(date).toLocaleDateString() : 'N/A';
        },
      },
    ],
    []
  );

  const table = useReactTable({
    data: productsData || [],
    columns,
    state: {
      sorting,
      globalFilter,
    },
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  const handleExport = () => {
    if (!productsData) return;
    
    // Transform data for export
    const exportData = productsData.map(product => ({
      'Product ID': product.product_id,
      'Product Name': product.name,
      'Category': product.category,
      'Current Stock': product.current_stock,
      'Unit Price': product.unit_price,
      'Inventory Value': (product.current_stock || 0) * (product.unit_price || 0),
      'Total Sold': (product as any).total_products_sold || 0,
      'Min Stock Level': product.min_stock_level,
      'Max Stock Level': product.max_stock_level,
      'Cost Price': product.cost_price,
      'Added Date': product.created_at ? new Date(product.created_at).toLocaleDateString() : 'N/A'
    }));
    
    const csv = Papa.unparse(exportData);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.setAttribute('download', 'product_inventory.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast({ title: 'Success', description: 'Product inventory exported successfully.' });
  };

  // Calculate summary statistics
  const totalProducts = productsData?.length || 0;
  const totalInventoryValue = productsData?.reduce((sum, p) => sum + ((p.current_stock || 0) * (p.unit_price || 0)), 0) || 0;
  const lowStockProducts = productsData?.filter(p => p.min_stock_level && p.current_stock < p.min_stock_level).length || 0;

  if (isLoading) return <Layout><div className="flex items-center justify-center h-96">Loading product data...</div></Layout>;
  if (error) return <Layout><div className="flex items-center justify-center h-96 text-red-500">Error fetching data: {(error as Error).message}</div></Layout>;

  return (
    <Layout>
      <div className="space-y-6">
        <CardHeader>
          <CardTitle>Product Inventory & Sales Overview</CardTitle>
          <CardDescription>Manage your product inventory and track sales potential.</CardDescription>
        </CardHeader>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Total Products</CardTitle>
              <Package className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">{totalProducts}</div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Total Inventory Value</CardTitle>
              <DollarSign className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">₹{totalInventoryValue.toLocaleString()}</div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Low Stock Items</CardTitle>
              <TrendingUp className="h-4 w-4 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">{lowStockProducts}</div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardContent className="pt-6">
            <div className="flex justify-between items-center mb-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                <Input
                  placeholder="Search products..."
                  value={globalFilter}
                  onChange={(e) => setGlobalFilter(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Button onClick={handleExport}>
                <Download className="mr-2 h-4 w-4" />
                Export CSV
              </Button>
            </div>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  {table.getHeaderGroups().map((headerGroup) => (
                    <TableRow key={headerGroup.id}>
                      {headerGroup.headers.map((header) => (
                        <TableHead key={header.id}>
                          {header.isPlaceholder
                            ? null
                            : flexRender(
                                header.column.columnDef.header,
                                header.getContext()
                              )}
                        </TableHead>
                      ))}
                    </TableRow>
                  ))}
                </TableHeader>
                <TableBody>
                  {table.getRowModel().rows?.length ? (
                    table.getRowModel().rows.map((row) => (
                      <TableRow
                        key={row.id}
                        data-state={row.getIsSelected() && 'selected'}
                      >
                        {row.getVisibleCells().map((cell) => (
                          <TableCell key={cell.id}>
                            {flexRender(
                              cell.column.columnDef.cell,
                              cell.getContext()
                            )}
                          </TableCell>
                        ))}
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell
                        colSpan={columns.length}
                        className="h-24 text-center"
                      >
                        No products found. Add some products to get started.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
            <div className="flex items-center justify-end space-x-2 py-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
              >
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
              >
                Next
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default Sales; 