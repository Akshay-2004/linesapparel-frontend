"use client"

import React, { useEffect, useState } from 'react'
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { MapPin, CreditCard, Loader2, Save, User, ShoppingBag } from "lucide-react"
import { useCartStore } from '@/store/cartStore'
import { useApi } from '@/hooks/useApi'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { useBuyNowStore } from "@/store/buyNowStore";
import { useUserDetails } from '@/hooks/useUserDetails'

const formSchema = z.object({
    // Shipping Address
    shipping_first_name: z.string().min(2, "First name is required"),
    shipping_last_name: z.string().min(2, "Last name is required"),
    shipping_address1: z.string().min(5, "Address is required"),
    shipping_city: z.string().min(2, "City is required"),
    shipping_province: z.string().min(2, "Province/State is required"),
    shipping_country: z.string().min(2, "Country is required"),
    shipping_zip: z.string().min(5, "ZIP code is required"),

    // Billing Address
    billing_first_name: z.string().min(2, "First name is required"),
    billing_last_name: z.string().min(2, "Last name is required"),
    billing_address1: z.string().min(5, "Address is required"),
    billing_city: z.string().min(2, "City is required"),
    billing_province: z.string().min(2, "Province/State is required"),
    billing_country: z.string().min(2, "Country is required"),
    billing_zip: z.string().min(5, "ZIP code is required"),

    email: z.string().email("Invalid email address"),
    sameAsShipping: z.boolean()
})

interface UserAddress {
    street?: string;
    city?: string;
    state?: string;
    zip?: string;
    country?: string;
}

interface AddressApiResponse {
    success?: boolean;
    data?: {
        address?: UserAddress | null;
    };
    message?: string;
    address?: UserAddress | null; // Direct address property for fallback
}

