"use client";

import React from "react";
import { AuthCard } from "../_components/AuthCard";
import useSupabaseClient from "@/utils/supabase/client";

import { Form } from "@/components/ui/form";
import { RootPath } from "@/constants/enum";
import { useForm } from "react-hook-form";
import { RegisterFormType, RegisterSchema } from "@/validators/auth.validate";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "@/components/ui/use-toast";
import { InputText } from "@/components/common/form/InputText";
import { InputPassword } from "@/components/common/form/InputPassword";
import { Button } from "@/components/ui/button";
import { Icons } from "@/components/icon";

const SignUpPage = () => {
  const supabase = useSupabaseClient();

  const form = useForm<RegisterFormType>({
    resolver: zodResolver(RegisterSchema),
    defaultValues: {
      email: "",
      // userName: '',
      password: "",
      confirmPassword: "",
    },
  });

  const {
    formState: { isSubmitting },
    handleSubmit,
    // setError,
  } = form;

  async function onSubmit(values: RegisterFormType) {
    const { error } = await supabase.auth.signUp(values);

    if (!error) {
      toast({
        variant: "success",
        title:
          "Tạo tài khoản thành công. Kiểm tra email để hoàn thành đăng ký.",
      });
      return;
    }

    toast({
      variant: "destructive",
      title: "Đăng ký thất bại",
      description: error.message,
    });
  }

  return (
    <AuthCard
      title="Đăng ký"
      desc="to continue to Streamline"
      backButtonLabel="Đã có tài khoản? Đăng nhập"
      backButtonHref={RootPath.Login}
      showSocial
    >
      <Form {...form}>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <InputText<RegisterFormType>
            name="email"
            label="Email"
            form={form}
            placeholder="Nhập Email"
          />

          <InputPassword<RegisterFormType>
            name="password"
            label="Mật khẩu"
            form={form}
            placeholder="Nhập mật khẩu"
            disablePasswordEye={form.watch("password").length === 0}
          />

          <InputPassword<RegisterFormType>
            name="confirmPassword"
            label="Nhập lại Mật khẩu"
            form={form}
            placeholder="Xác nhận mật khẩu"
            disablePasswordEye={form.watch("password").length === 0}
          />

          <Button type="submit" className="w-full mt-4" disabled={isSubmitting}>
            {isSubmitting && (
              <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
            )}
            Đăng ký
          </Button>
        </form>
      </Form>
    </AuthCard>
  );
};

export default SignUpPage;
