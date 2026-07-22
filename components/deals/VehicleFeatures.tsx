import { FaCheck } from "react-icons/fa";
import {
  MdAcUnit,
  MdAndroid,
  MdBluetooth,
  MdCameraAlt,
  MdEventSeat,
  MdLocalFireDepartment,
  MdLocalShipping,
  MdPhoneIphone,
  MdSensors,
  MdSpeed,
  MdWbSunny,
} from "react-icons/md";
import { GiCarWheel } from "react-icons/gi";

// Matches the checkbox options offered at listing creation (sell/upload, Step2CarSpecs) —
// any feature string outside this set still renders, just with the fallback icon.
const FEATURE_ICONS: Record<string, React.ReactNode> = {
  "Air Conditioning": <MdAcUnit size={22} />,
  "Leather Seats": <MdEventSeat size={22} />,
  Sunroof: <MdWbSunny size={22} />,
  Bluetooth: <MdBluetooth size={22} />,
  "Apple CarPlay": <MdPhoneIphone size={22} />,
  "Android Auto": <MdAndroid size={22} />,
  "Reverse Camera": <MdCameraAlt size={22} />,
  "Parking Sensors": <MdSensors size={22} />,
  "Cruise Control": <MdSpeed size={22} />,
  "Heated Seats": <MdLocalFireDepartment size={22} />,
  "Alloy Wheels": <GiCarWheel size={22} />,
  "Tow Bar": <MdLocalShipping size={22} />,
};

function FeatureTile({ feature }: { feature: string }) {
  return (
    <div className="flex flex-col items-center text-center gap-2">
      <span className="text-gray-500">
        {FEATURE_ICONS[feature] ?? <FaCheck size={18} />}
      </span>
      <span className="text-sm font-semibold text-gray-800">{feature}</span>
    </div>
  );
}

export function VehicleFeatures({ features }: { features: string[] }) {
  return (
    <div className="border border-gray-100 rounded-lg p-6">
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-x-4 gap-y-6">
        {features.map((f) => (
          <FeatureTile key={f} feature={f} />
        ))}
      </div>
    </div>
  );
}
