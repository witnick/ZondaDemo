"use client";

import { useGetCustomersQuery } from "@/feature/api";
import { DataTable, type Column } from "@/components/data-table";
import { ErrorBoundary } from "@/components/error-boundary";
import { ApiError } from "@/components/ui/api-error";
import type { Customer } from "@/lib/api/types";
import { useState } from "react";

const columns: Column<Customer>[] = [
  {
    header: "Name",
    accessorKey: "name",
    sortable: true,
    searchable: true,
  },
  {
    header: "Email",
    accessorKey: "email",
    sortable: true,
    searchable: true,
  },
];

function CustomerManagement() {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const {
    data: customers,
    isLoading,
    error,
    refetch,
  } = useGetCustomersQuery({ page, pageSize });

  const handlePageChange = (newPage: number, newPageSize: number) => {
    setPage(newPage);
    setPageSize(newPageSize);
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
    <DataTable
      data={customers || { items: [], totalCount: 0, pageSize: 10, currentPage: 1, totalPages: 0, hasNextPage: false, hasPreviousPage: false }}
      columns={columns}
      title="Customers"
      isLoading={isLoading}
      showActions={false}
      defaultPageSize={pageSize}
      onPageChange={handlePageChange}
      enableSearch={true}
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