export default function CheckoutPage() {
    const { fetchData, loading } = useApi()
    const { cart, error, fetchCart, clearCart } = useCartStore();
    const { variantId, quantity, clearBuyNow } = useBuyNowStore();
    const { user, isAuthenticated } = useUserDetails();
    const router = useRouter()
    const [savedAddress, setSavedAddress] = useState<UserAddress | null>(null);
    const [showSaveAddress, setShowSaveAddress] = useState(false);
    const [loadingAddress, setLoadingAddress] = useState(false);
    
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            shipping_first_name: "",
            shipping_last_name: "",
            shipping_address1: "",
            shipping_city: "",
            shipping_province: "",
            shipping_country: "",
            shipping_zip: "",
            billing_first_name: "",
            billing_last_name: "",
            billing_address1: "",
            billing_city: "",
            billing_province: "",
            billing_country: "",
            billing_zip: "",
            email: "",
            sameAsShipping: false
        },
    })

    // Fetch user's saved address on component mount
    useEffect(() => {
        const fetchUserAddress = async () => {
            if (!user?.id || !isAuthenticated()) return;
            
            setLoadingAddress(true);
            try {
                const response = await fetchData(`/users/${user.id}/address`, {
                    method: "GET"
                }) as AddressApiResponse;
                
                // Handle different response structures
                const address = response?.data?.address || response?.address || null;
                
                // Only set saved address if it exists and has required fields
                if (address && (address.street || address.city || address.state || address.zip || address.country)) {
                    setSavedAddress(address);
                } else {
                    setSavedAddress(null);
                }
            } catch (error) {
                console.error('Error fetching user address:', error);
                setSavedAddress(null);
            } finally {
                setLoadingAddress(false);
            }
        };

        fetchUserAddress();
    }, [user?.id, fetchData]);

    // Function to populate form with saved address
    const useSavedAddress = () => {
        if (!savedAddress) return;
        
        // Split name if available (assuming user.name contains full name)
        const nameParts = user?.name?.split(' ') || ['', ''];
        const firstName = nameParts[0] || '';
        const lastName = nameParts.slice(1).join(' ') || '';
        
        // Populate shipping address
        form.setValue('shipping_first_name', firstName);
        form.setValue('shipping_last_name', lastName);
        form.setValue('shipping_address1', savedAddress.street || '');
        form.setValue('shipping_city', savedAddress.city || '');
        form.setValue('shipping_province', savedAddress.state || '');
        form.setValue('shipping_country', savedAddress.country || '');
        form.setValue('shipping_zip', savedAddress.zip || '');
        
        // Also populate email if available
        if (user?.email) {
            form.setValue('email', user.email);
        }
        
        toast.success('Address loaded successfully!');
    };

    // Simplified function to save current address
    const saveCurrentAddress = async () => {
        if (!user?.id || !isAuthenticated()) {
            toast.error('Please login to save address');
            return;
        }

        const shippingValues = form.getValues([
            'shipping_address1',
            'shipping_city',
            'shipping_province',
            'shipping_country',
            'shipping_zip'
        ]);

        // Check if required fields are filled
        if (!shippingValues[0] || !shippingValues[1] || !shippingValues[2] || !shippingValues[3] || !shippingValues[4]) {
            toast.error('Please fill in all shipping address fields before saving');
            return;
        }

        setLoadingAddress(true);
        try {
            const addressData = {
                street: shippingValues[0],
                city: shippingValues[1],
                state: shippingValues[2],
                country: shippingValues[3],
                zip: shippingValues[4]
            };

            const response = await fetchData(`/users/${user.id}/address`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                data: addressData
            }) as AddressApiResponse;

            // Handle different response structures
            const returnedAddress = response?.data?.address || response?.address || null;
            
            if (returnedAddress || response?.success !== false) {
                setSavedAddress(addressData);
                setShowSaveAddress(false);
                toast.success('Address saved successfully! You can use it for future checkouts.');
            } else {
                toast.error('Failed to save address. Please try again.');
            }
        } catch (error) {
            console.error('Error saving address:', error);
            toast.error('Failed to save address. Please try again.');
        } finally {
            setLoadingAddress(false);
        }
    };

    const sameAsShipping = form.watch("sameAsShipping")
    // Sync billing fields when "Same as shipping" is checked
    useEffect(() => {
        if (sameAsShipping) {
            const shippingFields = form.getValues([
                'shipping_first_name',
                'shipping_last_name',
                'shipping_address1',
                'shipping_city',
                'shipping_province',
                'shipping_country',
                'shipping_zip'
            ])
            form.setValue('billing_first_name', shippingFields[0])
            form.setValue('billing_last_name', shippingFields[1])
            form.setValue('billing_address1', shippingFields[2])
            form.setValue('billing_city', shippingFields[3])
            form.setValue('billing_province', shippingFields[4])
            form.setValue('billing_country', shippingFields[5])
            form.setValue('billing_zip', shippingFields[6])
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [
        sameAsShipping,
        form.watch('shipping_first_name'),
        form.watch('shipping_last_name'),
        form.watch('shipping_address1'),
        form.watch('shipping_city'),
        form.watch('shipping_province'),
        form.watch('shipping_country'),
        form.watch('shipping_zip')
    ])


    async function onSubmit(values: z.infer<typeof formSchema>): Promise<void> {
        // Build line_items from cart or buyNowStore
        interface CartItem {
            variantId: string | number;
            quantity: number;
        }

        interface LineItem {
            variant_id: number;
            quantity: number;
        }

        interface ApiResponse {
            draft_order_id?: string | number;
            invoice_url?: string;
            debug_info?: {
                message?: string;
            };
        }

        let line_items: LineItem[] = [];

        // Prioritize Buy Now items over cart items
        if (variantId && quantity) {
            // User clicked "Buy Now" - use only this item
            line_items = [{
                variant_id: Number(variantId),
                quantity: quantity,
            }];
        } else if (cart?.items && cart.items.length > 0) {
            // User is checking out from cart
            line_items = cart.items.map((item: CartItem): LineItem => ({
                variant_id: Number(item.variantId),
                quantity: item.quantity,
            }));
        } else {
            toast.error("No items to checkout.");
            return;
        }

        // Build formData as required for draft order
        const formData = {
            line_items,
            customer: {
                email: values.email,
            },
            shipping_address: {
                first_name: values.shipping_first_name,
                last_name: values.shipping_last_name,
                address1: values.shipping_address1,
                city: values.shipping_city,
                province: values.shipping_province,
                country: values.shipping_country,
                zip: values.shipping_zip,
            },
            billing_address: {
                first_name: values.billing_first_name,
                last_name: values.billing_last_name,
                address1: values.billing_address1,
                city: values.billing_city,
                province: values.billing_province,
                country: values.billing_country,
                zip: values.billing_zip,
            },
            email: values.email,
            use_customer_default_address: false,
            // Add this to ensure invoice is generated
            send_receipt: true,
            send_fulfillment_receipt: true,
        };

        try {
            const res = await fetchData("/shopify/orders", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                data: formData,
            }) as ApiResponse;

            // Store draft order ID for later reference
            if (res.draft_order_id) {
                localStorage.setItem('draft_order_id', res.draft_order_id.toString());
            }

            // Clear Buy Now store if this was a Buy Now checkout
            if (variantId && quantity) {
                clearBuyNow();
            }

            // Redirect to Shopify's payment portal
            if (res.invoice_url) {
                window.location.href = res.invoice_url;
            } else {
                // Better error handling with debug info
                console.error('No payment URL received. Response:', res);

                if (res.debug_info) {
                    console.error('Debug info:', res.debug_info);
                }

                // Show user-friendly error message with toast
                toast.error(`Unable to proceed to payment. ${res.debug_info?.message || 'Please try again or contact support.'}`);
            }

        } catch (error) {
            console.error('Checkout error:', error);
            toast.error('An error occurred during checkout. Please try again.');
        }
    }

    return (
        <div className="min-h-screen bg-background py-16 px-4 sm:px-6 lg:px-8">
            <div className="container mx-auto">
                <Card className="bg-card shadow-sm border-border">
                    <CardHeader className="space-y-6 pb-8 border-b border-border">
                        <div>
                            <h4 className="text-primary-6 text-sm font-medium mb-2">Secure & Fast Payment</h4>
                            <CardTitle className="text-4xl font-bold text-foreground mb-4">
                                {variantId && quantity ? "Quick Checkout" : "Checkout"}
                            </CardTitle>
                        </div>
                    </CardHeader>
                    <CardContent className="pt-8 space-y-8">
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                                {/* Address Management Section - Only show if user is authenticated */}
                                {isAuthenticated() && user && (
                                    <div className="space-y-4 p-4 bg-muted/30 rounded-lg border border-border">
                                        <div className="flex items-center space-x-2 mb-3">
                                            <User className="w-4 h-4 text-primary-6" />
                                            <h3 className="text-sm font-medium text-foreground">Quick Address Options</h3>
                                        </div>
                                        
                                        {savedAddress ? (
                                            <div className="space-y-3">
                                                <div className="text-xs text-muted-foreground bg-background p-3 rounded border">
                                                    <p className="font-medium mb-1 text-foreground">Your Saved Address:</p>
                                                    <p>{savedAddress.street}</p>
                                                    <p>{savedAddress.city}, {savedAddress.state} {savedAddress.zip}</p>
                                                    <p>{savedAddress.country}</p>
                                                </div>
                                                
                                                <div className="flex flex-wrap gap-2">
                                                    <Button
                                                        type="button"
                                                        variant="default"
                                                        size="sm"
                                                        onClick={useSavedAddress}
                                                        disabled={loadingAddress}
                                                        className="text-xs bg-primary hover:bg-primary-5"
                                                    >
                                                        <MapPin className="w-3 h-3 mr-1" />
                                                        Use This Address
                                                    </Button>
                                                    
                                                    <Button
                                                        type="button"
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={saveCurrentAddress}
                                                        disabled={loadingAddress}
                                                        className="text-xs"
                                                    >
                                                        {loadingAddress ? (
                                                            <Loader2 className="w-3 h-3 animate-spin mr-1" />
                                                        ) : (
                                                            <Save className="w-3 h-3 mr-1" />
                                                        )}
                                                        Update Saved Address
                                                    </Button>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="space-y-3">
                                                <p className="text-xs text-muted-foreground">
                                                    💡 Fill in your address below and save it for faster checkout next time!
                                                </p>
                                                
                                                <Button
                                                    type="button"
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={saveCurrentAddress}
                                                    disabled={loadingAddress}
                                                    className="text-xs"
                                                >
                                                    {loadingAddress ? (
                                                        <Loader2 className="w-3 h-3 animate-spin mr-1" />
                                                    ) : (
                                                        <Save className="w-3 h-3 mr-1" />
                                                    )}
                                                    Save Address for Future Use
                                                </Button>
                                            </div>
                                        )}
                                    </div>
                                )}

                                {/* Shipping Address Section */}
                                <div className="space-y-6">
                                    <div className="flex items-center space-x-2">
                                        <MapPin className="w-5 h-5 text-primary-6" />
                                        <h2 className="text-xl font-semibold text-foreground">Shipping Address</h2>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <FormField
                                            control={form.control}
                                            name="shipping_first_name"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel className="text-foreground">First Name</FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            {...field}
                                                            className="border-border bg-background text-foreground"
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={form.control}
                                            name="shipping_last_name"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel className="text-foreground">Last Name</FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            {...field}
                                                            className="border-border bg-background text-foreground"
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={form.control}
                                            name="shipping_address1"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel className="text-foreground">Address</FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            {...field}
                                                            className="border-border bg-background text-foreground"
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={form.control}
                                            name="shipping_city"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel className="text-foreground">City</FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            {...field}
                                                            className="border-border bg-background text-foreground"
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={form.control}
                                            name="shipping_province"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel className="text-foreground">Province/State</FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            {...field}
                                                            className="border-border bg-background text-foreground"
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={form.control}
                                            name="shipping_country"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel className="text-foreground">Country</FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            {...field}
                                                            className="border-border bg-background text-foreground"
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={form.control}
                                            name="shipping_zip"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel className="text-foreground">ZIP Code</FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            {...field}
                                                            className="border-border bg-background text-foreground"
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>
                                </div>

                                <Separator className="my-8 bg-border" />

                                {/* Billing Address Section */}
                                <div className="space-y-6">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center space-x-2">
                                            <CreditCard className="w-5 h-5 text-primary-6" />
                                            <h2 className="text-xl font-semibold text-foreground">Billing Address</h2>
                                        </div>
                                        <FormField
                                            control={form.control}
                                            name="sameAsShipping"
                                            render={({ field }) => (
                                                <FormItem className="flex items-center space-x-2">
                                                    <FormControl>
                                                        <Checkbox
                                                            checked={field.value}
                                                            onCheckedChange={field.onChange}
                                                            className="border-border"
                                                        />
                                                    </FormControl>
                                                    <FormLabel className="mb-0 text-foreground">Same as shipping</FormLabel>
                                                </FormItem>
                                            )}
                                        />
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <FormField
                                            control={form.control}
                                            name="billing_first_name"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel className="text-foreground">First Name</FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            {...field}
                                                            disabled={sameAsShipping}
                                                            className="border-border bg-background text-foreground disabled:opacity-50"
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={form.control}
                                            name="billing_last_name"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel className="text-foreground">Last Name</FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            {...field}
                                                            disabled={sameAsShipping}
                                                            className="border-border bg-background text-foreground disabled:opacity-50"
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={form.control}
                                            name="billing_address1"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel className="text-foreground">Address</FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            {...field}
                                                            disabled={sameAsShipping}
                                                            className="border-border bg-background text-foreground disabled:opacity-50"
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={form.control}
                                            name="billing_city"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel className="text-foreground">City</FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            {...field}
                                                            disabled={sameAsShipping}
                                                            className="border-border bg-background text-foreground disabled:opacity-50"
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={form.control}
                                            name="billing_province"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel className="text-foreground">Province/State</FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            {...field}
                                                            disabled={sameAsShipping}
                                                            className="border-border bg-background text-foreground disabled:opacity-50"
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={form.control}
                                            name="billing_country"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel className="text-foreground">Country</FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            {...field}
                                                            disabled={sameAsShipping}
                                                            className="border-border bg-background text-foreground disabled:opacity-50"
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={form.control}
                                            name="billing_zip"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel className="text-foreground">ZIP Code</FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            {...field}
                                                            disabled={sameAsShipping}
                                                            className="border-border bg-background text-foreground disabled:opacity-50"
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>
                                </div>

                                {/* Email Section */}
                                <div className="space-y-6">
                                    <FormField
                                        control={form.control}
                                        name="email"
                                        render={({ field }) => (
                                            <FormItem className="max-w-md">
                                                <FormLabel className="text-foreground">Email</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        type="email"
                                                        placeholder="Enter your email"
                                                        {...field}
                                                        className="border-border bg-background text-foreground"
                                                    />
                                                </FormControl>
                                                <p className="text-sm text-muted-foreground">
                                                    We'll send your order confirmation here
                                                </p>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>

                                <div className="pt-6 border-t border-border">
                                    <Button
                                        disabled={loading}
                                        type="submit"
                                        className="w-full sm:w-auto min-w-[200px] bg-primary hover:bg-primary-5 text-primary-foreground"
                                    >
                                        {
                                            loading ? (
                                                <>
                                                    <Loader2 className='animate-spin mr-2 h-4 w-4' />
                                                    Processing...
                                                </>
                                            ) : (
                                                'Complete Checkout'
                                            )
                                        }
                                    </Button>
                                </div>
                            </form>
                        </Form>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}