import { getUsers } from "@/db/models/user";
import { z } from "zod";

type MyResponse<T> = {
  statusCode: number;
  message?: string;
  data?: T;
  error?: string;
};

const UserInputSchema = z.object({
  username: z.string().min(1, { message: "Username cannot be empty" }),
  email: z.string().email({
    message: "Email is required ++++++ USER",
  }),
  password: z
    .string({
      message: "Password harus berupa string",
    })
    .min(6, {
      message: "Password minimum 5 character",
    }),
  super_admin: z
    .boolean({
      message: "Super Admin harus berupa boolean",
    })
    .optional(),
  original_name: z
    .string({
      message: "Original Name harus berupa string",
    })
    .optional(),
});

// GET ALL USERS
export const GET = async () => {
  const users = await getUsers();

  return Response.json(
    {
      statusCode: 200,
      message: "Pong from GET /api/users !",
      data: users,
    },
    {
      status: 200,
    }
  );
};
