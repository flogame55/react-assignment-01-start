// R1, R2: รายการ 151 ตัว · ค้นหา ?q= · ธาตุ ?type= (useSearchParams) · loading / error / ไม่พบผลลัพธ์
import { useSearchParams } from 'react-router-dom'
import { useFetch } from '../hooks/useFetch'
import { useTeam } from '../context/TeamContext'
import { API, MAX_ID, TYPES, idFromUrl } from '../lib/pokemon.js'
import PokemonCard from '../components/PokemonCard'

function PokemonList() {
  const [searchParams, setSearchParams] = useSearchParams()
  const q = searchParams.get('q') || ''
  const type = searchParams.get('type') || ''
  const { has } = useTeam()

  // 1. Fetch รายชื่อ 151 ตัวแรก (ยิงเสมอ)
  const {
    data: allData,
    loading: allLoading,
    error: allError,
  } = useFetch(`${API}/pokemon?limit=${MAX_ID}`)

  // 2. Fetch Pokémon ตามธาตุ (ยิงเฉพาะตอนเลือกธาตุ — ถ้า type ว่าง ส่ง null เพื่อไม่ยิง)
  const {
    data: typeData,
    loading: typeLoading,
    error: typeError,
  } = useFetch(type ? `${API}/type/${type}` : null)

  // Twist 2: พิมพ์ค้นหาแล้วกด back ครั้งเดียวออกจากการค้นหาทั้งหมด
  const handleSearchChange = (e) => {
    const nextQ = e.target.value
    setSearchParams(
      (prev) => {
        const next = new URLSearchParams(prev)
        if (nextQ) {
          next.set('q', nextQ)
        } else {
          next.delete('q')
        }
        return next
      },
      { replace: Boolean(q) }
    )
  }

  const handleTypeChange = (e) => {
    const nextType = e.target.value
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev)
      if (nextType) {
        next.set('type', nextType)
      } else {
        next.delete('type')
      }
      return next
    })
  }

  const clearSearch = () => {
    setSearchParams(
      (prev) => {
        const next = new URLSearchParams(prev)
        next.delete('q')
        return next
      },
      { replace: true }
    )
  }

  const isLoading = allLoading || (Boolean(type) && typeLoading)
  const error = allError || (Boolean(type) && typeError)

  // ดึงรายการโปเกมอน 151 ตัวแรก
  const allPokemon = (allData?.results || [])
    .map((p) => ({
      id: idFromUrl(p.url),
      name: p.name,
    }))
    .filter((p) => p.id >= 1 && p.id <= MAX_ID)

  // เซตของ ID โปเกมอนตามธาตุที่เลือก (Twist 3: กรองเฉพาะ id <= MAX_ID)
  const typePokemonIds = typeData?.pokemon
    ? new Set(
        typeData.pokemon
          .map((p) => idFromUrl(p.pokemon.url))
          .filter((id) => id >= 1 && id <= MAX_ID)
      )
    : null

  // กรองร่วมกัน (AND) ทั้งธาตุและคำค้น
  let filteredList = allPokemon

  if (type && typePokemonIds) {
    filteredList = filteredList.filter((p) => typePokemonIds.has(p.id))
  }

  const trimmedQ = q.trim().toLowerCase()
  if (trimmedQ) {
    filteredList = filteredList.filter((p) =>
      p.name.toLowerCase().includes(trimmedQ)
    )
  }

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      {/* ส่วนค้นหาและกรองธาตุ (ค่ามาจาก URL เสมอ) */}
      <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm sm:p-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <input
              type="text"
              value={q}
              onChange={handleSearchChange}
              placeholder="ค้นหาชื่อ Pokémon (เช่น char, pikachu)..."
              className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500"
            />
            {q && (
              <button
                type="button"
                onClick={clearSearch}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                title="ล้างคำค้น"
              >
                ✕
              </button>
            )}
          </div>
          <div className="w-full sm:w-48">
            <select
              value={type}
              onChange={handleTypeChange}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm capitalize focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500"
            >
              {TYPES.map((t) => (
                <option key={t} value={t}>
                  {t === '' ? 'ธาตุทั้งหมด' : t}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* สถานะที่ 1: กำลังโหลด */}
      {isLoading && (
        <div className="rounded-xl border border-gray-200 bg-white p-12 text-center shadow-sm">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-red-600 border-r-transparent"></div>
          <p className="mt-3 text-sm text-gray-500">กำลังโหลดข้อมูล Pokémon...</p>
        </div>
      )}

      {/* สถานะที่ 2: โหลดไม่สำเร็จ / เกิดข้อผิดพลาด */}
      {error && !isLoading && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-center text-red-700 shadow-sm">
          <p className="text-xl">⚠️</p>
          <p className="mt-2 font-semibold">เกิดข้อผิดพลาดในการโหลดข้อมูล</p>
          <p className="mt-1 text-sm text-red-600">{error}</p>
        </div>
      )}

      {/* สถานะที่ 3: ไม่พบผลลัพธ์ */}
      {!isLoading && !error && filteredList.length === 0 && (
        <div className="rounded-xl border border-gray-200 bg-white p-12 text-center shadow-sm">
          <p className="text-4xl">🔍</p>
          <h3 className="mt-2 text-lg font-semibold text-gray-800">ไม่พบผลลัพธ์</h3>
          <p className="mt-1 text-sm text-gray-500">
            ไม่พบ Pokémon ที่ตรงกับคำค้นหรือธาตุที่เลือก
          </p>
        </div>
      )}

      {/* แสดงรายการผลลัพธ์ */}
      {!isLoading && !error && filteredList.length > 0 && (
        <div>
          <p className="mb-3 text-sm font-medium text-gray-500">
            พบ {filteredList.length} ตัว
          </p>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            {filteredList.map((p) => (
              <PokemonCard
                key={p.id}
                id={p.id}
                name={p.name}
                isInTeam={has(p.id)}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default PokemonList
