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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../ui/select";
import { Button } from "../../ui/button";
import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../../ui/dialog";
import { ItemFormValues, itemFormSchema } from "../ItemTable/ItemTable";

const AddItemForm = ({
  isOpen,
  setOpen,
  onSubmit,
  defaultValues,
}: {
  isOpen: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  onSubmit: (data: ItemFormValues) => void;
  defaultValues: Partial<ItemFormValues>;
}) => {
  const form = useForm<ItemFormValues>({
    resolver: zodResolver(itemFormSchema),
    defaultValues,
    mode: "onChange",
  });
  const quantityRef = useRef<HTMLInputElement>(null);
  const discountRef = useRef<HTMLInputElement>(null);
  const rateRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (data: ItemFormValues) => {
    form.reset();
    onSubmit(data);
  };

  const getAmount = ({
    quantityType,
    rate,
    discount,
  }: {
    quantityType: number;
    rate: number;
    discount: number;
  }) => {
    if (discount && !isNaN(quantityType) && !isNaN(rate) && !isNaN(discount)) {
      const discountedPrice = (quantityType * rate * discount) / 100;
      if (!isNaN(discountedPrice)) {
        return discountedPrice;
      } else {
        return 0; // Default to 0 if the calculation is invalid
      }
    } else {
      return 0; // Default to 0 if any of the values are invalid
    }
  };

  useEffect(() => {
    const quantityType = Number(quantityRef?.current?.value) ?? 0;
    const rate = Number(rateRef?.current?.value) ?? 0;
    const discount = Number(discountRef?.current?.value) ?? 0;
    form.setValue("grossTotalAmount", rate * quantityType);

    if (quantityType && rate && discount) {
      const discountAmount = Number(
        getAmount({
          quantityType,
          rate,
          discount,
        }).toFixed(2)
      );
      form.setValue("discountAmount", discountAmount);
      form.setValue("amount", quantityType * rate - discountAmount);
    }
  }, [
    rateRef?.current?.value,
    discountRef?.current?.value,
    quantityRef?.current?.value,
    form,
  ]);
  return (
    <Dialog open={isOpen} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-md ">
        <DialogHeader>
          <DialogTitle>Add Items</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="grid grid-cols-2 gap-5"
          >
            <FormField
              control={form.control}
              name="itemName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Item Name</FormLabel>
                  <FormControl>
                    <Input
                      defaultValue={defaultValues.itemName}
                      placeholder="Enter an item name"
                      {...field}
                    />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="hsnCode"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>HSN Code</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={defaultValues.hsnCode}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select HSN Code" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="kg">123</SelectItem>
                      <SelectItem value="perItem">1234</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="quantityType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Quantity</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      defaultValue={defaultValues.quantityType}
                      placeholder="Enter Quantity"
                      {...field}
                      ref={quantityRef}
                    />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="rate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Rate</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="Enter Rate"
                      defaultValue={defaultValues.rate}
                      {...field}
                      ref={rateRef}
                    />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="rate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Rate</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      defaultValue={defaultValues.rate}
                      placeholder="0"
                      {...field}
                    />
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

export default AddItemForm;
