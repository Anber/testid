export function classNames(
  ...args: Array<string | null | undefined>
): string | undefined {
  const filtered = args.filter(s => s);
  if (filtered.length > 0) {
    return filtered.join(' ');
  }

  return undefined;
}
