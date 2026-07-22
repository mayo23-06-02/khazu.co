"use client";
import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Container,
  Card,
  CardBody,
  CardFooter,
  Heading3,
  Body,
  Small,
  Button,
  InputText,
  Select,
  Textarea,
  ImageUpload,
  Checkbox,
  RadioGroup,
  ToggleSwitch,
  FormGroup,
  Stepper,
  Badge,
  Divider,
  Toast,
  AlertBanner,
  InputPassword,
  Logo,
  Heading4,
} from "@/components/ui";
import {
  FaArrowRight,
  FaArrowLeft,
  FaSpinner,
  FaEdit,
  FaGasPump,
  FaChargingStation,
  FaCar,
  FaCogs,
} from "react-icons/fa";
import { ListingPaymentGate } from "@/components/sell/ListingPaymentGate";
import type { ListingEntitlement } from "@/lib/subscriptions/entitlement";
import {
  ToyotaIcon,
  VolkswagenIcon,
  FordIcon,
  NissanIcon,
  HondaIcon,
  MBIcon,
  BMWIcon,
  AudiIcon,
  HyundaiIcon,
  KiaIcon,
  MazdaIcon,
  LexusIcon,
  LandroverIcon,
  JeepIcon,
  TeslaIcon,
  PorscheIcon,
  FerrariIcon,
  LamborghiniIcon,
  MaseratiIcon,
  AstonMartinIcon,
  BentleyIcon,
  JaguarIcon,
  VolvoIcon,
  FiatIcon,
  MitsubishiIcon,
  SubaruIcon,
  ChevroletIcon,
  DodgeIcon,
  AlfaRomeoIcon,
  BYDIcon,
  MiniIcon,
} from "@cardog-icons/react";
import { Autocomplete } from "@/components/ui/Inputs/Autocomplete/Autocomplete";
import { twMerge } from "tailwind-merge";
import { clsx } from "clsx";
import Image from "next/image";
import {
  BsFillAirplaneEnginesFill,
  BsThermometerHalf,
  BsPerson,
  BsShop,
} from "react-icons/bs";
import {
  PiEngine,
  PiEngineFill,
  PiSteeringWheel,
  PiSteeringWheelFill,
} from "react-icons/pi";
import {
  GiCarDoor,
  GiCarSeat,
  GiPowerRing,
  GiGearStickPattern,
  GiCircuitry,
  GiCarWheel,
} from "react-icons/gi";
import {
  MdSpeed,
  MdSettingsInputComponent,
  MdOutlineLocationOn,
  MdAttachMoney,
  MdOutlineAutoAwesome,
  MdTwoWheeler,
} from "react-icons/md";
import {
  TbManualGearbox,
  TbAutomaticGearbox,
  TbSettingsAutomation,
  TbSteeringWheelFilled,
} from "react-icons/tb";
import {
  FaUser,
  FaStore,
  FaStar,
  FaThumbsUp,
  FaMeh,
  FaFrown,
  FaCheckCircle,
  FaMoneyBillWave,
  FaCalendarAlt,
  FaHandshake,
} from "react-icons/fa";

// ─── Types ───────────────────────────────────────────────

interface CarData {
  regNumber: string;
  make: string;
  model: string;
  year: string;
  mileage: string;
  bodyType: string;
  fuelType: string;
  transmission: string;
  driveType: string;
  engineSize: string;
  power: string;
  torque: string;
  doors: string;
  seats: string;
  colour: string;
  condition: string;
  features: string[];
  description: string;
  price: string;
  negotiable: boolean;
  images: File[];
  sellerType: string;
  acceptsInstallments: boolean;
  depositAmount: string;
  installmentMonths: string;
}

interface AuthData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
  role: "personal" | "dealer";
  dealerName: string;
  termsAccepted: boolean;
}

const initialCarData: CarData = {
  regNumber: "",
  make: "",
  model: "",
  year: "",
  mileage: "",
  bodyType: "",
  fuelType: "",
  transmission: "",
  driveType: "",
  engineSize: "",
  power: "",
  torque: "",
  doors: "",
  seats: "",
  colour: "",
  condition: "good",
  features: [],
  description: "",
  price: "",
  negotiable: true,
  images: [],
  sellerType: "individual",
  acceptsInstallments: false,
  depositAmount: "",
  installmentMonths: "6",
};

const initialAuthData: AuthData = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  password: "",
  confirmPassword: "",
  role: "personal",
  dealerName: "",
  termsAccepted: false,
};

const CAR_MAKES = [
  { label: "Toyota", value: "toyota", icon: ToyotaIcon },
  { label: "Volkswagen", value: "volkswagen", icon: VolkswagenIcon },
  { label: "Ford", value: "ford", icon: FordIcon },
  { label: "BMW", value: "bmw", icon: BMWIcon },
  { label: "Mercedes-Benz", value: "mercedes-benz", icon: MBIcon },
  { label: "Nissan", value: "nissan", icon: NissanIcon },
  { label: "Hyundai", value: "hyundai", icon: HyundaiIcon },
  { label: "Isuzu", value: "isuzu" },
  { label: "Kia", value: "kia", icon: KiaIcon },
  { label: "Renault", value: "renault" },
  { label: "Mazda", value: "mazda", icon: MazdaIcon },
  { label: "Audi", value: "audi", icon: AudiIcon },
  { label: "Suzuki", value: "suzuki" },
  { label: "Chevrolet", value: "chevrolet", icon: ChevroletIcon },
  { label: "Honda", value: "honda", icon: HondaIcon },
  { label: "Land Rover", value: "land rover", icon: LandroverIcon },
  { label: "Jeep", value: "jeep", icon: JeepIcon },
  { label: "Lexus", value: "lexus", icon: LexusIcon },
  { label: "Mitsubishi", value: "mitsubishi", icon: MitsubishiIcon },
  { label: "Volvo", value: "volvo", icon: VolvoIcon },
  { label: "Porsche", value: "porsche", icon: PorscheIcon },
  { label: "Jaguar", value: "jaguar", icon: JaguarIcon },
  { label: "Chery", value: "chery" },
  { label: "Haval", value: "haval" },
  { label: "GWM", value: "gwm" },
  { label: "Mahindra", value: "mahindra" },
  { label: "Peugeot", value: "peugeot" },
  { label: "Citroen", value: "citroen" },
  { label: "Subaru", value: "subaru", icon: SubaruIcon },
  { label: "Mini", value: "mini", icon: MiniIcon },
];

