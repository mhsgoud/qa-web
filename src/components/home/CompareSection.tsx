import { COMPARE_ROWS } from "@/lib/site";

export function CompareSection() {
  return (
    <section className="shell home-section" aria-labelledby="compare-title">
      <div className="home-section-intro">
        <h2 id="compare-title">Why not just Google it?</h2>
        <p className="home-section-lead">
          Search engines send you somewhere else. AnswerKit gives you the answer on the page.
        </p>
      </div>

      <div className="compare-table-wrap">
        <table className="compare-table">
          <thead>
            <tr>
              <th scope="col" />
              <th scope="col">Google</th>
              <th scope="col">Forums</th>
              <th scope="col" className="compare-highlight">
                AnswerKit
              </th>
            </tr>
          </thead>
          <tbody>
            {COMPARE_ROWS.map((row) => (
              <tr key={row.label}>
                <th scope="row">{row.label}</th>
                <td>{row.google}</td>
                <td>{row.forums}</td>
                <td className="compare-highlight">{row.answerkit}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
