interface CardBasicProps {
  title: string;
  children?: React.ReactNode;
}

export default function CardBasic({ title, children }: CardBasicProps) {
  return (
    <div className="flex flex-col border-sky-500 border relative overflow-hidden rounded-lg bg-white text-slate-500 shadow-md shadow-slate-200 p-6 mb-4 box-content w-65 min-h-40 transition transform hover:-translate-y-1 hover:shadow-lg">
      {/* title */}
      <h3 className="text-lg font-medium text-slate-700 text-left">{title}</h3>

      <hr />

      <div className="mt-2 flex flex-1 flex-col h-auto place-content-between">
        {children}
      </div>
    </div>
  );
}
