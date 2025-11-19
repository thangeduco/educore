// src/shared/utils.ts
import { User} from '../domain/BM/bm-models/user.model';
import { PublicUser} from '../application/dtos/public-user.dto';

export const nowISOString = (): string => new Date().toISOString();

export const safeParseInt = (value: string, fallback: number = 0): number => {
  const parsed = parseInt(value, 10);
  return isNaN(parsed) ? fallback : parsed;
};

export const logRequest = (label: string, data: any) => {
  console.log(`[${label}]`, JSON.stringify(data, null, 2));
};

export function safeParseArray(value: any): string[] {
  if (!value) return [];
  try {
    const parsed = typeof value === 'string' ? JSON.parse(value) : value;
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};


export function sanitizeUser(user: User): PublicUser {
  const { passwordHash, email, phone, profile, ...rest } = user;

  return {
    ...rest,
    email: email ?? undefined,
    phone: phone ?? undefined,
    profile: profile
      ? {
          avatarImage: profile.avatarImage ?? undefined,
          dob: profile.dob ?? undefined,
          gender: profile.gender ?? undefined,
          grade: profile.grade ?? undefined,
          slogen: profile.slogen ?? undefined,
        }
      : undefined,
  };
}