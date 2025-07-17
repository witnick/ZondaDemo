"use client";

import { useGetCustomerQuery, useGetProductsQuery } from "@/feature/api";
import { useSelector } from "react-redux";
import { selectSelectedCustomerId } from "@/feature/selectedCustomerSlice";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function CustomerInfo() {
  const selectedCustomerId = useSelector(selectSelectedCustomerId);
  
  const { 
    data: customer, 
    isLoading: isLoadingCustomer,
    error: customerError 
  } = useGetCustomerQuery(Number(selectedCustomerId), {
    skip: !selectedCustomerId
  });

  const {
    data: products,
    isLoading: isLoadingProducts
  } = useGetProductsQuery(undefined, {
    skip: !customer?.productIds?.length
  });

  // Show loading skeleton while data is loading
  if (isLoadingCustomer || (customer?.productIds?.length && isLoadingProducts)) {
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

  const customerProducts = products?.filter(product => 
    customer.productIds.includes(product.id)
  ) || [];

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

      {/* Associated Products */}
      <Card>
        <CardHeader>
          <CardTitle>Associated Products</CardTitle>
          <CardDescription>Products purchased by this customer</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoadingProducts ? (
            <div className="space-y-4">
              {[1, 2].map(i => (
                <Skeleton key={i} className="h-16 w-full" />
              ))}
            </div>
          ) : customerProducts.length > 0 ? (
            <div className="grid gap-4">
              {customerProducts.map(product => (
                <div key={product.id} className="grid grid-cols-3 gap-4 p-4 border rounded-lg">
                  <div>
                    <p className="font-medium text-muted-foreground">Name</p>
                    <p>{product.name}</p>
                  </div>
                  <div>
                    <p className="font-medium text-muted-foreground">Description</p>
                    <p>{product.description}</p>
                  </div>
                  <div>
                    <p className="font-medium text-muted-foreground">Price</p>
                    <p>${product.price.toFixed(2)}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground">No products associated with this customer.</p>
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
