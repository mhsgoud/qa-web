import { HOME_BENEFITS } from "@/lib/site";

export function WhyAnswerKit() {
  return (
    <section className="home-why" aria-labelledby="why-answerkit-title">
      <div className="shell">
        <div className="home-why-head">
          <h2 id="why-answerkit-title">Why AnswerKit</h2>
          <p>
            Google gives you links. Forums give you discussions.
            <strong> AnswerKit gives you the answer.</strong>
          </p>
        </div>

        <ol className="benefit-list">
          {HOME_BENEFITS.map((item, i) => (
            <li key={item.title}>
              <span className="benefit-num">{String(i + 1).padStart(2, "0")}</span>
              <div>
                <h3>{item.title}</h3>
                <p>{item.body}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
