import React, { useContext, useEffect } from "react"
import classnames from "classnames"
import "./Ask.css"
import { Steps, StepMap } from "../Steps"
import { Link, Redirect } from "react-router-dom"
import { GlobalContext } from "../../Context/GlobalContext"
import Loader from "../../Components/Loader/Loader"

const Ask = ({ location, match, history }) => {
  const GlobalState = useContext(GlobalContext)
  const { step } = match.params
  const prevStep = Number(step) - 1
  const nextStep = Number(step) + 1

  const stepToState = {
    1: "state",
    2: "location",
    3: "budget",
    4: "attraction",
    5: "nightlife",
    6: "museum",
    7: "airport",
    8: "theme_park",
    9: "nature"
  }

  useEffect(() => {
    if (location.pathname !== "/ask/1" && !GlobalState.location) {
      history.push("/ask/1")
    }
  }, [])

  useEffect(() => {
    if (GlobalState.final_cities) {
      history.push("/results")
    }
  }, [GlobalState.final_cities])

  /*
  Get the object from global state and check to see if the current step, as derived from stepToState is filled in

  GlobalState: {
    StepName: 'some_value'
  }
  */
  const stateStep = stepToState[step]
  const isStepReady = GlobalState[stateStep]

  const handleNext = () => {
    history.push(`/ask/${nextStep}`)
  }
  return (
    <div className="ask-page-container">
      <div className="ask-page__interactable-container">
        <Steps step={step} />
        <div className="ask-page__progress">
          {step > 1 && (
            <Link to={`/ask/${prevStep}`} className="ask-page__navigate">
              Back
            </Link>
          )}
          {step < Object.keys(StepMap).length && (
            <button
              disabled={!isStepReady || GlobalState.isStepLoading}
              onClick={handleNext}
              className={classnames("ask-page__navigate ask-page__next", {
                "ask-page__navigate--inactive":
                  !isStepReady || GlobalState.isStepLoading
              })}
            >
              {GlobalState.isStepLoading ? <Loader /> : "Next"}
            </button>
          )}
          {step == Object.keys(StepMap).length && (
            <button
              className={classnames("ask-page__navigate ask-page__next", {
                "ask-page__navigate--inactive":
                  !isStepReady || GlobalState.isStepLoading
              })}
              onClick={GlobalState.handleFinish}
            >
              {GlobalState.isStepLoading ? <Loader /> : "Find my vacation! 😎"}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
export default Ask
