"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../../ui/form";
import { Input } from "../../ui/input";
import { Textarea } from "../../ui/textarea";
import { Button } from "../../ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../../ui/dialog";
import { Dispatch, SetStateAction } from "react";

const companyFormSchema = z.object({
  name: z
    .string()
    .min(1, {
      message: "Name is required.",
    })
    .max(100, {
      message: "Name must not be longer than 30 characters.",
    }),
  address: z
    .string()
    .min(1, {
      message: "Address is required.",
    })
    .max(100, {
      message: "Address must not be longer than 30 characters.",
    }),
  pincode: z
    .string()
    .min(1, {
      message: "Pincode is required.",
    })
    .max(100, {
      message: "Pincode must not be longer than 30 characters.",
    }),
  state: z
    .string()
    .min(1, {
      message: "State is required.",
    })
    .max(100, {
      message: "State must not be longer than 30 characters.",
    }),
  city: z
    .string()
    .min(1, {
      message: "City is required.",
    })
    .max(100, {
      message: "City must not be longer than 30 characters.",
    }),
  gst: z
    .string()
    .min(15, {
      message: "GST should be 15 characters long.",
    })
    .max(15, {
      message: "GST should be 15 characters long.",
    }),
  description: z.string().max(160).min(4),
});

type ProfileFormValues = z.infer<typeof companyFormSchema>;

// This can come from your database or API.
const defaultValues: Partial<ProfileFormValues> = {
  name: "",
  address: "",
  gst: "",
  pincode: "",
  city: "",
  state: "",
  description: "",
};

const AddCompany = ({
  isOpen,
  setOpen,
  onSubmit,
  defaultValues,
}: {
  isOpen: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  onSubmit: (data: ProfileFormValues) => void;
  defaultValues: Partial<ProfileFormValues>;
}) => {
  console.log(defaultValues);
  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(companyFormSchema),
    defaultValues,
    mode: "onChange",
  });

  const handleSubmit = (data: ProfileFormValues) => {
    form.reset();
    onSubmit(data);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-xl	 ">
        <DialogHeader>
          <DialogTitle>Add Company</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-0 grid grid-cols-2	 w-full gap-3	"
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel> Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter an name" {...field} />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="gst"
              render={({ field }) => (
                <FormItem>
                  <FormLabel> GST</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter an GST no" {...field} />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Address</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Tell us company address"
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Tell us a little bit about company"
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="pincode"
              render={({ field }) => (
                <FormItem>
                  <FormLabel> Pincode</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter an Pincode" {...field} />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="city"
              render={({ field }) => (
                <FormItem>
                  <FormLabel> City</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter an City" {...field} />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="state"
              render={({ field }) => (
                <FormItem>
                  <FormLabel> State</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter an State" {...field} />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />

            <div></div>
            <Button type="submit">Save</Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
export default AddCompany;
