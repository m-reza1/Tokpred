import { type NextRequest, NextResponse } from "next/server";
import { getUserById } from "@/db/models/user";

type MyResponse<T> = {
	statusCode: number;
	message?: string;
	data?: T;
	error?: string;
};

export const GET = async (
	_request: NextRequest,
	{ params }: { params: Promise<{ id: string }> },
) => {
	const { id } = await params;
	const user = await getUserById(id);

	return NextResponse.json<MyResponse<unknown>>({
		statusCode: 200,
		message: `Pong from GET /api/users/${id} !`,
		data: user,
	});
};
