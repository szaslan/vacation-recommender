import React from "react"
import { Prompt } from "../../Components/Prompt"
import * as _ from "lodash"
import classnames from "classnames"
import { budget } from "../../Constants"

const Budget = ({ ContextValue }) => {
  return (
    <div>
      <Prompt promptText="What's your budget?" />
      {Object.entries(budget).map(([key, tagLine], i) => (
        <div
          key={i}
          onClick={() =>
            ContextValue.handleChange({ field: "budget", value: key })
          }
          role="button"
          className={classnames("step-option", {
            "step-option--selected": ContextValue.budget === key
          })}
        >
          {tagLine}
        </div>
      ))}
    </div>
  )
}

export default Budget
