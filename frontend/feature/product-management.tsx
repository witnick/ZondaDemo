"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ChevronDown, MoreHorizontal, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react"

const products = [
  { id: 1, name: "CPU", price: 500 },
  { id: 2, name: "Monitor", price: 130 },
  { id: 3, name: "RAM", price: 200 },
  { id: 4, name: "Keyboard", price: 50 },
  { id: 5, name: "Mouse", price: 30 },
]

export default function ProductManagement() {
  const [selectedCustomer, setSelectedCustomer] = useState("Customer 1")
  const [itemsPerPage, setItemsPerPage] = useState("5")

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="w-64 bg-white border-r border-gray-200">
        <div className="p-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="w-full justify-between font-normal">
                {selectedCustomer}
                <ChevronDown className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-full">
              <DropdownMenuItem onClick={() => setSelectedCustomer("Customer 1")}>Customer 1</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSelectedCustomer("Customer 2")}>Customer 2</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <nav className="px-4 space-y-1">
          <Button variant="ghost" className="w-full justify-start font-normal text-gray-600">
            Customer Info
          </Button>
          <Button variant="ghost" className="w-full justify-start font-normal bg-blue-50 text-blue-600">
            Product Details
          </Button>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-semibold text-gray-900">
            Products <span className="text-gray-500">(23)</span>
          </h1>
          <Button className="bg-blue-600 hover:bg-blue-700">Add Product</Button>
        </div>

        {/* Table */}
        <div className="bg-white rounded-lg border border-gray-200">
          <Table>
            <TableHeader>
              <TableRow className="border-b border-gray-200">
                <TableHead className="text-gray-500 font-medium">
                  ProductID
                  <ChevronDown className="inline h-4 w-4 ml-1" />
                </TableHead>
                <TableHead className="text-gray-500 font-medium">ProductName</TableHead>
                <TableHead className="text-gray-500 font-medium">ProductPrice</TableHead>
                <TableHead className="w-12"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {products.map((product) => (
                <TableRow key={product.id} className="border-b border-gray-100 hover:bg-secondary">
                  <TableCell className="text-blue-600 font-medium">{product.id}</TableCell>
                  <TableCell className="text-gray-900">{product.name}</TableCell>
                  <TableCell className="text-gray-900">{product.price}</TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem className="text-red-600">Delete</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {/* Pagination */}
          <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200">
            <div className="flex items-center space-x-2">
              <Select value={itemsPerPage} onValueChange={setItemsPerPage}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="5">5 items per page</SelectItem>
                  <SelectItem value="10">10 items per page</SelectItem>
                  <SelectItem value="20">20 items per page</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-700">1 – 5 of 23</span>
              <div className="flex items-center space-x-1">
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <ChevronsLeft className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <ChevronRight className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <ChevronsRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
