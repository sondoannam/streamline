import * as z from "zod";

export const LoginSchema = z.object({
  email: z.string().email({
    message: "Email không được bỏ trống",
  }),
  password: z.string().min(1, {
    message: "Mật khẩu không được bỏ trống",
  }),
});

export type LoginFormType = z.infer<typeof LoginSchema>;

export const RegisterSchema = z
  .object({
    email: z.string().min(1, "Email không được bỏ trống").email({
      message: "Bạn cần nhập đúng định dạng email",
    }),
    password: z
      .string()
      .min(1, {
        message: "Mật khẩu không được bỏ trống",
      })
      .min(8, {
        message: "Mật khẩu cần ít nhất 8 kí tự",
      })
      .max(24, {
        message: "Mật khẩu dài tối đa 24 kí tự",
      }),
    confirmPassword: z
      .string()
      .min(1, {
        message: "Mật khẩu không được bỏ trống",
      })
      .min(8)
      .max(24),
  })
  .superRefine(({ confirmPassword, password }, ctx) => {
    if (confirmPassword !== password) {
      ctx.addIssue({
        code: "custom",
        message: "Nhập lại mật khẩu không trùng khớp",
        path: ["confirmPassword"],
      });
    }
  });

export type RegisterFormType = z.infer<typeof RegisterSchema>;

export const UpdateUserProfile = z.object({
  // userName: z
  //   .string()
  //   .min(1, {
  //     message: 'Tên người dùng không được bỏ trống',
  //   })
  //   .min(4, {
  //     message: 'Tên đăng nhập có độ dài ít nhất 4 kí tự',
  //   }),
  firstName: z
    .string()
    .min(1, {
      message: "Tên không được bỏ trống",
    })
    .min(2, {
      message: "Tên cần ít nhất 2 kí tự",
    }),
  lastName: z
    .string()
    .min(1, {
      message: "Họ không được bỏ trống",
    })
    .min(2, {
      message: "Họ cần ít nhất 2 kí tự",
    }),
});

export type UpdateProfileFormType = z.infer<typeof UpdateUserProfile>;
