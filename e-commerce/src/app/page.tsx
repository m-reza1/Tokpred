// app/page.tsx

import FeaturedProduct from "@/components/FeaturedProduct";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import { cookies } from "next/headers";

const Home = async () => {
  const cookieStore = await cookies();
  const token = cookieStore.get("token");

  const isLoggedIn = !!token;

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center">
      <Navbar isLoggedIn={isLoggedIn} />

      <div className="bg-green-600 mx-4 mt-6 text-white text-center py-16 text-4xl font-bold rounded-lg w-full max-w-7xl">
        Welcome to Tokpred
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-4 w-full max-w-7xl mt-6">
        {[
          {
            icon: "🛍️",
            title: "E-Commerce",
            description:
              "Our e-commerce offerings are provided through a mobile app as well as mobile and desktop sites, and are comprised of the following: Marketplace, Official Stores, Instant Commerce, Interactive Commerce and Mitra Tokpred.",
          },
          {
            icon: "🚚",
            title: "Logistics & Fulfillment",
            description:
              "Tokpred works with 15+ leading logistics and fulfillment partners who are equipped with same-day delivery services with an integrated system. Merchants can also store their products in our warehouses, which are located throughout Indonesia.",
          },
          {
            icon: "📢",
            title: "Marketing and Advertising Technology",
            description:
              "We provide an advertising technology platform to help merchants promote their businesses, attract more consumers, and grow sales through Pay for Performance “P4P” Advertising, Display Advertising, and Customised Marketing Packages services.",
          },
        ].map((item, index) => (
          <div
            key={index}
            className="bg-white p-6 shadow-lg rounded-lg text-center transition-transform duration-300 hover:shadow-2xl hover:scale-105"
          >
            <div className="bg-gray-100 w-16 h-16 mx-auto rounded-full flex items-center justify-center text-2xl">
              {item.icon}
            </div>
            <h2 className="mt-4 text-lg font-semibold text-black">
              {item.title}
            </h2>
            <p className="text-black mt-2">{item.description}</p>
          </div>
        ))}
      </div>

      <FeaturedProduct />

      <Footer />
    </div>
  );
};

export default Home;
