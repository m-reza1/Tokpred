import { getUserByEmail } from "@/db/models/user"

export const GET = async (request: Request) => {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get("email");
  
    if (!email) {
      return Response.json(
        {
          statusCode: 400,
          error: "Email parameter is required",
        },
        { status: 400 }
      );
    }
  
    const user = await getUserByEmail(email);
  
    return Response.json(
      {
        statusCode: 200,
        message: "User retrieved successfully",
        data: user,
      },
      { status: 200 }
    );
  };