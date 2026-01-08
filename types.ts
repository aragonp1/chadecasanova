
export interface RSVPFormData {
  name: string;
  guests: number;
  message?: string;
}

export interface GiftItem {
  id: string;
  name: string;
  priceRange: string;
  category: string;
  imageUrl: string;
  reserved: boolean;
}
