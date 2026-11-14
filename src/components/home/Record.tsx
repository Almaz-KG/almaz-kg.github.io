import { DocSection } from "@/components/doc/DocSection";
import { CERTIFICATIONS, RECORD } from "@/data/content";

/** Experience and education, as a ruled table. */
export function Record() {
  return (
    <DocSection id="record" title="Record">
      <table className="ruled">
        <thead>
          <tr>
            <th scope="col">When</th>
            <th scope="col">What</th>
            <th scope="col">Where</th>
          </tr>
        </thead>
        <tbody>
          {RECORD.map((row) => (
            <tr key={row.what}>
              {/* The first two columns never wrap, so the table sizes them to
                  their copy and gives what is left to the last one. */}
              <td className="whitespace-nowrap text-muted">{row.when}</td>
              <td className="font-semibold sm:whitespace-nowrap">{row.what}</td>
              <td className="text-muted">{row.where}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <p className="mt-3 text-muted">{CERTIFICATIONS}</p>
    </DocSection>
  );
}
