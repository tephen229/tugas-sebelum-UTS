// Kode error PostgreSQL yang sering kita tangani
export const PG_UNIQUE_VIOLATION = '23505'; // melanggar UNIQUE
export const PG_FOREIGN_KEY_VIOLATION = '23503'; // data masih dipakai tabel lain

export function isPgError(error: unknown, code: string): boolean {
  const e = error as { code?: string; driverError?: { code?: string } } | null;
  return e?.driverError?.code === code || e?.code === code;
}