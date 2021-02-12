import { acronymMap } from "./data"

export const findAcronym = (query: string): string | undefined => {
  const acronym = Object.keys(acronymMap).find(
    key => key.toLowerCase().trim() === query.toLowerCase().trim()
  )

  if (acronym) {
    const description = acronymMap[acronym]
    return [acronym, description].join(": ")
  }
}
