import React, { createContext, useState } from "react"
import {
  int_continents_query,
  int_budgets_query,
  dom_budgets_query,
  final_query
} from "../queries"

export const GlobalContext = createContext({})

class GlobalContextProvider extends React.Component {
  getContinents = async () => {
    const continents = await int_continents_query({
      officalCode: this.state.state
    })
    const continents_in_order = Object.entries(continents)
    const med_continents = continents_in_order
      .slice(0, 2)
      .reduce((acc, curr) => {
        acc[curr[0]] = curr[1]
        return acc
      }, {})
    const high_continents = continents_in_order.slice(2).reduce((acc, curr) => {
      acc[curr[0]] = curr[1]
      return acc
    }, {})
    this.setState({
      continents,
      med_continents,
      high_continents,
      isStepLoading: false
    })
  }

  intBudget = async () => {
    const place_codes = await int_budgets_query({
      options: {
        attraction: this.state.attraction,
        budget: this.state.budget
      },
      med_continents: Object.keys(this.state.med_continents),
      high_continents: Object.keys(this.state.high_continents),
      continents: this.state.continents
    })
    this.setState({
      place_codes: place_codes,
      isStepLoading: false
    })
  }

  domBudget = async () => {
    const place_codes = await dom_budgets_query({
      options: {
        attraction: this.state.attraction,
        budget: this.state.budget,
        officalCode: this.state.state
      }
    })

    this.setState({
      place_codes,
      isStepLoading: false
    })
  }

  handleFinish = async () => {
    /*
    Get the rankings, then run either domestic or international query for all    
    */
    this.setState({ isStepLoading: true })
    const q = await final_query({
      codes_list: this.state.place_codes,
      ranks: {
        nightlife: this.state.nightlife,
        museum: this.state.museum,
        airport: this.state.airport,
        theme_park: this.state.theme_park,
        nature: this.state.nature
      }
    })

    this.setState({
      final_cities: q,
      isStepLoading: false
    })
  }

  restart = () => {
    const state = this.getInitalState()
    this.setState(state)
  }

  /*
    Need some structure to store state as user progresses, and build query
  */

  handleChange = ({ field, value }) => {
    /*
      dispatch appropriate actions on changes
    */

    this.setState(
      {
        [field]: value
      },
      () => {
        switch (field) {
          case "location":
            if (value === "international") {
              if (!this.state.continents) {
                this.setState({ isStepLoading: true })
                this.getContinents()
              }
            }
            break
          case "attraction":
            this.setState({ isStepLoading: true })
            if (this.state.location === "international") {
              this.intBudget()
            } else {
              // domestic
              this.domBudget()
            }
          default:
            console.log("default")
        }
      }
    )
  }

  getInitalState = () => {
    return {
      handleChange: this.handleChange,
      handleFinish: this.handleFinish,
      restart: this.restart
    }
  }
  state = this.getInitalState()

  render() {
    return (
      <GlobalContext.Provider value={this.state}>
        {this.props.children}
      </GlobalContext.Provider>
    )
  }
}

export default GlobalContextProvider
