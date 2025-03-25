import Link from "next/link";
import ClientFlashComponent from "@/components/ClientFlashComponent";
import { handleRegister } from "./action";

const RegisterPage = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-96">
        <h2 className="text-2xl text-black font-bold text-center mb-4">
          Register
        </h2>
        <ClientFlashComponent />
        <form action={handleRegister}>
          <div className="mb-4">
            <label className="block text-black">Name</label>
            <input
              type="text"
              name="name"
              className="w-full p-2 border text-black rounded-lg"
            />
          </div>
          <div className="mb-4">
            <label className="block text-black">Username</label>
            <input
              type="text"
              name="username"
              className="w-full p-2 border text-black rounded-lg"
            />
          </div>
          <div className="mb-4">
            <label className="block text-black">Email</label>
            <input
              type="email"
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
            Register
          </button>
        </form>
        <p className="text-center text-gray-600 mt-4">
          Already have an account?{" "}
          <Link href="/login" className="text-blue-600">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;
