import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const ServerProtectedComponent = async ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const cookieStore = await cookies();

  const token = cookieStore.get("token");

  if (!token || token.value.length <= 0) {
    redirect("/login");
  }

  return <>{children}</>;
};

export default ServerProtectedComponent;
