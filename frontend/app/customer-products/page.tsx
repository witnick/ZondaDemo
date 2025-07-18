"use client";

import { useGetCustomerQuery } from "@/feature/api";
import { useSelector } from "react-redux";
import { selectSelectedCustomerId } from "@/feature/selectedCustomerSlice";
import { DataTable, type Column } from "@/components/data-table";
import { toast } from "sonner";
import { ErrorBoundary } from "@/components/error-boundary";
import { ApiError } from "@/components/ui/api-error";
import type { ProductDetail } from "@/lib/api/types";
import { useState } from "react";
import { ProductSelectDialog } from "@/components/product-select-dialog";
import { useAddProductToCustomerMutation, useRemoveProductFromCustomerMutation } from "@/feature/api";

const columns: Column<ProductDetail>[] = [
  {
    header: "Name",
    accessorKey: "name",
    sortable: true,
    searchable: true,
  },
  {
    header: "Description",
    accessorKey: "description",
    sortable: true,
    searchable: true,
  },
  {
    header: "Stock",
    accessorKey: "stock",
    sortable: true,
    searchable: false,
  },
  {
    header: "Price",
    accessorKey: "price",
    cell: (product) => `$${product.price.toFixed(2)}`,
    sortable: true,
    searchable: false,
  },
];

function CustomerProducts() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const selectedCustomerId = useSelector(selectSelectedCustomerId);
  
  const { 
    data: customer, 
    isLoading: isLoadingCustomer,
    error: customerError,
    refetch: refetchCustomer
  } = useGetCustomerQuery(Number(selectedCustomerId), {
    skip: !selectedCustomerId
  });

  const [addProductToCustomer] = useAddProductToCustomerMutation();
  const [removeProductFromCustomer] = useRemoveProductFromCustomerMutation();

  const handleAdd = () => {
    setIsDialogOpen(true);
  };

  const handleProductSelect = async (productId: number) => {
    if (!selectedCustomerId) return;

    try {
      await addProductToCustomer({
        customerId: Number(selectedCustomerId),
        productId
      }).unwrap();
      toast.success("Product added successfully");
      refetchCustomer();
    } catch (error) {
      toast.error("Failed to add product");
    }
  };

  const handleRemoveProduct = async (product: ProductDetail) => {
    if (!selectedCustomerId) return;

    try {
      await removeProductFromCustomer({
        customerId: Number(selectedCustomerId),
        productId: product.id
      }).unwrap();
      toast.success("Product removed successfully");
      refetchCustomer();
    } catch (error) {
      toast.error("Failed to remove product");
    }
  };

  if (!selectedCustomerId) {
    return (
      <div className="space-y-4">
        <h1 className="text-2xl font-bold">Customer's Products</h1>
        <p className="text-muted-foreground">Please select a customer from the dropdown menu.</p>
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

  return (
    <>
      <DataTable
        data={customer?.products || []}
        columns={columns}
        title={`Products for ${customer?.name || ''}`}
        isLoading={isLoadingCustomer}
        onAdd={handleAdd}
        onDelete={handleRemoveProduct}
        showEditAction={false}
        enableSearch={true}
      />

      <ProductSelectDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        onProductSelect={handleProductSelect}
        excludeProductIds={customer?.products?.map(p => p.id) || []}
      />
    </>
  );
}

// Wrap the page component with ErrorBoundary
export default function CustomerProductsPage() {
  return (
    <ErrorBoundary>
      <CustomerProducts />
    </ErrorBoundary>
  );
}