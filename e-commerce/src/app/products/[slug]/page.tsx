"use client";

import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import Link from "next/link";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import { useParams, useRouter } from "next/navigation";

type ProductDetail = {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  price: number;
  thumbnail?: string;
  images?: string[];
};

export default function ProductDetailPage() {
  const { slug } = useParams();
  const router = useRouter();
  const [product, setProduct] = useState<ProductDetail | null>(null);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const getTokenFromCookies = (): string | undefined => {
    if (typeof window !== "undefined") {
      const tokenCookie = document.cookie
        .split("; ")
        .find((row) => row.startsWith("token="));
      return tokenCookie ? tokenCookie.split("=")[1] : undefined;
    }
    return undefined;
  };

  useEffect(() => {
    const token = getTokenFromCookies();
    setIsLoggedIn(!!token);

    const fetchProduct = async () => {
      try {
        const res = await fetch("http://localhost:3000/api/products");
        const data = await res.json();
        const found = data.data.find((item: any) => item.slug === slug);
        setProduct(found || null);
      } catch (err) {
        console.error("Error fetching product:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();

    if (token) {
      fetchWishlist();
    }
  }, [slug]);

  const fetchWishlist = async () => {
    try {
      const response = await fetch("http://localhost:3000/api/wishlist", {
        method: "GET",
        credentials: "include",
      });

      if (!response.ok) throw new Error("Error fetching wishlist");

      const result = await response.json();
      if (result.data) {
        setWishlist(result.data.map((item: { productId: string }) => item.productId));
      }
    } catch (err) {
      console.error("Error fetching wishlist:", err);
    }
  };

  const toggleWishlist = async (productId: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isLoggedIn) {
      router.push("/login");
      return;
    }

    try {
      const response = await fetch("http://localhost:3000/api/wishlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ productId }),
      });

      if (!response.ok) throw new Error("Failed to update wishlist");

      setWishlist((prev) =>
        prev.includes(productId)
          ? prev.filter((id) => id !== productId)
          : [...prev, productId]
      );
    } catch (err) {
      console.error("Error updating wishlist:", err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-gray-50">
        <p>Loading...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-gray-50">
        <p className="text-xl font-medium text-gray-700">Produk tidak ditemukan</p>
      </div>
    );
  }

  const dummyImage = "https://konveksidiamond.com/wp-content/uploads/2023/02/Jaket-denim-jogja.jpeg";

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar isLoggedIn={isLoggedIn} />
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow p-6 md:p-10 max-w-4xl mx-auto flex flex-col md:flex-row gap-8">
          <div className="md:w-1/2">
            <img src={dummyImage} alt={product.name} className="object-cover rounded-lg w-full h-full" />
          </div>
          <div className="md:w-1/2 flex flex-col justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-800">{product.name}</h1>
              <p className="mt-4 text-gray-600 leading-relaxed">{product.description || "Deskripsi produk belum tersedia."}</p>
            </div>
            <div className="mt-6 flex items-center justify-between">
              <p className="text-2xl font-semibold text-gray-800">Rp{product.price.toLocaleString()}</p>
              <button onClick={(e) => toggleWishlist(product._id, e)} className="p-1 bg-white rounded-full shadow hover:bg-gray-100 transition transform hover:scale-105 focus:outline-none">
                {wishlist.includes(product._id) ? <FaHeart className="text-red-500 text-lg" /> : <FaRegHeart className="text-gray-500 text-lg" />}
              </button>
            </div>
          </div>
        </div>
        <div className="mt-8 text-center">
          <Link href="/products" className="text-blue-600 hover:underline mb-4 inline-block">&larr; Back to product</Link>
        </div>
      </div>
    </div>
  );
}