import React from "react"
import { Link } from "react-router-dom"
import "./App.css"

function App() {
  return (
    <div className="App">
      <div className="App-header">
        <div className="home-content">
          <div className="home-page-header">TripPal</div>
          <div className="home-page__action">
            <div className="home-page-subheader">
              Find your perfect getaway destination!
            </div>
            <Link to="/ask/1">
              <button className="home-page-navigate">Begin!</button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default App
