export type User = {
  id: number;
  fullName: string;
  email: string | null;
  phone: string | null;
  passwordHash: string;
  role: 'user' | 'admin' | string;
  status: 'active' | 'inactive' | 'banned' | string;
  createdAt: string;
  profile?: UserProfile;
};

export type UserProfile = {
  avatarImage?: string;
  dob?: string; // dạng YYYY-MM-DD
  gender?: 'male' | 'female' | 'other' | string;
  grade?: number;
  slogen?: string;
};
