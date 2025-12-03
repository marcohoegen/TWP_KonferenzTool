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

// Helper function to format numbers with comma as decimal separator (German format)
export function formatNumberDE(value: number): string {
  return value.toFixed(2).replace(".", ",");
}

// CSV Export
export function handleExportCSV(sortedRankings, conferenceId: string) {
  if (!sortedRankings.length) {
    alert("Keine Daten zum Exportieren verfügbar");
    return;
  }

  // CSV headers
  const headers = [
    "Rang",
    "Titel",
    "Präsentatoren",
    "Anzahl Bewertungen",
    "Durchschnitt Gesamt",
    "Durchschnitt Inhalt",
    "Durchschnitt Stil",
    "Durchschnitt Folien",
  ];

  // CSV rows
  const rows = sortedRankings.map((item) => [
    item.rank,
    `"${item.title}"`, // Quote to handle commas in title
    `"${item.presenters.map((p) => p.name).join(", ")}"`, // Quote to handle commas
    item.numberOfRatings,
    `"${formatNumberDE(item.overallAverage)}"`, // Quote numbers with comma decimal separator
    `"${formatNumberDE(item.contentsRatingStats.average)}"`,
    `"${formatNumberDE(item.styleRatingStats.average)}"`,
    `"${formatNumberDE(item.slidesRatingStats.average)}"`,
  ]);

  // Combine headers and rows - use semicolon as delimiter for German CSV format
  const csvContent = [headers, ...rows].map((row) => row.join(";")).join("\n");

  // Create blob and download
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  const url = URL.createObjectURL(blob);
  link.setAttribute("href", url);
  link.setAttribute(
    "download",
    `conference_${conferenceId}_ratings_${new Date().toISOString().split("T")[0]}.csv`
  );
  link.style.visibility = "hidden";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
