export default function About({ t }) {
  return (
    <section id="about">
      <div className="section-head" data-reveal>
        <h2 className="section-title">{t.nav.about}</h2>
      </div>

      <div className="about-body" data-reveal>
        <p dangerouslySetInnerHTML={{ __html: t.about_1 }} />
        <p dangerouslySetInnerHTML={{ __html: t.about_2 }} />
      </div>

      <ul className="skill-tags" data-reveal>
        {t.skills.map((skill) => (
          <li key={skill} className="skill-tag">{skill}</li>
        ))}
      </ul>
    </section>
  )
}
