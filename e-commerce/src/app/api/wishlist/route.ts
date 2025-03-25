import { NextResponse } from "next/server";
import { getWishlistByUser, toggleWishlistItem } from "@/db/models/wishlist";
import { verifyToken } from "@/utils/jwt";
import { cookies } from "next/headers";

type WishlistResponse = {
  _id: string;
  userId: string;
  productId: string;
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
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;
    // console.log("token api wl: ", token);

    if (!token) {
      return NextResponse.json<MyResponse<null>>(
        { statusCode: 401, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const decoded = await verifyToken(token);
    const userId = decoded.payload._id as string;
    // console.log(userId, 'userId api wl');

    if (!userId) {
      return NextResponse.json<MyResponse<null>>(
        { statusCode: 403, error: "Invalid token" },
        { status: 403 }
      );
    }

    const wishlist = await getWishlistByUser(userId);
    // console.log('wlbyuser api',wishlist);

    const formattedWishlist = wishlist.map((item) => ({
      _id: item._id.toHexString(),
      userId: item.userId.toHexString(),
      productId: item.productId.toHexString(),
      createdAt: item.createdAt.toISOString(),
      updatedAt: item.updatedAt.toISOString(),
      productDetails: item.productDetails,
    }));

    return NextResponse.json<MyResponse<typeof formattedWishlist>>(
      {
        statusCode: 200,
        message: "Success GET wishlist",
        data: formattedWishlist,
      },
      { status: 200 }
    );
  } catch (err) {
    console.error("Error in GET wishlist:", err);
    return NextResponse.json<MyResponse<null>>(
      { statusCode: 500, error: "Internal server error" },
      { status: 500 }
    );
  }
};

// Menambah atau menghapus wishlist
export const POST = async (request: Request) => {
  try {
    // console.log('Di API POST');
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;
    // console.log('Token API WISHLIST: ', token);

    if (!token) {
      return NextResponse.json<MyResponse<null>>(
        { statusCode: 401, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const decoded = await verifyToken(token);
    const userId = decoded.payload._id as string;
    // console.log('userId API WL: ',userId);

    if (!userId) {
      return NextResponse.json<MyResponse<null>>(
        { statusCode: 403, error: "Invalid token" },
        { status: 403 }
      );
    }

    const { productId } = await request.json();
    // console.log('Product ID API WL: ', productId);

    if (!productId) {
      return NextResponse.json<MyResponse<null>>(
        { statusCode: 400, error: "Product ID is required" },
        { status: 400 }
      );
    }

    const result = await toggleWishlistItem(userId, productId);
    // console.log('Result API WL: ', result);

    return NextResponse.json<MyResponse<null>>(
      {
        statusCode: 200,
        message: result
          ? "Produk ditambahkan ke wishlist"
          : "Produk dihapus dari wishlist",
      },
      { status: 200 }
    );
  } catch (err) {
    console.error("Error in POST wishlist:", err);
    return NextResponse.json<MyResponse<null>>(
      { statusCode: 500, error: "Internal server error" },
      { status: 500 }
    );
  }
};
