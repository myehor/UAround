export type UserProfile = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  emailVerified: boolean;
  bundesland: string;
  city: string;
  bio: string | null;
  phone: string | null;
  avatarUrl: string | null;
  coverUrl: string | null;
  languages: string[];
  profileCompleted: boolean;
  createdAt: string;
  updatedAt: string;
};

type ProfileResponse = {
  message?: string;
  user?: UserProfile;
  errors?: Array<{ field: string; message: string }>;
};

async function readProfileResponse(
  response: Response,
): Promise<ProfileResponse> {
  const text = await response.text();
  let data: ProfileResponse = {};

  if (text) {
    try {
      data = JSON.parse(text) as ProfileResponse;
    } catch {
      throw new Error(
        "The server returned an invalid response. Please try again.",
      );
    }
  }

  if (!response.ok) {
    throw new Error(data.message || `Request failed (${response.status}).`);
  }

  return data;
}

export async function getProfile(): Promise<UserProfile> {
  const response = await fetch("/api/profile", {
    credentials: "include",
  });
  const data = await readProfileResponse(response);

  if (!data.user) {
    throw new Error("The server did not return profile data.");
  }

  return data.user;
}

export type UpdateProfilePayload = {
  firstName: string;
  lastName: string;
  bundesland: string;
  city: string;
  bio: string;
  phone: string;
  languages: string[];
};

export async function updateProfile(
  payload: UpdateProfilePayload,
): Promise<UserProfile> {
  const response = await fetch("/api/profile", {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({
      ...payload,
      bio: payload.bio.trim() || null,
      phone: payload.phone.trim() || null,
    }),
  });
  const data = await readProfileResponse(response);

  if (!data.user) {
    throw new Error("The server did not return the saved profile.");
  }

  return data.user;
}

export async function uploadAvatar(file: File) {
  const imageData = await new Promise<string>((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => {
      if (typeof reader.result === "string") {
        resolve(reader.result);
      } else {
        reject(new Error("Failed to read image"));
      }
    };

    reader.onerror = () => reject(new Error("Failed to read image"));
    reader.readAsDataURL(file);
  });

  const response = await fetch("/api/profile/avatar", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify({ imageData }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message ?? "Failed to upload avatar");
  }

  return data.user;
}
