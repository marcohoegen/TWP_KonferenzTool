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

// Helper function to calculate histogram bar heights as percentages
// Takes individual histograms and calculates heights relative to global max for visual comparison
export function calculateHistogramHeights(
  contentHistogram: Record<number, number>,
  styleHistogram: Record<number, number>,
  slidesHistogram: Record<number, number>
): {
  contentHeights: Record<number, number>;
  styleHeights: Record<number, number>;
  slidesHeights: Record<number, number>;
} {
  // Find max values for each category
  const contentMax = Math.max(...Object.values(contentHistogram || {}), 1);
  const styleMax = Math.max(...Object.values(styleHistogram || {}), 1);
  const slidesMax = Math.max(...Object.values(slidesHistogram || {}), 1);

  // Global max across all categories for visual comparison
  const globalMax = Math.max(contentMax, styleMax, slidesMax);

  // Calculate heights as percentages using global max
  const calculateHeights = (histogram: Record<number, number>) => {
    const heights: Record<number, number> = {};
    for (let rating = 1; rating <= 5; rating++) {
      const count = histogram[rating] || 0;
      const heightPercent = globalMax > 0 ? (count / globalMax) * 100 : 0;
      heights[rating] = Math.round(heightPercent * 100) / 100; // Round to 2 decimals
    }
    return heights;
  };

  return {
    contentHeights: calculateHeights(contentHistogram),
    styleHeights: calculateHeights(styleHistogram),
    slidesHeights: calculateHeights(slidesHistogram),
  };
}

