"use client";

import { useEffect, useState } from "react";
import { FaTrashAlt } from "react-icons/fa";
import Navbar from "@/components/Navbar";

interface ProductDetails {
  _id: string;
  name: string;
  price: number;
  image: string;
  description: string;
}

interface WishlistItem {
  _id: string;
  userId: string;
  productId: string;
  createdAt: string;
  updatedAt: string;
  productDetails?: ProductDetails;
}

export default function WishlistPage() {
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  // console.log("Wishlist item dipage WL: ", wishlistItems);

  // GET ke API
  useEffect(() => {
    const fetchWishlist = async () => {
      try {
        const res = await fetch("/api/wishlist");
        if (res.ok) {
          const json = await res.json();
          if (json.data) {
            setWishlistItems(json.data);
          }
        } else {
          console.error("Gagal mengambil wishlist");
        }
      } catch (error) {
        console.error("Error fetching wishlist:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchWishlist();
  }, []);

  // POST ke API
  const handleRemove = async (
    productId: string,
    e: React.MouseEvent<HTMLButtonElement>
  ) => {
    e.stopPropagation();
    e.preventDefault();

    try {
      const res = await fetch("/api/wishlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId }),
      });
      if (res.ok) {
        setWishlistItems((prev) =>
          prev.filter((item) => item.productId.toString() !== productId)
        );
      } else {
        console.error("Gagal menghapus item wishlist");
      }
    } catch (err) {
      console.error("Error removing wishlist item:", err);
    }
  };

  // dummy image
  const dummyImage =
    "https://konveksidiamond.com/wp-content/uploads/2023/02/Jaket-denim-jogja.jpeg";

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="flex justify-center py-10">
        <div className="w-full max-w-4xl bg-white shadow-lg rounded-lg p-6">
          <h1 className="text-2xl font-bold text-black mb-4">Wishlist</h1>
          {loading ? (
            <div className="flex justify-center items-center h-32">
              <div className="animate-spin rounded-full h-10 w-10 border-t-4 border-black"></div>
            </div>
          ) : wishlistItems.length === 0 ? (
            <p className="text-center text-gray-500">Wishlist empty</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {wishlistItems.map((item) => {
                const product = item.productDetails;
                if (!product) return null;
                return (
                  <div
                    key={item._id}
                    className="bg-white p-4 shadow-md rounded-lg relative transform transition duration-300 hover:scale-105"
                  >
                    <img
                      src={dummyImage}
                      alt={product.name}
                      className="h-40 w-full object-cover rounded-lg"
                    />
                    <h2 className="mt-3 text-lg font-semibold text-black">
                      {product.name}
                    </h2>
                    <p className="text-sm text-gray-700">
                      {product.description}
                    </p>
                    <p className="text-lg font-bold text-black mt-1">
                      Rp{product.price.toLocaleString()}
                    </p>
                    <button
                      className="absolute top-2 right-2 p-2 bg-white rounded-full shadow hover:bg-gray-100 transition transform hover:scale-110 focus:outline-none"
                      onClick={(e) => handleRemove(product._id, e)}
                    >
                      <FaTrashAlt className="text-red-500 text-xl" />
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
