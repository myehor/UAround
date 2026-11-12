export type AuthUser = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  emailVerified: boolean;
  bundesland: string;
  city: string;
  avatarUrl: string | null;
  createdAt: string;
};

const API_URL = import.meta.env.VITE_API_URL ?? "";

type AuthResponse = {
  message: string;
  user?: AuthUser;
  errors?: Array<{
    field: string;
    message: string;
  }>;
};

async function readResponse(response: Response): Promise<AuthResponse> {
  const data = (await response.json()) as AuthResponse;

  if (!response.ok) {
    throw new Error(data.message || "Something went wrong.");
  }

  return data;
}

export async function registerUser(payload: {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  bundesland: string;
  city: string;
}): Promise<AuthResponse> {
  const response = await fetch(`${API_URL}/api/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(payload),
  });

  return readResponse(response);
}

export async function loginUser(payload: {
  email: string;
  password: string;
}): Promise<AuthResponse> {
  const response = await fetch(`${API_URL}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(payload),
  });

  return readResponse(response);
}

export async function getCurrentUser(): Promise<AuthUser | null> {
  const response = await fetch(`${API_URL}/api/auth/me`, {
    credentials: "include",
  });

  if (response.status === 401) {
    return null;
  }

  const data = await readResponse(response);
  return data.user ?? null;
}

export async function logoutUser(): Promise<void> {
  const response = await fetch(`${API_URL}/api/auth/logout`, {
    method: "POST",
    credentials: "include",
  });

  await readResponse(response);
}
