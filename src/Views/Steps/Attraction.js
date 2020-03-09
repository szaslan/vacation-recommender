import React from "react"
import { Prompt } from "../../Components/Prompt"
import * as _ from "lodash"
import classnames from "classnames"
import { attraction } from "../../Constants"

const Attraction = ({ ContextValue }) => {
  return (
    <div>
      <Prompt promptText="How would you most like to spend your vacation? (Pick one)" />
      {Object.entries(attraction).map(([key, tagLine], i) => (
        <div
          key={i}
          onClick={() =>
            ContextValue.handleChange({ field: "attraction", value: key })
          }
          role="button"
          className={classnames("step-option", {
            "step-option--selected": ContextValue.attraction === key
          })}
        >
          {tagLine}
        </div>
      ))}
    </div>
  )
}

export default Attraction
