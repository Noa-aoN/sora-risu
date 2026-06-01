export function pollenTypeSuffix(types?: string[]): string {
  if (!types || types.length === 0) return "";
  return `（${types.join("・")}）`;
}
