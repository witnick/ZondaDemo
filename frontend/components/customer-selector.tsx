"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useGetCustomersQuery } from '@/feature/api';
import type { Customer } from '@/lib/api/types';
import { useDispatch, useSelector } from 'react-redux';
import { setSelectedCustomer, selectSelectedCustomerId } from '@/feature/selectedCustomerSlice';
import { SearchableSelect, type SelectOption } from "@/components/ui/searchable-select";

export function CustomerSelector() {
    const pathname = usePathname();
    const router = useRouter();
    const dispatch = useDispatch();
    const selectedCustomer = useSelector(selectSelectedCustomerId);
    const { data: customers, isLoading } = useGetCustomersQuery({});

    // Convert customers to select options
    const customerOptions: SelectOption[] = customers?.map(customer => ({
        value: customer.id.toString(),
        label: customer.name
    })) || [];

    // Auto-select first customer when data is loaded
    useEffect(() => {
        if (customers?.length && !selectedCustomer) {
            const firstCustomerId = customers[0].id.toString();
            dispatch(setSelectedCustomer(firstCustomerId));
            router.push('/customer-info');
        }
    }, [customers, selectedCustomer, dispatch, router]);

    const handleCustomerChange = (customerId: string) => {
        dispatch(setSelectedCustomer(customerId));
        router.push('/customer-info');
    };

    return (
        <SearchableSelect
            options={customerOptions}
            value={selectedCustomer || ''}
            onValueChange={handleCustomerChange}
            placeholder="Select a customer"
            disabled={isLoading}
            loading={isLoading}
        />
    );
} 