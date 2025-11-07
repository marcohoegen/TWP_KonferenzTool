
interface ButtonImportProps {
  text?: string;
  width?: string; // z. B. "w-32" oder "w-full"
  iconSize?: string; // z. B. "h-5 w-5"
  onClick?: () => void;
}

export default function ButtonImport({
  text = "Button",
  width = "w-auto",
  iconSize = "h-5 w-5",
  onClick,
}: ButtonImportProps) {
  return (
    <>
      {/*<!-- Component: Base primary button with leading icon --> */}
      <button
        onClick={onClick}
        className={`inline-flex ${width} h-10 items-center justify-center gap-2 whitespace-nowrap rounded bg-emerald-500 px-5 text-sm font-medium tracking-wide text-white transition duration-300 hover:bg-emerald-600 focus:bg-emerald-700 focus-visible:outline-none disabled:cursor-not-allowed disabled:border-emerald-300 disabled:bg-emerald-300 disabled:shadow-none`}
      >
        {/* Text */}
        <span className="order-2">{text}</span>

        {/* Icon */}
        <span className="relative only:-mx-5">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className={iconSize}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="1.5"
            role="graphics-symbol"
            aria-labelledby="title-06 desc-06"
          >
            <title id="title-06">Icon title</title>
            <desc id="desc-06">A more detailed description of the icon</desc>
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10"
            />
          </svg>
        </span>
      </button>
      {/*<!-- End Base primary button with leading icon --> */}
    </>
  );
}
