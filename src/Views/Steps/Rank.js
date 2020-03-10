import React from "react"
import classnames from "classnames"
import { Prompt } from "../../Components/Prompt"

const ranks = [1, 2, 3, 4, 5]

const Rank = ({ options, ContextValue }) => {
  const { contextName, stringName, plural } = options

  const p = plural ? "are" : "is"
  return (
    <div>
      <Prompt promptText={`How important ${p} ${stringName}?`} />
      <div className="rank__options-container">
        {/* <div>Not Important</div> */}
        {ranks.map((rank, i) => {
          return (
            <button
              key={i}
              onClick={() =>
                ContextValue.handleChange({
                  field: contextName,
                  value: rank
                })
              }
              className={classnames("rank__option", {
                "rank__option--selected": ContextValue[contextName] === rank
              })}
            >
              {rank}
            </button>
          )
        })}
        {/* <div>I need this to be happy</div> */}
      </div>
    </div>
  )
}

export default Rank
