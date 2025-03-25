"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import Navbar from "@/components/Navbar";
import InfiniteScroll from "react-infinite-scroll-component";

type Product = {
  _id: string;
  name: string;
  slug: string;
  price: number;
  image: string;
  description: string;
};

export default function Products() {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [page, setPage] = useState<number>(1);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [loading, setLoading] = useState<boolean>(true);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [search, setSearch] = useState("");
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
    setIsLoggedIn(!!token); // If token exists, set logged in to true

    fetchMoreData();
    if (token) {
      fetchWishlist();
    }
  }, []);

  const fetchMoreData = async () => {
    try {
      const response = await fetch(
        `http://localhost:3000/api/products?page=${page}`
      );
      const result = await response.json();
      const newProducts: Product[] = result.data;

      if (newProducts.length === 0) {
        setHasMore(false);
        return;
      }

      setProducts((prevProducts) => [...prevProducts, ...newProducts]);
      setPage((prevPage) => prevPage + 1);
    } catch (err) {
      console.error("Error fetching products:", err);
      setHasMore(false);
    } finally {
      setLoading(false);
    }
  };

  const fetchWishlist = async () => {
    try {
      const response = await fetch("http://localhost:3000/api/wishlist", {
        method: "GET",
        credentials: "include",
      });

      if (!response.ok) throw new Error("error fetching wishlist");

      const result = await response.json();
      if (result.data) {
        setWishlist(
          result.data.map((item: { productId: string }) => item.productId)
        );
      }
    } catch (err) {
      console.error("Error fetching wishlist:", err);
    }
  };

  const toggleWishlist = async (productId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();

    if (!isLoggedIn) {
      router.push("/login");
      return;
    }

    try {
      const response = await fetch("http://localhost:3000/api/wishlist", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
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

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(search.toLowerCase())
  );

  const dummyImage =
    "https://konveksidiamond.com/wp-content/uploads/2023/02/Jaket-denim-jogja.jpeg";

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Pass isLoggedIn to Navbar */}
      <Navbar isLoggedIn={isLoggedIn} />
      <div className="flex">
        <div className="w-60 bg-white shadow-lg p-4 flex flex-col gap-4 h-[70vh] rounded-lg m-4 overflow-y-auto">
          <input
            type="text"
            placeholder="Search products..."
            className="p-2 border rounded w-full text-black"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <Link
            href={isLoggedIn ? "/wishlist" : "/login"}
            className="flex items-center gap-2 text-black bg-gray-200 p-2 rounded hover:bg-gray-300"
          >
            <FaHeart className="text-red-500" /> Wish List
          </Link>
        </div>

        <div className="flex-1 flex flex-col items-center p-6">
          {loading && products.length === 0 ? (
            <div className="flex justify-center items-center h-32">
              <div className="animate-spin rounded-full h-10 w-10 border-t-4 border-black"></div>
            </div>
          ) : (
            <InfiniteScroll
              dataLength={filteredProducts.length}
              next={fetchMoreData}
              hasMore={hasMore}
              loader={<h4>Loading...</h4>}
              endMessage={
                <p style={{ textAlign: "center" }}>
                  <b>No more products to load</b>
                </p>
              }
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 w-full max-w-7xl mx-4">
                {filteredProducts.map((product, index) => (
                  <Link
                    key={index}
                    href={`/products/${product.slug}`}
                    className="cursor-pointer"
                  >
                    <div className="bg-white p-4 shadow-lg rounded-lg transform transition duration-300 hover:scale-105 relative">
                      <img
                        src={dummyImage}
                        alt={product.name}
                        className="h-48 w-full object-cover rounded-lg"
                      />
                      <h2 className="mt-3 text-lg font-semibold text-black">
                        {product.name}
                      </h2>
                      <p className="text-sm text-black">
                        {product.description}
                      </p>
                      <p className="text-lg font-bold text-black mt-1">
                        Rp{product.price.toLocaleString()}
                      </p>

                      <button
                        className="absolute top-2 right-2 p-2 bg-white rounded-full shadow hover:bg-gray-100 transition transform hover:scale-110 focus:outline-none"
                        onClick={(e) => toggleWishlist(product._id, e)}
                      >
                        {wishlist.includes(product._id) ? (
                          <FaHeart className="text-red-500 text-xl" />
                        ) : (
                          <FaRegHeart className="text-gray-500 text-xl" />
                        )}
                      </button>
                    </div>
                  </Link>
                ))}
              </div>
            </InfiniteScroll>
          )}
        </div>
      </div>
    </div>
  );
}
