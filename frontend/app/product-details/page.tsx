"use client";

import { useGetCustomerQuery, useDeleteProductMutation } from "@/feature/api";
import { useSelector } from "react-redux";
import { selectSelectedCustomerId } from "@/feature/selectedCustomerSlice";
import { DataTable, type Column } from "@/components/data-table";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { ErrorBoundary } from "@/components/error-boundary";
import { ApiError } from "@/components/ui/api-error";
import { ProductFormDialog } from "@/components/product-form-dialog";
import type { ProductDetail } from "@/lib/api/types";
import { useState } from "react";

const columns: Column<ProductDetail>[] = [
  {
    header: "Name",
    accessorKey: "name",
  },
  {
    header: "Description",
    accessorKey: "description",
  },
  {
    header: "Stock",
    accessorKey: "stock",
  },
  {
    header: "Price",
    accessorKey: "price",
    cell: (product) => `$${product.price.toFixed(2)}`,
  },
];

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

  const [deleteProduct, { isLoading: isDeleting }] = useDeleteProductMutation();

  const handleDeleteProduct = async (product: ProductDetail) => {
    try {
      await deleteProduct(product.id).unwrap();
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

  if (!selectedCustomerId) {
    return (
      <div className="space-y-4">
        <h1 className="text-2xl font-bold">Product Details</h1>
        <p className="text-muted-foreground">Please select a customer from the dropdown menu to view their products.</p>
      </div>
    );
  }

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

  return (
    <>
      <DataTable
        data={customer.products}
        columns={columns}
        title={`Products for ${customer.name}`}
        isLoading={isLoadingCustomer}
        onAdd={handleAdd}
        onEdit={handleEdit}
        onDelete={handleDeleteProduct}
      />

      <ProductFormDialog
        open={isDialogOpen}
        onOpenChange={handleDialogClose}
        mode={selectedProduct ? 'update' : 'create'}
        product={selectedProduct}
      />
    </>
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