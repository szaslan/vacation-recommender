import React from "react"
import { Prompt } from "../../Components/Prompt"
import * as _ from "lodash"
import classnames from "classnames"
import { landscapes } from "../../Constants"
/*
Warm
Cool
Temperate
*/

const Landscape = ({ ContextValue }) => {
  const selectedClimate = ContextValue.climate
  return (
    <div>
      <Prompt promptText="What would you like to do most? (Pick one)" />
      {Object.entries(landscapes[selectedClimate]).map(([key, tagLine]) => (
        <div
          onClick={() =>
            ContextValue.handleChange({ field: "landscape", value: key })
          }
          role="button"
          className={classnames("step-option", {
            "step-option--selected": ContextValue.landscape === key
          })}
        >
          {tagLine}
        </div>
      ))}
    </div>
  )
}

export default Landscape
