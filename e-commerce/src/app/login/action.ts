"use server";

import { generateToken } from "@/utils/jwt";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";

type MyResponse<T> = {
  statusCode: number;
  message?: string;
  data?: T;
  error?: string;
};

interface User {
  _id: string;
  username: string;
  email: string;
}

export const handleLogin = async (formData: FormData) => {
  const data = {
    email: formData.get("email") as string,
    password: formData.get("password") as string,
  };

  const response = await fetch("http://localhost:3000/api/auth/login", {
    method: "POST",
    body: JSON.stringify(data),
    headers: {
      "Content-Type": "application/json",
    },
  });

  const result = await response.json();

  if (!response.ok) {
    // Encode error message untuk URL
    return redirect(`/login?error=${encodeURIComponent(result.error)}`);
  }

  const responseJson: MyResponse<User> = result;

  if (!responseJson.data) {
    const message = responseJson.error ?? "Invalid response from server!";
    return redirect(`/login?error=${encodeURIComponent(message)}`);
  }

  const { _id, username, email } = responseJson.data;
  const payload = { _id, username, email };
  const token = await generateToken(payload);

  const cookieStore = await cookies();
  cookieStore.set("token", token, { secure: true });

  return redirect("/");
};
