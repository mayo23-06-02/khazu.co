"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { FaArrowLeft } from "react-icons/fa";
import {
  Badge,
  Body,
  Button,
  Card,
  Divider,
  Heading1,
  InputNumber,
  InputText,
  Select,
  Textarea,
  ToggleSwitch,
} from "@/components/ui";
import { updateListing } from "@/lib/listings/actions";
import type { Listing } from "@/types/listing";

const BODY_TYPES = [
  "hatchback",
  "sedan",
  "suv",
  "van",
  "coupe",
  "convertible",
  "estate",
  "people-carrier",
];
const FUEL_TYPES = ["petrol", "diesel", "electric", "hybrid"];
const TRANSMISSION_TYPES = ["manual", "automatic", "cvt"];
const DRIVE_TYPES = ["fwd", "rwd", "awd", "4wd"];
const CONDITION_TYPES = ["excellent", "good", "fair", "poor"];

const toOptions = (values: string[]) => [
  { value: "", label: "Select..." },
  ...values.map((v) => ({
    value: v,
    label: v.charAt(0).toUpperCase() + v.slice(1),
  })),
];

export function EditListingForm({ listing }: { listing: Listing }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const [make, setMake] = useState(listing.make);
  const [model, setModel] = useState(listing.model);
  const [year, setYear] = useState(String(listing.year));
  const [mileage, setMileage] = useState(String(listing.mileage));
  const [bodyType, setBodyType] = useState(listing.body_type ?? "");
  const [fuelType, setFuelType] = useState(listing.fuel_type ?? "");
  const [transmission, setTransmission] = useState(listing.transmission ?? "");
  const [driveType, setDriveType] = useState(listing.drive_type ?? "");
  const [colour, setColour] = useState(listing.colour ?? "");
  const [condition, setCondition] = useState(listing.condition ?? "");
  const [description, setDescription] = useState(listing.description ?? "");
  const [price, setPrice] = useState(String(listing.price));
  const [negotiable, setNegotiable] = useState(listing.negotiable);
  const [acceptsInstallments, setAcceptsInstallments] = useState(
    listing.accepts_installments,
  );
  const [depositAmount, setDepositAmount] = useState(
    listing.deposit_amount != null ? String(listing.deposit_amount) : "",
  );
  const [installmentMonths, setInstallmentMonths] = useState(
    listing.installment_months != null
      ? String(listing.installment_months)
      : "",
  );

  const newPrice = Number(price) || 0;
  const isPriceDrop = newPrice > 0 && newPrice < Number(listing.price);
  const dropPercent = isPriceDrop
    ? Math.round(((Number(listing.price) - newPrice) / Number(listing.price)) * 100)
    : 0;

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!make.trim() || !model.trim()) {
      setError("Make and model are required.");
      return;
    }
    if (!year || !price) {
      setError("Year and price are required.");
      return;
    }

    startTransition(async () => {
      const res = await updateListing(listing.id, {
        make,
        model,
        year: Number(year),
        mileage: Number(mileage) || 0,
        body_type: bodyType || undefined,
        fuel_type: fuelType || undefined,
        transmission: transmission || undefined,
        drive_type: driveType || undefined,
        colour: colour || undefined,
        condition: condition || undefined,
        description: description || undefined,
        price: Number(price),
        negotiable,
        accepts_installments: acceptsInstallments,
        deposit_amount: depositAmount ? Number(depositAmount) : null,
        installment_months: installmentMonths
          ? Number(installmentMonths)
          : null,
      });

      if (!res.success) {
        setError(res.error || "Failed to update listing");
        return;
      }
      router.push("/dashboard/personal/listings");
      router.refresh();
    });
  };

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <div className="flex items-center gap-3">
        <Link
          href="/dashboard/personal/listings"
          className="p-2 text-gray-400 hover:text-gray-700 rounded-lg hover:bg-gray-50 transition-all"
          aria-label="Back to listings"
        >
          <FaArrowLeft size={16} />
        </Link>
        <div>
          <Heading1>Edit Listing</Heading1>
          <Body muted>
            {listing.year} {listing.make} {listing.model}
          </Body>
        </div>
      </div>

      {error && (
        <div className="rounded-lg bg-danger/10 text-danger text-sm font-semibold px-4 py-3">
          {error}
        </div>
      )}

      <Card padding="lg" className="bg-white border-gray-100 space-y-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <InputText
            label="Make"
            value={make}
            onChange={(e) => setMake(e.target.value)}
            fullWidth
            required
          />
          <InputText
            label="Model"
            value={model}
            onChange={(e) => setModel(e.target.value)}
            fullWidth
            required
          />
          <InputNumber
            label="Year"
            value={year}
            onChange={(e) => setYear(e.target.value)}
            required
          />
          <InputNumber
            label="Mileage (km)"
            value={mileage}
            onChange={(e) => setMileage(e.target.value)}
          />
          <Select
            label="Body type"
            options={toOptions(BODY_TYPES)}
            value={bodyType}
            onChange={(e) => setBodyType(e.target.value)}
            fullWidth
          />
          <Select
            label="Fuel type"
            options={toOptions(FUEL_TYPES)}
            value={fuelType}
            onChange={(e) => setFuelType(e.target.value)}
            fullWidth
          />
          <Select
            label="Transmission"
            options={toOptions(TRANSMISSION_TYPES)}
            value={transmission}
            onChange={(e) => setTransmission(e.target.value)}
            fullWidth
          />
          <Select
            label="Drive type"
            options={toOptions(DRIVE_TYPES)}
            value={driveType}
            onChange={(e) => setDriveType(e.target.value)}
            fullWidth
          />
          <InputText
            label="Colour"
            value={colour}
            onChange={(e) => setColour(e.target.value)}
            fullWidth
          />
          <Select
            label="Condition"
            options={toOptions(CONDITION_TYPES)}
            value={condition}
            onChange={(e) => setCondition(e.target.value)}
            fullWidth
          />
        </div>
        <Textarea
          label="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          fullWidth
          rows={4}
        />
      </Card>

      <Card padding="lg" className="bg-white border-gray-100 space-y-5">
        <div className="flex items-center justify-between">
          <label className="text-sm font-bold text-gray-800 uppercase tracking-wider">
            Asking price
          </label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold">
              SZL
            </span>
            <input
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="pl-14 pr-4 py-3 bg-gray-50 border-none rounded-lg text-xl font-bold text-primary w-52 focus:ring-2 focus:ring-primary/20 transition-all"
              placeholder="0"
              required
            />
          </div>
        </div>

        {isPriceDrop && (
          <div className="flex items-center gap-2 text-sm">
            <Badge variant="danger">-{dropPercent}%</Badge>
            <span className="text-gray-500">
              Price drop from SZL{" "}
              {new Intl.NumberFormat("en-SZ").format(listing.price)} — buyers
              will see this badge on the listing.
            </span>
          </div>
        )}

        <Divider />

        <ToggleSwitch
          label="Price is negotiable"
          checked={negotiable}
          onChange={(e) => setNegotiable(e.target.checked)}
        />
        <ToggleSwitch
          label="Accept deposit + installments"
          checked={acceptsInstallments}
          onChange={(e) => setAcceptsInstallments(e.target.checked)}
        />

        {acceptsInstallments && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <InputNumber
              label="Deposit (SZL)"
              value={depositAmount}
              onChange={(e) => setDepositAmount(e.target.value)}
            />
            <InputNumber
              label="Installment months"
              value={installmentMonths}
              onChange={(e) => setInstallmentMonths(e.target.value)}
            />
          </div>
        )}
      </Card>

      <div className="flex items-center gap-3">
        <Button type="submit" variant="primary" disabled={pending}>
          {pending ? "Saving..." : "Save changes"}
        </Button>
        <Link href="/dashboard/personal/listings">
          <Button type="button" variant="outline" disabled={pending}>
            Cancel
          </Button>
        </Link>
      </div>
    </form>
  );
}
