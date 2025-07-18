"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "sonner"
import { productSchema, type ProductFormData } from "@/lib/schemas/product"
import { useCreateProductMutation, useUpdateProductMutation } from "@/feature/api"
import { ErrorMessage } from "@/components/ui/error-message"
import type { ProductDetail } from "@/lib/api/types"
import { useEffect } from "react"

interface ProductFormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  mode: 'create' | 'update'
  product?: ProductDetail
}

const defaultValues: ProductFormData = {
  name: "",
  description: "",
  price: 0,
  stock: 0,
}

export function ProductFormDialog({
  open,
  onOpenChange,
  mode,
  product,
}: ProductFormDialogProps) {
  const [createProduct] = useCreateProductMutation()
  const [updateProduct] = useUpdateProductMutation()

  const form = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues,
  })

  // Update form values when editing an existing product
  useEffect(() => {
    if (mode === 'update' && product) {
      form.reset({
        name: product.name,
        description: product.description,
        price: product.price,
        stock: product.stock,
      })
    } else {
      form.reset(defaultValues)
    }
  }, [form, mode, product])

  // Handle dialog close
  const handleOpenChange = (open: boolean) => {
    if (!open) {
      // Reset form to default values and clear all errors
      form.reset(defaultValues)
      form.clearErrors()
    }
    onOpenChange(open)
  }

  async function onSubmit(data: ProductFormData) {
    try {
      if (mode === 'create') {
        await createProduct(data).unwrap();
        toast.success("Product created successfully");
      } else if (product?.id) {
        await updateProduct({ 
          id: product.id, 
          data: {
            name: data.name,
            description: data.description,
            price: data.price,
            stock: data.stock,
          }
        }).unwrap();
        toast.success("Product updated successfully");
      }
      handleOpenChange(false);
    } catch (error: any) {
      console.error('Operation failed:', error);
      toast.error(error?.data?.message || `Failed to ${mode} product. Please try again.`);
    }
  }

  const title = mode === 'create' ? 'Create a new product' : 'Edit Product'
  const description = mode === 'create' 
    ? 'Fill in the product details below. Click save when you\'re done.'
    : 'Update the product details below. Click save when you\'re done.'

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field, fieldState }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter product name" {...field} />
                  </FormControl>
                  <ErrorMessage content={fieldState.error?.message} />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field, fieldState }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Enter product description"
                      {...field}
                    />
                  </FormControl>
                  <ErrorMessage content={fieldState.error?.message} />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="price"
              render={({ field, fieldState }) => (
                <FormItem>
                  <FormLabel>Price</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      step="0.01"
                      min="0"
                      placeholder="Enter product price"
                      {...field}
                      onChange={(e) => field.onChange(parseFloat(e.target.value))}
                    />
                  </FormControl>
                  <ErrorMessage content={fieldState.error?.message} />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="stock"
              render={({ field, fieldState }) => (
                <FormItem>
                  <FormLabel>Stock</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min="0"
                      placeholder="Enter stock quantity"
                      {...field}
                      onChange={(e) => field.onChange(parseInt(e.target.value, 10))}
                    />
                  </FormControl>
                  <ErrorMessage content={fieldState.error?.message} />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="submit">Save</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
} 