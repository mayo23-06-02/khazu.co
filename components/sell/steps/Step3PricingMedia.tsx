"use client";
import { twMerge } from "tailwind-merge";
import { Heading3, Body, Small, Divider, FormGroup, ToggleSwitch, ImageUpload } from "@/components/ui";
import { FaMoneyBillWave, FaHandshake, FaCheckCircle, FaCalendarAlt } from "react-icons/fa";
import { CarData } from "./types";

interface Props {
  carData: CarData;
  errors: Record<string, string>;
  updateCar: (updates: Partial<CarData>) => void;
}

export function Step3PricingMedia({ carData, errors, updateCar }: Props) {
  return (
    <div className="space-y-4">
      <Heading3>Pricing &amp; Photos</Heading3>
      <Body muted>Set your asking price and add clear photos.</Body>

      <div className="bg-white p-8 rounded-lg border border-gray-100 shadow-sm space-y-8">
        {/* Asking Price */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <label className="text-sm font-bold text-gray-800 uppercase tracking-wider">Asking Price</label>
              <p className="text-xs text-gray-400">Set a competitive price to sell faster</p>
            </div>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold">SZL</span>
              <input
                type="number"
                value={carData.price}
                onChange={(e) => updateCar({ price: e.target.value })}
                className="pl-12 pr-4 py-3 bg-gray-50 border-none rounded-lg text-xl font-bold text-primary w-48 focus:ring-2 focus:ring-primary/20 transition-all"
                placeholder="0"
              />
            </div>
          </div>
          <div className="space-y-4">
            <div className="flex justify-between text-xs font-bold text-gray-400 uppercase tracking-widest">
              <span>E15,000</span><span>E5,000,000</span>
            </div>
            <input type="range" min="15000" max="5000000" step="5000" value={carData.price || 15000}
              onChange={(e) => updateCar({ price: e.target.value })}
              className="w-full h-2 bg-gray-100 rounded-lg appearance-none cursor-pointer accent-primary" />
            <div className="flex justify-center">
              <div className="bg-primary/5 text-primary px-4 py-2 rounded-full text-sm font-bold border border-primary/10">
                {carData.price ? `E ${parseInt(carData.price).toLocaleString()}` : "Select Price"}
              </div>
            </div>
          </div>
          {errors.price && <p className="text-red-500 text-xs">{errors.price}</p>}
        </div>

        <Divider />

        {/* Payment Options */}
        <div className="space-y-4">
          <div className="space-y-1">
            <label className="text-sm font-bold text-gray-800 uppercase tracking-wider">Payment Options</label>
            <p className="text-xs text-gray-400">Do you accept a deposit and installments, or only full upfront payment?</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              { value: false, icon: FaMoneyBillWave, title: "Full Amount Only", desc: "Buyer must pay the full asking price upfront before handover." },
              { value: true, icon: FaHandshake, title: "Accept Installments", desc: "Buyer pays an upfront deposit and settles the rest over time." },
            ].map(({ value, icon: Icon, title, desc }) => {
              const active = carData.acceptsInstallments === value;
              return (
                <button key={title} onClick={() => updateCar({ acceptsInstallments: value })}
                  className={twMerge("relative flex flex-col items-start p-5 rounded-lg border-2 text-left transition-all",
                    active ? "border-primary bg-primary/5" : "border-gray-100 hover:border-gray-200 bg-white")}>
                  <div className={twMerge("p-3 rounded-lg mb-3", active ? "bg-primary/10 text-primary" : "bg-gray-50 text-gray-500")}>
                    <Icon size={20} />
                  </div>
                  <h4 className={twMerge("font-bold mb-1", active ? "text-primary" : "text-gray-800")}>{title}</h4>
                  <p className="text-xs text-gray-500 line-clamp-2">{desc}</p>
                  {active && <div className="absolute top-3 right-3 text-primary"><FaCheckCircle size={18} /></div>}
                </button>
              );
            })}
          </div>

          {carData.acceptsInstallments && (
            <div className="mt-4 p-5 rounded-lg border border-primary/20 bg-primary/5 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">Minimum Deposit (SZL)</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold">E</span>
                    <input type="number" value={carData.depositAmount}
                      onChange={(e) => updateCar({ depositAmount: e.target.value })}
                      className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-lg focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                      placeholder="e.g. 30000" />
                  </div>
                  {errors.depositAmount && <p className="text-red-500 text-xs">{errors.depositAmount}</p>}
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">Max Installment Duration</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"><FaCalendarAlt /></span>
                    <select value={carData.installmentMonths} onChange={(e) => updateCar({ installmentMonths: e.target.value })}
                      className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-lg focus:border-primary focus:ring-1 focus:ring-primary transition-all appearance-none">
                      <option value="3">3 Months</option>
                      <option value="6">6 Months</option>
                      <option value="12">12 Months</option>
                      <option value="24">24 Months</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        <Divider />

        <FormGroup direction="horizontal" spacing="md">
          <ToggleSwitch label="Price is negotiable" checked={carData.negotiable}
            onChange={(e) => updateCar({ negotiable: e.target.checked })} />
        </FormGroup>
      </div>

      <Divider />
      <ImageUpload label="Upload Media (Photos & Videos)" onImagesChange={(files) => updateCar({ images: files })} maxCount={20} preview error={errors.images} />
      <Small muted>Recommended: 5-10 photos/videos showing different angles. The first item is your Cover Photo.</Small>
    </div>
  );
}