const BODY_TYPES = [
  { id: "hatchback", label: "Hatchback", image: "/car-type/hatchback.png" },
  { id: "sedan", label: "Saloon", image: "/car-type/saloon.png" },
  { id: "suv", label: "SUV", image: "/car-type/suv.png" },

  { id: "Van", label: "Van", image: "/car-type/pick-up.png" },
  { id: "coupe", label: "Coupe", image: "/car-type/coupe.png" },
  {
    id: "convertible",
    label: "Convertible",
    image: "/car-type/convertible.png",
  },
  { id: "estate", label: "Estate", image: "/car-type/estate.png" },
  {
    id: "people-carrier",
    label: "People Carrier",
    image: "/car-type/people-carrier.png",
  },
];

const FUEL_TYPES = [
  { id: "petrol", label: "Petrol", icon: FaGasPump },
  { id: "diesel", label: "Diesel", icon: FaGasPump },
  { id: "electric", label: "Electric", icon: FaChargingStation },
  { id: "hybrid", label: "Hybrid", icon: FaChargingStation },
];

const TRANSMISSION_TYPES = [
  { id: "manual", label: "Manual", icon: TbManualGearbox },
  { id: "automatic", label: "Automatic", icon: TbAutomaticGearbox },
  { id: "cvt", label: "CVT", icon: TbSettingsAutomation },
];

const DRIVE_TYPES = [
  { id: "fwd", label: "FWD", icon: GiCarWheel },
  { id: "rwd", label: "RWD", icon: GiCarWheel },
  { id: "awd", label: "AWD", icon: GiCarWheel },
  { id: "4wd", label: "4WD", icon: GiCarWheel },
];

const CONDITION_TYPES = [
  { id: "excellent", label: "Excellent", icon: FaStar },
  { id: "good", label: "Good", icon: FaThumbsUp },
  { id: "fair", label: "Fair", icon: FaMeh },
  { id: "poor", label: "Poor", icon: FaFrown },
];

const SELLER_TYPES = [
  { id: "individual", label: "Individual", icon: FaUser },
  { id: "dealer", label: "Dealer", icon: FaStore },
];

const CAR_MODELS: Record<string, string[]> = {
  toyota: [
    "Corolla",
    "Corolla Cross",
    "Hilux",
    "Fortuner",
    "Starlet",
    "Vitz",
    "Urban Cruiser",
    "Land Cruiser",
  ],
  volkswagen: [
    "Polo",
    "Polo Vivo",
    "Golf",
    "Tiguan",
    "T-Cross",
    "T-Roc",
    "Amarok",
    "Caddy",
  ],
  ford: ["Ranger", "Everest", "EcoSport", "Mustang", "Puma"],
  bmw: [
    "1 Series",
    "2 Series",
    "3 Series",
    "4 Series",
    "5 Series",
    "X1",
    "X3",
    "X5",
    "X7",
    "M3",
    "M4",
  ],
  "mercedes-benz": [
    "A-Class",
    "C-Class",
    "E-Class",
    "S-Class",
    "GLA",
    "GLC",
    "GLE",
    "GLS",
  ],
  nissan: ["NP200", "Navara", "Magnite", "Qashqai", "X-Trail"],
  hyundai: ["Grand i10", "i20", "Creta", "Venue", "Tucson", "Santa Fe"],
  isuzu: ["D-Max", "mu-X"],
  kia: ["Picanto", "Rio", "Seltos", "Sportage", "Sorento"],
  renault: ["Kwid", "Kiger", "Triber", "Clio", "Duster"],
  suzuki: ["Swift", "S-Presso", "Baleno", "Ertiga", "Jimny", "Grand Vitara"],
  haval: ["Jolion", "H6", "P-Series"],
  chery: ["Tiggo 4 Pro", "Tiggo 7 Pro", "Tiggo 8 Pro"],
  mazda: ["CX-3", "CX-30", "CX-5", "Mazda2", "Mazda3"],
  audi: ["A1", "A3", "A4", "Q2", "Q3", "Q5"],
};

export default function SellCarPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SellCarContent />
    </Suspense>
  );
}

function SellCarContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const regFromQuery = searchParams.get("reg") || "";

  const [currentStep, setCurrentStep] = useState(1);
  const [carData, setCarData] = useState<CarData>({
    ...initialCarData,
    regNumber: regFromQuery.toUpperCase(),
  });
  const [authData, setAuthData] = useState<AuthData>(initialAuthData);

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState<"personal" | "dealer">("personal");
  const [userName, setUserName] = useState("");
  const [entitlement, setEntitlement] = useState<ListingEntitlement | null>(
    null,
  );
  const [toast, setToast] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  const refreshEntitlement = async () => {
    try {
      const { getListingEntitlement } = await import(
        "@/lib/subscriptions/entitlement"
      );
      const ent = await getListingEntitlement();
      setEntitlement(ent);
      if (ent) {
        setUserRole(ent.role === "dealer" ? "dealer" : "personal");
      }
    } catch {
      setEntitlement(null);
    }
  };

  useEffect(() => {
    // Check Supabase session + listing billing entitlement
    (async () => {
      try {
        const { createClient } = await import("@/lib/supabase/client");
        const supabase = createClient();
        const {
          data: { user },
        } = await supabase.auth.getUser();
        if (user) {
          setIsLoggedIn(true);
          const { data: profile } = await supabase
            .from("profiles")
            .select("role, full_name")
            .eq("id", user.id)
            .maybeSingle();
          const role =
            profile?.role === "dealer" ? "dealer" : "personal";
          setUserRole(role);
          setUserName(
            profile?.full_name || user.email?.split("@")[0] || "Khazu user",
          );
          await refreshEntitlement();
        } else {
          setIsLoggedIn(false);
          setEntitlement(null);
        }
      } catch {
        setIsLoggedIn(false);
        setEntitlement(null);
      }
    })();
  }, []);

  const updateCar = (updates: Partial<CarData>) => {
    setCarData((prev) => ({ ...prev, ...updates }));
    // Clear errors for updated fields
    const clean = { ...errors };
    Object.keys(updates).forEach((k) => delete clean[k]);
    setErrors(clean);
  };

  const updateAuth = (updates: Partial<AuthData>) => {
    setAuthData((prev) => ({ ...prev, ...updates }));
    const clean = { ...errors };
    Object.keys(updates).forEach((k) => delete clean[k]);
    setErrors(clean);
  };

  const validateStep = (step: number): boolean => {
    const newErrors: Record<string, string> = {};

    if (step === 1) {
      if (!carData.regNumber?.trim())
        newErrors.regNumber = "Registration is required";
      if (!carData.make?.trim()) newErrors.make = "Make is required";
      if (!carData.model?.trim()) newErrors.model = "Model is required";
    } else if (step === 2) {
      if (!carData.year?.toString().trim()) newErrors.year = "Year is required";
      if (!carData.mileage?.toString().trim())
        newErrors.mileage = "Mileage is required";
      if (!carData.bodyType?.trim())
        newErrors.bodyType = "Body type is required";
      if (!carData.fuelType?.trim())
        newErrors.fuelType = "Fuel type is required";
      if (!carData.transmission?.trim())
        newErrors.transmission = "Transmission is required";
      if (!carData.driveType?.trim())
        newErrors.driveType = "Drive type is required";
      if (!carData.engineSize?.toString().trim())
        newErrors.engineSize = "Engine size is required";
      if (!carData.power?.toString().trim())
        newErrors.power = "Power is required";
      if (!carData.doors?.toString().trim())
        newErrors.doors = "Doors count is required";
      if (!carData.seats?.toString().trim())
        newErrors.seats = "Seats count is required";
      if (!carData.condition?.trim())
        newErrors.condition = "Condition is required";
    } else if (step === 3) {
      if (!carData.price?.toString().trim())
        newErrors.price = "Price is required";
      if (carData.images.length === 0)
        newErrors.images = "At least one photo/video is required";
      if (
        carData.acceptsInstallments &&
        !carData.depositAmount?.toString().trim()
      ) {
        newErrors.depositAmount =
          "Minimum deposit amount is required for installments";
      }
    } else if (step === 4) {
      // Review step has no inputs, validation is implicit
    } else if (step === 5) {
      if (!isLoggedIn) {
        if (!authData.firstName?.trim())
          newErrors.firstName = "First name is required";
        if (!authData.lastName?.trim())
          newErrors.lastName = "Last name is required";
        if (!authData.email?.trim()) newErrors.email = "Email is required";
        if (!authData.phone?.trim())
          newErrors.phone = "Phone number is required";
        if (authData.password.length < 6)
          newErrors.password = "Password must be at least 6 characters";
        if (authData.password !== authData.confirmPassword)
          newErrors.confirmPassword = "Passwords do not match";

        if (authData.role === "dealer" && !authData.dealerName?.trim()) {
          newErrors.dealerName = "Dealer/Business name is required";
        }
      }
      if (!authData.termsAccepted)
        newErrors.termsAccepted = "You must accept the terms";
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      setToast({
        type: "error",
        message: "Please fill in all required fields",
      });
      // Scroll to top of form to see errors
      window.scrollTo({ top: 0, behavior: "smooth" });
    }

    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (!validateStep(currentStep)) return;
    setCurrentStep((prev) => Math.min(prev + 1, 5));
  };

  const handlePrev = () => setCurrentStep((prev) => Math.max(prev - 1, 1));

  const handleSubmit = async () => {
    if (!validateStep(5)) return;

    setIsSubmitting(true);
    try {
      // 1. Require Supabase session
      if (!isLoggedIn) {
        throw new Error(
          "Please sign in or create an account first, then list your car.",
        );
      }

      // 2. Refresh entitlement — payment required after free trial listing
      await refreshEntitlement();
      const { getListingEntitlement } = await import(
        "@/lib/subscriptions/entitlement"
      );
      const ent = await getListingEntitlement();
      setEntitlement(ent);
      if (!ent?.canPost) {
        throw new Error(
          ent?.reason ||
            "Payment required before posting. Complete a plan checkout first.",
        );
      }

      // 3. Upload images to Cloudinary
      const uploadedUrls: string[] = [];
      for (const file of carData.images) {
        const formData = new FormData();
        formData.append("file", file);
        const res = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });

        const contentType = res.headers.get("content-type");
        if (contentType && contentType.includes("application/json")) {
          const data = await res.json();
          if (data.url) uploadedUrls.push(data.url);
        } else {
          throw new Error("Image upload failed due to server error.");
        }
      }

      // 4. Create listing (server also re-checks entitlement)
      const { createListing } = await import("@/lib/listings/actions");
      const result = await createListing({
        reg_number: carData.regNumber,
        make: carData.make,
        model: carData.model,
        year: Number(carData.year),
        mileage: Number(carData.mileage) || 0,
        body_type: carData.bodyType,
        fuel_type: carData.fuelType,
        transmission: carData.transmission,
        drive_type: carData.driveType,
        engine_size: carData.engineSize,
        power_kw: carData.power ? Number(carData.power) : null,
        torque_nm: carData.torque ? Number(carData.torque) : null,
        doors: carData.doors ? Number(carData.doors) : null,
        seats: carData.seats ? Number(carData.seats) : null,
        colour: carData.colour,
        condition: carData.condition,
        features: carData.features,
        description: carData.description,
        price: Number(carData.price),
        negotiable: carData.negotiable,
        accepts_installments: carData.acceptsInstallments,
        deposit_amount: carData.depositAmount
          ? Number(carData.depositAmount)
          : null,
        installment_months: carData.installmentMonths
          ? Number(carData.installmentMonths)
          : null,
        images: uploadedUrls,
        seller_type:
          authData.role === "dealer" || userRole === "dealer"
            ? "dealer"
            : "individual",
        status: "active",
      });

      if (!result.success) {
        if (result.code === "PAYMENT_REQUIRED") {
          await refreshEntitlement();
        }
        throw new Error(result.error || "Failed to post listing");
      }

      setToast({
        type: "success",
        message: "Your car has been listed successfully!",
      });
      const dest =
        userRole === "dealer" || authData.role === "dealer"
          ? "/dashboard/dealer/listings"
          : "/dashboard/personal/listings";
      setTimeout(() => router.push(dest), 1500);
    } catch (error: any) {
      setToast({ type: "error", message: error.message });
    } finally {
      setIsSubmitting(false);
    }
  };

  const stepLabels = [
    "Vehicle Details",
    "Car Specs",
    "Pricing & Images",
    "Review",
    "Account",
  ];

  return (
    <div className="min-h-screen w-full overflow-x-hidden bg-[#e6e6e6]">
      {/* Header */}

      <div className="py-4 sm:py-8 min-h-screen sm:h-screen flex justify-between flex-col items-center bg-white w-full max-w-6xl mx-auto px-0 sm:px-2">
        {/* Toast notifications */}
        <div className="fixed top-4 right-4 z-50 space-y-2">
          {toast && (
            <Toast
              type={toast.type}
              message={toast.message}
              onClose={() => setToast(null)}
            />
          )}
        </div>
        <div className="flex max-w-4xl items-center px-4 w-full mx-auto justify-between  mb-6">
          <Logo />
          <Button
            size="sm"
            color="primary"
            variant="outline"
            onClick={() => router.push("/login")}
          >
            Login
          </Button>
        </div>
        <div className="max-w-4xl mx-auto h-full flex flex-col  justify-between w-full">
          <div className="my-6 px-4">
            <div className="mb-6">
              <p className=" font-extrabold text-4xl text-black">
                Follow these steps to get your car in front of thousands of
                buyers.
              </p>
            </div>
          </div>

          {/* Main Card */}
          <div className="border-none w-full h-full mb-24 py4 overflow-auto custom-scrollbar  flex flex-col justify-between ">
            <div className="pb-6 lg:pb-12 px-4">
              {/* Step 1: Vehicle Details */}
              {currentStep === 1 && (
                <div className="space-y-6">
                  <div className="px-4">
                    <Heading3>Vehicle Details</Heading3>
                    <Body muted>
                      Start with your registration and basic model info.
                    </Body>
                  </div>

                  <div className="bg-white p-4 lg:p-8 ">
                    <div className="flex flex-col lg:items-center mb-8">
                      <label className="text-md font-semibold  text-gray-600 mb-4 block">
                        Enter Registration
                      </label>
                      <div className="relative group w-full max-w-[500px]">
                        <div className="w-full relative h-[130px]  flex items-center justify-center rounded-lg shadow-[0_20px_50px_rgba(0,0,0,0.15)] border-[6px] border-black overflow-hidden transition-transform group-hover:scale-[1.02] duration-500">
                          <Image
                            src="/plate-bg.svg"
                            alt="Plate Background"
                            fill
                            className="object-cover"
                          />
                          <input
                            className="font-mono max-h-[430px] bg-transparent w-full h-full text-center font-black text-6xl md:text-7xl focus:outline-none transition-all uppercase placeholder:text-black/5 text-black drop-shadow-sm"
                            type="text"
                            placeholder="ABC 123 CM"
                            value={carData.regNumber}
                            onChange={(e) =>
                              updateCar({
                                regNumber: e.target.value.toUpperCase(),
                              })
                            }
                          />
                        </div>

                        <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-[80%] h-4 bg-[#1a1a1a]/5 blur-xl rounded-full -z-10" />
                      </div>
                      {errors.regNumber && (
                        <p className="text-red-500 text-xs mt-4 font-medium">
                          {errors.regNumber}
                        </p>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-8 border-t border-gray-50">
                      <div className="space-y-2">
                        <Autocomplete
                          label="Make / Brand"
                          placeholder="Select make (e.g. Toyota)"
                          options={CAR_MAKES}
                          value={carData.make.toLowerCase()}
                          onChange={(val) =>
                            updateCar({ make: val, model: "" })
                          }
                          error={errors.make}
                          className="bg-gray-50/50"
                        />
                      </div>
                      <div className="space-y-2">
                        <Autocomplete
                          label="Model"
                          placeholder="Select model (e.g. Hilux)"
                          options={(
                            CAR_MODELS[carData.make.toLowerCase()] || []
                          ).map((m) => ({ label: m, value: m }))}
                          value={carData.model}
                          onChange={(val) => updateCar({ model: val })}
                          error={errors.model}
                          className="bg-gray-50/50"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 2: Car Specs */}
              {currentStep === 2 && (
                <div className="space-y-8 pb-10">
                  <div className="space-y-4">
                    <label className="text-sm font-semibold text-gray-700 block px-1">
                      Select Body Type
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                      {BODY_TYPES.map((type) => (
                        <button
                          key={type.id}
                          onClick={() => updateCar({ bodyType: type.label })}
                          className={twMerge(
                            "relative flex flex-col items-center justify-center p-4 rounded-lg border transition-all group overflow-hidden bg-white ",
                            carData.bodyType === type.label
                              ? "border-primary bg-primary/5 border-4  "
                              : "border-gray-200 hover:border-primary/30",
                          )}
                        >
                          <div className="w-full h-16 relative mb-3 group-hover:scale-110 transition-transform duration-300">
                            <img
                              src={type.image}
                              alt={type.label}
                              className="w-full h-full object-contain"
                            />
                          </div>
                          <span
                            className={twMerge(
                              "text-xs font-bold uppercase tracking-wider",
                              carData.bodyType === type.label
                                ? "text-primary"
                                : "text-gray-600",
                            )}
                          >
                            {type.label}
                          </span>
                          {carData.bodyType === type.label && (
                            <div className="absolute top-2 right-2 bg-primary text-white p-1 rounded-full shadow-sm">
                              <svg
                                className="w-3 h-3"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth="3"
                                  d="M5 13l4 4L19 7"
                                />
                              </svg>
                            </div>
                          )}
                        </button>
                      ))}
                    </div>
                    {errors.bodyType && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.bodyType}
                      </p>
                    )}
                  </div>

                  <div className="space-y-4">
                    <label className="text-sm font-semibold text-gray-700 block px-1">
                      Select Fuel Type
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                      {FUEL_TYPES.map((type) => (
                        <button
                          key={type.id}
                          onClick={() => updateCar({ fuelType: type.label })}
                          className={twMerge(
                            "relative flex flex-col items-center justify-center p-6 rounded-lg border transition-all group bg-white ",
                            carData.fuelType === type.label
                              ? "border-primary bg-primary/5 border-2"
                              : "border-gray-200 hover:border-primary/30",
                          )}
                        >
                          <div
                            className={twMerge(
                              "mb-3 p-3 rounded-lg transition-colors",
                              carData.fuelType === type.label
                                ? "bg-primary/10"
                                : "bg-gray-50 group-hover:bg-gray-100",
                            )}
                          >
                            <type.icon
                              className={twMerge(
                                "text-2xl",
                                carData.fuelType === type.label
                                  ? "text-primary"
                                  : "text-gray-600 group-hover:text-gray-700",
                              )}
                            />
                          </div>
                          <span
                            className={twMerge(
                              "text-xs font-bold uppercase tracking-wider",
                              carData.fuelType === type.label
                                ? "text-primary"
                                : "text-gray-600",
                            )}
                          >
                            {type.label}
                          </span>
                        </button>
                      ))}
                    </div>
                    {errors.fuelType && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.fuelType}
                      </p>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8  ">
                    <div className="space-y-4">
                      <label className="text-sm font-semibold text-gray-700 block px-1">
                        Select Transmission
                      </label>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        {TRANSMISSION_TYPES.map((type) => (
                          <button
                            key={type.id}
                            onClick={() =>
                              updateCar({ transmission: type.label })
                            }
                            className={twMerge(
                              "relative flex flex-col items-center justify-center p-6 rounded-lg border transition-all group bg-white ",
                              carData.transmission === type.label
                                ? "border-primary bg-primary/5 border-2"
                                : "border-gray-200 hover:border-primary/30",
                            )}
                          >
                            <div
                              className={twMerge(
                                "mb-3 p-3 rounded-lg transition-colors",
                                carData.transmission === type.label
                                  ? "bg-primary/10"
                                  : "bg-gray-50 group-hover:bg-gray-100",
                              )}
                            >
                              <type.icon
                                className={twMerge(
                                  "text-2xl",
                                  carData.transmission === type.label
                                    ? "text-primary"
                                    : "text-gray-600 group-hover:text-gray-700",
                                )}
                              />
                            </div>
                            <span
                              className={twMerge(
                                "text-xs font-bold uppercase tracking-wider",
                                carData.transmission === type.label
                                  ? "text-primary"
                                  : "text-gray-600",
                              )}
                            >
                              {type.label}
                            </span>
                          </button>
                        ))}
                      </div>
                      {errors.transmission && (
                        <p className="text-red-500 text-xs mt-1 font-medium px-1">
                          {errors.transmission}
                        </p>
                      )}
                    </div>

                    <div className="space-y-4">
                      <label className="text-sm font-semibold text-gray-700 block px-1">
                        Select Drive Type
                      </label>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                        {DRIVE_TYPES.map((type) => (
                          <button
                            key={type.id}
                            onClick={() => updateCar({ driveType: type.label })}
                            className={twMerge(
                              "relative flex flex-col items-center justify-center p-6 rounded-lg border transition-all group bg-white ",
                              carData.driveType === type.label
                                ? "border-primary bg-primary/5 border-2"
                                : "border-gray-200 hover:border-primary/30",
                            )}
                          >
                            <div
                              className={twMerge(
                                "mb-3 p-3 rounded-lg transition-colors",
                                carData.driveType === type.label
                                  ? "bg-primary/10"
                                  : "bg-gray-50 group-hover:bg-gray-100",
                              )}
                            >
                              <type.icon
                                className={twMerge(
                                  "text-2xl",
                                  carData.driveType === type.label
                                    ? "text-primary"
                                    : "text-gray-600 group-hover:text-gray-700",
                                )}
                              />
                            </div>
                            <span
                              className={twMerge(
                                "text-xs font-bold uppercase tracking-wider",
                                carData.driveType === type.label
                                  ? "text-primary"
                                  : "text-gray-600",
                              )}
                            >
                              {type.label}
                            </span>
                          </button>
                        ))}
                      </div>
                      {errors.driveType && (
                        <p className="text-red-500 text-xs mt-1 font-medium px-1">
                          {errors.driveType}
                        </p>
                      )}
                    </div>

                    <div className="space-y-4">
                      <label className="text-sm font-semibold text-gray-700 block px-1">
                        Select Vehicle Condition
                      </label>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                        {CONDITION_TYPES.map((type) => (
                          <button
                            key={type.id}
                            onClick={() => updateCar({ condition: type.id })}
                            className={twMerge(
                              "relative flex flex-col items-center justify-center p-6 rounded-lg border transition-all group bg-white ",
                              carData.condition === type.id
                                ? "border-primary bg-primary/5 border-2"
                                : "border-gray-200 hover:border-primary/30",
                            )}
                          >
                            <div
                              className={twMerge(
                                "mb-3 p-3 rounded-lg transition-colors",
                                carData.condition === type.id
                                  ? "bg-primary/10"
                                  : "bg-gray-50 group-hover:bg-gray-100",
                              )}
                            >
                              <type.icon
                                className={twMerge(
                                  "text-2xl",
                                  carData.condition === type.id
                                    ? "text-primary"
                                    : "text-gray-600 group-hover:text-gray-700",
                                )}
                              />
                            </div>
                            <span
                              className={twMerge(
                                "text-xs font-bold uppercase tracking-wider",
                                carData.condition === type.id
                                  ? "text-primary"
                                  : "text-gray-600",
                              )}
                            >
                              {type.label}
                            </span>
                          </button>
                        ))}
                      </div>
                      {errors.condition && (
                        <p className="text-red-500 text-xs mt-1 font-medium px-1">
                          {errors.condition}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="space-y-6">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="p-2 bg-[#a72346] rounded-sm">
                        <FaCar className="text-white text-lg" />
                      </div>
                      <h4 className="font-bold text-gray-800">Vehicle Info</h4>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <InputText
                        label="Year"
                        placeholder="2024"
                        value={carData.year}
                        onChange={(e) => updateCar({ year: e.target.value })}
                        type="number"
                        error={errors.year}
                        fullWidth
                      />
                      <InputText
                        label="Mileage (km)"
                        placeholder="45000"
                        value={carData.mileage}
                        onChange={(e) => updateCar({ mileage: e.target.value })}
                        type="number"
                        error={errors.mileage}
                        fullWidth
                      />
                    </div>
                  </div>
                  <div className="bg-[#1a1a1a] p-6  rounded-lg ">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                      <div className="space-y-2">
                        <p className="text-white uppercase tracking-wider px-1 flex gap-2">
                          <PiEngineFill className="text-2xl text-white" />{" "}
                          Engine
                        </p>
                        <InputText
                          placeholder="2.0L"
                          value={carData.engineSize}
                          onChange={(e) =>
                            updateCar({ engineSize: e.target.value })
                          }
                          fullWidth
                          className="bg-white border-transparent focus:border-primary/20"
                        />
                      </div>
                      <div className="space-y-2">
                        <p className="text-white uppercase tracking-wider px-1 flex gap-2">
                          <MdSpeed className="text-2xl text-white" /> Power
                        </p>
                        <InputText
                          placeholder="120 hp"
                          value={carData.power}
                          onChange={(e) => updateCar({ power: e.target.value })}
                          type="number"
                          fullWidth
                          className="bg-white border-transparent focus:border-primary/20"
                        />
                      </div>
                      <div className="space-y-2">
                        <p className="text-white uppercase tracking-wider px-1 flex gap-2">
                          <GiCarDoor className="text-2xl text-white" /> Doors
                        </p>
                        <InputText
                          placeholder="4"
                          value={carData.doors}
                          onChange={(e) => updateCar({ doors: e.target.value })}
                          type="number"
                          fullWidth
                          className="bg-white border-transparent focus:border-primary/20"
                        />
                      </div>
                      <div className="space-y-2">
                        <p className="text-white uppercase tracking-wider px-1 flex gap-2">
                          <GiCarSeat className="text-2xl text-white" /> Seats
                        </p>
                        <InputText
                          placeholder="5"
                          value={carData.seats}
                          onChange={(e) => updateCar({ seats: e.target.value })}
                          type="number"
                          fullWidth
                          className="bg-white border-transparent focus:border-primary/20"
                        />
                      </div>
                    </div>
                  </div>

                  <FormGroup>
                    <label className="text-sm font-medium text-gray-800 mb-1 block">
                      Features
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                      {[
                        "Air Conditioning",
                        "Leather Seats",
                        "Sunroof",
                        "Bluetooth",
                        "Apple CarPlay",
                        "Android Auto",
                        "Reverse Camera",
                        "Parking Sensors",
                        "Cruise Control",
                        "Heated Seats",
                        "Alloy Wheels",
                        "Tow Bar",
                      ].map((f) => (
                        <Checkbox
                          key={f}
                          label={f}
                          checked={carData.features.includes(f)}
                          onChange={(e) => {
                            if (e.target.checked)
                              updateCar({ features: [...carData.features, f] });
                            else
                              updateCar({
                                features: carData.features.filter(
                                  (x) => x !== f,
                                ),
                              });
                          }}
                        />
                      ))}
                    </div>
                  </FormGroup>
                  <Textarea
                    label="Description (optional)"
                    placeholder="Describe your car's condition, service history, extras..."
                    value={carData.description}
                    onChange={(e) => updateCar({ description: e.target.value })}
                    fullWidth
                    rows={4}
                  />
                </div>
              )}

              {/* Step 3: Pricing & Images */}
              {currentStep === 3 && (
                <div className="space-y-4">
                  <Heading3>Pricing & Photos</Heading3>
                  <Body muted>Set your asking price and add clear photos.</Body>

                  <div className="bg-white p-8 rounded-lg border border-gray-100 shadow-sm space-y-8">
                    <div className="space-y-6">
                      <div className="flex items-center justify-between">
                        <div className="space-y-1">
                          <label className="text-sm font-bold text-gray-800 uppercase tracking-wider">
                            Asking Price
                          </label>
                          <p className="text-xs text-gray-400">
                            Set a competitive price to sell faster
                          </p>
                        </div>
                        <div className="relative">
                          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold">
                            SZL
                          </span>
                          <input
                            type="number"
                            value={carData.price}
                            onChange={(e) =>
                              updateCar({ price: e.target.value })
                            }
                            className="pl-12 pr-4 py-3 bg-gray-50 border-none rounded-lg text-xl font-bold text-primary w-48 focus:ring-2 focus:ring-primary/20 transition-all"
                            placeholder="0"
                          />
                        </div>
                      </div>

                      <div className="space-y-4">
                        <div className="flex justify-between text-xs font-bold text-gray-400 uppercase tracking-widest">
                          <span>E15,000</span>
                          <span>E5,000,000</span>
                        </div>
                        <input
                          type="range"
                          min="15000"
                          max="5000000"
                          step="5000"
                          value={carData.price || 15000}
                          onChange={(e) => updateCar({ price: e.target.value })}
                          className="w-full h-2 bg-gray-100 rounded-lg appearance-none cursor-pointer accent-primary"
                        />
                        <div className="flex justify-center">
                          <div className="bg-primary/5 text-primary px-4 py-2 rounded-full text-sm font-bold border border-primary/10">
                            {carData.price
                              ? `E ${parseInt(carData.price).toLocaleString()}`
                              : "Select Price"}
                          </div>
                        </div>
                      </div>
                    </div>

                    <Divider />

                    {/* Payment Terms Section */}
                    <div className="space-y-4">
                      <div className="space-y-1">
                        <label className="text-sm font-bold text-gray-800 uppercase tracking-wider">
                          Payment Options
                        </label>
                        <p className="text-xs text-gray-400">
                          Do you accept a deposit and installments, or only full
                          upfront payment?
                        </p>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <button
                          onClick={() =>
                            updateCar({ acceptsInstallments: false })
                          }
                          className={twMerge(
                            "relative flex flex-col items-start p-5 rounded-lg border-2 text-left transition-all",
                            !carData.acceptsInstallments
                              ? "border-primary bg-primary/5"
                              : "border-gray-100 hover:border-gray-200 bg-white",
                          )}
                        >
                          <div
                            className={twMerge(
                              "p-3 rounded-lg mb-3",
                              !carData.acceptsInstallments
                                ? "bg-primary/10 text-primary"
                                : "bg-gray-50 text-gray-500",
                            )}
                          >
                            <FaMoneyBillWave size={20} />
                          </div>
                          <h4
                            className={twMerge(
                              "font-bold mb-1",
                              !carData.acceptsInstallments
                                ? "text-primary"
                                : "text-gray-800",
                            )}
                          >
                            Full Amount Only
                          </h4>
                          <p className="text-xs text-gray-500 line-clamp-2">
                            Buyer must pay the full asking price upfront before
                            handover.
                          </p>

                          {!carData.acceptsInstallments && (
                            <div className="absolute top-3 right-3 text-primary">
                              <FaCheckCircle size={18} />
                            </div>
                          )}
                        </button>

                        <button
                          onClick={() =>
                            updateCar({ acceptsInstallments: true })
                          }
                          className={twMerge(
                            "relative flex flex-col items-start p-5 rounded-lg border-2 text-left transition-all",
                            carData.acceptsInstallments
                              ? "border-primary bg-primary/5"
                              : "border-gray-100 hover:border-gray-200 bg-white",
                          )}
                        >
                          <div
                            className={twMerge(
                              "p-3 rounded-lg mb-3",
                              carData.acceptsInstallments
                                ? "bg-primary/10 text-primary"
                                : "bg-gray-50 text-gray-500",
                            )}
                          >
                            <FaHandshake size={20} />
                          </div>
                          <h4
                            className={twMerge(
                              "font-bold mb-1",
                              carData.acceptsInstallments
                                ? "text-primary"
                                : "text-gray-800",
                            )}
                          >
                            Accept Installments
                          </h4>
                          <p className="text-xs text-gray-500 line-clamp-2">
                            Buyer pays an upfront deposit and settles the rest
                            over time.
                          </p>

                          {carData.acceptsInstallments && (
                            <div className="absolute top-3 right-3 text-primary">
                              <FaCheckCircle size={18} />
                            </div>
                          )}
                        </button>
                      </div>

                      {/* Expandable Installment Details */}
                      {carData.acceptsInstallments && (
                        <div className="mt-4 p-5 rounded-lg border border-primary/20 bg-primary/5 space-y-6 animate-in fade-in slide-in-from-top-2">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                              <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">
                                Minimum Deposit (SZL)
                              </label>
                              <div className="relative">
                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold">
                                  E
                                </span>
                                <input
                                  type="number"
                                  value={carData.depositAmount}
                                  onChange={(e) =>
                                    updateCar({ depositAmount: e.target.value })
                                  }
                                  className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-lg focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                                  placeholder="e.g. 30000"
                                />
                              </div>
                            </div>

                            <div className="space-y-2">
                              <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">
                                Max Installment Duration
                              </label>
                              <div className="relative">
                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                                  <FaCalendarAlt />
                                </span>
                                <select
                                  value={carData.installmentMonths}
                                  onChange={(e) =>
                                    updateCar({
                                      installmentMonths: e.target.value,
                                    })
                                  }
                                  className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-lg focus:border-primary focus:ring-1 focus:ring-primary transition-all appearance-none"
                                >
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
                      <ToggleSwitch
                        label="Price is negotiable"
                        checked={carData.negotiable}
                        onChange={(e) =>
                          updateCar({ negotiable: e.target.checked })
                        }
                      />
                    </FormGroup>
                  </div>
                  <Divider />
                  <ImageUpload
                    label="Upload Media (Photos & Videos)"
                    onImagesChange={(files) => updateCar({ images: files })}
                    maxCount={20}
                    preview
                    error={errors.images}
                  />
                  <Small muted>
                    Recommended: 5-10 photos/videos showing different angles.
                    The first item is your Cover Photo.
                  </Small>
                </div>
              )}

              {/* Step 4: Review */}
              {currentStep === 4 && (
                <div className="space-y-6">
                  <div className="space-y-1">
                    <Heading3>Review Listing</Heading3>
                    <Body muted>
                      Check your details before proceeding to the final step.
                    </Body>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Card padding="md" className="bg-white border-gray-100">
                      <div className="flex justify-between items-start mb-2">
                        <Badge variant="primary">
                          Vehicle
                        </Badge>
                        <button
                          onClick={() => setCurrentStep(1)}
                          className="text-gray-400 hover:text-primary transition-colors"
                        >
                          <FaEdit size={14} />
                        </button>
                      </div>
                      <Heading4 className="mb-0">
                        {carData.make} {carData.model}
                      </Heading4>
                      <Body size="sm" muted>
                        {carData.year} • {carData.mileage} km •{" "}
                        {carData.regNumber}
                      </Body>
                    </Card>

                    <Card padding="md" className="bg-white border-gray-100">
                      <div className="flex justify-between items-start mb-2">
                        <Badge variant="success">
                          Price
                        </Badge>
                        <button
                          onClick={() => setCurrentStep(3)}
                          className="text-gray-400 hover:text-primary transition-colors"
                        >
                          <FaEdit size={14} />
                        </button>
                      </div>
                      <Heading4 className="mb-0 text-primary">
                        SZL {parseInt(carData.price || "0").toLocaleString()}
                      </Heading4>
                      <Body size="sm" muted>
                        {carData.negotiable ? "Negotiable" : "Fixed Price"}
                      </Body>
                    </Card>
                    <Card padding="md" className="bg-white border-gray-100">
                      <div className="flex justify-between items-start mb-2">
                        <Badge variant="primary">
                          Specs
                        </Badge>
                        <button
                          onClick={() => setCurrentStep(2)}
                          className="text-gray-400 hover:text-primary transition-colors"
                        >
                          <FaEdit size={14} />
                        </button>
                      </div>
                      <Body size="sm" className="font-bold">
                        {carData.bodyType} • {carData.transmission}
                      </Body>
                      <Body size="sm" muted>
                        {carData.fuelType} • {carData.engineSize}L
                      </Body>
                    </Card>
                    <Card padding="md" className="bg-white border-gray-100">
                      <div className="flex justify-between items-start mb-2">
                        <Badge variant="secondary">
                          Photos
                        </Badge>
                        <button
                          onClick={() => setCurrentStep(3)}
                          className="text-gray-400 hover:text-primary transition-colors"
                        >
                          <FaEdit size={14} />
                        </button>
                      </div>
                      <Body size="sm" className="font-bold">
                        {carData.images.length} photos
                      </Body>
                      <Body size="sm" muted>
                        First photo is cover
                      </Body>
                    </Card>
                  </div>
                </div>
              )}

              {/* Step 5: Account + billing gate */}
              {currentStep === 5 && (
                <div className="space-y-6">
                  <div className="space-y-1">
                    <Heading3>Account & payment</Heading3>
                    <Body muted>
                      {isLoggedIn
                        ? "Confirm your account. New users get 1 free trial listing; next vehicles require payment."
                        : "Create your account to publish this listing."}
                    </Body>
                  </div>

                  {isLoggedIn ? (
                    <>
                      <div className="bg-primary/5 border border-primary/20 p-6 rounded-lg">
                        <Body className="font-bold">
                          Logged in as: {userName || "Khazu user"}
                        </Body>
                        <Body size="sm" muted>
                          Your listing will be posted under this account.
                        </Body>
                      </div>
                      <ListingPaymentGate
                        entitlement={entitlement}
                        onEntitlementRefresh={refreshEntitlement}
                      />
                    </>
                  ) : (
                    <div className="bg-white p-8 rounded-lg border border-gray-100 shadow-sm space-y-6">
                      <div className="flex flex-col space-y-4">
                        <label className="text-sm font-bold text-gray-800 uppercase tracking-wider block px-1">
                          Signup as
                        </label>
                        <div className="flex p-1 bg-gray-100 rounded-lg w-full max-w-sm">
                          <button
                            type="button"
                            onClick={() => updateAuth({ role: "personal" })}
                            className={twMerge(
                              "flex-1 py-3 px-4 rounded-lg text-sm font-bold transition-all",
                              authData.role === "personal"
                                ? "bg-white text-primary shadow-sm"
                                : "text-gray-500 hover:text-gray-700",
                            )}
                          >
                            Personal
                          </button>
                          <button
                            type="button"
                            onClick={() => updateAuth({ role: "dealer" })}
                            className={twMerge(
                              "flex-1 py-3 px-4 rounded-lg text-sm font-bold transition-all",
                              authData.role === "dealer"
                                ? "bg-white text-primary shadow-sm"
                                : "text-gray-500 hover:text-gray-700",
                            )}
                          >
                            Dealership
                          </button>
                        </div>
                      </div>

                      {authData.role === "dealer" && (
                        <InputText
                          label="Dealer / Business Name"
                          placeholder="e.g. Mbabane Motors"
                          value={authData.dealerName}
                          onChange={(e) =>
                            updateAuth({ dealerName: e.target.value })
                          }
                          error={errors.dealerName}
                          fullWidth
                        />
                      )}

                      <FormGroup direction="horizontal" spacing="md">
                        <InputText
                          label="First name"
                          placeholder="e.g. Sipho"
                          value={authData.firstName}
                          onChange={(e) =>
                            updateAuth({ firstName: e.target.value })
                          }
                          error={errors.firstName}
                          fullWidth
                        />
                        <InputText
                          label="Last name"
                          placeholder="e.g. Dlamini"
                          value={authData.lastName}
                          onChange={(e) =>
                            updateAuth({ lastName: e.target.value })
                          }
                          error={errors.lastName}
                          fullWidth
                        />
                      </FormGroup>

                      <InputText
                        label="Email address"
                        type="email"
                        placeholder="e.g. sipho@email.com"
                        value={authData.email}
                        onChange={(e) => updateAuth({ email: e.target.value })}
                        error={errors.email}
                        fullWidth
                      />

                      <InputText
                        label="Phone number"
                        placeholder="+268 7654 3210"
                        value={authData.phone}
                        onChange={(e) => updateAuth({ phone: e.target.value })}
                        error={errors.phone}
                        fullWidth
                      />

                      <FormGroup direction="horizontal" spacing="md">
                        <InputPassword
                          label="Password"
                          value={authData.password}
                          onChange={(e) =>
                            updateAuth({ password: e.target.value })
                          }
                          error={errors.password}
                          fullWidth
                        />
                        <InputPassword
                          label="Confirm password"
                          value={authData.confirmPassword}
                          onChange={(e) =>
                            updateAuth({ confirmPassword: e.target.value })
                          }
                          error={errors.confirmPassword}
                          fullWidth
                        />
                      </FormGroup>

                      <Body size="sm" className="text-center mt-4">
                        Already have an account?{" "}
                        <button
                          type="button"
                          onClick={() => router.push("/login")}
                          className="text-primary font-bold hover:underline"
                        >
                          Sign In here
                        </button>
                      </Body>
                    </div>
                  )}

                  <div className="mt-6">
                    <Checkbox
                      label="I agree to Khazu's Terms of Service and Privacy Policy."
                      checked={authData.termsAccepted}
                      onChange={(e) =>
                        updateAuth({ termsAccepted: e.target.checked })
                      }
                      error={errors.termsAccepted}
                    />
                  </div>
                </div>
              )}
            </div>

            <div className="px-3 sm:px-4 pb-4 sm:pb-0">
              <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-between gap-3 w-full">
                <Button
                  variant="outline"
                  size="md"
                  onClick={handlePrev}
                  disabled={currentStep === 1}
                  className="w-full sm:w-auto"
                >
                  <FaArrowLeft className="mr-2" /> Back
                </Button>
                <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
                  <Small muted className="text-gray-400 shrink-0">
                    Step {currentStep} of 5
                  </Small>
                  {currentStep === 5 ? (
                    <Button
                      variant="primary"
                      size="md"
                      onClick={handleSubmit}
                      className="flex-1 sm:flex-none"
                      disabled={
                        !authData.termsAccepted ||
                        isSubmitting ||
                        (isLoggedIn && entitlement?.requiresPayment === true)
                      }
                      loading={isSubmitting}
                    >
                      {isSubmitting ? (
                        <FaSpinner className="animate-spin mr-2" />
                      ) : null}
                      {isSubmitting
                        ? "Posting..."
                        : isLoggedIn && entitlement?.requiresPayment
                          ? "Pay to post"
                          : "Post Listing"}
                    </Button>
                  ) : (
                    <Button
                      variant="primary"
                      size="md"
                      onClick={handleNext}
                      className="flex-1 sm:flex-none"
                    >
                      Next <FaArrowRight className="ml-2" />
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
