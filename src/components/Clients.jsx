import { projectPath } from '../projects'

// Brands I have built for, each leading to its case study. Names only: no
// logos borrowed without asking.
const CLIENTS = [
  { name: 'Pro-Ject Audio Systems', id: 'project-global' },
  { name: 'Interdyn', id: 'interdyn' },
  { name: 'Exclusive Construction', id: 'exclusive' },
  { name: 'Trimension', id: 'trimension' },
]

export default function Clients({ t }) {
  return (
    <section className="clients" aria-labelledby="clients-label" data-reveal>
      <h2 id="clients-label" className="clients-label">{t.clients_label}</h2>
      <ul className="clients-list">
        {CLIENTS.map(({ name, id }) => (
          <li key={id}>
            <a href={projectPath(id)} className="clients-link">{name}</a>
          </li>
        ))}
      </ul>
    </section>
  )
}
