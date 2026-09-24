# 📋 Assignment 1 — แผนงาน Pokédex Team Builder

> **ส่งภายใน:** เสาร์ 26 ก.ย. 69 เวลา 09:00 น.
> **สมาชิก:** โฟ · กิต · พี

---

## 1. ภาพรวมโจทย์

สร้าง SPA ด้วย React สำหรับเรียกดู Pokémon รุ่นแรก (#1–#151) จัดทีมได้สูงสุด 6 ตัว และลงทะเบียนทีมผ่านฟอร์ม

**Tech Stack ที่ติดตั้งแล้ว:** Vite + React 19 + React Router v7 + Tailwind CSS v4 + react-hook-form + zod + @hookform/resolvers
**ห้ามเพิ่ม:** Redux / Zustand

**API:** PokéAPI (https://pokeapi.co/) — ไม่ต้องใช้ key

---

## 2. การแบ่งงาน

### 👤 โฟ — ระบบทีม + หน้ารายละเอียด (~30 คะแนน)

| ไฟล์ | Requirement | งาน |
|---|---|---|
| `context/TeamContext.jsx` | R4, R5 | Context + `useTeam()` + Guard + กฎ 6 ตัว/ห้ามซ้ำ + localStorage + กัน localStorage เสีย |
| `main.jsx` | R4 | ครอบ `<TeamProvider>` |
| `pages/PokemonDetail.jsx` | R3 | `useParams` + แสดงข้อมูล + แปลง ม./กก. + ปุ่มเพิ่ม/เอาออกทีม + ก่อนหน้า/ถัดไป + กัน id นอก 1–151 |
| `pages/Home.jsx` | ข้อ 2 | ข้อความต้อนรับ + ลิงก์ `/pokemon` + จำนวนทีม |

### 👤 กิต — Data Fetching + หน้ารายการ + การ์ด (~35 คะแนน)

| ไฟล์ | Requirement | งาน |
|---|---|---|
| `hooks/useFetch.js` | R1 | Custom Hook: เช็ค `res.ok` + cleanup + รองรับ `url = null` |
| `pages/PokemonList.jsx` | R1, R2 | ดึง 151 ตัว + ค้นหา/กรองธาตุด้วย `useSearchParams` + fetch endpoint ธาตุ + กรอง id ≤ 151 + 3 สถานะ |
| `components/PokemonCard.jsx` | R7 | การ์ดที่ใช้ซ้ำทั้งหน้า `/pokemon` และ `/team` |

### 👤 พี — โครงสร้าง Routing + ฟอร์ม (~25 คะแนน + ไฟล์เยอะ)

| ไฟล์ | Requirement | งาน |
|---|---|---|
| `App.jsx` | ข้อ 2 | ตั้ง Routes ทั้ง 5 เส้นทาง ภายใต้ Layout Route |
| `components/Layout.jsx` | ข้อ 2 | `<Nav />` + `<Outlet />` + footer |
| `components/Nav.jsx` | ข้อ 2 | `NavLink` + active state + `ทีม (n/6)` |
| `pages/NotFound.jsx` | ข้อ 2 | หน้า 404 + ปุ่มกลับหน้าแรก |
| `pages/Team.jsx` | R4, R6 | แสดงการ์ดสมาชิก + ปุ่มเอาออก/ล้าง + ฟอร์มลงทะเบียน + จำลองรอ 800ms + การ์ดสรุป |
| `schemas/registration.js` | R6 | Zod Schema 4 ช่อง + ชื่อทีมห้ามซ้ำชื่อ Pokémon |

### 👥 ร่วมกัน — README (10 คะแนน)

- กรอกสมาชิก + วิธีรัน + ตอบ 3 ข้อเรื่อง State

---

## 3. ⚠️ ลำดับการทำ (Dependency)

```
ลำดับ 1 (ทำก่อน — ไม่พึ่งใคร):
  กิต → useFetch.js
  โฟ  → TeamContext.jsx + main.jsx
  พี  → App.jsx + Layout.jsx + NotFound.jsx

ลำดับ 2 (ต้องรอลำดับ 1):
  กิต → PokemonCard.jsx (ต้องรู้ว่า useTeam ส่งอะไรมา)
  กิต → PokemonList.jsx (ต้องใช้ useFetch + PokemonCard)
  โฟ  → PokemonDetail.jsx (ต้องใช้ useFetch + useTeam)
  พี  → Nav.jsx (ต้องใช้ useTeam)

ลำดับ 3 (ต้องรอลำดับ 2):
  พี  → Team.jsx (ต้องใช้ useTeam + PokemonCard)
  พี  → registration.js (ต้องรู้ว่าทีมส่งชื่อ Pokémon มายังไง)
```

> 💡 **ถ้าทำตามสัญญา (Contract) ด้านล่างนี้ แต่ละคนเริ่มพร้อมกันได้เลยโดยไม่ต้องรอ**

---

## 4. 🤝 สัญญาร่วม (Interface Contracts)

ส่วนนี้คือข้อตกลงเรื่อง **ชื่อตัวแปร, ชื่อฟังก์ชัน, props, export/import** ที่ทุกคนต้องใช้ตรงกัน เพื่อให้รวมโค้ดแล้วไม่พัง

---

### 4.1 `lib/pokemon.js` — ✅ มีให้แล้ว (ทุกคนใช้ได้เลย)

```
import ที่ใช้:
  import { API, MAX_ID, TYPES, idFromUrl, artworkUrl } from '../lib/pokemon.js'

ค่าที่มี:
  API       = 'https://pokeapi.co/api/v2'     // string — base URL
  MAX_ID    = 151                              // number — id สูงสุด
  TYPES     = ['', 'normal', 'fire', ...]      // string[] — '' = ทั้งหมด
  idFromUrl(url)   → number   // ดึง id จาก URL ท้าย เช่น '.../pokemon/25/' → 25
  artworkUrl(id)   → string   // URL รูป official artwork
```

---

### 4.2 `hooks/useFetch.js` — กิตเขียน / โฟ+กิตใช้

```
import:
  import { useFetch } from '../hooks/useFetch'

เรียกใช้:
  const { data, loading, error } = useFetch(url)

พารามิเตอร์:
  url : string | null
    - string → fetch ตามปกติ
    - null   → ไม่ยิง (data = null, loading = false, error = null)

ค่าที่คืน (object):
  data    : any | null       // JSON ที่ได้จาก response (null ถ้ายังไม่มี/error)
  loading : boolean          // true ระหว่างรอ response
  error   : string | null    // ข้อความ error (null ถ้าไม่มี error)

พฤติกรรมสำคัญ:
  - เช็ค res.ok → ถ้า !res.ok ให้ set error (เช่น "ไม่พบข้อมูล")
  - มี cleanup (AbortController หรือ ignore flag) กัน response เก่าทับใหม่
  - url เปลี่ยน → fetch ใหม่อัตโนมัติ (อยู่ใน dependency ของ useEffect)
  - url = null → ข้ามไม่ยิง ตั้งค่าเป็น { data: null, loading: false, error: null }
```

---

### 4.3 `context/TeamContext.jsx` — โฟเขียน / ทุกคนใช้

```
import:
  import { TeamProvider } from '../context/TeamContext'    // ใช้ใน main.jsx
  import { useTeam }     from '../context/TeamContext'    // ใช้ใน component ต่างๆ

--- TeamProvider ---
ใช้ใน main.jsx:
  <TeamProvider>
    <App />
  </TeamProvider>

--- useTeam() ---
const {
  team,            // array ของสมาชิก (ดูรูปแบบด้านล่าง)
  addPokemon,      // function(pokemon) → เพิ่มเข้าทีม
  removePokemon,   // function(id)      → เอาออกจากทีม
  clearTeam,       // function()        → ล้างทั้งทีม
  count,           // number            → จำนวนสมาชิกตอนนี้ (0–6)
  isFull,          // boolean           → true ถ้าครบ 6 ตัว
  has,             // function(id) → boolean → ตัวนี้อยู่ในทีมหรือยัง
} = useTeam()
```

#### 🔴 รูปแบบข้อมูลสมาชิกทีม (ทุกคนต้องใช้โครงสร้างเดียวกัน)

```
สมาชิก 1 ตัว = object:
{
  id:   number,    // เช่น 25
  name: string,    // เช่น "pikachu" (ตัวเล็กตาม API)
}

team = array ของ object ข้างบน:
[
  { id: 25,  name: "pikachu" },
  { id: 6,   name: "charizard" },
]
```

#### การเรียกใช้ addPokemon

```
ส่ง object เข้าไป:
  addPokemon({ id: 25, name: "pikachu" })

กฎภายใน (โฟเขียนไว้ใน Context):
  - ถ้า team.length >= 6 → ไม่เพิ่ม (return เฉยๆ)
  - ถ้า id ซ้ำกับที่มีอยู่แล้ว → ไม่เพิ่ม
  - อัปเดตแบบ immutable ([...prev, pokemon])
  - sync ลง localStorage ทุกครั้งที่เปลี่ยน

กฎ removePokemon:
  removePokemon(25)   // ส่งแค่ id (number)

กฎ has:
  has(25) → true/false   // ส่งแค่ id (number)
```

#### Guard

```
เรียก useTeam() นอก <TeamProvider> → throw Error:
  "useTeam must be used within TeamProvider"
```

#### localStorage

```
key ที่ใช้เก็บ: "pokedex-team"
ค่าที่เก็บ:   JSON.stringify(team)

ตอนโหลดครั้งแรก:
  - อ่าน localStorage.getItem("pokedex-team")
  - JSON.parse ได้ → ใช้เป็น initial state
  - parse ไม่ได้ / ไม่ใช่ array / เสีย → ใช้ [] (ทีมว่าง) ห้ามจอขาว
```

#### ⚠️ ค่าที่คำนวณ (ไม่เก็บเป็น state แยก)

```
count  = team.length                          // คำนวณตอน render
isFull = team.length >= 6                     // คำนวณตอน render
has    = (id) => team.some(p => p.id === id)  // คำนวณตอน render
```

---

### 4.4 `components/PokemonCard.jsx` — กิตเขียน / กิต+พีใช้

```
import:
  import PokemonCard from '../components/PokemonCard'

Props:
  <PokemonCard
    id={25}               // number — required
    name="pikachu"        // string — required
    isInTeam={true}       // boolean — optional (default false)
                          //   true → แสดงป้าย "อยู่ในทีม"
  />

พฤติกรรม:
  - แสดง: รูป (ใช้ artworkUrl(id)) + #id + ชื่อ + ป้าย "อยู่ในทีม" (ถ้า isInTeam)
  - กดที่การ์ด → Link ไป /pokemon/{id}
  - key ที่ใช้ตอน .map(): ใช้ id (number) ห้ามใช้ index
```

#### ใครส่ง isInTeam มา?

```
หน้า PokemonList (กิต):
  const { has } = useTeam()
  <PokemonCard id={id} name={name} isInTeam={has(id)} />

หน้า Team (พี):
  // สมาชิกทุกตัวอยู่ในทีมอยู่แล้ว
  <PokemonCard id={p.id} name={p.name} isInTeam={true} />
```

---

### 4.5 `App.jsx` — พีเขียน

```
import:
  import { Routes, Route } from 'react-router-dom'
  import Layout         from './components/Layout'
  import Home           from './pages/Home'
  import PokemonList    from './pages/PokemonList'
  import PokemonDetail  from './pages/PokemonDetail'
  import Team           from './pages/Team'
  import NotFound       from './pages/NotFound'

โครงสร้าง Routes:
  <Routes>
    <Route element={<Layout />}>          ← layout route (ไม่มี path)
      <Route path="/"                     element={<Home />} />
      <Route path="/pokemon"              element={<PokemonList />} />
      <Route path="/pokemon/:nameOrId"    element={<PokemonDetail />} />
      <Route path="/team"                 element={<Team />} />
      <Route path="*"                     element={<NotFound />} />
    </Route>
  </Routes>

Export:
  export default App
```

---

### 4.6 `components/Layout.jsx` — พีเขียน

```
import:
  import { Outlet } from 'react-router-dom'
  import Nav from './Nav'

โครงสร้าง:
  <Nav />
  <main>
    <Outlet />      ← หน้าย่อยจะ render ตรงนี้
  </main>
  <footer> ... </footer>

Export:
  export default Layout
```

---

### 4.7 `components/Nav.jsx` — พีเขียน

```
import:
  import { NavLink } from 'react-router-dom'
  import { useTeam } from '../context/TeamContext'

ใช้:
  const { count } = useTeam()

ลิงก์ที่ต้องมี (ใช้ NavLink):
  /          → หน้าแรก
  /pokemon   → Pokédex
  /team      → ทีม (n/6)    ← แสดง count ตรงนี้

NavLink ต้องมี active state (เช่น className ที่เปลี่ยนตอน isActive)

Export:
  export default Nav
```

---

### 4.8 `pages/Home.jsx` — โฟเขียน

```
import:
  import { Link } from 'react-router-dom'
  import { useTeam } from '../context/TeamContext'

ใช้:
  const { count } = useTeam()

แสดง:
  - ข้อความต้อนรับ
  - Link ไป /pokemon
  - จำนวนสมาชิกทีมตอนนี้ (count)

Export:
  export default Home
```

---

### 4.9 `pages/PokemonList.jsx` — กิตเขียน

```
import:
  import { useSearchParams, Link } from 'react-router-dom'
  import { useFetch } from '../hooks/useFetch'
  import { useTeam } from '../context/TeamContext'
  import { API, MAX_ID, TYPES, idFromUrl } from '../lib/pokemon.js'
  import PokemonCard from '../components/PokemonCard'

URL query string:
  /pokemon?q=char&type=fire

  const [searchParams, setSearchParams] = useSearchParams()
  const q    = searchParams.get('q') || ''       // คำค้น
  const type = searchParams.get('type') || ''    // ธาตุ

  ⚠️ ห้ามเก็บ q หรือ type ใน useState อีก — อ่านจาก searchParams โดยตรง

Fetch ที่ต้องทำ:
  1. useFetch(`${API}/pokemon?limit=151`)                    ← ดึงรายชื่อ 151 ตัว (ยิงเสมอ)
  2. useFetch(type ? `${API}/type/${type}` : null)           ← ดึง Pokémon ตามธาตุ (ยิงเฉพาะตอนเลือกธาตุ)

Logic กรอง:
  - เริ่มจากรายชื่อ 151 ตัว
  - ถ้ามี type → กรองเหลือเฉพาะตัวที่อยู่ในผลลัพธ์ธาตุ AND id ≤ 151
  - ถ้ามี q → กรองชื่อด้วย .toLowerCase().includes(q.toLowerCase())
  - ทั้งสองทำงานพร้อมกัน (AND)

Export:
  export default PokemonList
```

---

### 4.10 `pages/PokemonDetail.jsx` — โฟเขียน

```
import:
  import { useParams, Link } from 'react-router-dom'
  import { useFetch } from '../hooks/useFetch'
  import { useTeam } from '../context/TeamContext'
  import { API, MAX_ID, artworkUrl } from '../lib/pokemon.js'

ใช้:
  const { nameOrId } = useParams()
  const { data, loading, error } = useFetch(`${API}/pokemon/${nameOrId}`)
  const { addPokemon, removePokemon, has, isFull } = useTeam()

แปลงหน่วย:
  ส่วนสูง: data.height / 10    → เมตร     (API ให้เป็นเดซิเมตร)
  น้ำหนัก: data.weight / 10    → กิโลกรัม (API ให้เป็นเฮกโตกรัม)

ปุ่มเพิ่ม/เอาออก:
  if (has(data.id)):
    <button onClick={() => removePokemon(data.id)}>เอาออกจากทีม</button>
  else:
    <button onClick={() => addPokemon({ id: data.id, name: data.name })}
            disabled={isFull}>
      เพิ่มเข้าทีม
    </button>

ลิงก์ก่อนหน้า/ถัดไป:
  ก่อนหน้า: data.id > 1   → Link to /pokemon/{data.id - 1}
  ถัดไป:    data.id < 151 → Link to /pokemon/{data.id + 1}
  (ที่ขอบไม่แสดงลิงก์)

กัน id นอกช่วง:
  ถ้า data โหลดมาได้แต่ data.id > 151 → แสดง "ไม่อยู่ใน Pokédex นี้"
  ถ้า fetch error (404) → แสดง "ไม่พบ Pokémon"

Export:
  export default PokemonDetail
```

---

### 4.11 `pages/Team.jsx` — พีเขียน

```
import:
  import { useState } from 'react'
  import { useForm } from 'react-hook-form'
  import { zodResolver } from '@hookform/resolvers/zod'
  import { useTeam } from '../context/TeamContext'
  import { createRegistrationSchema } from '../schemas/registration'
  import PokemonCard from '../components/PokemonCard'

ใช้:
  const { team, removePokemon, clearTeam, count } = useTeam()

  // Schema ต้องรับชื่อ Pokémon ในทีมเข้าไป เพราะต้องเช็คว่าชื่อทีมไม่ซ้ำกับชื่อ Pokémon
  const teamNames = team.map(p => p.name)
  const schema = createRegistrationSchema(teamNames)

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
    mode: 'onTouched',     // ไม่ขึ้น error ก่อนผู้ใช้แตะช่อง
  })

แสดงผล 2 ส่วน:
  ส่วน A — การ์ดสมาชิกทีม:
    team.map(p => <PokemonCard ... />)  พร้อมปุ่ม "เอาออก" แต่ละตัว
    ปุ่ม "ล้างทีม" (clearTeam)
    ถ้า team ว่าง → แสดงข้อความ "ยังไม่มีสมาชิก"

  ส่วน B — ฟอร์มลงทะเบียน:
    ปุ่มส่ง disabled ถ้า count < 3 → แสดง "ต้องมีอย่างน้อย 3 ตัว (ขาดอีก X ตัว)"
    กดส่ง → จำลองรอ 800ms (isSubmitting = true, ปุ่มแสดง "กำลังส่ง…")
    สำเร็จ → แสดงการ์ดสรุป: ชื่อเทรนเนอร์ + ชื่อทีม + รายชื่อสมาชิก

Export:
  export default Team
```

---

### 4.12 `schemas/registration.js` — พีเขียน

```
import:
  import { z } from 'zod'

⚠️ Export เป็น FUNCTION (ไม่ใช่ object ตรงๆ)
เพราะต้องรับชื่อ Pokémon ในทีมเข้ามาเช็คตอน validate

export function createRegistrationSchema(teamNames) {
  // teamNames = ['pikachu', 'charizard', ...]  ← string[]

  return z.object({
    trainerName:  ...  // string, min(2), max(30)
    teamName:     ...  // string, min(3), max(20)
                       //   regex: /^[A-Za-z0-9 ]+$/  (เฉพาะ A-Z a-z 0-9 ช่องว่าง)
                       //   .refine: ห้ามซ้ำกับชื่อ Pokémon ในทีม (ไม่สนตัวพิมพ์)
                       //     teamNames.every(name =>
                       //       name.toLowerCase() !== val.toLowerCase()
                       //     )
    email:        ...  // string, email()
    confirmEmail: ...  // string, email()
  }).refine(ตรวจ email === confirmEmail, {
    message: "อีเมลไม่ตรงกัน",
    path: ["confirmEmail"],
  })
}

ชื่อฟิลด์ใน form (ใช้กับ register):
  register("trainerName")
  register("teamName")
  register("email")
  register("confirmEmail")
```

---

### 4.13 `pages/NotFound.jsx` — พีเขียน

```
import:
  import { Link } from 'react-router-dom'

แสดง:
  - ข้อความ 404 / ไม่พบหน้านี้
  - Link กลับหน้าแรก (/)

Export:
  export default NotFound
```

---

## 5. 🚨 Twist ที่ต้องผ่าน (ใครรับผิดชอบ)

| # | Twist | คนรับผิดชอบ |
|---|---|---|
| 1 | เปิด `/pokemon?q=saur&type=grass` ในแท็บใหม่ → ช่องค้นหาต้องมี saur, dropdown เป็น grass | **กิต** |
| 2 | พิมพ์ค้น 5 ตัวแล้วกด back ครั้งเดียว → ออกจากการค้นหาทั้งหมด ไม่ใช่ลบทีละตัว | **กิต** |
| 3 | เปิด `/pokemon/152` → แสดงว่าไม่อยู่ใน Pokédex / ธาตุ fire ไม่มี #155 | **โฟ** (Detail) + **กิต** (List) |
| 4 | เปิด `/pokemon/notapokemon` → "ไม่พบ" ไม่จอขาว / `/pokemon/25` กับ `/pokemon/pikachu` → หน้าเดียวกัน | **โฟ** |
| 5 | กด "ถัดไป" รัว 10 ครั้ง → ข้อมูลสุดท้ายตรงกับ URL (cleanup) | **โฟ** (ใช้ useFetch ที่ **กิต** เขียน) |
| 6 | เพิ่มตัวที่ 7 ไม่ได้ / ซ้ำไม่ได้ / ตัวเลข Nav เปลี่ยนทันที / refresh ทีมยังอยู่ | **โฟ** |
| 7 | แก้ localStorage เป็น `abc` แล้ว refresh → ไม่จอขาว ทีมว่าง | **โฟ** |
| 8 | ทีมมี pikachu ตั้งชื่อทีมว่า `Pikachu` → error / ลบ pikachu ออกแล้วส่งได้ | **พี** |
| 9 | ทีม 2 ตัว → ส่งไม่ได้ บอกขาดกี่ตัว / เปิดหน้า `/team` ครั้งแรก → ยังไม่มี error แดง | **พี** |

---

## 6. ✅ เช็กลิสต์ก่อนรวมโค้ด

- [ ] ทุกคน export ชื่อตรงตามสัญญาในเอกสารนี้
- [ ] `useTeam()` ส่งคืน object ที่มี key ตรงตามข้อ 4.3
- [ ] `useFetch()` ส่งคืน `{ data, loading, error }` ตามข้อ 4.2
- [ ] `PokemonCard` รับ props `{ id, name, isInTeam }` ตามข้อ 4.4
- [ ] `createRegistrationSchema` รับ `teamNames` (string[]) ตามข้อ 4.12
- [ ] สมาชิกทีมเก็บเป็น `{ id: number, name: string }` ทุกจุด
- [ ] localStorage key ใช้ `"pokedex-team"` ตรงกัน
- [ ] `npm run build` ผ่านไม่มี error
- [ ] ลอง Twist ข้อ 1–9 ครบทุกข้อ

---

## 7. ✅ เช็กลิสต์ก่อนส่ง

- [ ] `npm run build` ผ่าน
- [ ] แตก zip ลงโฟลเดอร์ใหม่ → `npm install && npm run dev` รันขึ้นทันที
- [ ] ไม่มี `node_modules` ใน zip
- [ ] `package.json` อยู่ชั้นบนสุดของ zip
- [ ] `grep -rn "useContext(TeamContext)" src` เจอแค่บรรทัดเดียว
- [ ] ไม่มี `redux` / `zustand` ใน `package.json`
- [ ] README ครบ 3 หัวข้อ ไม่มี `[ ... ]` ค้าง
- [ ] ชื่อไฟล์: `assignment-01-<ชื่อกลุ่ม>.zip`
