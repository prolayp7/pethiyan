export function toDisplayTitleCase(value: string | null | undefined): string {
  const input = (value ?? "").trim();
  if (!input) return "";

  return input
    .replace(/[_-]+/g, " ")
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .split(/\s+/)
    .map((word) => {
      if (!word) return word;
      if (/^x$/i.test(word)) return "x";
      if (/\d/.test(word) && !/[a-z]/i.test(word)) return word;
      if (/^[A-Z]{2,}$/.test(word)) return word;

      return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
    })
    .join(" ");
}
