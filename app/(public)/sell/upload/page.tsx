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

const SELL_UPLOAD_DRAFT_KEY = "khazu:sellUploadDraft";
const DRAFT_TTL_MS = 24 * 60 * 60 * 1000;

type SellUploadDraft = {
  carData: Omit<CarData, "images"> & { images: string[] };
  expiresAt: number;
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
  // Set only when resuming after a dealer-signup hand-off — images were
  // already uploaded to Storage before the redirect, so we skip re-upload.
  const [uploadedImageUrls, setUploadedImageUrls] = useState<string[]>([]);
  const [toast, setToast] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  useEffect(() => {
    // Check Supabase session
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
        } else {
          setIsLoggedIn(false);
        }
      } catch {
        setIsLoggedIn(false);
      }
    })();
  }, []);

  // Resume after a signup/verification hand-off (dealer registration or
  // email verification redirected back here with ?resume=1).
  useEffect(() => {
    if (searchParams.get("resume") !== "1") return;

    (async () => {
      try {
        const raw = localStorage.getItem(SELL_UPLOAD_DRAFT_KEY);
        if (!raw) return;
        const draft: SellUploadDraft = JSON.parse(raw);
        if (!draft.expiresAt || draft.expiresAt < Date.now()) {
          localStorage.removeItem(SELL_UPLOAD_DRAFT_KEY);
          return;
        }

        const { createClient } = await import("@/lib/supabase/client");
        const supabase = createClient();
        const {
          data: { user },
        } = await supabase.auth.getUser();
        if (!user) return; // not logged in yet — leave draft in place, try again later

        const { images: draftImageUrls, ...restCarData } = draft.carData;
        setCarData((prev) => ({ ...prev, ...restCarData }));
        setUploadedImageUrls(draftImageUrls);
        setCurrentStep(5);
        localStorage.removeItem(SELL_UPLOAD_DRAFT_KEY);
      } catch {
        localStorage.removeItem(SELL_UPLOAD_DRAFT_KEY);
      }
    })();
  }, [searchParams]);

  const updateCar = (updates: Partial<CarData>) => {
    setCarData((prev) => ({ ...prev, ...updates }));
    // New photos were picked — the previously-uploaded draft URLs no longer
    // reflect what the user wants listed.
    if (updates.images) setUploadedImageUrls([]);
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

  const uploadCarImages = async (files: File[]): Promise<string[]> => {
    const urls: string[] = [];
    for (const file of files) {
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const contentType = res.headers.get("content-type");
      if (contentType && contentType.includes("application/json")) {
        const data = await res.json();
        if (data.url) urls.push(data.url);
      } else {
        throw new Error("Image upload failed due to server error.");
      }
    }
    return urls;
  };

  const saveDraftAndRedirect = async (destination: string) => {
    const imageUrls =
      uploadedImageUrls.length > 0
        ? uploadedImageUrls
        : await uploadCarImages(carData.images);
    const draft: SellUploadDraft = {
      carData: { ...carData, images: imageUrls },
      expiresAt: Date.now() + DRAFT_TTL_MS,
    };
    localStorage.setItem(SELL_UPLOAD_DRAFT_KEY, JSON.stringify(draft));
    router.push(destination);
  };

  const handleSubmit = async () => {
    if (!validateStep(5)) return;

    setIsSubmitting(true);
    try {
      if (!isLoggedIn) {
        const resumeNext = encodeURIComponent("/sell/upload?resume=1");

        if (authData.role === "dealer") {
          // Dealer signup collects far more than Step 5 asks for (business
          // registration, address, documents, etc.) — hand off to the real
          // dealer registration flow instead of faking it here.
          await saveDraftAndRedirect(
            `/auth/register?accountType=dealer&next=${resumeNext}`,
          );
          return;
        }

        // Personal seller — Step 5 already collects everything registerUser()
        // needs, so create the account inline.
        const { registerUser } = await import("@/lib/auth/actions");
        const fd = new FormData();
        fd.set(
          "full_name",
          `${authData.firstName} ${authData.lastName}`.trim(),
        );
        fd.set("email", authData.email);
        fd.set("phone", authData.phone);
        fd.set("password", authData.password);
        fd.set("account_type", "individual");

        const regResult = await registerUser(fd);
        if (!regResult.success) {
          throw new Error(regResult.error || "Could not create your account.");
        }

        if (regResult.needsVerification) {
          // Account needs an EmailJS code before it's usable — save
          // progress and send them to verify.
          await saveDraftAndRedirect(
            `/auth/verify?email=${encodeURIComponent(authData.email)}&next=${resumeNext}`,
          );
          return;
        }

        // Verification is bypassed (SKIP_EMAIL_VERIFICATION=true, dev only)
        // — the account is already usable, so fall through and post the
        // listing in this same submit instead of redirecting to verify.
      }

      // 2. Upload images to Supabase Storage (already uploaded if resuming
      // after a signup hand-off).
      const uploadedUrls =
        uploadedImageUrls.length > 0
          ? uploadedImageUrls
          : await uploadCarImages(carData.images);

      // 3. Create listing
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

  const percentComplete = Math.round((currentStep / stepLabels.length) * 100);

  return (
    // No overflow-x-hidden here: it forces an implicit overflow-y: auto
    // (per spec, when one axis is non-visible the other computes to auto),
    // which turns this div into an intermediate scroll container and
    // breaks position:sticky for the header below - it would stick to
    // this div's own (never-scrolling) box instead of the real page
    // scroll. The global <html> rule already prevents horizontal scroll.
    <div className="min-h-dvh w-full bg-surface-alt">
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

      {/* Sticky header + progress - stays visible while scrolling instead of
          disappearing above the fold like the old inline header did. */}
      <div className="sticky top-0 z-40 w-full bg-white border-b border-line safe-area-pt">
        <div className="mx-auto flex max-w-4xl items-center justify-between gap-3 px-4 py-2.5 sm:py-3">
          <Logo />
          <Button size="sm" variant="outline" onClick={() => router.push("/login")}>
            Login
          </Button>
        </div>
        <div className="mx-auto max-w-4xl px-4 pb-3">
          <div className="mb-1.5 flex items-center justify-between gap-2">
            <span className="truncate text-xs font-semibold text-ink">
              {stepLabels[currentStep - 1]}
            </span>
            <span className="shrink-0 text-xs font-semibold text-primary">
              Step {currentStep} of {stepLabels.length} &middot; {percentComplete}%
            </span>
          </div>
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-surface-sunken">
            <div
              className="h-full rounded-full bg-primary transition-all duration-300 ease-out"
              style={{ width: `${percentComplete}%` }}
            />
          </div>
        </div>
      </div>

      <div className="mx-auto w-full max-w-4xl bg-white">
        <div className="px-4 pt-5 sm:pt-6">
          <p className="font-display text-lg sm:text-2xl md:text-4xl font-extrabold text-black">
            Follow these steps to get your car in front of thousands of
            buyers.
          </p>
        </div>

        {/* Main Card */}
        <div className="w-full">
          <div className="px-4 pb-6 pt-5 sm:pt-6 lg:pb-12">
            {/* Step 1: Vehicle Details */}
              {currentStep === 1 && (
                <div className="space-y-6">
                  <div className="px-4">
                    <Heading3>Vehicle Details</Heading3>
                    <Body muted>
                      Start with your registration and basic model info.
                    </Body>
                  </div>

                  <div className="bg-white p-4 sm:p-6 lg:p-8">
                    <div className="flex flex-col lg:items-center mb-8">
                      <label className="text-md font-semibold  text-gray-600 mb-4 block">
                        Enter Registration
                      </label>
                      <div className="relative group w-full max-w-[500px]">
                        <div className="w-full relative h-[80px] sm:h-[100px] md:h-[130px] flex items-center justify-center rounded-lg shadow-[0_20px_50px_rgba(0,0,0,0.15)] border-[4px] sm:border-[6px] border-black overflow-hidden transition-transform group-hover:scale-[1.02] duration-500">
                          <Image
                            src="/plate-bg.svg"
                            alt="Plate Background"
                            fill
                            className="object-cover"
                          />
                          <input
                            className="font-mono max-h-[430px] bg-transparent w-full h-full px-3 sm:px-5 md:px-8 text-center font-black text-[37px] sm:text-[56px] focus:outline-none transition-all uppercase placeholder:text-black/20 text-black drop-shadow-sm"
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
                          size="lg"
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
                          size="lg"
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
                        size="lg"
                        label="Year"
                        placeholder="2024"
                        value={carData.year}
                        onChange={(e) => updateCar({ year: e.target.value })}
                        type="number"
                        error={errors.year}
                        fullWidth
                      />
                      <InputText
                        size="lg"
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
                  <div className="bg-[#1a1a1a] p-4 sm:p-6 rounded-lg">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                      <div className="space-y-2">
                        <p className="text-white uppercase tracking-wider px-1 flex gap-2">
                          <PiEngineFill className="text-2xl text-white" />{" "}
                          Engine
                        </p>
                        <InputText
                          size="lg"
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
                          size="lg"
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
                          size="lg"
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
                          size="lg"
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
                    size="lg"
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

                  <div className="bg-white p-4 sm:p-6 lg:p-8 rounded-lg border border-gray-100 shadow-sm space-y-6 sm:space-y-8">
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
                        {Math.max(carData.images.length, uploadedImageUrls.length)} photos
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
                        ? "Confirm your account to publish this listing."
                        : "Create your account to publish this listing."}
                    </Body>
                  </div>

                  {isLoggedIn ? (
                    <div className="bg-primary/5 border border-primary/20 p-6 rounded-lg">
                      <Body className="font-bold">
                        Logged in as: {userName || "Khazu user"}
                      </Body>
                      <Body size="sm" muted>
                        Your listing will be posted under this account.
                      </Body>
                    </div>
                  ) : (
                    <div className="bg-white p-4 sm:p-6 lg:p-8 rounded-lg border border-gray-100 shadow-sm space-y-6">
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
                          size="lg"
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
                          size="lg"
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
                          size="lg"
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
                        size="lg"
                        label="Email address"
                        type="email"
                        placeholder="e.g. sipho@email.com"
                        value={authData.email}
                        onChange={(e) => updateAuth({ email: e.target.value })}
                        error={errors.email}
                        fullWidth
                      />

                      <InputText
                        size="lg"
                        label="Phone number"
                        placeholder="+268 7654 3210"
                        value={authData.phone}
                        onChange={(e) => updateAuth({ phone: e.target.value })}
                        error={errors.phone}
                        fullWidth
                      />

                      <FormGroup direction="horizontal" spacing="md">
                        <InputPassword
                          size="lg"
                          label="Password"
                          value={authData.password}
                          onChange={(e) =>
                            updateAuth({ password: e.target.value })
                          }
                          error={errors.password}
                          fullWidth
                        />
                        <InputPassword
                          size="lg"
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

            <div className="px-3 sm:px-4 pb-4 sm:pb-6">
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
                {currentStep === stepLabels.length ? (
                  <Button
                    variant="primary"
                    size="md"
                    onClick={handleSubmit}
                    className="w-full sm:w-auto"
                    disabled={!authData.termsAccepted || isSubmitting}
                    loading={isSubmitting}
                  >
                    {isSubmitting ? (
                      <FaSpinner className="animate-spin mr-2" />
                    ) : null}
                    {isSubmitting ? "Posting..." : "Post Listing"}
                  </Button>
                ) : (
                  <Button
                    variant="primary"
                    size="md"
                    onClick={handleNext}
                    className="w-full sm:w-auto"
                  >
                    Next <FaArrowRight className="ml-2" />
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
  );
}
