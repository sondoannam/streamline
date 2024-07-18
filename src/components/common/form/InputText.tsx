"use client";

import React, {
  ChangeEventHandler,
  InputHTMLAttributes,
  ReactNode,
} from "react";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { FieldPath, FieldValues, UseFormReturn } from "react-hook-form";
import { cn } from "@/lib/utils";
import { Textarea } from "@/components/ui/textarea";

type InputProps = Omit<InputHTMLAttributes<HTMLInputElement>, "form">;

type InputFieldProps<TFieldValues extends FieldValues> = {
  className?: string;
  name: FieldPath<TFieldValues>;
  label: string;
  form: UseFormReturn<TFieldValues>;
  isLoading?: boolean;
  description?: string | ReactNode;
  onChange?: ChangeEventHandler<HTMLInputElement>;
  isTextArea?: boolean;
  inputAttributes?: InputHTMLAttributes<HTMLInputElement>;
};

export const InputText = <T extends FieldValues>({
  className,
  name,
  label,
  form,
  isLoading = false,
  description,
  onChange,
  isTextArea,
  ...props
}: InputProps & InputFieldProps<T>) => {
  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field, fieldState: { error } }) => (
        <FormItem className={className}>
          <FormLabel className="text-base">{label}</FormLabel>
          <FormControl>
            {isTextArea !== undefined && isTextArea ? (
              <Textarea
                {...field}
                placeholder={props.placeholder}
                disabled={isLoading || props.disabled}
              />
            ) : (
              <Input
                {...field}
                {...props}
                className={cn(
                  "text-base focus-visible:ring-0 focus-visible:ring-offset-0 disabled:opacity-100",
                  error && "border-primary"
                )}
                disabled={isLoading || props.disabled}
                onChange={(e) => (onChange ? onChange(e) : field.onChange(e))}
              />
            )}
          </FormControl>
          {description && <FormDescription>{description}</FormDescription>}
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
