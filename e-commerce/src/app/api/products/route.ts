import { getProducts } from "@/db/models/product";
import { NextResponse } from "next/server";

type ProductResponse = {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  excerpt?: string;
  price: number;
  tags?: string[];
  thumbnail?: string;
  images?: string[];
  createdAt: string;
  updatedAt: string;
};

type MyResponse<T> = {
  statusCode: number;
  message?: string;
  data?: T;
  error?: string;
};

export const GET = async (request: Request) => {
  try {
    const products = await getProducts();
    // console.log('product di api: ',products)

    const formattedProducts: ProductResponse[] = products.map((product) => ({
      _id: product._id.toHexString(),
      name: product.name,
      slug: product.slug,
      description: product.description,
      excerpt: product.excerpt,
      price: product.price,
      tags: product.tags,
      thumbnail: product.thumbnail,
      images: product.images,
      createdAt: product.createdAt.toISOString(),
      updatedAt: product.updatedAt.toISOString(),
    }));
    // console.log("format product: ", formattedProducts);

    return NextResponse.json<MyResponse<ProductResponse[]>>(
      {
        statusCode: 200,
        message: "Success get product",
        data: formattedProducts,
      },
      { status: 200 }
    );
  } catch (err) {
    console.error(err);
    return NextResponse.json<MyResponse<null>>(
      {
        statusCode: 500,
        error: "Internal server error",
      },
      { status: 500 }
    );
  }
};
