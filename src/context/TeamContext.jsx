// ว่างไว้ตั้งใจ — R4, R5: createContext + TeamProvider + useTeam() (พร้อม guard) · สูงสุด 6 ตัว ห้ามซ้ำ · เก็บใน localStorage
import { createContext, useContext, useState, useEffect } from 'react'

const STORAGE_KEY = 'pokedex-team'
const MAX_TEAM_SIZE = 6

const TeamContext = createContext(null)

export function TeamProvider({ children }) {
  const [team, setTeam] = useState(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (!stored) return []
      const parsed = JSON.parse(stored)
      return Array.isArray(parsed) ? parsed : []
    } catch {
      return []
    }
  })

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(team))
    } catch (e) {
      console.error('Failed to save team to localStorage:', e)
    }
  }, [team])

  const addPokemon = (pokemon) => {
    if (!pokemon || typeof pokemon.id !== 'number') return
    setTeam((prev) => {
      if (prev.length >= MAX_TEAM_SIZE) return prev
      if (prev.some((p) => p.id === pokemon.id)) return prev
      return [...prev, { id: pokemon.id, name: pokemon.name }]
    })
  }

  const removePokemon = (id) => {
    setTeam((prev) => prev.filter((p) => p.id !== id))
  }

  const clearTeam = () => {
    setTeam([])
  }

  const count = team.length
  const isFull = team.length >= MAX_TEAM_SIZE
  const has = (id) => team.some((p) => p.id === id)

  return (
    <TeamContext.Provider
      value={{
        team,
        addPokemon,
        removePokemon,
        clearTeam,
        count,
        isFull,
        has,
      }}
    >
      {children}
    </TeamContext.Provider>
  )
}

export function useTeam() {
  const ctx = useContext(TeamContext)
  if (!ctx) {
    throw new Error('useTeam must be used within TeamProvider')
  }
  return ctx
}

