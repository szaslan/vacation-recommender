import React from "react"
import { Prompt } from "../../Components/Prompt"
import * as _ from "lodash"
import classnames from "classnames"
/*
Warm
Cool
Temperate
*/

const TEMPS = ["warm", "cool", "temperate"]

const Climate = ({ ContextValue }) => {
  return (
    <div>
      <Prompt promptText="Which climate would you like to go to? (Pick one)" />
      {TEMPS.map(temp => (
        <div
          onClick={() =>
            ContextValue.handleChange({ field: "climate", value: temp })
          }
          role="button"
          className={classnames("step-option", {
            "step-option--selected": ContextValue.climate === temp
          })}
        >
          {_.capitalize(temp)}
        </div>
      ))}
    </div>
  )
}

export default Climate
