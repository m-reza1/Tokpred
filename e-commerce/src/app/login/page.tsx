import Link from "next/link";
import ClientFlashComponent from "@/components/ClientFlashComponent";
import { handleLogin } from "./action";

const LoginPage = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-96">
        <h2 className="text-2xl text-black font-bold text-center mb-4">Login</h2>
        <ClientFlashComponent />
        <form action={handleLogin}>
          <div className="mb-4">
            <label className="block text-black">Email</label>
            <input
              type="text"
              name="email"
              className="w-full p-2 border text-black rounded-lg"
            />
          </div>
          <div className="mb-4">
            <label className="block text-black">Password</label>
            <input
              type="password"
              name="password"
              className="w-full p-2 border text-black rounded-lg"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700"
          >
            Login
          </button>
        </form>
        <p className="text-center text-gray-600 mt-4">
          Create account here{" "}
          <Link href="/register" className="text-blue-600">
            Register
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
