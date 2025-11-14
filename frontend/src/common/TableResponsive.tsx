
{/* 
    PASST SICH LEIDER NOCH NICHT GUT AN BEI MITTLERER BREITE; 
    BESONDERS GUT ALLERDINGS BEI GROSS UND SEHR KLEIN;
*/}

interface Column {
  key: string;
  label: string;
}

interface Row {
  id?: string | number;
  [key: string]: string | number | undefined;
}

interface TableResponsiveProps {
  columns: Column[];
  data: Row[];
}

export default function TableResponsive({ columns, data }: TableResponsiveProps) {
  return (
    <table className="w-full text-left border border-separate rounded border-slate-200">
      <thead className="hidden sm:table-header-group">
        <tr>
          {columns.map((col) => (
            <th
              key={col.key}
              className="h-12 px-6 text-sm font-medium border-l first:border-l-0 bg-slate-100 text-slate-700"
            >
              {col.label}
            </th>
          ))}
        </tr>
      </thead>

      <tbody>
        {data.map((row) => (
          <tr
            key={row.id || Math.random()}
            className="block border-b sm:table-row last:border-b-0 border-slate-200 sm:border-none"
          >
            {columns.map((col) => (
              <td
                key={col.key}
                data-label={col.label}
                className="
                  before:min-w-24 before:inline-block before:font-medium before:text-slate-700 
                  before:content-[attr(data-label)':'] sm:before:content-none
                  flex items-center sm:table-cell
                  h-12 px-6 text-sm sm:border-t sm:border-l first:border-l-0
                  border-slate-200 text-slate-500
                "
              >
                {row[col.key]}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}