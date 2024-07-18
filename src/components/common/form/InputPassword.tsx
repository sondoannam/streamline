"use client";

import React, {
  ChangeEventHandler,
  InputHTMLAttributes,
  ReactNode,
  useState,
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
import { Button } from "@/components/ui/button";
import { FieldPath, FieldValues, UseFormReturn } from "react-hook-form";
import { cn } from "@/lib/utils";
import { Eye, EyeOff } from "lucide-react";

type InputProps = Omit<React.InputHTMLAttributes<HTMLInputElement>, "form">;

type InputFieldProps<TFieldValues extends FieldValues> = {
  name: FieldPath<TFieldValues>;
  label: string;
  form: UseFormReturn<TFieldValues>;
  isLoading?: boolean;
  description?: string | ReactNode;
  onChange?: ChangeEventHandler<HTMLInputElement>;
  disablePasswordEye: boolean;
};

export const InputPassword = <T extends FieldValues>({
  name,
  label,
  form,
  isLoading = false,
  description,
  onChange,
  placeholder,
  disablePasswordEye,
  ...props
}: InputProps & InputFieldProps<T>) => {
  const [showPassword, setShowPassword] = useState<boolean>(false);

  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field, fieldState: { error } }) => (
        <FormItem className={props.className}>
          <FormLabel className="text-base">{label}</FormLabel>
          <FormControl>
            <div className="relative">
              <Input
                {...field}
                {...props}
                type={showPassword ? "text" : "password"}
                placeholder={placeholder}
                className={cn(
                  "text-base focus-visible:ring-0 focus-visible:ring-offset-0",
                  error && "border-primary"
                )}
                disabled={isLoading || props.disabled}
                onChange={(e) => (onChange ? onChange(e) : field.onChange(e))}
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                onClick={() => setShowPassword((prev) => !prev)}
                disabled={disablePasswordEye || props.disabled}
              >
                {showPassword && !disablePasswordEye ? (
                  <Eye className="h-5 w-5" aria-hidden="true" />
                ) : (
                  <EyeOff className="h-5 w-5" aria-hidden="true" />
                )}
                <span className="sr-only">
                  {showPassword ? "Hide password" : "Show password"}
                </span>
              </Button>
            </div>
          </FormControl>
          {description && <FormDescription>{description}</FormDescription>}
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export const FakeInputPassword = () => {
  return (
    <FormItem className="text-base w-full mb-4">
      <FormLabel>Mật khẩu</FormLabel>
      <Input type="password" value="********" readOnly />
    </FormItem>
  );
};
