"use client";

import * as z from "zod";
import Image from "next/image";
// import { useState } from "react";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { useContact } from "@/lib/hooks/useContact";
import { Loader2 } from "lucide-react";

// Zod schema using union of literals
const formSchema = z.object({
  fname: z.string().min(1, "First Name is required"),
  lname: z.string().min(1, "Last Name is required"),
  email: z.string().email("Invalid email address"),
  phone: z
    .string()
    .min(10, "Phone number must be at least 10 digits")
    .max(15, "Phone number is too long"),
  message: z.string().min(1, "Message is required"),
  agree: z.boolean().refine((val) => val === true, {
    message: "You must agree to the privacy policy",
  }),
});

export default function GetInTouch() {
  // const [loading, setLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fname: "",
      lname: "",
      email: "",
      phone: "",
      message: "",
      agree: false,
    },
  });

  const { submitContact, loading } = useContact();

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const payload = {
        firstName: values.fname,
        lastName: values.lname,
        email: values.email,
        phone: values.phone,
        message: values.message,
      };

      const res = await submitContact(payload);

      if (res?.success) {
        toast.success("Your message has been sent successfully! ");
        form.reset();
      } else {
        toast.error("Failed to send message ");
      }
    } catch (error) {
      toast.error("Something went wrong while sending the message.");
    }
  }

  return (
    <div className=" py-10 bg-white ">
      <div className="container mx-auto  grid grid-cols-1 md:grid-cols-2">
        {/* Right side: Form */}
        <div className="p-10 h-full ">
          {/* Title */}
          <h2 className="text-4xl font-semibold text-[#1a1a1a] mb-2">
            Get in touch
          </h2>
          <p className="text-[#606060] mb-8">
            Our friendly team would love to hear from you.
          </p>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* First + Last Name */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="fname"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm text-[#4a4a4a]">
                        First name
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="First name"
                          {...field}
                          className="h-12 rounded-lg border border-[#d3d3d3]"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="lname"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm text-[#4a4a4a]">
                        Last name
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Last name"
                          {...field}
                          className="h-12 rounded-lg border border-[#d3d3d3]"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Email */}
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm text-[#4a4a4a]">
                      Email
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="olivia@untitledui.com"
                        {...field}
                        className="h-12 rounded-lg border border-[#d3d3d3]"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Phone */}
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm text-[#4a4a4a]">
                      Phone number
                    </FormLabel>

                    <div className="flex gap-2">
                      {/* Country Dropdown */}
                      <select className="h-12 w-28 rounded-lg border border-[#d3d3d3] px-2">
                        <option>US</option>
                        <option>UK</option>
                        <option>CA</option>
                        <option>AU</option>
                      </select>

                      {/* Actual Number */}
                      <FormControl>
                        <Input
                          placeholder="+1 (555) 000–0000"
                          {...field}
                          className="h-12 rounded-lg border border-[#d3d3d3] flex-1"
                        />
                      </FormControl>
                    </div>

                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Message */}
              <FormField
                control={form.control}
                name="message"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm text-[#4a4a4a]">
                      Message
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder=""
                        {...field}
                        className="h-[140px] rounded-lg border border-[#d3d3d3] p-3"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Checkbox */}
              <FormField
                control={form.control}
                name="agree"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex justify-start items-center gap-3 pt-2">
                      <FormControl>
                        <input
                          type="checkbox"
                          checked={field.value}
                          onChange={field.onChange}
                          className="mt-1 h-5 w-5"
                        />
                      </FormControl>

                      <p className="text-sm text-[#4a4a4a]">
                        You agree to our friendly{" "}
                        <span className="text-[#b62400] font-medium cursor-pointer">
                          privacy policy
                        </span>
                        .
                      </p>
                    </div>

                    {/* Error message */}
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-[#7E1800] cursor-pointer hover:bg-[#c23f22] text-white h-12 rounded-lg text-lg font-medium flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    Sending...
                  </>
                ) : (
                  "Send message"
                )}
              </Button>
            </form>
          </Form>
        </div>
        {/* Left side: Image with gradient overlay */}
        <div className="relative h-96 md:h-auto rounded-l-2xl overflow-hidden">
          <Image
            src="/images/contact.jpg"
            alt="Contact Image"
            fill
            className="object-cover aspect-square rounded-md "
            priority
          />
          {/* <div className="absolute inset-0 bg-black/20 rounded-l-2xl" /> */}
        </div>
      </div>
    </div>
  );
}
