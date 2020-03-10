import React, { useContext, useEffect, useState } from "react"
import { GlobalContext } from "../../Context/GlobalContext"
import Climate from "./Climate"
import Landscape from "./Landscape"
import State from "./State"
import Location from "./Location"
import Budget from "./Budget"
import Rank from "./Rank"
import Attraction from "./Attraction"
import { queries } from "../../queries"
import "./Steps.css"

// const Test = ({ ContextValue }) => {
//   useEffect(() => {
//     const getCities = async () => {
//       const climate = ContextValue.climate
//       const landscape = ContextValue.landscape
//       const url = `https://query.wikidata.org/sparql?query=${encodeURIComponent(
//         queries[climate][landscape]
//       )}`

//       // Object.keys(params).forEach(key =>
//       //   url.searchParams.append(key, params[key])
//       // )
//       let r = await fetch(url, {
//         headers: { Accept: "application/sparql-results+json" }
//       })
//       r = await r.json()
//       console.log(r)
//     }
//     getCities()
//   }, [])

//   return <div>check console dingus</div>
// }

export const StepMap = {
  1: <State />,
  2: <Location />,
  3: <Budget />,
  4: <Attraction />,
  5: (
    <Rank
      options={{
        stringName: "nightlife",
        plural: false,
        contextName: "nightlife"
      }}
    />
  ),
  6: (
    <Rank
      options={{
        stringName: "museums",
        plural: true,
        contextName: "museum"
      }}
    />
  ),
  7: (
    <Rank
      options={{
        stringName: "proximity to an aiport",
        plural: false,
        contextName: "airport"
      }}
    />
  ),
  8: (
    <Rank
      options={{
        stringName: "theme parks",
        plural: true,
        contextName: "theme_park"
      }}
    />
  ),
  9: (
    <Rank
      options={{
        stringName: "nature",
        plural: false,
        contextName: "nature"
      }}
    />
  )
}

const Steps = ({ step, ...rest }) => {
  const r = React.useRef(null)
  const ContextValue = useContext(GlobalContext)
  console.log(ContextValue)

  //Wrap Component Here with Animation
  return (
    <div className="ask-page__steps-container" ref={r}>
      {React.cloneElement(StepMap[step], {
        ContextValue,
        ...rest
      })}
    </div>
  )
}
export default Steps
