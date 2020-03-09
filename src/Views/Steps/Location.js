import React from "react"
import { Prompt } from "../../Components/Prompt"
import * as _ from "lodash"
import classnames from "classnames"
import { location } from "../../Constants"
/*
Warm
Cool
Temperate
*/

const Location = ({ ContextValue }) => {
  return (
    <div>
      <Prompt promptText="Would you like to travel internationally or domestically?" />
      {Object.entries(location).map(([key, tagLine], i) => (
        <div
          key={i}
          onClick={() =>
            ContextValue.handleChange({ field: "location", value: key })
          }
          role="button"
          className={classnames("step-option", {
            "step-option--selected": ContextValue.location === key
          })}
        >
          {tagLine}
        </div>
      ))}
    </div>
  )
}

export default Location
