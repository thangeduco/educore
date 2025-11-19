import { UserProfile } from '../../domain/BM/bm-models/user.model';

export interface PublicUser {
    id: number;
    fullName: string;
    email?: string;
    phone?: string;
    status: string;
    role: string;
    createdAt: string;

    profile?: UserProfile;

    // Thông tin học sinh mở rộng (nếu có)
    badgeCount?: number;
    rank?: string;
}

