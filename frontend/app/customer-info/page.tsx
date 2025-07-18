"use client";

import { useGetCustomerQuery, useGetProductsQuery } from "@/feature/api";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useSelector } from "react-redux";
import { selectSelectedCustomerId } from "@/feature/selectedCustomerSlice";

export default function CustomerInfo() {
  const selectedCustomerId = useSelector(selectSelectedCustomerId);
  
  const { 
    data: customer, 
    isLoading: isLoadingCustomer,
    error: customerError 
  } = useGetCustomerQuery(Number(selectedCustomerId), {
    skip: !selectedCustomerId
  });

  // Show loading skeleton while data is loading
  if (isLoadingCustomer) {
    return <LoadingSkeleton />;
  }

  if (!selectedCustomerId) {
    return (
      <div className="space-y-4">
        <h1 className="text-2xl font-bold">Customer Information</h1>
        <p className="text-muted-foreground">Please select a customer from the dropdown menu.</p>
      </div>
    );
  }

  if (customerError || !customer) {
    return (
      <div className="space-y-4">
        <h1 className="text-2xl font-bold">Error</h1>
        <p className="text-red-500">Failed to load customer information.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Customer Information</h1>

      {/* Basic Info */}
      <Card>
        <CardHeader>
          <CardTitle>Basic Information</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="font-medium text-muted-foreground">Name</p>
              <p>{customer.name}</p>
            </div>
            <div>
              <p className="font-medium text-muted-foreground">Email</p>
              <p>{customer.email}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Contact Details */}
      <Card>
        <CardHeader>
          <CardTitle>Contact Details</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="font-medium text-muted-foreground">Phone</p>
              <p>{customer.detail.phone}</p>
            </div>
            <div>
              <p className="font-medium text-muted-foreground">Address</p>
              <p>{customer.detail.address}</p>
            </div>
          </div>
          {customer.detail.notes && (
            <div>
              <p className="font-medium text-muted-foreground">Notes</p>
              <p>{customer.detail.notes}</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function LoadingSkeleton() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Customer Information</h1>
      
      {/* Basic Info Skeleton */}
      <Card>
        <CardHeader>
          <CardTitle>Basic Information</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="font-medium text-muted-foreground">Name</p>
              <Skeleton className="h-6 w-[200px]" />
            </div>
            <div>
              <p className="font-medium text-muted-foreground">Email</p>
              <Skeleton className="h-6 w-[200px]" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Contact Details Skeleton */}
      <Card>
        <CardHeader>
          <CardTitle>Contact Details</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="font-medium text-muted-foreground">Phone</p>
              <Skeleton className="h-6 w-[150px]" />
            </div>
            <div>
              <p className="font-medium text-muted-foreground">Address</p>
              <Skeleton className="h-6 w-[250px]" />
            </div>
          </div>
          <div>
            <p className="font-medium text-muted-foreground">Notes</p>
            <Skeleton className="h-6 w-full" />
          </div>
        </CardContent>
      </Card>

      {/* Products Skeleton */}
      <Card>
        <CardHeader>
          <CardTitle>Associated Products</CardTitle>
          <CardDescription>Products purchased by this customer</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="grid grid-cols-3 gap-4 p-4 border rounded-lg">
                <div>
                  <p className="font-medium text-muted-foreground">Name</p>
                  <Skeleton className="h-4 w-[100px]" />
                </div>
                <div>
                  <p className="font-medium text-muted-foreground">Description</p>
                  <Skeleton className="h-4 w-[150px]" />
                </div>
                <div>
                  <p className="font-medium text-muted-foreground">Price</p>
                  <Skeleton className="h-4 w-[80px]" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 