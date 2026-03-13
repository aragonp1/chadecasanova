
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

export interface Photo {
  id: string;
  url?: string; // Mantido para compatibilidade com fotos antigas
  urls?: string[]; // Novo campo para carrossel
  caption: string;
  authorName: string;
  authorUid: string;
  authorPhotoUrl?: string | null;
  timestamp: any;
  reactions?: { [key: string]: number };
}

export interface Reaction {
  type: string;
  userId: string;
}
