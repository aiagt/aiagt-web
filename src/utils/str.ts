export function toPascalCase(str?: string) {
  if (!str) return ''

  return str
    .toLowerCase()
    .split(/[^a-zA-Z0-9]/)
    .filter((word: string) => word.length > 0)
    .map((word: string) => word[0].toUpperCase() + word.slice(1))
    .join('')
}