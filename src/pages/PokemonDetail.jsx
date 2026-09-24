// ว่างไว้ตั้งใจ — R3: อ่าน nameOrId จาก useParams · ธาตุ · ม./กก. · เพิ่ม/เอาออกจากทีม · ก่อนหน้า/ถัดไป · นอก #1–#151 = ไม่อยู่ใน Pokédex นี้
import { useParams, Link } from 'react-router-dom'
import { useFetch } from '../hooks/useFetch'
import { useTeam } from '../context/TeamContext'
import { API, MAX_ID, artworkUrl } from '../lib/pokemon.js'

function PokemonDetail() {
  const { nameOrId } = useParams()
  const { addPokemon, removePokemon, has, isFull } = useTeam()

  // ส่ง nameOrId เป็นตัวพิมพ์เล็กเสมอ เพื่อให้ค้นหาได้ทั้งแบบพิมพ์ชื่อตัวพิมพ์ใหญ่ เช่น "Pikachu" หรือ id "25"
  const cleanParam = nameOrId ? nameOrId.trim().toLowerCase() : ''
  const { data, loading, error } = useFetch(cleanParam ? `${API}/pokemon/${cleanParam}` : null)

  if (loading) {
    return (
      <div className="mx-auto max-w-2xl py-12 px-4 text-center">
        <div className="rounded-lg border border-gray-200 bg-white p-8 shadow-sm">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-red-600 border-r-transparent"></div>
          <p className="mt-3 text-gray-500">กำลังโหลดข้อมูล Pokémon...</p>
        </div>
      </div>
    )
  }

  if (error || !data) {
    return (
      <div className="mx-auto max-w-2xl py-12 px-4 text-center">
        <div className="rounded-lg border border-red-200 bg-red-50 p-8 shadow-sm">
          <p className="text-4xl">🔍</p>
          <h2 className="mt-2 text-xl font-bold text-red-700">ไม่พบ Pokémon</h2>
          <p className="mt-1 text-sm text-red-600">
            {error || `ไม่พบข้อมูลสำหรับ "${nameOrId}"`}
          </p>
          <div className="mt-6">
            <Link
              to="/pokemon"
              className="inline-block rounded-md bg-red-600 px-4 py-2 font-semibold text-white transition hover:bg-red-700"
            >
              ← กลับไปหน้ารายการ
            </Link>
          </div>
        </div>
      </div>
    )
  }

  // Twist 3: ตรวจสอบว่าอยู่ในรุ่นแรก (#1–#151) หรือไม่
  if (data.id < 1 || data.id > MAX_ID) {
    return (
      <div className="mx-auto max-w-2xl py-12 px-4 text-center">
        <div className="rounded-lg border border-amber-300 bg-amber-50 p-8 shadow-sm">
          <p className="text-4xl">⚠️</p>
          <h2 className="mt-2 text-xl font-bold text-amber-800">
            ไม่อยู่ใน Pokédex นี้
          </h2>
          <p className="mt-2 text-sm text-amber-700">
            Pokémon #{data.id} <span className="capitalize font-semibold">{data.name}</span> อยู่นอกเหนือจากรุ่นแรก (#1–#{MAX_ID})
          </p>
          <div className="mt-6">
            <Link
              to="/pokemon"
              className="inline-block rounded-md bg-amber-800 px-4 py-2 font-semibold text-white transition hover:bg-amber-900"
            >
              ← กลับไปหน้ารายการ
            </Link>
          </div>
        </div>
      </div>
    )
  }

  const inTeam = has(data.id)
  const heightMeters = (data.height / 10).toFixed(1)
  const weightKg = (data.weight / 10).toFixed(1)
  const formattedId = `#${String(data.id).padStart(3, '0')}`

  return (
    <div className="mx-auto max-w-2xl py-6 px-4">
      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
          <div className="flex justify-center sm:w-1/2">
            <img
              src={artworkUrl(data.id)}
              alt={data.name}
              className="h-48 w-48 object-contain transition duration-200 hover:scale-105"
            />
          </div>

          <div className="flex-1">
            <p className="text-sm font-semibold text-gray-400">{formattedId}</p>
            <h1 className="text-3xl font-bold capitalize text-gray-900">{data.name}</h1>

            {/* แสดงธาตุ (Types) */}
            <div className="mt-3 flex flex-wrap gap-2">
              {data.types?.map((t) => (
                <span
                  key={t.slot}
                  className="rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold capitalize text-gray-700 border border-gray-200"
                >
                  {t.type.name}
                </span>
              ))}
            </div>

            {/* แปลงหน่วย ส่วนสูง / น้ำหนัก */}
            <dl className="mt-5 grid grid-cols-2 gap-4 rounded-lg bg-gray-50 p-4 border border-gray-100 text-sm">
              <div>
                <dt className="text-gray-500">ส่วนสูง</dt>
                <dd className="font-semibold text-gray-900">{heightMeters} ม.</dd>
              </div>
              <div>
                <dt className="text-gray-500">น้ำหนัก</dt>
                <dd className="font-semibold text-gray-900">{weightKg} กก.</dd>
              </div>
            </dl>

            {/* ปุ่ม เพิ่มเข้าทีม / เอาออกจากทีม */}
            <div className="mt-6">
              {inTeam ? (
                <button
                  type="button"
                  onClick={() => removePokemon(data.id)}
                  className="w-full sm:w-auto rounded-md border border-red-600 bg-white px-4 py-2 text-sm font-semibold text-red-600 transition hover:bg-red-50 cursor-pointer shadow-sm"
                >
                  เอาออกจากทีม
                </button>
              ) : (
                <div>
                  <button
                    type="button"
                    onClick={() => addPokemon({ id: data.id, name: data.name })}
                    disabled={isFull}
                    className={`w-full sm:w-auto rounded-md px-5 py-2 text-sm font-semibold text-white transition shadow-sm ${
                      isFull
                        ? 'bg-gray-300 cursor-not-allowed'
                        : 'bg-red-600 hover:bg-red-700 cursor-pointer'
                    }`}
                  >
                    เพิ่มเข้าทีม
                  </button>
                  {isFull && (
                    <p className="mt-1.5 text-xs text-red-600 font-medium">
                      ทีมเต็มแล้ว (สูงสุด 6 ตัว)
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ลิงก์ ก่อนหน้า / กลับหน้ารายการ / ถัดไป */}
        <div className="mt-8 flex items-center justify-between border-t border-gray-200 pt-4 text-sm">
          {data.id > 1 ? (
            <Link
              to={`/pokemon/${data.id - 1}`}
              className="font-medium text-red-600 hover:underline"
            >
              ← #{String(data.id - 1).padStart(3, '0')}
            </Link>
          ) : (
            <span className="text-gray-300 select-none">← ตัวแรก</span>
          )}

          <Link
            to="/pokemon"
            className="font-medium text-gray-600 hover:text-gray-900 hover:underline"
          >
            กลับหน้ารายการ
          </Link>

          {data.id < MAX_ID ? (
            <Link
              to={`/pokemon/${data.id + 1}`}
              className="font-medium text-red-600 hover:underline"
            >
              #{String(data.id + 1).padStart(3, '0')} →
            </Link>
          ) : (
            <span className="text-gray-300 select-none">ตัวสุดท้าย →</span>
          )}
        </div>
      </div>
    </div>
  )
}

export default PokemonDetail

