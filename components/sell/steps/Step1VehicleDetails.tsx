"use client";
import Image from "next/image";
import { Heading3, Body } from "@/components/ui";
import { Autocomplete } from "@/components/ui/Inputs/Autocomplete/Autocomplete";
import { CarData } from "./types";
import { CAR_MAKES, CAR_MODELS } from "./constants";

interface Props {
  carData: CarData;
  errors: Record<string, string>;
  updateCar: (updates: Partial<CarData>) => void;
}

export function Step1VehicleDetails({ carData, errors, updateCar }: Props) {
  return (
    <div className="space-y-6">
      <div className="px-4">
        <Heading3>Vehicle Details</Heading3>
        <Body muted>Start with your registration and basic model info.</Body>
      </div>

      <div className="bg-white p-4 lg:p-8">
        <div className="flex flex-col lg:items-center mb-8">
          <label className="text-md font-semibold text-gray-600 mb-4 block">
            Enter Registration
          </label>
          <div className="relative group w-full max-w-[500px]">
            <div className="w-full relative h-[130px] flex items-center justify-center rounded-lg border-[6px] border-black overflow-hidden transition-transform group-hover:scale-[1.02] duration-500">
              <Image src="/plate-bg.svg" alt="Plate Background" fill className="object-cover" />
              <input
                className="font-mono max-h-[430px] bg-transparent w-full h-full text-center font-black text-6xl md:text-7xl focus:outline-none transition-all uppercase placeholder:text-black/5 text-black drop-shadow-sm"
                type="text"
                placeholder="ABC 123 CM"
                value={carData.regNumber}
                onChange={(e) => updateCar({ regNumber: e.target.value.toUpperCase() })}
              />
            </div>
            <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-[80%] h-4 bg-[#1a1a1a]/5 blur-xl rounded-full -z-10" />
          </div>
          {errors.regNumber && (
            <p className="text-red-500 text-xs mt-4 font-medium">{errors.regNumber}</p>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-8 border-t border-gray-50">
          <div className="space-y-2">
            <Autocomplete
              label="Make / Brand"
              placeholder="Select make (e.g. Toyota)"
              options={CAR_MAKES}
              value={carData.make.toLowerCase()}
              onChange={(val) => updateCar({ make: val, model: "" })}
              error={errors.make}
              className="bg-gray-50/50"
            />
          </div>
          <div className="space-y-2">
            <Autocomplete
              label="Model"
              placeholder="Select model (e.g. Hilux)"
              options={(CAR_MODELS[carData.make.toLowerCase()] || []).map((m) => ({ label: m, value: m }))}
              value={carData.model}
              onChange={(val) => updateCar({ model: val })}
              error={errors.model}
              className="bg-gray-50/50"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
