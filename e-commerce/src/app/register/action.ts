"use server";

import { redirect } from "next/navigation";

type MyResponse<T> = {
  statusCode: number;
  message?: string;
  data?: T;
  error?: string;
};

// POST ke API
export const handleRegister = async (formData: FormData) => {
  // console.log('[DEBUG]formData: ',formData);

  const response = await fetch("http://localhost:3000/api/auth/register", {
    method: "POST",
    body: JSON.stringify({
      name: formData.get("name"),
      username: formData.get("username"),
      email: formData.get("email"),
      password: formData.get("password"),
    }),
    headers: {
      "Content-Type": "application/json",
    },
  });

  // console.log(response, '<-- response formData page');

  const responseJson: MyResponse<unknown> = await response.json();
  if (!response.ok) {
    const message = responseJson.error ?? "Something went wrong!";
    return redirect(`/register?error=${message}`);
  }

  return redirect("/login");
};
