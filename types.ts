
export interface RSVPFormData {
  name: string;
  companionsCount: number;
  companionNames: string;
  dietary: string;
  dietaryCustom?: string;
  message?: string;
}

export interface RSVPConfirmation extends RSVPFormData {
  id: string;
  timestamp: string;
}

export interface GiftItem {
  id: string;
  name: string;
  priceRange: string;
  category: string;
  imageUrl: string;
  reserved: boolean;
}
