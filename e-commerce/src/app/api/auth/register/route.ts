import { NextResponse } from "next/server";
import { createUser } from "@/db/models/user";
import { z } from "zod";

type MyResponse<T> = {
  statusCode: number;
  message?: string;
  data?: T;
  error?: string;
};

const UserInputSchema = z.object({
  username: z
    .string({
      message: "Username invalid",
    })
    .min(1, { message: "Username cannot be empty" }),
  email: z.string().email({
    message: "Email is required",
  }),
  password: z
    .string({
      message: "Password should be string",
    })
    .min(6, {
      message: "Password minimum 5 character",
    }),
});

// POST REGISTER
export const POST = async (request: Request) => {
  try {
    // console.log(request, '<< requrest register');

    const data = await request.json();
    const parsedData = UserInputSchema.safeParse(data);

    if (!parsedData.success) {
      throw parsedData.error;
    }
    const user = await createUser(parsedData.data);

    return NextResponse.json<MyResponse<unknown>>(
      {
        statusCode: 201,
        message: "Pong from POST /api/users !",
        data: user,
      },
      {
        status: 201,
      }
    );
  } catch (err) {
    if (err instanceof z.ZodError) {
      //   console.log(err, "<< OOO");

      const errPath = err.issues[0].path[0];
      const errMessage = err.issues[0].message;

      return NextResponse.json<MyResponse<never>>(
        {
          statusCode: 400,
          error: `${errPath} - ${errMessage}`,
        },
        {
          status: 400,
        }
      );
    }

    return NextResponse.json<MyResponse<never>>(
      {
        statusCode: 500,
        message: "Internal Server Error !",
      },
      {
        status: 500,
      }
    );
  }
};
