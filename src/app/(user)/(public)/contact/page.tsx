"use client"
import React, { useState } from 'react'
import ContactImage from '@/assets/contact image.png'
import Image from 'next/image'
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { zodResolver } from '@hookform/resolvers/zod';
import { useInquiryService } from '@/services/inquiry.service'
import { INQUIRY_PURPOSES } from '@/types/inquiry.interface'
import { toast } from 'sonner'
import { Loader2 } from 'lucide-react'


const formSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  email: z.string().email({ message: "Please enter a valid email address." }),
  purpose: z.string().min(1, { message: "Please select a purpose for your inquiry." }),
  message: z.string().min(5, { message: "Message must be at least 5 characters." }),
  terms: z.boolean().refine(val => val === true, {
    message: "You must accept the terms and conditions."
  })
})

export default function ContactPage() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { createInquiry } = useInquiryService()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      purpose: "",
      message: "",
      terms: false,
    },
  })

  const termsAccepted = form.watch("terms")

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true)
    
    try {
      const response = await createInquiry({
        name: values.name,
        email: values.email,
        purpose: values.purpose,
        message: values.message
      })
      
      // Check if response exists and is successful
      if (response) {
        toast.success('Thank you for your inquiry! We\'ll get back to you soon.')
        form.reset()
      } else {
        throw new Error('No response received from server')
      }
    } catch (error: any) {
      console.error('Failed to submit inquiry:', error)
      const errorMessage = error?.response?.data?.message || error?.message || 'Failed to submit inquiry. Please try again.'
      toast.error(errorMessage)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className='container mx-auto grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-16 py-16 px-4 md:px-0'>
      <div className="flex flex-col space-y-6">
        <div>
          <h4 className="text-primary-6 text-sm font-medium mb-2">We&apos;re Here to Help—Always in Style</h4>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Contact us</h1>
          <p className="text-gray-700 mb-6">
            Have a question, a collab idea, or just want to say hi? Our team&apos;s always here
            to help—fashionably fast.
          </p>
        </div>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Name" {...field} />
                  </FormControl>
                  <p className="text-sm text-muted-foreground">Enter your Name</p>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="Email" {...field} />
                  </FormControl>
                  <p className="text-sm text-muted-foreground">Enter your email address</p>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="purpose"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Purpose of Inquiry</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select the purpose of your inquiry" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="w-full">
                      {INQUIRY_PURPOSES.map((purpose) => (
                        <SelectItem key={purpose.value} value={purpose.value}>
                          {purpose.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <p className="text-sm text-muted-foreground">
                    Help us route your inquiry to the right team
                  </p>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="message"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Your message</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Type your message here" 
                      className="min-h-[120px]" 
                      {...field} 
                    />
                  </FormControl>
                  <p className="text-sm text-muted-foreground">Your message will be sent to the support team.</p>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="terms"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>Accept terms and condition</FormLabel>
                  </div>
                </FormItem>
              )}
            />
            
            <Button 
              type="submit" 
              className="bg-primary hover:bg-primary-5 w-32" 
              disabled={!termsAccepted || isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Sending...
                </>
              ) : (
                'Submit'
              )}
            </Button>
          </form>
        </Form>
      </div>
      
      <div>
        <Image src={ContactImage} alt='Contact Image' className='w-full h-auto rounded-xs' />
      </div>
    </div>
  )
}