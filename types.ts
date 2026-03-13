
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
  url: string;
  caption: string;
  authorName: string;
  authorUid: string;
  timestamp: any;
  reactions?: { [key: string]: number };
}

export interface Reaction {
  type: string;
  userId: string;
}
