/** Legacy `?subject=` slugs from marketing nav → category slugs in DB */
export const SUBJECT_TO_CATEGORY_SLUG: Record<string, string> = {
  "ventas-b2b": "ventas-b2b",
  propuestas: "propuestas",
  "nichos-pricing": "nichos-pricing",
  ingles: "ingles",
  operacion: "operacion",
};

export const CATEGORY_SLUG_TO_NAME: Record<string, string> = {
  "ventas-b2b": "Ventas B2B en Upwork",
  propuestas: "Propuestas que convierten",
  "nichos-pricing": "Nichos y pricing",
  ingles: "Inglés para entrevistas",
  operacion: "Connects y operación freelance",
};

export function categoryNamesForFilterUi(
  names: string[],
  slugs: string[],
): string[] {
  const fromSlugs = slugs
    .map((slug) => CATEGORY_SLUG_TO_NAME[slug])
    .filter((name): name is string => Boolean(name));
  return [...new Set([...names, ...fromSlugs])];
}
