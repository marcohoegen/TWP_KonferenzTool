import type { ReactNode } from "react";

export default function ButtonStandard({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <button className="inline-flex items-center justify-center h-10 gap-2 px-5 text-sm font-medium tracking-wide text-white transition duration-300 rounded-full whitespace-nowrap bg-sky-500 hover:bg-sky-600 focus:bg-sky-700 focus-visible:outline-none disabled:cursor-not-allowed disabled:border-sky-300 disabled:bg-sky-300 disabled:shadow-none">
      {children}
    </button>
  );
}
