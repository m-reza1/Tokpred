import { getFeatured } from "@/db/models/product";
import { NextResponse } from "next/server";

type MyResponse<T> = {
  statusCode: number;
  message?: string;
  data?: T;
  error?: string;
};

export const GET = async () => {
  try {
    const featured = await getFeatured();
    // console.log('featured api: ', featured);

    return NextResponse.json<MyResponse<typeof featured>>(
      {
        statusCode: 200,
        message: "Success get featured",
        data: featured,
      },
      { status: 200 }
    );
  } catch (err) {
    console.error(err);
    return NextResponse.json<MyResponse<null>>(
      {
        statusCode: 500,
        error: "Internal Server Error",
      },
      { status: 500 }
    );
  }
};
