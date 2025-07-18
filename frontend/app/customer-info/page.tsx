"use client";

import { useState } from "react";
import { useGetCustomerQuery, useUpdateCustomerMutation, useUpdateCustomerDetailMutation } from "@/feature/api";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useSelector } from "react-redux";
import { selectSelectedCustomerId } from "@/feature/selectedCustomerSlice";
import { Button } from "@/components/ui/button";
import { EditCustomerDialog } from "@/components/edit-customer-dialog";
import { toast } from "sonner";
import type { CustomerFormData } from "@/lib/api/schemas";
import { Pencil } from "lucide-react";

export default function CustomerInfo() {
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const selectedCustomerId = useSelector(selectSelectedCustomerId);
  
  const { 
    data: customer, 
    isLoading: isLoadingCustomer,
    error: customerError 
  } = useGetCustomerQuery(Number(selectedCustomerId), {
    skip: !selectedCustomerId
  });

  const [updateCustomer] = useUpdateCustomerMutation();
  const [updateCustomerDetail] = useUpdateCustomerDetailMutation();

  const handleEditSubmit = async (data: CustomerFormData) => {
    if (!selectedCustomerId || !customer) return;

    try {
      // First update the customer's basic info
      await updateCustomer({
        id: Number(selectedCustomerId),
        data: {
          id: Number(selectedCustomerId),
          name: data.name,
          email: data.email,
          phone: data.phone,
        },
      }).unwrap();

      // Then update the customer's detail
      await updateCustomerDetail({
        id: Number(selectedCustomerId),
        data: {
          customerId: Number(selectedCustomerId),
          address: data.detail.address,
          notes: data.detail.notes || "",
        },
      }).unwrap();

      toast.success("Customer updated successfully");
    } catch (error) {
      toast.error("Failed to update customer");
    }
  };

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
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Customer Information</h1>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setIsEditDialogOpen(true)}
        >
          <Pencil className="h-4 w-4 mr-2" />
          Edit
        </Button>
      </div>

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
          <div>
            <p className="font-medium text-muted-foreground">Phone</p>
            <p>{customer.phone}</p>
          </div>
        </CardContent>
      </Card>

      {/* Contact Details */}
      <Card>
        <CardHeader>
          <CardTitle>Contact Details</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div>
            <p className="font-medium text-muted-foreground">Address</p>
            <p>{customer.detail.address}</p>
          </div>
          {customer.detail.notes && (
            <div>
              <p className="font-medium text-muted-foreground">Notes</p>
              <p>{customer.detail.notes}</p>
            </div>
          )}
        </CardContent>
      </Card>

      <EditCustomerDialog
        customer={customer}
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        onSubmit={handleEditSubmit}
      />
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
          <div>
            <p className="font-medium text-muted-foreground">Phone</p>
            <Skeleton className="h-6 w-[150px]" />
          </div>
        </CardContent>
      </Card>

      {/* Contact Details Skeleton */}
      <Card>
        <CardHeader>
          <CardTitle>Contact Details</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div>
            <p className="font-medium text-muted-foreground">Address</p>
            <Skeleton className="h-6 w-[250px]" />
          </div>
          <div>
            <p className="font-medium text-muted-foreground">Notes</p>
            <Skeleton className="h-6 w-full" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 