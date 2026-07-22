import {
  ToyotaIcon, VolkswagenIcon, FordIcon, NissanIcon, HondaIcon,
  MBIcon, BMWIcon, AudiIcon, HyundaiIcon, KiaIcon, MazdaIcon,
  LexusIcon, LandroverIcon, JeepIcon, TeslaIcon, PorscheIcon,
  MitsubishiIcon, SubaruIcon, ChevroletIcon, VolvoIcon,
  JaguarIcon, FiatIcon, DodgeIcon, AlfaRomeoIcon, BYDIcon,
  MiniIcon, FerrariIcon, LamborghiniIcon, MaseratiIcon,
  AstonMartinIcon, BentleyIcon,
} from "@cardog-icons/react";
import { FaGasPump, FaChargingStation, FaStar, FaThumbsUp, FaMeh, FaFrown } from "react-icons/fa";
import { TbManualGearbox, TbAutomaticGearbox, TbSettingsAutomation } from "react-icons/tb";
import { GiCarWheel } from "react-icons/gi";

export const CAR_MAKES = [
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

export const CAR_MODELS: Record<string, string[]> = {
  toyota: ["Corolla", "Corolla Cross", "Hilux", "Fortuner", "Starlet", "Vitz", "Urban Cruiser", "Land Cruiser"],
  volkswagen: ["Polo", "Polo Vivo", "Golf", "Tiguan", "T-Cross", "T-Roc", "Amarok", "Caddy"],
  ford: ["Ranger", "Everest", "EcoSport", "Mustang", "Puma"],
  bmw: ["1 Series", "2 Series", "3 Series", "4 Series", "5 Series", "X1", "X3", "X5", "X7", "M3", "M4"],
  "mercedes-benz": ["A-Class", "C-Class", "E-Class", "S-Class", "GLA", "GLC", "GLE", "GLS"],
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

export const BODY_TYPES = [
  { id: "hatchback", label: "Hatchback", image: "/car-type/hatchback.png" },
  { id: "sedan", label: "Saloon", image: "/car-type/saloon.png" },
  { id: "suv", label: "SUV", image: "/car-type/suv.png" },
  { id: "Van", label: "Van", image: "/car-type/pick-up.png" },
  { id: "coupe", label: "Coupe", image: "/car-type/coupe.png" },
  { id: "convertible", label: "Convertible", image: "/car-type/convertible.png" },
  { id: "estate", label: "Estate", image: "/car-type/estate.png" },
  { id: "people-carrier", label: "People Carrier", image: "/car-type/people-carrier.png" },
];

export const FUEL_TYPES = [
  { id: "petrol", label: "Petrol", icon: FaGasPump },
  { id: "diesel", label: "Diesel", icon: FaGasPump },
  { id: "electric", label: "Electric", icon: FaChargingStation },
  { id: "hybrid", label: "Hybrid", icon: FaChargingStation },
];

export const TRANSMISSION_TYPES = [
  { id: "manual", label: "Manual", icon: TbManualGearbox },
  { id: "automatic", label: "Automatic", icon: TbAutomaticGearbox },
  { id: "cvt", label: "CVT", icon: TbSettingsAutomation },
];

export const DRIVE_TYPES = [
  { id: "fwd", label: "FWD", icon: GiCarWheel },
  { id: "rwd", label: "RWD", icon: GiCarWheel },
  { id: "awd", label: "AWD", icon: GiCarWheel },
  { id: "4wd", label: "4WD", icon: GiCarWheel },
];

export const CONDITION_TYPES = [
  { id: "excellent", label: "Excellent", icon: FaStar },
  { id: "good", label: "Good", icon: FaThumbsUp },
  { id: "fair", label: "Fair", icon: FaMeh },
  { id: "poor", label: "Poor", icon: FaFrown },
];
