// R1: Custom Hook useFetch(url)
// - เช็ค res.ok (PokéAPI คืน 404 เมื่อไม่พบข้อมูล)
// - cleanup ด้วย AbortController กัน race condition (Twist 5)
// - รองรับ url = null (ไม่ยิง และรีเซ็ตสถานะ)
import { useState, useEffect } from 'react'

export function useFetch(url) {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(Boolean(url))
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!url) {
      setData(null)
      setLoading(false)
      setError(null)
      return
    }

    const controller = new AbortController()
    let active = true

    setLoading(true)
    setError(null)

    fetch(url, { signal: controller.signal })
      .then(async (res) => {
        if (!res.ok) {
          throw new Error(res.status === 404 ? 'ไม่พบข้อมูล' : `เกิดข้อผิดพลาด (${res.status})`)
        }
        return res.json()
      })
      .then((json) => {
        if (!active) return
        setData(json)
        setLoading(false)
      })
      .catch((err) => {
        if (!active || err.name === 'AbortError') return
        setError(err.message || 'เกิดข้อผิดพลาดในการโหลดข้อมูล')
        setData(null)
        setLoading(false)
      })

    return () => {
      active = false
      controller.abort()
    }
  }, [url])

  return { data, loading, error }
}

export default useFetch
