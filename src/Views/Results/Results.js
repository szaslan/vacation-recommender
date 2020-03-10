import React, { useContext } from "react"
import { GlobalContext } from "../../Context/GlobalContext"
import { Redirect } from "react-router-dom"
import "./Results.css"

const Results = ({ history }) => {
  const GlobalState = useContext(GlobalContext)
  const finalCities = GlobalState.final_cities

  if (finalCities === undefined || finalCities === null) {
    return <Redirect to="/ask/1" />
  }

  if (Object.keys(finalCities).length === 0) {
    return (
      <div className="ask-page-container results-page">
        <div className="result-page__text">
          Oops! We couldn't find a vacation for the preferences you entered.
          Please try again with something different!
        </div>
        <button
          className="rank__option"
          onClick={() => history.push("/ask/1")}
          style={{ flex: "0 0" }}
        >
          Start Over
        </button>
      </div>
    )
  }
  const first = Object.keys(finalCities)[0]
  const bestCity = finalCities[first]
  return (
    <div className="ask-page-container results-page">
      <div className="result-page__text">You got</div>
      <div className="result-page__text result-page__text--big">
        {bestCity}!
      </div>
      <iframe
        src={`https://en.wikipedia.org/wiki/${bestCity}`}
        width="100%"
        height="100%"
      ></iframe>
    </div>
  )
}

export default Results
