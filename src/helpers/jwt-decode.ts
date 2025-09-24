export type JwtPayload = Record<string, unknown>;

export function decodeJwtPayload(token: string): JwtPayload | null {
    try {
        const parts = token.split('.');
        if (parts.length < 2) return null;
        const base64 = parts[1].replace(/-/g, '+').replace(/_/g, '/');
        const json = decodeURIComponent(
            atob(base64)
                .split('')
                .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
                .join('')
        );
        return JSON.parse(json) as JwtPayload;
    } catch {
        return null;
    }
}

export function getExpirationDate(exp: number) {
  const date = new Date(exp * 1000);

  return {
    date,
    iso: date.toISOString(),
    local: date.toLocaleString(),
  };
}