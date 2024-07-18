"use client";

import React from "react";
import { useRouter } from "next/navigation";
import useSupabaseClient from "@/utils/supabase/client";

import { AuthCard } from "../_components/AuthCard";
import { RootPath } from "@/constants/enum";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoginFormType, LoginSchema } from "@/validators/auth.validate";
import { Form } from "@/components/ui/form";
import { InputText } from "@/components/common/form/InputText";
import { InputPassword } from "@/components/common/form/InputPassword";
import { Button } from "@/components/ui/button";
import { Icons } from "@/components/icon";
import { toast } from "@/components/ui/use-toast";

const SignInPage = () => {
  const { push } = useRouter();
  const supabase = useSupabaseClient();

  const form = useForm<LoginFormType>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const {
    formState: { isSubmitting },
    handleSubmit,
    setError,
    watch,
  } = form;

  async function onSubmit(values: LoginFormType) {
    const { error } = await supabase.auth.signInWithPassword(values);

    if (!error) {
      toast({
        variant: "success",
        title: "Đăng nhập thành công",
      });

      push(RootPath.Home);

      return;
    }

    toast({
      variant: "destructive",
      title: "Đăng nhập thất bại",
      description: error.message,
    });
  }

  return (
    <AuthCard
      title="Đăng nhập"
      desc="to continue to Streamline"
      backButtonLabel="Chưa có tài khoản? Đăng ký"
      backButtonHref={RootPath.Register}
      showSocial
    >
      <Form {...form}>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <InputText<LoginFormType>
            name="email"
            label="Email"
            form={form}
            placeholder="Nhập email"
          />

          <InputPassword<LoginFormType>
            name="password"
            label="Password"
            form={form}
            placeholder="Nhập mật khẩu"
            disablePasswordEye={watch("password").length === 0}
          />

          <Button type="submit" className="w-full mt-4" disabled={isSubmitting}>
            {isSubmitting && (
              <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
            )}
            Đăng nhập
          </Button>
        </form>
      </Form>
    </AuthCard>
  );
};

export default SignInPage;
