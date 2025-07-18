"use client"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { useGetProductsQuery } from "@/feature/api"
import type { ProductDetail } from "@/lib/api/types"

interface ProductSelectDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onProductSelect: (productId: number) => void
  excludeProductIds?: number[]
}

export function ProductSelectDialog({
  open,
  onOpenChange,
  onProductSelect,
  excludeProductIds = []
}: ProductSelectDialogProps) {
  const [selectedProductId, setSelectedProductId] = useState<string>("")
  const { data: products, isLoading } = useGetProductsQuery()

  const availableProducts = products?.filter(
    product => !excludeProductIds.includes(product.id)
  ) || []

  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen) {
      setSelectedProductId("")
    }
    onOpenChange(newOpen)
  }

  const handleSubmit = () => {
    if (selectedProductId) {
      onProductSelect(parseInt(selectedProductId, 10))
      handleOpenChange(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add Product</DialogTitle>
          <DialogDescription>
            Select a product to add to the customer's product list.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <Select
            value={selectedProductId}
            onValueChange={setSelectedProductId}
            disabled={isLoading}>
            <SelectTrigger>
              <SelectValue placeholder={isLoading ? "Loading..." : "Select a product"} />
            </SelectTrigger>
            <SelectContent className="custom-scrollbar">
              {availableProducts.map((product) => (
                <SelectItem
                  key={product.id}
                  value={product.id.toString()}>
                  {product.name} - ${product.price.toFixed(2)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <div className="flex justify-end">
            <Button
              onClick={handleSubmit}
              disabled={!selectedProductId || isLoading}>
              Add Product
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
} 