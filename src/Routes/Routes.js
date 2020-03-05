import React from "react"
import App from "../App"
import { BrowserRouter as Router, Route, Switch } from "react-router-dom"

export default () => {
  return (
    <Router>
      <Route path="/" component={App} />
    </Router>
  )
}
