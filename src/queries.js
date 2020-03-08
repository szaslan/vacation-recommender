const t = `SELECT DISTINCT ?city ?cityLabel WHERE {
    wd:Q712 wdt:P625 ?islands .
    wd:Q16552 wdt:P625 ?northAm .
    wd:Q1352 wdt:P625 ?asia .
    wd:Q258 wdt:P625 ?africa .
    wd:Q1524 wdt:P625 ?europe .
    wd:Q826 wdt:P625 ?island2 .
    wd:Q3130 wdt:P625 ?aust .
    ?attraction wdt:P31 wd:Q40080 .
    ?attraction wdt:P131 ?city .
    ?city wdt:P17 ?country .
    ?city wdt:P1082 ?pop .
    ?country wdt:P625 ?location .
    FILTER NOT EXISTS {?city wdt:P31/wdt:P279* wd:Q3024240} .
    FILTER NOT EXISTS {?city wdt:P31/wdt:P279* wd:Q28171280} .
    FILTER NOT EXISTS {?city wdt:P31/wdt:P279* wd:Q217177} .
    FILTER( geof:distance(?location, ?islands) < 3000 ||
            geof:distance(?location, ?northAm) < 1000  ||
            geof:distance(?location, ?asia) < 2000  ||
            geof:distance(?location, ?africa) < 2000  ||
            geof:distance(?location, ?aust) < 2000  ||
            geof:distance(?location, ?island2) < 3000  ||
            geof:distance(?location, ?europe) < 2000 ) .
    SERVICE wikibase:label { bd:serviceParam wikibase:language "en". }
  }
  ORDER BY DESC(?pop) LIMIT 300`

export const queries = {
  warm: {
    beach: t
  }
}
