// R4, R6: การ์ดสมาชิก · เอาออก/ล้างทีม · ข้อความทีมว่าง · ฟอร์มลงทะเบียนทีม (ต้องมีอย่างน้อย 3 ตัว)
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useTeam } from '../context/TeamContext'
import { createRegistrationSchema } from '../schemas/registration'
import PokemonCard from '../components/PokemonCard'

const MIN_TEAM_SIZE = 3

const FIELDS = [
  { name: 'trainerName', label: 'ชื่อเทรนเนอร์' },
  { name: 'teamName', label: 'ชื่อทีม' },
  { name: 'email', label: 'อีเมล', type: 'email' },
  { name: 'confirmEmail', label: 'ยืนยันอีเมล', type: 'email' },
]

function Team() {
  const { team, removePokemon, clearTeam, count } = useTeam()
  const [summary, setSummary] = useState(null)

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(createRegistrationSchema(team.map((p) => p.name))),
    mode: 'onTouched',
  })

  const missing = MIN_TEAM_SIZE - count

  const onSubmit = async ({ trainerName, teamName }) => {
    await new Promise((resolve) => setTimeout(resolve, 800))
    setSummary({ trainerName, teamName, members: team })
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <section>
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold">ทีมของฉัน ({count}/6)</h1>
          {count > 0 && (
            <button type="button" onClick={clearTeam} className="px-3 py-1 rounded border border-red-500 text-red-600">
              ล้างทีม
            </button>
          )}
        </div>

        {count === 0 ? (
          <p className="text-gray-500">ยังไม่มีสมาชิกในทีม</p>
        ) : (
          <ul className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {team.map((p) => (
              <li key={p.id} className="space-y-2">
                <PokemonCard id={p.id} name={p.name} isInTeam={true} />
                <button type="button" onClick={() => removePokemon(p.id)} className="w-full px-3 py-1 rounded bg-red-500 text-white">
                  เอาออก
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section>
        <h2 className="text-xl font-bold mb-4">ลงทะเบียนทีม</h2>
        <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4 max-w-md">
          {FIELDS.map(({ name, label, type = 'text' }) => (
            <div key={name}>
              <label htmlFor={name} className="block font-medium">{label}</label>
              <input id={name} type={type} {...register(name)} className="w-full border rounded px-3 py-2" />
              {errors[name] && <p className="text-sm text-red-600">{errors[name].message}</p>}
            </div>
          ))}

          {missing > 0 && (
            <p className="text-sm text-amber-600">ต้องมีอย่างน้อย {MIN_TEAM_SIZE} ตัว (ขาดอีก {missing} ตัว)</p>
          )}

          <button type="submit" disabled={missing > 0 || isSubmitting} className="px-4 py-2 rounded bg-blue-600 text-white disabled:opacity-50">
            {isSubmitting ? 'กำลังส่ง…' : 'ลงทะเบียนทีม'}
          </button>
        </form>
      </section>

      {summary && (
        <section className="border rounded p-4 bg-green-50">
          <h2 className="text-xl font-bold mb-2">ลงทะเบียนสำเร็จ 🎉</h2>
          <p>ชื่อเทรนเนอร์: {summary.trainerName}</p>
          <p>ชื่อทีม: {summary.teamName}</p>
          <p className="mt-2 font-medium">สมาชิก:</p>
          <ul className="list-disc list-inside">
            {summary.members.map((p) => (
              <li key={p.id} className="capitalize">#{p.id} {p.name}</li>
            ))}
          </ul>
        </section>
      )}
    </div>
  )
}
export default Team
