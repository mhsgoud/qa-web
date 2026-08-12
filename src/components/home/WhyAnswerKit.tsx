import { HOME_BENEFITS } from "@/lib/site";

export function WhyAnswerKit() {
  return (
    <section className="home-band" aria-labelledby="why-answerkit-title">
      <div className="shell">
        <div className="home-section-intro">
          <h2 id="why-answerkit-title">Why AnswerKit?</h2>
          <p className="home-section-lead">
            Google gives you links. Forums give you discussions. AnswerKit gives you the answer.
          </p>
        </div>

        <ul className="benefit-grid">
          {HOME_BENEFITS.map((item) => (
            <li key={item.title} className="benefit-card">
              <h3>{item.title}</h3>
              <p>{item.body}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
