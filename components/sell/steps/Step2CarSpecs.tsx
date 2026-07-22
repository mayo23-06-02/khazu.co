"use client";
import { twMerge } from "tailwind-merge";
import { InputText, Checkbox, Textarea, FormGroup } from "@/components/ui";
import { FaCar } from "react-icons/fa";
import { PiEngineFill } from "react-icons/pi";
import { GiCarDoor, GiCarSeat } from "react-icons/gi";
import { MdSpeed } from "react-icons/md";
import { CarData } from "./types";
import { BODY_TYPES, FUEL_TYPES, TRANSMISSION_TYPES, DRIVE_TYPES, CONDITION_TYPES } from "./constants";

interface Props {
  carData: CarData;
  errors: Record<string, string>;
  updateCar: (updates: Partial<CarData>) => void;
}

function OptionButton({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className={twMerge(
        "relative flex flex-col items-center justify-center p-6 rounded-lg border transition-all group bg-white",
        active ? "border-primary bg-primary/5 border-2" : "border-gray-200 hover:border-primary/30",
      )}
    >
      {children}
    </button>
  );
}

const CheckIcon = () => (
  <div className="absolute top-2 right-2 bg-primary text-white p-1 rounded-full shadow-sm">
    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
    </svg>
  </div>
);

export function Step2CarSpecs({ carData, errors, updateCar }: Props) {
  const FEATURES = [
    "Air Conditioning", "Leather Seats", "Sunroof", "Bluetooth",
    "Apple CarPlay", "Android Auto", "Reverse Camera", "Parking Sensors",
    "Cruise Control", "Heated Seats", "Alloy Wheels", "Tow Bar",
  ];

  return (
    <div className="space-y-8 pb-10">
      {/* Body Type */}
      <div className="space-y-4">
        <label className="text-sm font-semibold text-gray-700 block px-1">Select Body Type</label>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {BODY_TYPES.map((type) => (
            <button key={type.id} onClick={() => updateCar({ bodyType: type.label })}
              className={twMerge("relative flex flex-col items-center justify-center p-4 rounded-lg border transition-all group overflow-hidden bg-white",
                carData.bodyType === type.label ? "border-primary bg-primary/5 border-4" : "border-gray-200 hover:border-primary/30")}>
              <div className="w-full h-16 relative mb-3 group-hover:scale-110 transition-transform duration-300">
                <img src={type.image} alt={type.label} className="w-full h-full object-contain" />
              </div>
              <span className={twMerge("text-xs font-bold uppercase tracking-wider", carData.bodyType === type.label ? "text-primary" : "text-gray-600")}>
                {type.label}
              </span>
              {carData.bodyType === type.label && <CheckIcon />}
            </button>
          ))}
        </div>
        {errors.bodyType && <p className="text-red-500 text-xs mt-1">{errors.bodyType}</p>}
      </div>

      {/* Fuel Type */}
      <div className="space-y-4">
        <label className="text-sm font-semibold text-gray-700 block px-1">Select Fuel Type</label>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {FUEL_TYPES.map((type) => (
            <OptionButton key={type.id} active={carData.fuelType === type.label} onClick={() => updateCar({ fuelType: type.label })}>
              <div className={twMerge("mb-3 p-3 rounded-lg transition-colors", carData.fuelType === type.label ? "bg-primary/10" : "bg-gray-50 group-hover:bg-gray-100")}>
                <type.icon className={twMerge("text-2xl", carData.fuelType === type.label ? "text-primary" : "text-gray-600 group-hover:text-gray-700")} />
              </div>
              <span className={twMerge("text-xs font-bold uppercase tracking-wider", carData.fuelType === type.label ? "text-primary" : "text-gray-600")}>{type.label}</span>
            </OptionButton>
          ))}
        </div>
        {errors.fuelType && <p className="text-red-500 text-xs mt-1">{errors.fuelType}</p>}
      </div>

      {/* Transmission + Drive + Condition */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {[
          { label: "Select Transmission", types: TRANSMISSION_TYPES, field: "transmission" as const, error: errors.transmission },
          { label: "Select Drive Type", types: DRIVE_TYPES, field: "driveType" as const, error: errors.driveType },
          { label: "Select Vehicle Condition", types: CONDITION_TYPES, field: "condition" as const, error: errors.condition, useId: true },
        ].map(({ label, types, field, error, useId }) => (
          <div key={field} className="space-y-4">
            <label className="text-sm font-semibold text-gray-700 block px-1">{label}</label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4" style={{ gridTemplateColumns: `repeat(${Math.min(types.length, 3)}, minmax(0, 1fr))` }}>
              {types.map((type) => {
                const active = useId ? carData[field] === type.id : carData[field] === type.label;
                return (
                  <OptionButton key={type.id} active={active} onClick={() => updateCar({ [field]: useId ? type.id : type.label } as any)}>
                    <div className={twMerge("mb-3 p-3 rounded-lg transition-colors", active ? "bg-primary/10" : "bg-gray-50 group-hover:bg-gray-100")}>
                      <type.icon className={twMerge("text-2xl", active ? "text-primary" : "text-gray-600 group-hover:text-gray-700")} />
                    </div>
                    <span className={twMerge("text-xs font-bold uppercase tracking-wider", active ? "text-primary" : "text-gray-600")}>{type.label}</span>
                  </OptionButton>
                );
              })}
            </div>
            {error && <p className="text-red-500 text-xs mt-1 font-medium px-1">{error}</p>}
          </div>
        ))}
      </div>

      {/* Year + Mileage */}
      <div className="space-y-6">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 bg-[#a72346] rounded-sm"><FaCar className="text-white text-lg" /></div>
          <h4 className="font-bold text-gray-800">Vehicle Info</h4>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <InputText label="Year" placeholder="2024" value={carData.year} onChange={(e) => updateCar({ year: e.target.value })} type="number" error={errors.year} fullWidth />
          <InputText label="Mileage (km)" placeholder="45000" value={carData.mileage} onChange={(e) => updateCar({ mileage: e.target.value })} type="number" error={errors.mileage} fullWidth />
        </div>
      </div>

      {/* Mechanical specs */}
      <div className="bg-[#1a1a1a] p-6 rounded-lg">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {[
            { label: "Engine", icon: PiEngineFill, field: "engineSize" as const, placeholder: "2.0L", type: "text", error: errors.engineSize },
            { label: "Power", icon: MdSpeed, field: "power" as const, placeholder: "120 hp", type: "number", error: errors.power },
            { label: "Doors", icon: GiCarDoor, field: "doors" as const, placeholder: "4", type: "number", error: errors.doors },
            { label: "Seats", icon: GiCarSeat, field: "seats" as const, placeholder: "5", type: "number", error: errors.seats },
          ].map(({ label, icon: Icon, field, placeholder, type, error }) => (
            <div key={field} className="space-y-2">
              <p className="text-white uppercase tracking-wider px-1 flex gap-2"><Icon className="text-2xl text-white" /> {label}</p>
              <InputText placeholder={placeholder} value={carData[field]} onChange={(e) => updateCar({ [field]: e.target.value } as any)} type={type as any} fullWidth className="bg-white border-transparent focus:border-primary/20" />
              {error && <p className="text-red-400 text-xs mt-1">{error}</p>}
            </div>
          ))}
        </div>
      </div>

      {/* Features */}
      <FormGroup>
        <label className="text-sm font-medium text-gray-800 mb-1 block">Features</label>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {FEATURES.map((f) => (
            <Checkbox key={f} label={f} checked={carData.features.includes(f)}
              onChange={(e) => updateCar({ features: e.target.checked ? [...carData.features, f] : carData.features.filter((x) => x !== f) })} />
          ))}
        </div>
      </FormGroup>

      <Textarea label="Description (optional)" placeholder="Describe your car's condition, service history, extras..." value={carData.description} onChange={(e) => updateCar({ description: e.target.value })} fullWidth rows={4} />
    </div>
  );
}
