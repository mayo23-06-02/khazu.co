"use client";
import { Heading3, Body, Heading4, Card, Badge } from "@/components/ui";
import { FaEdit } from "react-icons/fa";
import { CarData } from "./types";

interface Props {
  carData: CarData;
  goToStep: (step: number) => void;
}

export function Step4Review({ carData, goToStep }: Props) {
  const summaryCards = [
    {
      badge: { variant: "primary" as const, label: "Vehicle" },
      step: 1,
      title: `${carData.make} ${carData.model}`,
      detail: `${carData.year} • ${carData.mileage} km • ${carData.regNumber}`,
    },
    {
      badge: { variant: "success" as const, label: "Price" },
      step: 3,
      title: `SZL ${parseInt(carData.price || "0").toLocaleString()}`,
      detail: carData.negotiable ? "Negotiable" : "Fixed Price",
      titleClass: "text-primary",
    },
    {
      badge: { variant: "info" as const, label: "Specs" },
      step: 2,
      title: `${carData.bodyType} • ${carData.transmission}`,
      detail: `${carData.fuelType} • ${carData.engineSize}L`,
    },
    {
      badge: { variant: "secondary" as const, label: "Photos" },
      step: 3,
      title: `${carData.images.length} photo${carData.images.length !== 1 ? "s" : ""}`,
      detail: "First photo is cover",
    },
  ];

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <Heading3>Review Listing</Heading3>
        <Body muted>Check your details before proceeding to the final step.</Body>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {summaryCards.map(({ badge, step, title, detail, titleClass }) => (
          <Card key={badge.label} padding="md" className="bg-white border-gray-100">
            <div className="flex justify-between items-start mb-2">
              <Badge variant={badge.variant} size="sm">{badge.label}</Badge>
              <button onClick={() => goToStep(step)} className="text-gray-400 hover:text-primary transition-colors">
                <FaEdit size={14} />
              </button>
            </div>
            <Heading4 className={`mb-0 ${titleClass ?? ""}`}>{title}</Heading4>
            <Body size="sm" muted>{detail}</Body>
          </Card>
        ))}
      </div>
    </div>
  );
}
