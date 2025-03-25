"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type NavbarProps = {
  isLoggedIn: boolean;
};

export default function Navbar({ isLoggedIn }: NavbarProps) {
  const [isLoggedInState, setIsLoggedInState] = useState(isLoggedIn);

  useEffect(() => {
    setIsLoggedInState(isLoggedIn);
  }, [isLoggedIn]);

  const handleLogout = () => {
    document.cookie = "token=; Max-Age=0";
    setIsLoggedInState(false);
    window.location.href = "/login"; 
  };

  return (
    <nav className="bg-white p-4 px-50 w-full flex items-center shadow-md">
      <div className="flex-shrink-0">
        <h1 className="text-2xl text-green-500 font-bold">
          <Link href="/">Tokpred</Link>
        </h1>
      </div>
      <div className="flex-grow flex justify-center">
        <ul className="flex space-x-4">
          <li className="cursor-pointer text-black">
            <Link href="/">Home</Link>
          </li>
          <li className="cursor-pointer text-black">
            <Link href="/products">Products</Link>
          </li>
        </ul>
      </div>
      <div className="flex-shrink-0">
        <ul className="flex space-x-4">
          {!isLoggedInState ? (
            <>
              <li className="cursor-pointer text-black">
                <Link href="/login">Sign in</Link>
              </li>
              <li className="cursor-pointer text-black">
                <Link href="/register">Create account</Link>
              </li>
            </>
          ) : (
            <li className="cursor-pointer text-black">
              <button onClick={handleLogout}>Logout</button>
            </li>
          )}
        </ul>
      </div>
    </nav>
  );
}
