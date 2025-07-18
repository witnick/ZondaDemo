"use client"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { useGetProductsQuery } from '@/feature/api'
import type { ProductDetail } from '@/lib/api/types'
import { SearchableSelect, type SelectOption } from "@/components/ui/searchable-select"

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

  // Convert products to select options
  const productOptions: SelectOption[] = availableProducts.map(product => ({
    value: product.id.toString(),
    label: `${product.name} - $${product.price.toFixed(2)}`
  }))

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
          <SearchableSelect
            options={productOptions}
            value={selectedProductId}
            onValueChange={setSelectedProductId}
            placeholder="Select a product"
            disabled={isLoading}
            loading={isLoading}
          />
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