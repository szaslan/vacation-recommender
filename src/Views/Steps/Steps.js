import React, { useContext, useEffect } from "react"
import { GlobalContext } from "../../Context/GlobalContext"
import Climate from "./Climate"
import Landscape from "./Landscape"
import { queries } from "../../queries"
import "./Steps.css"

const Test = ({ ContextValue }) => {
  useEffect(() => {
    const getCities = async () => {
      const climate = ContextValue.climate
      const landscape = ContextValue.landscape
      const url = `https://query.wikidata.org/sparql?query=${encodeURIComponent(
        queries[climate][landscape]
      )}`

      // Object.keys(params).forEach(key =>
      //   url.searchParams.append(key, params[key])
      // )
      let r = await fetch(url, {
        headers: { Accept: "application/sparql-results+json" }
      })
      r = await r.json()
      console.log(r)
    }
    getCities()
  }, [])

  return <div>check console dingus</div>
}

export const StepMap = {
  1: <Climate />,
  2: <Landscape />,
  3: <Test />
}

const Steps = ({ step, ...rest }) => {
  const r = React.useRef(null)
  const ContextValue = useContext(GlobalContext)
  console.log(ContextValue)

  useEffect(() => {
    // if (ContextValue.isStepReady) {
    //   ContextValue.handleChange({ field: "isStepReady", value: false })
    // }
  }, [step, ContextValue])
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
