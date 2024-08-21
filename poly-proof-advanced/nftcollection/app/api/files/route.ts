import { NextResponse, NextRequest } from "next/server";
import dotenv from "dotenv";
dotenv.config();
export const config = {
  api: {
    bodyParser: false,
  },
};

export async function POST(request: NextRequest) {
  try {
    const data = await request.formData();
    const file: File | null = data.get("file") as unknown as File;
    data.append("file", file);
    data.append("pinataMetadata", JSON.stringify({ name: "File to upload" }));
    const res = await fetch("https://api.pinata.cloud/pinning/pinFileToIPFS", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_PINATA_JWT}`,
      },
      body: data,
    });
    let resp : any , { IpfsHash } = await res.json();
    console.log(IpfsHash);

    return NextResponse.json({ IpfsHash }, { status: 200 });
  } catch (e) {
    console.log(e);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
