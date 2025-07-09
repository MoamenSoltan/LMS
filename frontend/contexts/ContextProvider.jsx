
import React, { useContext, useState } from "react"
const stateContext=React.createContext()

export const ContextProvider = ({children})=>{

    
 
   return (
    <stateContext.Provider value={{
      
    }}>
        {children}
    </stateContext.Provider>
   )

}

export const useStateContext = ()=>useContext(stateContext)

