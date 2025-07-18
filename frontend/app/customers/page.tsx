"use client";

import { useGetCustomersQuery } from "@/feature/api";
import { DataTable, type Column } from "@/components/data-table";
import { ErrorBoundary } from "@/components/error-boundary";
import { ApiError } from "@/components/ui/api-error";
import type { Customer } from "@/lib/api/types";

const columns: Column<Customer>[] = [
  {
    header: "Name",
    accessorKey: "name",
  },
  {
    header: "Email",
    accessorKey: "email",
  },
];

function CustomerManagement() {
  const {
    data: customers,
    isLoading,
    error,
    refetch,
  } = useGetCustomersQuery();

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
    <DataTable
      data={customers || []}
      columns={columns}
      title="Customers"
      isLoading={isLoading}
      showActions={false}
    />
  );
}

// Wrap the page component with ErrorBoundary
export default function CustomerManagementPage() {
  return (
    <ErrorBoundary>
      <CustomerManagement />
    </ErrorBoundary>
  );
} 