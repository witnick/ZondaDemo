"use client";

import * as React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

export interface SelectOption {
  value: string;
  label: string;
}

interface SearchableSelectProps {
  options: SelectOption[];
  value?: string;
  onValueChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  loading?: boolean;
}

export function SearchableSelect({
  options,
  value,
  onValueChange,
  placeholder = "Select an option",
  disabled = false,
  className,
  loading = false,
}: SearchableSelectProps) {
  const [searchQuery, setSearchQuery] = React.useState("");
  const [isOpen, setIsOpen] = React.useState(false);

  const filteredOptions = React.useMemo(() => {
    if (!searchQuery) return options;
    
    const query = searchQuery.toLowerCase();
    return options.filter(option => 
      option.label.toLowerCase().includes(query)
    );
  }, [options, searchQuery]);

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    if (!open) {
      // Reset search when closing
      setSearchQuery("");
    }
  };

  return (
    <Select
      value={value}
      onValueChange={onValueChange}
      disabled={disabled}
      open={isOpen}
      onOpenChange={handleOpenChange}
    >
      <SelectTrigger className={cn("w-full", className)}>
        <SelectValue placeholder={loading ? "Loading..." : placeholder} />
      </SelectTrigger>
      <SelectContent className="p-0">
        <div className="sticky top-0 z-10 bg-popover border-b border-border p-2">
          <Input
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="custom-scrollbar max-h-[200px] overflow-y-auto py-2">
          {filteredOptions.length === 0 ? (
            <div className="py-2 px-4 text-sm text-muted-foreground">
              No results found
            </div>
          ) : (
            filteredOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))
          )}
        </div>
      </SelectContent>
    </Select>
  );
} 