export type StudentProfile = {
  id: string;
  email: string | null;
  firstName: string | null;
  lastName: string | null;
  imageUrl: string | null;
  bio: string | null;
};

export type StudentProfileQueryData = {
  profile: StudentProfile;
  storageConfigured: boolean;
  maxAvatarSizeMb: number;
};

export type GetStudentProfileResult =
  | {
      ok: true;
      profile: StudentProfile;
      storageConfigured: boolean;
      maxAvatarSizeMb: number;
    }
  | { ok: false; error: string };

export type InitStudentAvatarUploadResult =
  | { ok: true; uploadUrl: string; imageUrl: string }
  | { ok: false; error: string };

export type SetStudentAvatarResult =
  | { ok: true; imageUrl: string | null }
  | { ok: false; error: string };

export type UpdateStudentProfileResult =
  | { ok: true; profile: StudentProfile }
  | { ok: false; error: string };
