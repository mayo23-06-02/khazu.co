export interface ApifyListing {
  url: string;
  vehicle_data: {
    header: {
      listingId: number;
      registrationYearMakeModel: string;
      variant: string;
      listingPrice: string;
      previousListingPrice?: string;
      priceDropPercent?: number;
    };
    priceInformation: {
      indicators: { marketPriceData: { description: string } };
      repaymentPrice: {
        estimatedRepayment: string;
        deposit: string;
        term: number;
        rate: number;
      };
    };
    summaryIcons: Array<{ text: string }>;
    additionalInformation: Array<{ text: string } | null>;
    listingSpecifications: {
      specificationCategories: Array<{ categoryItems: Array<{ value: string } | null> } | null>;
    };
    description: string;
    listingDealer: {
      name: string;
      rating: { score: number; ratingCount: number };
    };
    listingSellerInformation: { sellerSuburbName: string };
    gallery: { galleryImages: Array<{ imageUrl: string }> };
  };
}

export const sampleApifyListings: ApifyListing[] = [
  {
    url: "https://www.autotrader.co.za/car-for-sale/foton/tunland-g7/2.0/28508721",
    vehicle_data: {
      header: {
        listingId: 28508721,
        registrationYearMakeModel: "2025 Foton Tunland G7",
        variant: "2.0TD Single Cab 4x4",
        listingPrice: "R 399 900",
      },
      priceInformation: {
        indicators: { marketPriceData: { description: "R 197 below market average" } },
        repaymentPrice: {
          estimatedRepayment: "R 6 806",
          deposit: "R 35 000",
          term: 72,
          rate: 10.25,
        },
      },
      summaryIcons: [
        { text: "Used" },
        { text: "2025" },
        { text: "15 000 km" },
        { text: "Manual" },
        { text: "Diesel" },
      ],
      additionalInformation: [
        { text: "1" },
        { text: "Full Franchise Service History" },
        { text: "silver" },
        { text: "Single cab" },
      ],
      listingSpecifications: {
        specificationCategories: [
          {
            categoryItems: [
              { value: "3" },
              { value: "100 000 km" },
              { value: "15 000 km" },
            ],
          },
        ],
      },
      description: "Take on any job or adventure with confidence in this 2025 Foton Tunland G7 2.0TD Single Cab 4x4. With just 4,500 km, this bakkie is virtually brand new — built for reliability, power, and durability with modern tech and rugged good looks.",
      listingDealer: {
        name: "Group 1 Chery George",
        rating: { score: 4.3, ratingCount: 51 },
      },
      listingSellerInformation: {
        sellerSuburbName: "Dormehls Drift",
      },
      gallery: {
        galleryImages: [{ imageUrl: "https://img.autotrader.co.za/45176221/Crop1280x960" }],
      },
    },
  },
  {
    url: "https://www.autotrader.co.za/car-for-sale/volkswagen/caddy/2.0tdi/28546825",
    vehicle_data: {
      header: {
        listingId: 28546825,
        registrationYearMakeModel: "2026 Volkswagen Caddy",
        variant: "Maxi Cargo 2.0TDi Panel Van",
        listingPrice: "R 569 950",
      },
      priceInformation: {
        indicators: { marketPriceData: { description: " none market average" } },
        repaymentPrice: {
          estimatedRepayment: "R 9 978",
          deposit: "R 35 000",
          term: 72,
          rate: 10.25,
        },
      },
      summaryIcons: [
        { text: "Used" },
        { text: "2026" },
        { text: "12 000 km" },
        { text: "Manual" },
        { text: "Diesel" },
      ],
      additionalInformation: [
        { text: "1" },
        { text: "Full Franchise Service History" },
        { text: "Candy White" },
        { text: "Panel van" },
      ],
      listingSpecifications: {
        specificationCategories: [
          {
            categoryItems: [
              { value: "2" },
              { value: "15 000 km" },
            ],
          },
        ],
      },
      description: "Your Dream Car Awaits! Trusted, reliable, and multiple award-winning dealer alert!",
      listingDealer: {
        name: "VW Bryanston",
        rating: { score: 3.6, ratingCount: 56 },
      },
      listingSellerInformation: {
        sellerSuburbName: "Bryanston",
      },
      gallery: {
        galleryImages: [{ imageUrl: "https://img.autotrader.co.za/47008113/Crop1280x960" }],
      },
    },
  },
  {
    url: "https://www.autotrader.co.za/car-for-sale/toyota/land-cruiser-76/2.8/28522869",
    vehicle_data: {
      header: {
        listingId: 28522869,
        registrationYearMakeModel: "2025 Toyota Land Cruiser 76",
        variant: "2.8GD-6 Station Wagon LX Manual",
        listingPrice: "R 1 069 900",
      },
      priceInformation: {
        indicators: { marketPriceData: { description: " none market average" } },
        repaymentPrice: {
          estimatedRepayment: "R 19 303",
          deposit: "R 35 000",
          term: 72,
          rate: 10.25,
        },
      },
      summaryIcons: [
        { text: "Used" },
        { text: "2025" },
        { text: "11 106 km" },
        { text: "Manual" },
        { text: "Diesel" },
      ],
      additionalInformation: [
        { text: "Unknown" },
        { text: "Full Service History" },
        { text: "Beige" },
        { text: "SUV" },
      ],
      listingSpecifications: {
        specificationCategories: [
          {
            categoryItems: [
              { value: "100 000 km" },
              { value: "10 000 km" },
              { value: "09/03/2026" },
            ],
          },
        ],
      },
      description: "Features: 4x4, ABS Brakes, Air Conditioning, Airbags, Alloy Wheels...",
      listingDealer: {
        name: "Gys Pitzer Motors Wonderboom",
        rating: { score: 4.2, ratingCount: 47 },
      },
      listingSellerInformation: {
        sellerSuburbName: "Wonderboom South",
      },
      gallery: {
        galleryImages: [{ imageUrl: "https://img.autotrader.co.za/46621805/Crop1280x960" }],
      },
    },
  },
  {
    url: "https://www.autotrader.co.za/car-for-sale/nissan/navara/2.5/28527179",
    vehicle_data: {
      header: {
        listingId: 28527179,
        registrationYearMakeModel: "2026 Nissan Navara",
        variant: "2.5DDTi Single Cab XE",
        listingPrice: "R 399 900",
      },
      priceInformation: {
        indicators: { marketPriceData: { description: "R 9 094 above market average" } },
        repaymentPrice: {
          estimatedRepayment: "R 6 806",
          deposit: "R 35 000",
          term: 72,
          rate: 10.25,
        },
      },
      summaryIcons: [
        { text: "Used" },
        { text: "2026" },
        { text: "10 500 km" },
        { text: "Manual" },
        { text: "Diesel" },
      ],
      additionalInformation: [
        { text: "Unknown" },
        { text: "Full Franchise Service History" },
        { text: "White" },
        { text: "Single cab" },
      ],
      listingSpecifications: {
        specificationCategories: [
          {
            categoryItems: [
              { value: "6" },
              { value: "150 000 km" },
              { value: "15 000 km" },
            ],
          },
        ],
      },
      description: "This 2026 Nissan Navara 2.5DDTi Single Cab XE blends hardworking diesel performance...",
      listingDealer: {
        name: "Edenvale Nissan",
        rating: { score: 4.6, ratingCount: 89 },
      },
      listingSellerInformation: {
        sellerSuburbName: "Edenvale Central",
      },
      gallery: {
        galleryImages: [{ imageUrl: "https://img.autotrader.co.za/46695995/Crop1280x960" }],
      },
    },
  },
];
