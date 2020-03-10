import React from "react"
import { states } from "../../Constants"
import { Prompt } from "../../Components/Prompt"
const State = ({ ContextValue }) => {
  return (
    <div>
      <Prompt promptText="What state are you in?" />
      <select
        style={{ width: "100%" }}
        onChange={e => {
          ContextValue.handleChange({ field: "state", value: e.target.value })
        }}
      >
        <option disabled selected value>
          Select a state
        </option>

        {Object.keys(states).map((state, i) => {
          return (
            <option
              key={i}
              value={states[state]}
              selected={ContextValue.state === states[state]}
            >
              {state}
            </option>
          )
        })}
      </select>
    </div>
  )
}

export default State
