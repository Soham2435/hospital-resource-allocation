import { useState } from "react"
import Dashboard from "./pages/Dashboard"
import Patients from "./pages/Patients"
import Rooms from "./pages/Rooms"
import Allocation from "./pages/Allocation"
import History from "./pages/History"

const initialRooms = [
  {
    id: "G101",
    room_type: "general",
    capacity: 1,
    isolation: false,
    available: true,
  },
  {
    id: "G102",
    room_type: "general",
    capacity: 1,
    isolation: false,
    available: true,
  },
  {
    id: "G103",
    room_type: "general",
    capacity: 1,
    isolation: false,
    available: true,
  },
  {
    id: "G104",
    room_type: "general",
    capacity: 1,
    isolation: false,
    available: true,
  },
  {
    id: "P201",
    room_type: "private",
    capacity: 1,
    isolation: false,
    available: true,
  },
  {
    id: "P202",
    room_type: "private",
    capacity: 1,
    isolation: false,
    available: true,
  },
  {
    id: "I301",
    room_type: "icu",
    capacity: 1,
    isolation: true,
    available: true,
  },
  {
    id: "I302",
    room_type: "icu",
    capacity: 1,
    isolation: true,
    available: true,
  },
]

const navigation = [
  "Dashboard",
  "Patients",
  "Rooms & Beds",
  "Allocation",
  "History",
]

function App() {
  const [activePage, setActivePage] =
    useState("Dashboard")

  const [patients, setPatients] = useState([])

  const [rooms, setRooms] =
    useState(initialRooms)

  const [allocationResult, setAllocationResult] =
    useState(null)
  const [allocationHistory, setAllocationHistory] =
    useState([])
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      {/* Header */}
      <header className="border-b border-slate-200 bg-white">
        <div className="flex h-16 items-center justify-between px-6">
          <div>
            <h1 className="text-lg font-semibold">
              Hospital Resource Allocation
            </h1>

            <p className="text-xs text-slate-500">
              CSP-based resource allocation system
            </p>
          </div>

          <div className="flex items-center gap-2 text-sm text-slate-600">
            <span className="h-2 w-2 rounded-full bg-emerald-500" />
            System Ready
          </div>
        </div>
      </header>

      <div className="flex min-h-[calc(100vh-4rem)]">
        {/* Sidebar */}
        <aside className="w-60 border-r border-slate-200 bg-white p-4">
          <nav className="space-y-1">
            {navigation.map((item) => (
              <button
                key={item}
                onClick={() => setActivePage(item)}
                className={`w-full rounded-lg px-4 py-2.5 text-left text-sm font-medium transition ${activePage === item
                  ? "bg-slate-900 text-white"
                  : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                  }`}
              >
                {item}
              </button>
            ))}
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-8">
          {activePage === "Dashboard" && (
            <Dashboard
              patients={patients}
              rooms={rooms}
            />
          )}

          {activePage === "Patients" && (
            <Patients
              patients={patients}
              setPatients={setPatients}
            />
          )}

          {activePage === "Rooms & Beds" && (
            <Rooms
              rooms={rooms}
              setRooms={setRooms}
            />
          )}

          {activePage === "Allocation" && (
            <Allocation
              patients={patients}
              rooms={rooms}
              setPatients={setPatients}
              setRooms={setRooms}
              allocationResult={allocationResult}
              setAllocationResult={setAllocationResult}
              setAllocationHistory={setAllocationHistory}
            />
          )}

          {activePage === "History" && (
            <History
              allocationHistory={allocationHistory}
            />
          )}
        </main>
      </div>
    </div>
  )
}

function PagePlaceholder({
  title,
  description,
}) {
  return (
    <div className="mx-auto max-w-7xl">
      <h2 className="text-2xl font-semibold">
        {title}
      </h2>

      <p className="mt-1 text-sm text-slate-500">
        {description}
      </p>

      <div className="mt-8 rounded-xl border border-dashed border-slate-300 bg-white p-10 text-center">
        <p className="text-sm text-slate-500">
          This module will be implemented in the next
          milestone.
        </p>
      </div>
    </div>
  )
}

export default App