export interface User {
  uid: string;
  email: string;
  displayName: string;
  photoURL?: string;
}

export interface Image {
  id: string;
  userId: string;
  userDisplayName: string; // Denormalized for simpler UI
  userPhotoURL?: string;
  imageUrl: string;
  prompt: string;
  style: string[]; // e.g., "Cyberpunk", "Realistic"
  engine: string; // e.g., "Midjourney v6"
  category: string[]; // e.g., "Sci-Fi", "Portrait"
  uploadedAt: number;
  likes: number;
  likedBy: string[]; // Array of user IDs who liked the image
}

export interface PromptTemplate {
  id: string;
  name: string;
  template: string;
  category: string;
}

export interface FilterState {
  style: string;
  engine: string;
  category: string;
}
