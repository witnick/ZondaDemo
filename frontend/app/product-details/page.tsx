"use client";

import { useGetCustomerQuery, useGetProductsQuery, useCreateProductMutation, useDeleteProductMutation } from "@/feature/api";
import { useSelector } from "react-redux";
import { selectSelectedCustomerId } from "@/feature/selectedCustomerSlice";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Plus, Trash2, Pencil } from "lucide-react";
import { toast } from "sonner";
import { ErrorBoundary } from "@/components/error-boundary";
import { ApiError } from "@/components/ui/api-error";
import { ProductFormDialog } from "@/components/product-form-dialog";
import type { ProductDetail } from "@/lib/api/types";
import { useState } from "react";

function ProductDetails() {
  const selectedCustomerId = useSelector(selectSelectedCustomerId);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<ProductDetail | undefined>();

  const { 
    data: customer,
    isLoading: isLoadingCustomer,
    error: customerError,
    refetch: refetchCustomer
  } = useGetCustomerQuery(Number(selectedCustomerId), {
    skip: !selectedCustomerId
  });

  // const {
  //   data: products,
  //   isLoading: isLoadingProducts,
  //   error: productsError,
  //   refetch: refetchProducts
  // } = useGetProductsQuery();

  const [deleteProduct, { isLoading: isDeleting }] = useDeleteProductMutation();

  const handleDeleteProduct = async (productId: number) => {
    try {
      await deleteProduct(productId).unwrap();
      toast.success("Product deleted successfully");
    } catch (error) {
      toast.error("Failed to delete product");
    }
  };

  const handleEdit = (product: ProductDetail) => {
    setSelectedProduct(product);
    setIsDialogOpen(true);
  };

  const handleAdd = () => {
    setSelectedProduct(undefined);
    setIsDialogOpen(true);
  };

  const handleDialogClose = (open: boolean) => {
    setIsDialogOpen(open);
    if (!open) {
      setSelectedProduct(undefined);
    }
  };

  // Show loading skeleton while either customers are loading
  if (isLoadingCustomer ) {
    return <LoadingSkeleton />;
  }

  if (!selectedCustomerId) {
    return (
      <div className="space-y-4">
        <h1 className="text-2xl font-bold">Product Details</h1>
        <p className="text-muted-foreground">Please select a customer from the dropdown menu to view their products.</p>
      </div>
    );
  }

  // Handle errors
  if (customerError) {
    return (
      <ApiError 
        error={customerError} 
        onRetry={refetchCustomer}
        className="max-w-2xl"
      />
    );
  }

  if (!customer) {
    return (
      <div className="space-y-4">
        <h1 className="text-2xl font-bold">Error</h1>
        <p className="text-red-500">Customer not found.</p>
      </div>
    );
  }

  const customerProducts = customer.products;

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Products for {customer.name}</h1>
        <Button onClick={handleAdd}>
          <Plus className="mr-2 h-4 w-4" />
          Add Product
        </Button>
      </div>

      {customerProducts.length > 0 ? (
        <div className="border rounded-lg">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Stock</TableHead>
                <TableHead>Price</TableHead>
                <TableHead className="w-[150px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {customerProducts.map((product) => (
                <TableRow key={product.id}>
                  <TableCell>{product.name}</TableCell>
                  <TableCell>{product.description}</TableCell>
                  <TableCell>{product.stock}</TableCell>
                  <TableCell>${product.price.toFixed(2)}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleEdit(product)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDeleteProduct(product.id)}
                        disabled={isDeleting}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      ) : (
        <p className="text-muted-foreground">No products found for this customer.</p>
      )}

      <ProductFormDialog
        open={isDialogOpen}
        onOpenChange={handleDialogClose}
        mode={selectedProduct ? 'update' : 'create'}
        product={selectedProduct}
      />
    </div>
  );
}

// Wrap the page component with ErrorBoundary
export default function ProductDetailsPage() {
  return (
    <ErrorBoundary>
      <ProductDetails />
    </ErrorBoundary>
  );
}

function LoadingSkeleton() {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-10 w-32" />
      </div>
      <div className="border rounded-lg">
        <div className="p-4">
          <div className="space-y-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="grid grid-cols-4 gap-4">
                <Skeleton className="h-6" />
                <Skeleton className="h-6" />
                <Skeleton className="h-6" />
                <Skeleton className="h-6 w-[100px]" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}