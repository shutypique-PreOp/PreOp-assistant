/**
 * Normalise une chaîne pour la recherche : minuscules, sans accents.
 */
export function normalizeSearchText(value: string): string {
  return value
    .normalize("NFD")
    .replace(/\p{M}/gu, "")
    .toLowerCase()
    .trim();
}
