// ข้อ 2: 404 + ปุ่มกลับหน้าแรก
import { Link } from 'react-router-dom'

function NotFound() {
  return (
    <div className="text-center py-12">
      <h1 className="text-3xl font-bold">404 — ไม่พบหน้านี้</h1>
      <p className="mt-2 text-gray-600">URL ที่คุณเข้าไม่มีอยู่จริง</p>
      <Link to="/" className="text-blue-600 underline mt-4 inline-block">← กลับหน้าแรก</Link>
    </div>
  )
}
export default NotFound
