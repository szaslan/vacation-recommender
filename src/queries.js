const getUrl = q => {
  return `https://query.wikidata.org/sparql?query=${encodeURIComponent(q)}`
}

const headers = { Accept: "application/sparql-results+json" }

/*

===== QUERIES =====

*/

/*
---- DOMESTIC ----
*/

export const dom_budgets_query = async ({ options }) => {
  // prettier-ignore
  const q = `
  SELECT DISTINCT ?place ?placeLabel ?attractionLabel WHERE {
    wd:${options.officalCode} wdt:P625 ?stateCoords .
    ?attraction wdt:P31/wdt:P279* wd:${codes.attraction[options.attraction]} .
    ?attraction wdt:P131 ?place .
    ?place wdt:P17 wd:Q30 .
    ?place wdt:P31/wdt:P279* ?area .
    ?place wdt:P625 ?location .
    ?place wdt:P1082 ?pop .
    FILTER(?area = wd:Q35657 || ?area = wd:Q515) .
    ${budgets[options.budget]}
    SERVICE wikibase:label { bd:serviceParam wikibase:language "en". }
  }
  ORDER BY DESC(?pop)`
  console.log(q)
  const url = getUrl(q)
  let r = await fetch(url, {
    headers: headers
  })
  r = await r.json()
  console.log(r)
}

/*
---- INTERNATIONAL ----
*/
export const int_continents_query = async ({ officalCode }) => {
  const q = `
  SELECT DISTINCT ?continent ?continentLabel ?q WHERE {
    wd:${officalCode} wdt:P625 ?stateCoords .
    ?continent wdt:P31 wd:Q5107 ;
            wdt:P625 ?contCoords .
    FILTER NOT EXISTS {?continent wdt:P361 wd:Q1555938}
    FILTER NOT EXISTS {?continent wdt:P610 wd:Q130018}
    FILTER NOT EXISTS {?continent wdt:P17 wd:Q408}
    BIND(geof:distance(?contCoords, ?stateCoords) AS ?q)
    SERVICE wikibase:label { bd:serviceParam wikibase:language "en" }
  } ORDER BY ASC(?q)
  `
  const url = getUrl(q)
  let r = await fetch(url, {
    headers: headers
  })
  r = await r.json()
  let continents = {}
  for (let i of r.results.bindings) {
    const continent_code = i.continent.value
    const continent_name = i.continentLabel.value
    const distance = i.q.value
    const splitter = continent_code.split("entity/")
    continents[continent_name] = [splitter[1], distance]
  }
  return continents
}

export const int_budgets_query = async ({
  options,
  continents,
  med_continents,
  high_continents
}) => {
  let q = ``
  if (options.budget === "low") {
    q = `
      SELECT DISTINCT ?item ?itemLabel ?attractionLabel WHERE {
        ?attraction wdt:P31 wd:${codes.attraction[options.attraction]} ;
                    wdt:P131 ?item .
        ?item wdt:P17/wdt:P279* ?country .
        ?country wdt:P30 wd:Q49 .
        FILTER NOT EXISTS {?country wdt:P31 wd:Q1489259}
        FILTER NOT EXISTS {?country wdt:P31 wd:Q417175}
        FILTER NOT EXISTS {?country wdt:P31 wd:Q5123999}
        SERVICE wikibase:label { bd:serviceParam wikibase:language "en" }
      }`
  } else if (options.budget === "moderate") {
    // prettier-ignore
    q = `
    SELECT DISTINCT ?item ?itemLabel ?attractionLabel WHERE {
      ?attraction wdt:P31 wd:${codes.attraction[options.attraction]} ;
                  wdt:P131 ?item .
      ?item wdt:P17/wdt:P279* ?country .
      ?country wdt:P30 ?cont . 
      FILTER(?cont = wd:${continents[med_continents[0]][0]} || ?cont = wd:${continents[med_continents[1]][0]})
      ?item wdt:P1082 ?pop
      FILTER NOT EXISTS {?country wdt:P31 wd:Q1489259}
      FILTER NOT EXISTS {?country wdt:P31 wd:Q417175}
      FILTER NOT EXISTS {?country wdt:P31 wd:Q5123999}
      SERVICE wikibase:label { bd:serviceParam wikibase:language "en" }
    } ORDER BY DESC(?pop)
    `
  } else {
    // prettier-ignore
    q = `
    SELECT DISTINCT ?item ?itemLabel ?attractionLabel WHERE {
      ?attraction wdt:P31 wd:${codes.attraction[options.attraction]} ;
                  wdt:P131 ?item .
      ?item wdt:P17/wdt:P279* ?country .
      ?country wdt:P30 ?cont .
      FILTER(?cont = wd:${continents[high_continents[0]][0]} || ?cont = wd:${continents[high_continents[1]][0]} || ?cont = wd:${continents[high_continents[2]][0]})
      ?item wdt:P1082 ?pop
      FILTER NOT EXISTS {?country wdt:P31 wd:Q1489259}
      FILTER NOT EXISTS {?country wdt:P31 wd:Q417175}
      FILTER NOT EXISTS {?country wdt:P31 wd:Q5123999}
      SERVICE wikibase:label { bd:serviceParam wikibase:language "en" }
    } ORDER BY DESC(?pop)`
  }

  const url = getUrl(q)
  let r = await fetch(url, {
    headers: headers
  })
  const budget_data = await r.json()
  console.log(budget_data)
  let place_codes = {}
  for (let i of budget_data.results.bindings) {
    const item_code = i.item.value
    const item_value = i.itemLabel.value
    const splitter = item_code.split("entity/")
    place_codes[splitter[1]] = item_value
  }

  return place_codes
}

export const queries = {
  // warm: {
  //   beach: t
  // },
  cool: {},
  temperate: {}
}

/*

====== HELPERS FOR QUERIES ======
*/

const budgets = {
  low: "FILTER(geof:distance(?location, ?stateCoords) < 400)",
  moderate:
    "FILTER(geof:distance(?location, ?stateCoords) > 400) . FILTER(geof:distance(?location, ?stateCoords) < 800).",
  high: "FILTER(geof:distance(?location, ?stateCoords) > 800)."
}

const codes = {
  attraction: {
    beach: "Q40080",
    ski_resort: "Q130003",
    tourist: "Q570116",
    park: "Q728904"
  },
  ranking_codes: {
    nightclub: "Q622425",
    museums: "Q33506",
    airport: "Q1248784",
    themepark: "Q2416723",
    nature: "Q2143825"
  }
}
