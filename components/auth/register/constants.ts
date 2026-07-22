export const CITIES = [
  "Mbabane",
  "Manzini",
  "Siteki",
  "Nhlangano",
  "Piggs Peak",
  "Lobamba",
  "Ezulwini",
  "Matsapha",
  "Big Bend",
  "Other",
];

export const CITY_OPTIONS = [
  { value: "", label: "Select city" },
  ...CITIES.map((c) => ({ value: c, label: c })),
];
