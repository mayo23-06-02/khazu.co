import { Button } from "@/components/ui";
import { FaPhoneAlt } from "react-icons/fa";
import { formatSzl } from "@/lib/marketplace/format";

export function VehicleMobileBar({
  price,
  phone,
  onContact,
  onEnquireClick,
}: {
  price: number;
  phone: string | null | undefined;
  onContact: (channel: "call" | "whatsapp") => void;
  onEnquireClick: () => void;
}) {
  return (
    <div className="fixed bottom-0 inset-x-0 lg:hidden bg-white border-t border-gray-200 p-3 z-50 flex gap-2 shadow-[0_-4px_20px_rgba(0,0,0,0.06)]">
      <div className="flex-1">
        <p className="text-[10px] text-gray-400 font-bold uppercase">Price</p>
        <p className="font-black text-gray-900">{formatSzl(price)}</p>
      </div>
      <Button
        className="bg-[#CD2C58] text-white font-bold rounded-lg border-none px-6"
        onClick={onEnquireClick}
      >
        Enquire
      </Button>
      {phone && (
        <Button
          variant="outline"
          className="rounded-lg border-2 font-bold px-4"
          onClick={() => onContact("call")}
        >
          <FaPhoneAlt />
        </Button>
      )}
    </div>
  );
}
