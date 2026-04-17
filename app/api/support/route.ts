import { NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  try {
    const { name, email, message, type } = await req.json();

    if (!message || !email) {
      return new NextResponse("Missing required fields", { status: 400 });
    }

    const { data, error } = await resend.emails.send({
      from: "Unicode Support <support@unicode.edu>",
      to: ["admin@unicode.edu"], // Change this to the client's email
      subject: `[${type.toUpperCase()}] New Feedback from ${name || "User"}`,
      html: `
        <h2>New Support/Feedback Request</h2>
        <p><strong>Type:</strong> ${type}</p>
        <p><strong>Name:</strong> ${name || "N/A"}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Message:</strong></p>
        <p>${message}</p>
      `,
    });

    if (error) {
      return NextResponse.json({ error }, { status: 500 });
    }

    return NextResponse.json({ success: true, data });
  } catch (error: any) {
    return new NextResponse(error.message, { status: 500 });
  }
}
