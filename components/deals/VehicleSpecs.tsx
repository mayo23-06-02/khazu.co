import type { MarketplaceListing } from "@/lib/marketplace/types";
import { formatMileage } from "@/lib/marketplace/format";

export type Spec = { label: string; value: string };

export function buildVehicleSpecs(listing: MarketplaceListing): Spec[] {
  return [
    { label: "Year", value: String(listing.year) },
    { label: "Mileage", value: formatMileage(listing.mileage) },
    listing.engine_size
      ? { label: "Engine size", value: listing.engine_size }
      : null,
    listing.power_kw != null
      ? { label: "Engine power", value: `${listing.power_kw} kW` }
      : null,
    listing.transmission
      ? { label: "Transmission", value: listing.transmission }
      : null,
    listing.torque_nm != null
      ? { label: "Torque", value: `${listing.torque_nm} Nm` }
      : null,
    listing.fuel_type ? { label: "Fuel", value: listing.fuel_type } : null,
    listing.doors != null
      ? { label: "Doors", value: String(listing.doors) }
      : null,
    listing.seats != null
      ? { label: "Seats", value: String(listing.seats) }
      : null,
    listing.colour ? { label: "Colour", value: listing.colour } : null,
    listing.drive_type
      ? { label: "Drive", value: listing.drive_type }
      : null,
    listing.body_type
      ? { label: "Body", value: listing.body_type }
      : null,
    listing.condition
      ? { label: "Condition", value: listing.condition }
      : null,
    listing.reg_number
      ? { label: "Registration number", value: listing.reg_number }
      : null,
  ].filter(Boolean) as Spec[];
}

function SpecRow({ label, value }: Spec) {
  return (
    <div className="flex border-b last:border-none border-gray-200  items-center justify-between gap-4 py-3">
      <span className="text-sm text-gray-500">{label}</span>
      <span className="text-sm font-bold text-gray-900 text-right capitalize">
        {value}
      </span>
    </div>
  );
}

export function VehicleSpecs({ specs }: { specs: Spec[] }) {
  const mid = Math.ceil(specs.length / 2);
  const left = specs.slice(0, mid);
  const right = specs.slice(mid);

  return (
    <div className="grid border rounded-lg l p-4 border-gray-300 grid-cols-1 sm:grid-cols-2 gap-x-10">
      <div>
        {left.map((s) => (
          <SpecRow key={s.label} {...s} />
        ))}
      </div>
      <div>
        {right.map((s) => (
          <SpecRow key={s.label} {...s} />
        ))}
      </div>
    </div>
  );
}
