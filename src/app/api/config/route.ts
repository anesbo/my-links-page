import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { getPublishedConfig, savePublishedConfig } from "@/lib/redis";
import { BioConfig } from "@/types/config";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const result = await getPublishedConfig();
    return NextResponse.json(result);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Internal Server Error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const config = body.config as BioConfig;
    const providedSecret = body.secret || request.headers.get("x-admin-secret");

    // Optional admin secret protection
    const adminSecret = process.env.ADMIN_SECRET;
    if (adminSecret && adminSecret.trim() !== "") {
      if (providedSecret !== adminSecret) {
        return NextResponse.json(
          { success: false, error: "Unauthorized: Invalid admin secret" },
          { status: 401 }
        );
      }
    }

    if (!config || !config.identity || !config.theme || !config.links) {
      return NextResponse.json(
        { success: false, error: "Invalid config payload" },
        { status: 400 }
      );
    }

    const result = await savePublishedConfig(config);

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error },
        { status: 400 }
      );
    }

    try {
      revalidatePath("/");
    } catch {
      // ignore in environments where revalidatePath is unavailable
    }

    return NextResponse.json(result);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Internal Server Error";
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    );
  }
}

