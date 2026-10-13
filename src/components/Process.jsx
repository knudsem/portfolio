// How a project runs, in four steps
export default function Process({ t }) {
  return (
    <section id="process" aria-labelledby="process-title">
      <div className="section-head" data-reveal>
        <h2 id="process-title" className="section-title">{t.process_title}</h2>
        <p className="section-intro">{t.process_intro}</p>
      </div>
      <ol className="process">
        {t.process.map((step, i) => (
          <li key={step.title} className="process-step" data-reveal style={{ '--reveal-delay': `${i * 80}ms` }}>
            <span className="process-num" aria-hidden="true">{String(i + 1).padStart(2, '0')}</span>
            <h3 className="process-title">{step.title}</h3>
            <p className="process-text">{step.text}</p>
          </li>
        ))}
      </ol>
    </section>
  )
}
