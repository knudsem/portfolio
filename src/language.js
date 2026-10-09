const STORAGE_KEY = 'lang'

// Time zones used in France, its overseas territories and Monaco.
const FRENCH_TIME_ZONES = new Set([
  'Europe/Paris',
  'Europe/Monaco',
  'America/Guadeloupe',
  'America/Martinique',
  'America/Cayenne',
  'America/Miquelon',
  'America/St_Barthelemy',
  'America/Marigot',
  'Indian/Reunion',
  'Indian/Mayotte',
  'Indian/Kerguelen',
  'Pacific/Tahiti',
  'Pacific/Marquesas',
  'Pacific/Gambier',
  'Pacific/Noumea',
  'Pacific/Wallis',
])

function savedLanguage() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    return saved === 'fr' || saved === 'en' ? saved : null
  } catch {
    return null
  }
}

export function saveLanguage(lang) {
  try {
    localStorage.setItem(STORAGE_KEY, lang)
  } catch {
    // Storage blocked (private mode, strict settings): the choice lasts for this visit only.
  }
}

function isInFrance() {
  try {
    return FRENCH_TIME_ZONES.has(Intl.DateTimeFormat().resolvedOptions().timeZone)
  } catch {
    return false
  }
}

// A language the visitor picked themselves always wins. Otherwise visitors in
// France (judged from the device time zone, so no server call and no flash of
// the wrong language) and visitors whose browser is set to French get French.
// Everyone else gets English.
export function detectLanguage() {
  const saved = savedLanguage()
  if (saved) return saved

  const browserLanguage = (navigator.languages?.[0] || navigator.language || '').toLowerCase()
  if (browserLanguage.startsWith('fr') || isInFrance()) return 'fr'
  return 'en'
}
