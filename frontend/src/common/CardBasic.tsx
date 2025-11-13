import ButtonGreenRed from "./ButtonGreenRed";

interface CardBasicProps {
  title: string;
  description?: string;
  buttonText?: string;
  onButtonClick?: () => void;
}

export default function CardBasic({
  title,
  buttonText = "Action",
  description = "Description is currently empty.",
  onButtonClick,
}: CardBasicProps) {
  return (
    <div className="relative overflow-hidden rounded bg-white text-slate-500 shadow-md shadow-slate-200 p-6 mb-4 min-w-65">
      {/* title */}
      <h3 className="mb-2 w-4/5 text-xl font-medium text-slate-700 text-left">
        {title}
      </h3>

      {/* description */}
      <p className="w-3/5 text-left whitespace-pre-line">{description}</p>

      {/* button */}
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
