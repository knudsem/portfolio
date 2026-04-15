export default function About({ t }) {
  return (
    <section id="about">
      <div className="section-label">{t.nav[0]}</div>

      <div className="availability-badge">
        <span className="pulse-dot" />
        {t.available}
      </div>

      <div className="about-body">
        <p dangerouslySetInnerHTML={{ __html: t.about_1 }} />
        <p dangerouslySetInnerHTML={{ __html: t.about_2 }} />
        <p dangerouslySetInnerHTML={{ __html: t.about_3 }} />
      </div>

      <div className="skill-tags">
        {t.skills.map((skill) => (
          <span key={skill} className="skill-tag">{skill}</span>
        ))}
      </div>
    </section>
  )
}
