"use client";

import { useState, useMemo } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  Plus, 
  Trash2, 
  Pencil, 
  ChevronLeft, 
  ChevronRight, 
  ChevronsLeft, 
  ChevronsRight,
  ArrowUpDown,
  Search,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { PagedDataResult } from "@/lib/api/types";

export interface Column<T> {
  header: string;
  accessorKey: keyof T;
  cell?: (item: T) => React.ReactNode;
  sortable?: boolean;
  searchable?: boolean;
}

interface DataTableProps<T> {
  data: T[] | PagedDataResult<T>;
  columns: Column<T>[];
  title: string;
  onAdd?: () => void;
  onEdit?: (item: T) => void;
  onDelete?: (item: T) => void;
  isLoading?: boolean;
  showActions?: boolean;
  defaultPageSize?: number;
  onPageChange?: (page: number, pageSize: number) => void;
  enableSearch?: boolean;
}

type SortDirection = 'asc' | 'desc' | null;

interface SortState {
  column: string | null;
  direction: SortDirection;
}

const PAGE_SIZE_OPTIONS = [5, 10, 20, 50, 100];

export function DataTable<T extends { id: number }>({
  data,
  columns,
  title,
  onAdd,
  onEdit,
  onDelete,
  isLoading,
  showActions = true,
  defaultPageSize = 10,
  onPageChange,
  enableSearch = false,
}: DataTableProps<T>) {
  const [pageSize, setPageSize] = useState(defaultPageSize);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortState, setSortState] = useState<SortState>({ column: null, direction: null });
  const [searchTerm, setSearchTerm] = useState("");

  // Determine if we're using server-side pagination
  const isServerPaginated = !Array.isArray(data);

  // Sort and filter data
  const processedData = useMemo(() => {
    let result = isServerPaginated ? (data as PagedDataResult<T>).items : [...(data as T[])];

    // Apply search if enabled
    if (enableSearch && searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      result = result.filter(item => 
        columns.some(column => {
          if (!column.searchable) return false;
          const value = item[column.accessorKey];
          if (value == null) return false;
          return String(value).toLowerCase().includes(searchLower);
        })
      );
    }

    // Apply sorting if not server paginated
    if (!isServerPaginated && sortState.column && sortState.direction) {
      const column = columns.find(col => col.accessorKey === sortState.column);
      if (column) {
        result.sort((a, b) => {
          const aValue = a[column.accessorKey];
          const bValue = b[column.accessorKey];
          
          if (aValue == null) return sortState.direction === 'asc' ? -1 : 1;
          if (bValue == null) return sortState.direction === 'asc' ? 1 : -1;
          
          const comparison = String(aValue).localeCompare(String(bValue));
          return sortState.direction === 'asc' ? comparison : -comparison;
        });
      }
    }

    return result;
  }, [data, isServerPaginated, sortState, searchTerm, enableSearch, columns]);

  // Calculate pagination values
  const {
    items,
    totalCount,
    totalPages,
    hasNextPage,
    hasPreviousPage
  } = useMemo(() => {
    if (isServerPaginated) {
      return data as PagedDataResult<T>;
    } else {
      const start = (currentPage - 1) * pageSize;
      const end = start + pageSize;
      return {
        items: processedData.slice(start, end),
        totalCount: processedData.length,
        totalPages: Math.ceil(processedData.length / pageSize),
        hasNextPage: end < processedData.length,
        hasPreviousPage: currentPage > 1
      };
    }
  }, [data, currentPage, pageSize, isServerPaginated, processedData]);

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
    if (isServerPaginated && onPageChange) {
      onPageChange(newPage, pageSize);
    }
  };

  const handlePageSizeChange = (newSize: string) => {
    const size = parseInt(newSize, 10);
    setPageSize(size);
    setCurrentPage(1);
    if (isServerPaginated && onPageChange) {
      onPageChange(1, size);
    }
  };

  const handleSort = (column: Column<T>) => {
    if (!column.sortable) return;

    setSortState(current => {
      if (current.column === column.accessorKey) {
        // Cycle through: asc -> desc -> null
        if (current.direction === 'asc') return { column: column.accessorKey, direction: 'desc' };
        if (current.direction === 'desc') return { column: null, direction: null };
        return { column: column.accessorKey, direction: 'asc' };
      }
      return { column: column.accessorKey, direction: 'asc' };
    });
  };

  if (isLoading) {
    return <LoadingSkeleton />;
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">{title}</h1>
        {onAdd && (
          <Button onClick={onAdd}>
            <Plus className="mr-2 h-4 w-4" />
            Add {title.replace(/s$/, '')}
          </Button>
        )}
      </div>

      {enableSearch && (
        <div className="flex items-center space-x-2">
          <Search className="h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-sm"
          />
        </div>
      )}

      {items.length > 0 ? (
        <div className="border rounded-lg">
          <Table>
            <TableHeader>
              <TableRow>
                {columns.map((column) => (
                  <TableHead 
                    key={String(column.accessorKey)}
                    className={column.sortable ? 'cursor-pointer select-none' : ''}
                    onClick={() => column.sortable && handleSort(column)}
                  >
                    <div className="flex items-center space-x-2">
                      <span>{column.header}</span>
                      {column.sortable && (
                        <ArrowUpDown className={`h-4 w-4 ${
                          sortState.column === column.accessorKey
                            ? 'text-foreground'
                            : 'text-muted-foreground'
                        }`} />
                      )}
                    </div>
                  </TableHead>
                ))}
                {showActions && (onEdit || onDelete) && (
                  <TableHead className="w-[150px]">Actions</TableHead>
                )}
              </TableRow>
            </TableHeader>
            <TableBody>
              {items.map((item) => (
                <TableRow key={item.id}>
                  {columns.map((column) => (
                    <TableCell key={String(column.accessorKey)}>
                      {column.cell
                        ? column.cell(item)
                        : String(item[column.accessorKey])}
                    </TableCell>
                  ))}
                  {showActions && (onEdit || onDelete) && (
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {onEdit && (
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => onEdit(item)}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                        )}
                        {onDelete && (
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => onDelete(item)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  )}
                </TableRow>
              ))}
            </TableBody>
          </Table>
          
          <div className="flex items-center justify-between px-4 py-2 border-t">
            <div className="flex items-center gap-2">
              <p className="text-sm text-muted-foreground">
                Items per page
              </p>
              <Select
                value={pageSize.toString()}
                onValueChange={handlePageSizeChange}
              >
                <SelectTrigger className="w-[70px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {PAGE_SIZE_OPTIONS.map(size => (
                    <SelectItem key={size} value={size.toString()}>
                      {size}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-sm text-muted-foreground">
                {(currentPage - 1) * pageSize + 1} – {Math.min(currentPage * pageSize, totalCount)} of {totalCount}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="icon"
                onClick={() => handlePageChange(1)}
                disabled={!hasPreviousPage}
              >
                <ChevronsLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={!hasPreviousPage}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={!hasNextPage}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={() => handlePageChange(totalPages)}
                disabled={!hasNextPage}
              >
                <ChevronsRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      ) : (
        <p className="text-muted-foreground">No {title.toLowerCase()} found.</p>
      )}
    </div>
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