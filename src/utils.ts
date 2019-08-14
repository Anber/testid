export function classNames(
  first?: string | null,
  second?: string | null
): string | undefined {
  if (first && second) {
    return `${first} ${second}`;
  }

  return first || second || undefined;
}
