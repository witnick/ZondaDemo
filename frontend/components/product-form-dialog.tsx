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
import { useToast } from "@/hooks/use-toast"
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

export function ProductFormDialog({
  open,
  onOpenChange,
  mode,
  product,
}: ProductFormDialogProps) {
  const { toast } = useToast()
  const [createProduct] = useCreateProductMutation()
  const [updateProduct] = useUpdateProductMutation()

  const form = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: "",
      description: "",
      price: 0,
      stock: 0,
    },
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
    }
  }, [form, mode, product])

  // Handle dialog close
  const handleOpenChange = (open: boolean) => {
    if (!open) {
      form.reset()
      form.clearErrors()
    }
    onOpenChange(open)
  }

  async function onSubmit(data: ProductFormData) {
    try {
      if (mode === 'create') {
        await createProduct(data).unwrap()
        toast({
          title: "Success",
          description: "Product created successfully",
        })
      } else if (product?.id) {
        await updateProduct({ id: product.id, data }).unwrap()
        toast({
          title: "Success",
          description: "Product updated successfully",
        })
      }
      handleOpenChange(false)
    } catch (error) {
      toast({
        title: "Error",
        description: `Failed to ${mode} product. Please try again.`,
        variant: "destructive",
      })
    }
  }

  const title = mode === 'create' ? 'Add New Product' : 'Edit Product'
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
                      step="any"
                      placeholder="Enter price"
                      {...field}
                      onChange={(e) => {
                        const value = e.target.value;
                        // Ensure we only allow 2 decimal places
                        if (value.includes('.') && value.split('.')[1]?.length > 2) {
                          return;
                        }
                        field.onChange(parseFloat(value) || 0);
                      }}
                      onBlur={(e) => {
                        const value = parseFloat(e.target.value);
                        if (!isNaN(value)) {
                          // Format to 2 decimal places on blur
                          e.target.value = value.toFixed(2);
                          field.onChange(value);
                        }
                      }}
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
                      step="1"
                      placeholder="Enter stock quantity"
                      {...field}
                      onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                    />
                  </FormControl>
                  <ErrorMessage content={fieldState.error?.message} />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="submit">
                {mode === 'create' ? 'Save Product' : 'Update Product'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
} 