// R7: PokemonCard ใช้ซ้ำทั้งหน้า /pokemon และ /team
// แสดง: รูป (artworkUrl) + #id + ชื่อ + ป้าย "อยู่ในทีม" (ถ้า isInTeam)
// คลิกการ์ด -> Link ไป /pokemon/{id}
import { Link } from 'react-router-dom'
import { artworkUrl } from '../lib/pokemon.js'

function PokemonCard({ id, name, isInTeam = false }) {
  const formattedId = `#${String(id).padStart(3, '0')}`

  return (
    <Link
      to={`/pokemon/${id}`}
      className="group flex flex-col rounded-xl border border-gray-200 bg-white p-3.5 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-red-300 hover:shadow-md"
    >
      <div className="relative flex items-center justify-center p-2">
        <img
          src={artworkUrl(id)}
          alt={name}
          className="h-28 w-28 object-contain transition-transform duration-200 group-hover:scale-105"
          loading="lazy"
        />
        {isInTeam && (
          <span className="absolute right-0 top-0 rounded-full bg-green-600 px-2.5 py-0.5 text-xs font-semibold text-white shadow-xs">
            อยู่ในทีม
          </span>
        )}
      </div>
      <div className="mt-2">
        <p className="text-xs font-medium text-gray-400">{formattedId}</p>
        <p className="font-semibold text-gray-900 capitalize truncate group-hover:text-red-600">
          {name}
        </p>
      </div>
    </Link>
  )
}

export default PokemonCard
