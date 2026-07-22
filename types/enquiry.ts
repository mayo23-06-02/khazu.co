export interface Enquiry {
  id: string;
  listing_id: string;
  seller_id: string;
  name: string;
  phone: string;
  message: string;
  created_at: string;
}

export type EnquiryListing = {
  make: string;
  model: string;
  year: number;
  price: number;
  images: string[] | null;
};

export type EnquiryWithListing = Enquiry & {
  listings: EnquiryListing | null;
};
