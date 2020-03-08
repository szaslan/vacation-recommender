import React, { useState } from "react"
import { CSSTransition } from "react-transition-group"
import "./AnimatedSection.css"

const AnimatedSection = ({ children }) => {
  const [inProp, setInProp] = useState(false)
  return (
    <CSSTransition in={true} timeout={200} classNames="transition-container">
      {children({
        setInProp
      })}
    </CSSTransition>
  )
}
export default AnimatedSection
