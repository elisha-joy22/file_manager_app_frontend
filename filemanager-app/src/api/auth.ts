export async function login(username: string, password: string): Promise<{ message: string } | { error: string }> {
  const res = await fetch('/api/auth/login/', {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ username, password }),
  });

  return await res.json();
}
