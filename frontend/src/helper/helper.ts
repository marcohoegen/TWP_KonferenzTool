export function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return dateStr;
  return date.toLocaleDateString("de-DE", {
    weekday: "short",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

export function cropEmail(emailStr: string, chars: number): string {
  if (emailStr.length > chars) {
    emailStr = emailStr.substring(0, chars - 3);
    emailStr = emailStr.concat("...");
  }

  return emailStr;
}
