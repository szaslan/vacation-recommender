import React, { useContext, useEffect, useState } from "react"
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

  const [slowRequest, setSlowRequest] = useState(false)

  const stateStep = stepToState[step]
  const isStepReady = GlobalState[stateStep]

  useEffect(() => {
    if (location.pathname !== "/ask/1" && !GlobalState.location) {
      history.push("/ask/1")
    }
    window.addEventListener("keypress", handleEnter)
    return () => window.removeEventListener("keypress", handleEnter)
  }, [GlobalState])

  useEffect(() => {
    if (GlobalState.final_cities) {
      history.push("/results")
    }
  }, [GlobalState.final_cities])

  useEffect(() => {
    if (GlobalState.isStepLoading) {
      setTimeout(to, 3000)
    }

    if (!GlobalState.isStepLoading) {
      setSlowRequest(false)
    }
  }, [GlobalState.isStepLoading])

  useEffect(() => {
    if (!slowRequest) {
      console.log("slow false")
      clearTimeout(to)
    }
  }, [slowRequest])

  const handleEnter = e => {
    if (e.key === "Enter") {
      if (isStepReady && !GlobalState.isStepLoading) {
        if (step == Object.keys(StepMap).length) {
          GlobalState.handleFinish()
        } else {
          handleNext()
        }
      }
    }
  }

  const to = () => {
    if (GlobalState.isStepLoading) {
      setSlowRequest(true)
    } else setSlowRequest(false)
  }

  /*
  Get the object from global state and check to see if the current step, as derived from stepToState is filled in

  GlobalState: {
    StepName: 'some_value'
  }
  */

  const handleNext = () => {
    history.push(`/ask/${nextStep}`)
    clearTimeout(to)
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
      {slowRequest && (
        <div className="ask-page__slow-request">
          Finding your perfect destination may take a second!
        </div>
      )}
    </div>
  )
}
export default Ask
