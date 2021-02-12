const ACRONYM_MAP: AcronymMap = require("./data.json")

export const findAcronym = (query: string): string | undefined => {
  const acronym = Object.keys(ACRONYM_MAP).find(
    key => key.toLowerCase().trim() === query.toLowerCase().trim()
  )

  if (acronym) {
    const description = ACRONYM_MAP[acronym]
    return [acronym, description].join(": ")
  }
}

interface AcronymMap {
  [acronym: string]: string
}
