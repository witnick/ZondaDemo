"use client";

import { ThemeProvider } from "@/components/theme-provider";
import "./globals.css";
import { ReactNode, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import {
	Sidebar,
	SidebarContent,
	SidebarGroup,
	SidebarGroupContent,
	SidebarGroupLabel,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Info, Package, Users } from "lucide-react";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { ThemeToggle } from "@/components/theme-toggle";
import { Provider } from 'react-redux';
import { store } from '@/feature/store';
import { useGetCustomersQuery } from '@/feature/api';
import type { Customer } from '@/lib/api/types';
import { useDispatch, useSelector } from 'react-redux';
import { setSelectedCustomer, selectSelectedCustomerId } from '@/feature/selectedCustomerSlice';
import { Toaster } from "sonner";

const managementMenuItems = [
	{ title: "Customers", icon: Users, href: "/customers" },
	{ title: "Product Details", icon: Package, href: "/product-details" },
];

const userManagementMenuItems = [
	{ title: "Customer Info", icon: Info, href: "/customer-info" },
	{ title: "Customer's Products", icon: Package, href: "/customer-products" },
];

const AppContent = ({ children }: { children: ReactNode }) => {
	const pathname = usePathname();
	const router = useRouter();
	const dispatch = useDispatch();
	const selectedCustomer = useSelector(selectSelectedCustomerId);
	const { data: customers, isLoading } = useGetCustomersQuery();

	// Auto-select first customer when data is loaded
	useEffect(() => {
		if (customers?.length && !selectedCustomer) {
			const firstCustomerId = customers[0].id.toString();
			dispatch(setSelectedCustomer(firstCustomerId));
			
			// If on customer info page, update the URL
			if (pathname === '/customer-info') {
				router.push(`/customer-info?customerId=${firstCustomerId}`, { scroll: false });
			}
		}
	}, [customers, selectedCustomer, dispatch, pathname, router]);

	const handleCustomerChange = (customerId: string) => {
		dispatch(setSelectedCustomer(customerId));
		if (pathname === '/customer-info') {
			router.push(`/customer-info?customerId=${customerId}`, { scroll: false });
		}
	};

	return (
		<>
			<Sidebar className="w-64 border-r" collapsible="icon">
				<SidebarContent>
					<div className="p-6 border-b h-[60px] flex items-center justify-center">
						<span className="text-lg font-semibold">App Demo</span>
					</div>
					
					{/* Management Group */}
					<SidebarGroup>
						<SidebarGroupLabel>Management</SidebarGroupLabel>
						<SidebarGroupContent>
							<SidebarMenu>
								{managementMenuItems.map((item) => (
									<SidebarMenuItem key={item.title}>
										<SidebarMenuButton asChild isActive={pathname === item.href}>
											<Link
												href={item.href}
												className="flex items-center gap-2 px-4 py-2"
												scroll={false}>
												{item.icon && <item.icon className="h-4 w-4" />}
												<span>{item.title}</span>
											</Link>
										</SidebarMenuButton>
									</SidebarMenuItem>
								))}
							</SidebarMenu>
						</SidebarGroupContent>
					</SidebarGroup>

					{/* User Management Group */}
					<SidebarGroup>
						<SidebarGroupLabel>User Management</SidebarGroupLabel>
						<SidebarGroupContent>
							<div className="px-2 py-2">
								<Select
									value={selectedCustomer || undefined}
									onValueChange={handleCustomerChange}
									disabled={isLoading}>
									<SelectTrigger className="w-full">
										<SelectValue placeholder={isLoading ? "Loading..." : "Select a customer"} />
									</SelectTrigger>
									<SelectContent className="custom-scrollbar">
										{customers?.map((customer: Customer) => (
											<SelectItem
												key={customer.id}
												value={customer.id.toString()}>
												{customer.name}
											</SelectItem>
										))}
									</SelectContent>
								</Select>
							</div>
							<SidebarMenu>
								{userManagementMenuItems.map((item) => (
									<SidebarMenuItem key={item.title}>
										<SidebarMenuButton asChild isActive={pathname === item.href}>
											<Link
												href={item.href}
												className="flex items-center gap-2 px-4 py-2"
												scroll={false}>
												{item.icon && <item.icon className="h-4 w-4" />}
												<span>{item.title}</span>
											</Link>
										</SidebarMenuButton>
									</SidebarMenuItem>
								))}
							</SidebarMenu>
						</SidebarGroupContent>
					</SidebarGroup>
				</SidebarContent>
			</Sidebar>
			<div className="flex min-h-screen w-full">
				<div className="flex flex-col flex-1">
					<header className="flex flex-row w-full items-center gap-4 border-b bg-muted/40 px-4 lg:h-[60px] lg:px-6 justify-between h-[60px]">
						<div className="flex flex-row items-center justify-center gap-3">
							<SidebarTrigger />
						</div>
						<div className="ml-auto flex items-center gap-x-4">
							<div>Hello, Zonda Demo</div>
							<ThemeToggle />
						</div>
					</header>
					<main className="flex-1 p-6">
						{children}
					</main>
				</div>
			</div>
		</>
	);
};

export default function RootLayout({ children }: { children: ReactNode }) {
	return (
		<html lang="en" suppressHydrationWarning>
			<body suppressHydrationWarning>
				<Provider store={store}>
					<ThemeProvider
						attribute="class"
						defaultTheme="system"
						enableSystem
						disableTransitionOnChange>
						<SidebarProvider>
							<AppContent>{children}</AppContent>
							<Toaster />
						</SidebarProvider>
					</ThemeProvider>
				</Provider>
			</body>
		</html>
	);
}
