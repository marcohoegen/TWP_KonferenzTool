
import ButtonGreenRed from "./ButtonGreenRed";

interface CardBasicProps {
  title: string;          // aus Formular
  startDate?: string;     // Startdatum
  endDate?: string;       // Enddatum
  room?: string;          // Raumname
  buttonText?: string;
  onButtonClick?: () => void;
}

export default function CardBasic({
  title,
  startDate,
  endDate,
  room,
  buttonText = "Aktion",
  onButtonClick,
}: CardBasicProps) {
  // Beschreibung automatisch generieren
  let description = "Noch keine Daten angegeben.";
  if (startDate && endDate && room) {
    description = `${formatDate(startDate)} → ${formatDate(endDate)}\n${room}`;
  } else if (startDate && endDate) {
    description = `${formatDate(startDate)} → ${formatDate(endDate)}`;
  } else if (room) {
    description = `Raum: ${room}`;
  }

  return (
    <div className="relative overflow-hidden rounded bg-white text-slate-500 shadow-md shadow-slate-200 p-6 mb-4">
      {/* Titel */}
      <h3 className="mb-2 w-4/5 text-xl font-medium text-slate-700 text-left">
        {title}
      </h3>

      {/* Beschreibung */}
      <p className="w-3/5 text-left whitespace-pre-line">{description}</p>

      {/* Button unten rechts */}
      <div className="absolute bottom-4 right-4">
        <ButtonGreenRed
          text={buttonText}
          width="w-24"
          onClick={onButtonClick}
        />
      </div>
    </div>
  );
}

// Datum formatieren (Deutsch)
function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return dateStr;
  return date.toLocaleDateString("de-DE", {
    weekday: "short",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}
