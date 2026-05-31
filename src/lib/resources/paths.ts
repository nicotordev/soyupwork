export const GUIDES_INDEX_PATH = "/resources/guias";
export const TEMPLATES_INDEX_PATH = "/resources/plantillas";

export function guidePath(slug: string): string {
  return `${GUIDES_INDEX_PATH}/${slug}`;
}

export function templatePath(slug: string): string {
  return `${TEMPLATES_INDEX_PATH}/${slug}`;
}
