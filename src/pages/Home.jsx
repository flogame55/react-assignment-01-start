// ว่างไว้ตั้งใจ — ข้อ 2: ข้อความต้อนรับ + ลิงก์ไป /pokemon + จำนวนสมาชิกทีมตอนนี้
import { Link } from 'react-router-dom'
import { useTeam } from '../context/TeamContext'

function Home() {
  const { count } = useTeam()

  return (
    <div className="mx-auto max-w-2xl py-12 px-4 text-center">
      <div className="rounded-xl border border-gray-200 bg-white p-8 shadow-sm">
        <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl">
          Pokédex Team Builder
        </h1>
        <p className="mt-3 text-base text-gray-600">
          ยินดีต้อนรับสู่ระบบจัดทีม Pokémon รุ่นแรก (#1–#151) เลือกคู่หูเข้าทีมได้สูงสุด 6 ตัว
        </p>

        <div className="mt-6 inline-flex items-center rounded-lg bg-red-50 px-4 py-2 border border-red-200">
          <p className="text-base text-gray-700">
            ตอนนี้ทีมของคุณมี <b className="text-red-600 font-bold">{count}/6</b> ตัว
          </p>
        </div>

        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            to="/pokemon"
            className="w-full sm:w-auto inline-block rounded-lg bg-red-600 px-6 py-2.5 font-semibold text-white transition hover:bg-red-700 shadow-sm"
          >
            ไปหน้ารายการ Pokédex →
          </Link>
          <Link
            to="/team"
            className="w-full sm:w-auto inline-block rounded-lg border border-gray-300 bg-white px-6 py-2.5 font-semibold text-gray-700 transition hover:bg-gray-50 shadow-sm"
          >
            ดูทีมของฉัน ({count}/6)
          </Link>
        </div>
      </div>
    </div>
  )
}

export default Home

