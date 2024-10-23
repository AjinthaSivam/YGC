import React, { createContext, useContext, useState } from 'react'

const PremiumContext = createContext()

export const PremiumProvider = ({ children }) => {
    const [isPremium, setIsPremium] = useState(false)

    return (
            <PremiumContext.Provider value={{ isPremium, setIsPremium }}>
                {children}
            </PremiumContext.Provider>
    )
}

export const usePremium = () => useContext(PremiumContext)
