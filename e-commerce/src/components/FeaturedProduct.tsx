"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type Product = {
  _id: string;
  name: string;
  price: number;
  image: string;
};

export default function FeaturedProduct() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  // console.log('Featured di HOME: ',products);

  useEffect(() => {
    const fetchFeaturedProducts = async () => {
      try {
        const response = await fetch("http://localhost:3000/api/featured");
        const result = await response.json();
        // console.log("result di featured: ", result);

        if (response.ok) {
          setProducts(result.data);
        } else {
          console.error("error fetch featured", result.error);
        }
      } catch (err) {
        console.error("fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedProducts();
  }, []);

  // dummy image
  const dummyImage =
    "https://konveksidiamond.com/wp-content/uploads/2023/02/Jaket-denim-jogja.jpeg";

  return (
    <>
      <h1 className="text-2xl font-bold text-black text-center mt-6">
        Featured Product
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 p-4 w-full max-w-7xl mt-4">
        {loading ? (
          <p className="text-black">Loading...</p>
        ) : (
          products.map((product) => (
            <div
              key={product._id}
              className="bg-white p-4 shadow-lg rounded-lg"
            >
              <img
                src={dummyImage}
                alt={product.name}
                className="h-40 w-full object-cover rounded-lg"
              />
              <h2 className="mt-2 text-lg font-semibold text-black">
                {product.name}
              </h2>
              <p className="text-black">Rp{product.price.toLocaleString()}</p>
            </div>
          ))
        )}
      </div>
      <div className="w-full flex justify-end max-w-7xl mt-1">
        <Link href="/products" className="text-blue-500 hover:underline">
          Show all product
        </Link>
      </div>
    </>
  );
}
