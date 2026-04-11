import { Image, PromptTemplate, User } from '../types';

// --- Mock Data ---

const MOCK_USERS: User[] = [
  {
    uid: 'user-1',
    email: 'creator@neonlens.ai',
    displayName: 'NeoArchitect',
    photoURL: 'https://picsum.photos/seed/user1/100/100',
  },
  {
    uid: 'user-2',
    email: 'dreamer@neonlens.ai',
    displayName: 'LucidDreamer',
    photoURL: 'https://picsum.photos/seed/user2/100/100',
  }
];

const MOCK_IMAGES: Image[] = [
  {
    id: 'img-1',
    userId: 'user-1',
    userDisplayName: 'NeoArchitect',
    userPhotoURL: 'https://picsum.photos/seed/user1/100/100',
    imageUrl: 'https://picsum.photos/seed/neon1/800/800',
    prompt: 'A cyberpunk street food vendor in Tokyo, raining night, neon lights reflecting on wet pavement, high detail, volumetric lighting, 8k.',
    style: ['Cyberpunk', 'Cinematic'],
    engine: 'Midjourney',
    category: ['Sci-Fi', 'Urban'],
    uploadedAt: Date.now() - 10000000,
    likes: 42,
    likedBy: ['user-2'],
  },
  {
    id: 'img-2',
    userId: 'user-2',
    userDisplayName: 'LucidDreamer',
    userPhotoURL: 'https://picsum.photos/seed/user2/100/100',
    imageUrl: 'https://picsum.photos/seed/fantasy1/800/600',
    prompt: 'Ethereal forest spirit, glowing antlers, bioluminescent flora, soft mist, watercolor style, pastel colors, dreamy atmosphere.',
    style: ['Fantasy', 'Watercolor'],
    engine: 'DALL-E 3',
    category: ['Nature', 'Character'],
    uploadedAt: Date.now() - 5000000,
    likes: 128,
    likedBy: ['user-1'],
  },
  {
    id: 'img-3',
    userId: 'user-1',
    userDisplayName: 'NeoArchitect',
    userPhotoURL: 'https://picsum.photos/seed/user1/100/100',
    imageUrl: 'https://picsum.photos/seed/robot/800/1000',
    prompt: 'Rusty vintage robot sitting on a park bench reading a newspaper, sepia tone, melancholic, hyperrealistic texture.',
    style: ['Steampunk', 'Realistic'],
    engine: 'Stable Diffusion',
    category: ['Character', 'Retro'],
    uploadedAt: Date.now() - 2000000,
    likes: 55,
    likedBy: [],
  },
  {
    id: 'img-4',
    userId: 'user-2',
    userDisplayName: 'LucidDreamer',
    userPhotoURL: 'https://picsum.photos/seed/user2/100/100',
    imageUrl: 'https://picsum.photos/seed/space/900/600',
    prompt: 'A nebula in the shape of a giant eye, cosmic horror, deep purples and blacks, stars scattered, wide angle.',
    style: ['Surreal', 'Dark'],
    engine: 'Midjourney',
    category: ['Space', 'Abstract'],
    uploadedAt: Date.now() - 100000,
    likes: 12,
    likedBy: ['user-1'],
  },
];

const MOCK_TEMPLATES: PromptTemplate[] = [
  {
    id: 'tpl-1',
    name: 'Cyberpunk Portrait',
    category: 'Character',
    template: 'A close-up portrait of a {adjective} cyborg with {color} neon accents, intricate circuitry, dystopian city background, {lighting} lighting.',
  },
  {
    id: 'tpl-2',
    name: 'Fantasy Landscape',
    category: 'Environment',
    template: 'A {adjective} landscape featuring floating islands, {color} waterfalls, ancient ruins, {lighting} atmosphere, wide angle view.',
  },
  {
    id: 'tpl-3',
    name: 'Abstract Oil Painting',
    category: 'Abstract',
    template: 'An abstract oil painting representing {noun}, thick impasto strokes, chaotic composition, {color} and {color} color palette.',
  }
];

// --- Service Implementation ---

// Simulating local storage persistence for the session
let currentImages = [...MOCK_IMAGES];

export const MockService = {
  login: async (email: string): Promise<User> => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const user = MOCK_USERS.find((u) => u.email === email) || MOCK_USERS[0];
        // Ensure we "login" even if email doesn't match for demo purposes, defaulting to first user
        resolve(user);
      }, 800);
    });
  },

  logout: async (): Promise<void> => {
    return new Promise((resolve) => setTimeout(resolve, 500));
  },

  getImages: async (): Promise<Image[]> => {
    return new Promise((resolve) => {
      setTimeout(() => resolve([...currentImages]), 600);
    });
  },

  getUserImages: async (userId: string): Promise<Image[]> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(currentImages.filter((img) => img.userId === userId));
      }, 500);
    });
  },

  getLikedImages: async (userId: string): Promise<Image[]> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(currentImages.filter((img) => img.likedBy.includes(userId)));
      }, 500);
    });
  },

  toggleLike: async (imageId: string, userId: string): Promise<Image> => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const index = currentImages.findIndex(img => img.id === imageId);
        if (index === -1) {
            reject('Image not found');
            return;
        }

        const image = { ...currentImages[index] };
        const hasLiked = image.likedBy.includes(userId);

        if (hasLiked) {
            image.likedBy = image.likedBy.filter(id => id !== userId);
            image.likes = Math.max(0, image.likes - 1);
        } else {
            image.likedBy = [...image.likedBy, userId];
            image.likes += 1;
        }

        currentImages[index] = image;
        resolve(image);
      }, 200);
    });
  },

  uploadImage: async (
    file: File, 
    metadata: Omit<Image, 'id' | 'imageUrl' | 'uploadedAt' | 'likes' | 'userDisplayName' | 'userPhotoURL' | 'likedBy'>, 
    user: User
  ): Promise<Image> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const newImage: Image = {
          ...metadata,
          id: `img-${Date.now()}`,
          // In a real app, this would be the Firebase Storage URL
          imageUrl: URL.createObjectURL(file), 
          uploadedAt: Date.now(),
          likes: 0,
          likedBy: [],
          userId: user.uid,
          userDisplayName: user.displayName,
          userPhotoURL: user.photoURL,
        };
        currentImages = [newImage, ...currentImages];
        resolve(newImage);
      }, 1500);
    });
  },

  getTemplates: async (): Promise<PromptTemplate[]> => {
    return new Promise((resolve) => setTimeout(() => resolve(MOCK_TEMPLATES), 400));
  }
};
