import React from "react"
import App from "../App"
import { Steps } from "../Views/Steps"
import { Ask } from "../Views/Ask"
import { Results } from "../Views/Results"
import { BrowserRouter as Router, Route } from "react-router-dom"

export default () => {
  return (
    <Router>
      <Route path="/" component={App} exact />
      <Route path="/ask/:step" component={Ask} />
      <Route path="/results" component={Results} exact />
    </Router>
  )
}
