
/* Beispiel:
    <AccordionBasic
        items={[
            { id: "ac01", title: "How does TailwindCSS work?", content: "Tailwind CSS works by scanning..." },
            { id: "ac02", title: "How do I install TailwindCSS?", content: "The simplest and fastest way..." },
            { id: "ac03", title: "What is Wind UI about?", content: "Expertly made components..." },
            { id: "ac04", title: "How do I use Wind UI components?", content: "All components can be copied..." },
        ]}
    />

*/

interface AccordionItem {
  id: string;
  title: string;
  content: string;
  open?: boolean; // optional, ob das Item initial geöffnet sein soll
}

interface AccordionBasicProps {
  items: AccordionItem[];
}

export default function AccordionBasic({ items }: AccordionBasicProps) {
  return (
    <>
      {/*<!-- Component: Basic accordion -->*/}
      <section className="w-full divide-y rounded divide-slate-200">
        {items.map((item, index) => (
          <details
            key={item.id}
            className="p-4 group"
            open={item.open ?? false}
          >
            <summary className="relative cursor-pointer list-none pr-8 font-medium text-slate-700 transition-colors duration-300 focus-visible:outline-none group-hover:text-slate-900 [&::-webkit-details-marker]:hidden">
              {item.title}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="absolute right-0 w-4 h-4 transition duration-300 top-1 shrink-0 stroke-slate-700 group-open:rotate-45"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="1.5"
                aria-labelledby={`title-${item.id} desc-${item.id}`}
              >
                <title id={`title-${item.id}`}>Open icon</title>
                <desc id={`desc-${item.id}`}>
                  Icon that represents the state of the summary
                </desc>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
              </svg>
            </summary>
            <p className="mt-4 text-slate-500">{item.content}</p>
          </details>
        ))}
      </section>
      {/*<!-- End Basic accordion -->*/}
    </>
  );
}
