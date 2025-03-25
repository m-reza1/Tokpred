import { NextResponse } from "next/server";
import { getUserByEmail } from "@/db/models/user";
import { compareTextWithHash } from "@/utils/hash";
import { z } from "zod";

type MyResponse<T> = {
  statusCode: number;
  message?: string;
  data?: T;
  error?: string;
};

const LoginInputSchema = z.object({
  email: z.string().email({
    message: "Email is required",
  }),
  password: z.string({
    required_error: "Password is required",
  }),
});

export const POST = async (request: Request) => {
  try {
    const data = await request.json();
    // console.log('loginrouter :', data);

    const parsedData = LoginInputSchema.safeParse(data);

    if (!parsedData.success) {
      throw parsedData.error;
    }

    const { email, password } = parsedData.data;
    const user = await getUserByEmail(email);
    // console.log('[user] diroute login:', user);

    if (!user) {
      return NextResponse.json<MyResponse<never>>(
        { statusCode: 400, error: "User tidak ditemukan" },
        { status: 400 }
      );
    }

    const checkPassword = compareTextWithHash(password, user.password);
    if (!checkPassword) {
      return NextResponse.json<MyResponse<never>>(
        { statusCode: 400, error: "Invalid credentials" },
        { status: 400 }
      );
    }

    const { _id, username, email: userEmail } = user;

    // ini return API
    return NextResponse.json<
      MyResponse<{
        _id: string;
        username: string;
        email: string;
      }>
    >(
      {
        statusCode: 200,
        message: "Login success",
        data: { _id: _id.toString(), username, email: userEmail },
      },
      { status: 200 }
    );
  } catch (err) {
    if (err instanceof z.ZodError) {
      const errPath = err.issues[0].path[0];
      const errMessage = err.issues[0].message;
      return NextResponse.json<MyResponse<never>>(
        { statusCode: 400, error: `${errPath} - ${errMessage}` },
        { status: 400 }
      );
    }

    return NextResponse.json<MyResponse<never>>(
      { statusCode: 500, error: "Internal Server Error" },
      { status: 500 }
    );
  }
};
