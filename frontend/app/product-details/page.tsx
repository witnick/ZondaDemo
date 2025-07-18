"use client";

import { useGetProductsQuery, useDeleteProductMutation } from "@/feature/api";
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
    sortable: true,
    searchable: true,
    className: "w-[300px]",
  },
  {
    header: "Description",
    accessorKey: "description",
    sortable: true,
    searchable: true,
    className: "min-w-[400px]",
  },
  {
    header: "Stock",
    accessorKey: "stock",
    sortable: true,
    searchable: false,
    className: "w-[100px] text-right",
  },
  {
    header: "Price",
    accessorKey: "price",
    cell: (product) => `$${product.price.toFixed(2)}`,
    sortable: true,
    searchable: false,
    className: "w-[100px] text-right",
  },
];

function ProductDetails() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<ProductDetail | undefined>();

  const { 
    data: products,
    isLoading,
    error,
    refetch,
  } = useGetProductsQuery();

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

  if (error) {
    return (
      <ApiError 
        error={error} 
        onRetry={refetch}
        className="max-w-2xl"
      />
    );
  }

  return (
    <>
      <DataTable
        data={products || []}
        columns={columns}
        title="Products"
        isLoading={isLoading}
        onAdd={handleAdd}
        onEdit={handleEdit}
        onDelete={handleDeleteProduct}
        enableSearch={true}
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