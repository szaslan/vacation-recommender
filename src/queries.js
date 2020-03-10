const getUrl = q => {
  return `https://query.wikidata.org/sparql?query=${encodeURIComponent(q)}`
}

const headers = { Accept: "application/sparql-results+json" }
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
    nightlife: "Q622425",
    museum: "Q33506",
    airport: "Q1248784",
    theme_park: "Q2416723",
    nature: "Q2143825"
  }
}

/*

===== QUERIES =====

*/

/*
---- DOMESTIC ----
*/

export const dom_budgets_query = async ({ options }) => {
  // prettier-ignore
  const q = `
  SELECT DISTINCT ?place ?placeLabel WHERE {
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
  ORDER BY DESC(?pop) LIMIT 10`
  console.log(q)
  const url = getUrl(q)
  let r = await fetch(url, {
    headers: headers
  })
  r = await r.json()
  console.log(r)
  let city_codes = {}
  for (let i of r.results.bindings) {
    const place_code = i.place.value
    const place_name = i.placeLabel.value
    // const attraction_name = i.attractionLabel.value
    const g = place_code.split("entity/")
    city_codes[g[1]] = place_name
  }

  return city_codes
}

export const final_query = async ({ codes_list, ranks }) => {
  if (codes_list.length === 0) {
    return []
  }

  let rankCopy = ranks
  const fiveRank = Object.keys(rankCopy).reduce((a, b) =>
    rankCopy[a] > rankCopy[b] ? a : b
  )
  delete rankCopy[fiveRank]

  const fourRank = Object.keys(rankCopy).reduce((a, b) =>
    rankCopy[a] > rankCopy[b] ? a : b
  )

  console.log(fiveRank, fourRank)

  /*
  get top two ranks here
  */

  let potential_cities = {}
  for (let query of Object.keys(codes_list)) {
    //prettier-ignore
    let q = `
    SELECT DISTINCT ?${fiveRank}Label ?${fourRank}Label ?place ?placeLabel WHERE {
      ?${fiveRank} wdt:P31/wdt:P279* wd:${codes.ranking_codes[fiveRank]} .
      ?${fiveRank} wdt:P131 ?place .
      OPTIONAL{?${fourRank} wdt:P31/wdt:P279* wd:${codes.ranking_codes[fourRank]};
              wdt:P131 ?place .}
      FILTER(?place = wd:${query})
      SERVICE wikibase:label { bd:serviceParam wikibase:language "en". }
    }
  `

    const url = getUrl(q)
    let r = await fetch(url, {
      headers: headers
    })
    r = await r.json()
    // console.log(r)

    if (r.results.bindings) {
      for (let i of r.results.bindings) {
        const place_code = i.place.value
        const place_name = i.placeLabel.value
        const g = place_code.split("entity/")
        potential_cities[g[1]] = place_name
      }
    }
  }
  console.log(potential_cities)
  return potential_cities
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
      SELECT DISTINCT ?item ?itemLabel WHERE {
        ?attraction wdt:P31 wd:${codes.attraction[options.attraction]} ;
                    wdt:P131 ?item .
        ?item wdt:P17/wdt:P279* ?country .
        ?country wdt:P30 wd:Q49 .
        FILTER NOT EXISTS {?country wdt:P31 wd:Q1489259}
        FILTER NOT EXISTS {?country wdt:P31 wd:Q417175}
        FILTER NOT EXISTS {?country wdt:P31 wd:Q5123999}
        SERVICE wikibase:label { bd:serviceParam wikibase:language "en" }
      } LIMIT 10`
  } else if (options.budget === "moderate") {
    // prettier-ignore
    q = `
    SELECT DISTINCT ?item ?itemLabel WHERE {
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
    } ORDER BY DESC(?pop) LIMIT 10
    `
  } else {
    // prettier-ignore
    q = `
    SELECT DISTINCT ?item ?itemLabel WHERE {
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
    } ORDER BY DESC(?pop) LIMIT 10 `
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
