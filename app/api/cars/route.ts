import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createListing } from "@/lib/listings/actions";
import type { SellerType } from "@/types/listing";

export async function GET(req: Request) {
  try {
    const supabase = await createClient();
    const { searchParams } = new URL(req.url);
    const sellerId = searchParams.get("sellerId");

    let query = supabase
      .from("listings")
      .select("*")
      .eq("status", "active")
      .order("created_at", { ascending: false });

    if (sellerId) {
      query = query.eq("seller_id", sellerId);
    }

    const { data, error } = await query;
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json(data ?? []);
  } catch {
    return NextResponse.json({ error: "Failed to fetch cars" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const sellerType: SellerType =
      body.sellerType === "dealer" || body.seller_type === "dealer"
        ? "dealer"
        : "individual";

    const result = await createListing({
      reg_number: body.regNumber ?? body.reg_number,
      make: body.make,
      model: body.model,
      year: Number(body.year),
      mileage: Number(body.mileage) || 0,
      body_type: body.bodyType ?? body.body_type,
      fuel_type: body.fuelType ?? body.fuel_type,
      transmission: body.transmission,
      drive_type: body.driveType ?? body.drive_type,
      engine_size: body.engineSize ?? body.engine_size,
      power_kw: body.power ? Number(body.power) : null,
      torque_nm: body.torque ? Number(body.torque) : null,
      doors: body.doors ? Number(body.doors) : null,
      seats: body.seats ? Number(body.seats) : null,
      colour: body.colour,
      condition: body.condition,
      features: body.features ?? [],
      description: body.description,
      price: Number(body.price),
      negotiable: body.negotiable ?? true,
      accepts_installments:
        body.acceptsInstallments ?? body.accepts_installments ?? false,
      deposit_amount: body.depositAmount
        ? Number(body.depositAmount)
        : body.deposit_amount
          ? Number(body.deposit_amount)
          : null,
      installment_months: body.installmentMonths
        ? Number(body.installmentMonths)
        : body.installment_months
          ? Number(body.installment_months)
          : null,
      images: body.images ?? [],
      seller_type: sellerType,
      status: "active",
    });

    if (!result.success) {
      const status = result.error?.includes("signed in") ? 401 : 400;
      return NextResponse.json({ error: result.error }, { status });
    }

    return NextResponse.json({
      message: "Car listed successfully",
      listingId: result.listingId,
    });
  } catch {
    return NextResponse.json({ error: "Failed to list car" }, { status: 500 });
  }
}
