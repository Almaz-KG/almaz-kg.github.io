import { DocSection } from "@/components/doc/DocSection";
import { STACK } from "@/data/content";

/** What the work is built with, one layer per row. */
export function Stack() {
  return (
    <DocSection id="stack" title="Stack">
      <table className="ruled">
        <thead>
          <tr>
            <th scope="col">Layer</th>
            <th scope="col">Tools</th>
          </tr>
        </thead>
        <tbody>
          {STACK.map((row) => (
            <tr key={row.layer}>
              {/* Never wraps, so the column is as wide as its longest layer and
                  the tools get the rest. */}
              <th scope="row" className="font-semibold sm:whitespace-nowrap">
                {row.layer}
              </th>
              <td>{row.tools}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </DocSection>
  );
}
