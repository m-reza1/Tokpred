import { NextRequest, NextResponse } from "next/server";

const getTokenFromCookies = (request: NextRequest): string | undefined => {
  const tokenCookie = request.cookies.get("token"); 
  return tokenCookie ? tokenCookie.value : undefined; 
};

export function middleware(request: NextRequest) {
  const token = getTokenFromCookies(request);

  const isLoggedIn = !!token;

  const response = NextResponse.next();
  response.headers.set("X-Is-Logged-In", JSON.stringify(isLoggedIn));

  return response;
}

export const config = {
  matcher: ["/products", "/wishlist", "/dashboard"],
};
