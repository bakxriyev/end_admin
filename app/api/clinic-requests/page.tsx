// components/clinic-requests/page.tsx
"use client"

import { useState, useEffect, useCallback } from "react"
import { 
  Search, 
  Filter, 
  Download, 
  Edit, 
  Trash2, 
  ChevronLeft, 
  ChevronRight,
  Calendar,
  Clock,
  Phone,
  User
} from "lucide-react"

interface ClinicRequest {
  id: string
  full_name: string
  phone_number: string
  photo: string
  department: string
  doctor_name: string
  message: string
  appointment_date: string
  appointment_time: string
  createdAt: string
  updatedAt: string
}

interface MetaData {
  total: number
  page: number
  limit: number
  totalPages: number
}

export function ClinicRequestsPage() {
  const [requests, setRequests] = useState<ClinicRequest[]>([])
  const [meta, setMeta] = useState<MetaData>({ total: 0, page: 1, limit: 10, totalPages: 0 })
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [department, setDepartment] = useState("")
  const [sortBy, setSortBy] = useState("createdAt")
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc")
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(10)
  const [departments, setDepartments] = useState<string[]>([])

  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3040"

  const fetchRequests = useCallback(async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        sortBy,
        sortOrder,
        ...(search && { search }),
        ...(department && { department }),
      })

      const response = await fetch(`${API_URL}/users?${params}`)
      const data = await response.json()
      
      if (data.data && Array.isArray(data.data)) {
        setRequests(data.data)
        setMeta(data.meta || { total: 0, page: 1, limit: 10, totalPages: 0 })
        
        // Extract unique departments for filter
        const uniqueDepartments = Array.from(
          new Set(data.data.map((item: ClinicRequest) => item.department).filter(Boolean))
        ) as string[]
        setDepartments(uniqueDepartments)
      }
    } catch (error) {
      console.error("Error fetching requests:", error)
    } finally {
      setLoading(false)
    }
  }, [API_URL, page, limit, sortBy, sortOrder, search, department])

  useEffect(() => {
    fetchRequests()
  }, [fetchRequests])

  const handleDelete = async (id: string) => {
    if (confirm("Bu so'rovni o'chirishni xohlaysizmi?")) {
      try {
        await fetch(`${API_URL}/users/${id}`, {
          method: "DELETE",
        })
        fetchRequests() // Refresh list
      } catch (error) {
        console.error("Error deleting request:", error)
      }
    }
  }

  const handleExport = async () => {
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        sortBy,
        sortOrder,
        ...(search && { search }),
        ...(department && { department }),
      })

      const response = await fetch(`${API_URL}/users/export/excel?${params}`)
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `clinic_requests_${new Date().toISOString().split("T")[0]}.xlsx`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
    } catch (error) {
      console.error("Error exporting:", error)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("uz-UZ", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  const formatTime = (timeString: string) => {
    return timeString
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Zayafkalar</h1>
          <p className="text-gray-600">Barcha klinikaga kelgan so'rovlar</p>
        </div>
        <button
          onClick={handleExport}
          className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
        >
          <Download size={20} />
          Excel ga yuklash
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Ism yoki telefon bo'yicha qidirish..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            />
          </div>

          {/* Department Filter */}
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <select
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent appearance-none"
            >
              <option value="">Barcha bo'limlar</option>
              {departments.map((dept) => (
                <option key={dept} value={dept}>
                  {dept}
                </option>
              ))}
            </select>
          </div>

          {/* Sort By */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
          >
            <option value="createdAt">Sana bo'yicha</option>
            <option value="appointment_date">Navbat sanasi bo'yicha</option>
            <option value="full_name">Ism bo'yicha</option>
          </select>

          {/* Sort Order */}
          <select
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value as "asc" | "desc")}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
          >
            <option value="desc">Eng yangisi</option>
            <option value="asc">Eng eskisi</option>
          </select>
        </div>

        {/* Items per page */}
        <div className="mt-4 flex items-center gap-2">
          <span className="text-gray-600">Har sahifada:</span>
          <select
            value={limit}
            onChange={(e) => {
              setLimit(Number(e.target.value))
              setPage(1)
            }}
            className="px-3 py-1 border border-gray-300 rounded-lg"
          >
            <option value="5">5</option>
            <option value="10">10</option>
            <option value="20">20</option>
            <option value="50">50</option>
          </select>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-4 rounded-xl shadow-sm">
          <div className="text-2xl font-bold text-gray-800">{meta.total}</div>
          <div className="text-gray-600">Jami so'rovlar</div>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm">
          <div className="text-2xl font-bold text-emerald-600">
            {requests.filter(r => new Date(r.appointment_date) > new Date()).length}
          </div>
          <div className="text-gray-600">Kelgusi navbatlar</div>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm">
          <div className="text-2xl font-bold text-blue-600">{departments.length}</div>
          <div className="text-gray-600">Bo'limlar</div>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm">
          <div className="text-2xl font-bold text-orange-600">
            {Array.from(new Set(requests.map(r => r.doctor_name))).length}
          </div>
          <div className="text-gray-600">Shifokorlar</div>
        </div>
      </div>

      {/* Requests Table */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-8 text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
            <p className="mt-2 text-gray-600">Yuklanmoqda...</p>
          </div>
        ) : requests.length === 0 ? (
          <div className="p-8 text-center">
            <p className="text-gray-600">So'rovlar topilmadi</p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Bemor
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Bo'lim / Shifokor
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Navbat vaqti
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Xabar
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Yaratilgan sana
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Harakatlar
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {requests.map((request) => (
                    <tr key={request.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10">
                            {request.photo ? (
                              <img
                                className="h-10 w-10 rounded-full object-cover"
                                src={request.photo}
                                alt={request.full_name}
                              />
                            ) : (
                              <div className="h-10 w-10 rounded-full bg-gradient-to-br from-emerald-100 to-teal-100 flex items-center justify-center">
                                <User className="h-5 w-5 text-emerald-600" />
                              </div>
                            )}
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{request.full_name}</div>
                            <div className="text-sm text-gray-500 flex items-center gap-1">
                              <Phone size={12} />
                              {request.phone_number}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900 font-medium">{request.department}</div>
                        <div className="text-sm text-gray-500">{request.doctor_name}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <Calendar size={16} className="text-gray-400" />
                          <span className="text-sm text-gray-900">{formatDate(request.appointment_date)}</span>
                        </div>
                        <div className="flex items-center gap-2 mt-1">
                          <Clock size={16} className="text-gray-400" />
                          <span className="text-sm text-gray-500">{formatTime(request.appointment_time)}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900 max-w-xs truncate">{request.message}</div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {formatDate(request.createdAt)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex gap-2">
                          <button className="text-blue-600 hover:text-blue-900 p-1">
                            <Edit size={18} />
                          </button>
                          <button
                            onClick={() => handleDelete(request.id)}
                            className="text-red-600 hover:text-red-900 p-1"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
              <div className="text-sm text-gray-700">
                {meta.total} tadan {Math.min((meta.page - 1) * meta.limit + 1, meta.total)} -{" "}
                {Math.min(meta.page * meta.limit, meta.total)} ko'rsatilmoqda
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setPage(page - 1)}
                  disabled={page === 1}
                  className="p-2 rounded-lg border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                >
                  <ChevronLeft size={20} />
                </button>
                
                {Array.from({ length: Math.min(5, meta.totalPages) }, (_, i) => {
                  let pageNum
                  if (meta.totalPages <= 5) {
                    pageNum = i + 1
                  } else if (page <= 3) {
                    pageNum = i + 1
                  } else if (page >= meta.totalPages - 2) {
                    pageNum = meta.totalPages - 4 + i
                  } else {
                    pageNum = page - 2 + i
                  }
                  
                  return (
                    <button
                      key={i}
                      onClick={() => setPage(pageNum)}
                      className={`w-10 h-10 rounded-lg ${
                        page === pageNum
                          ? "bg-emerald-600 text-white"
                          : "border border-gray-300 hover:bg-gray-50"
                      }`}
                    >
                      {pageNum}
                    </button>
                  )
                })}
                
                <button
                  onClick={() => setPage(page + 1)}
                  disabled={page === meta.totalPages}
                  className="p-2 rounded-lg border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                >
                  <ChevronRight size={20} />
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}