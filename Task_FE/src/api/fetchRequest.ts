const LOCAL_API = import.meta.env.VITE_LOCAL_API;

const getAuthHeaders = (token = "") => ({
  "Content-Type": "application/json",
  Authorization: `Bearer ${token}`,
});

export const fetchRequest = async <T>(
  path: string,
  token: string | undefined,
  options: RequestInit = {},
  body?: Record<string, any>,
): Promise<T> => {
  const response = await fetch(`${LOCAL_API}${path}`, {
    ...options,
    headers: {
      ...getAuthHeaders(token),
      ...options.headers,
    },
    body: JSON.stringify(body),
    credentials: "include",
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || response.statusText);
  }

  return response.json() as Promise<T>;
};
