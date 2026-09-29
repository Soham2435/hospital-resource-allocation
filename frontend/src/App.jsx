import { useState } from "react"

const navigation = [
  "Dashboard",
  "Patients",
  "Rooms",
  "Allocation",
  "History",
]

const initialPatient = {
  id: "",
  room_type: "general",
  capacity_required: 1,
  isolation_required: false,
  priority: 1,
}

const initialRoom = {
  id: "",
  room_type: "general",
  capacity: 1,
  isolation: false,
  available: true,
}

function App() {
  const [activePage, setActivePage] = useState("Dashboard")
  const [patients, setPatients] = useState([])
  const [rooms, setRooms] = useState([])

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
                className={`w-full rounded-lg px-4 py-2.5 text-left text-sm font-medium transition ${
                  activePage === item
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
            <Dashboard patients={patients} rooms={rooms} />
          )}

          {activePage === "Patients" && (
            <Patients
              patients={patients}
              setPatients={setPatients}
            />
          )}

          {activePage === "Rooms" && (
            <Rooms
              rooms={rooms}
              setRooms={setRooms}
            />
          )}

          {activePage === "Allocation" && (
            <PagePlaceholder
              title="AI Allocation"
              description="Run the CSP and backtracking allocation engine."
            />
          )}

          {activePage === "History" && (
            <PagePlaceholder
              title="Allocation History"
              description="View previously completed allocation runs."
            />
          )}
        </main>
      </div>
    </div>
  )
}

/* =========================================================
   DASHBOARD
========================================================= */

function Dashboard({ patients, rooms }) {
  const availableRooms = rooms.filter(
    (room) => room.available
  ).length

  const occupiedRooms = rooms.filter(
    (room) => !room.available
  ).length

  const statistics = [
    {
      label: "Total Rooms",
      value: rooms.length,
      description: "Configured rooms",
    },
    {
      label: "Available Rooms",
      value: availableRooms,
      description: "Currently available",
    },
    {
      label: "Waiting Patients",
      value: patients.length,
      description: "Awaiting allocation",
    },
    {
      label: "Unavailable Rooms",
      value: occupiedRooms,
      description: "Currently unavailable",
    },
  ]

  return (
    <div className="mx-auto max-w-7xl">
      <div className="mb-8">
        <h2 className="text-2xl font-semibold">
          Dashboard
        </h2>

        <p className="mt-1 text-sm text-slate-500">
          Overview of the current resource allocation state.
        </p>
      </div>

      {/* Statistics */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {statistics.map((stat) => (
          <div
            key={stat.label}
            className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm"
          >
            <p className="text-sm font-medium text-slate-500">
              {stat.label}
            </p>

            <p className="mt-3 text-3xl font-semibold text-slate-900">
              {stat.value}
            </p>

            <p className="mt-1 text-xs text-slate-500">
              {stat.description}
            </p>
          </div>
        ))}
      </div>

      {/* Allocation Status */}
      <div className="mt-6 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-semibold">
              Allocation Status
            </h3>

            <p className="mt-1 text-sm text-slate-500">
              The system is ready to run a CSP allocation.
            </p>
          </div>

          <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700">
            Ready
          </span>
        </div>
      </div>

      {/* AI Methodology */}
      <div className="mt-6 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <h3 className="font-semibold">
          AI Methodology
        </h3>

        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            "Constraint Satisfaction",
            "MRV Heuristic",
            "Forward Checking",
            "Backtracking Search",
          ].map((method) => (
            <div
              key={method}
              className="rounded-lg bg-slate-50 p-4 text-sm font-medium text-slate-700"
            >
              {method}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

/* =========================================================
   PATIENTS
========================================================= */

function Patients({ patients, setPatients }) {
  const [form, setForm] = useState(initialPatient)
  const [error, setError] = useState("")

  function handleChange(event) {
    const { name, value, type, checked } = event.target

    setForm((current) => ({
      ...current,
      [name]:
        type === "checkbox"
          ? checked
          : type === "number"
            ? Number(value)
            : value,
    }))
  }

  function handleSubmit(event) {
    event.preventDefault()
    setError("")

    if (!form.id.trim()) {
      setError("Patient ID is required.")
      return
    }

    const patientId = form.id.trim().toUpperCase()

    if (
      patients.some(
        (patient) => patient.id === patientId
      )
    ) {
      setError("A patient with this ID already exists.")
      return
    }

    setPatients((current) => [
      ...current,
      {
        ...form,
        id: patientId,
      },
    ])

    setForm({
      ...initialPatient,
      id: "",
    })
  }

  function removePatient(patientId) {
    setPatients((current) =>
      current.filter(
        (patient) => patient.id !== patientId
      )
    )
  }

  return (
    <div className="mx-auto max-w-7xl">
      <div className="mb-8">
        <h2 className="text-2xl font-semibold">
          Patients
        </h2>

        <p className="mt-1 text-sm text-slate-500">
          Add fictional patients to the allocation waiting
          list.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[380px_1fr]">
        {/* Add Patient */}
        <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <h3 className="font-semibold">
            Add Patient
          </h3>

          <p className="mt-1 text-xs text-slate-500">
            Use fictional IDs such as P001, P002 and P003.
          </p>

          <form
            onSubmit={handleSubmit}
            className="mt-6 space-y-5"
          >
            <div>
              <label className="mb-1.5 block text-sm font-medium">
                Patient ID
              </label>

              <input
                type="text"
                name="id"
                value={form.id}
                onChange={handleChange}
                placeholder="P001"
                className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-slate-900"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium">
                Room Type
              </label>

              <select
                name="room_type"
                value={form.room_type}
                onChange={handleChange}
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-slate-900"
              >
                <option value="general">
                  General
                </option>

                <option value="private">
                  Private
                </option>

                <option value="icu">
                  ICU
                </option>
              </select>
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium">
                Capacity Required
              </label>

              <input
                type="number"
                name="capacity_required"
                min="1"
                value={form.capacity_required}
                onChange={handleChange}
                className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-slate-900"
              />
            </div>

            <label className="flex cursor-pointer items-center gap-3">
              <input
                type="checkbox"
                name="isolation_required"
                checked={form.isolation_required}
                onChange={handleChange}
                className="h-4 w-4 rounded border-slate-300"
              />

              <span className="text-sm font-medium">
                Isolation required
              </span>
            </label>

            <div>
              <label className="mb-1.5 block text-sm font-medium">
                Priority
              </label>

              <select
                name="priority"
                value={form.priority}
                onChange={handleChange}
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-slate-900"
              >
                <option value={1}>
                  1 — Normal
                </option>

                <option value={2}>
                  2 — Higher
                </option>

                <option value={3}>
                  3 — Highest
                </option>
              </select>

              <p className="mt-1.5 text-xs text-slate-500">
                Priority is currently stored as a configurable
                project field. It does not yet affect the CSP
                search order.
              </p>
            </div>

            {error && (
              <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2.5 text-sm text-red-700">
                {error}
              </div>
            )}

            <button
              type="submit"
              className="w-full rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-slate-800"
            >
              Add to Waiting List
            </button>
          </form>
        </section>

        {/* Waiting List */}
        <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold">
                Waiting List
              </h3>

              <p className="mt-1 text-xs text-slate-500">
                Patients currently waiting for allocation.
              </p>
            </div>

            <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700">
              {patients.length} patient
              {patients.length === 1 ? "" : "s"}
            </span>
          </div>

          {patients.length === 0 ? (
            <div className="mt-8 rounded-lg border border-dashed border-slate-300 p-10 text-center">
              <p className="text-sm text-slate-500">
                No patients have been added yet.
              </p>
            </div>
          ) : (
            <div className="mt-6 space-y-3">
              {patients.map((patient) => (
                <div
                  key={patient.id}
                  className="flex items-center justify-between rounded-lg border border-slate-200 p-4"
                >
                  <div>
                    <p className="font-medium">
                      {patient.id}
                    </p>

                    <p className="mt-1 text-xs text-slate-500">
                      {patient.room_type} · Capacity{" "}
                      {patient.capacity_required} ·{" "}
                      {patient.isolation_required
                        ? "Isolation required"
                        : "No isolation"}
                    </p>

                    <p className="mt-1 text-xs text-slate-400">
                      Priority {patient.priority}
                    </p>
                  </div>

                  <button
                    onClick={() =>
                      removePatient(patient.id)
                    }
                    className="rounded-lg px-3 py-2 text-xs font-medium text-red-600 hover:bg-red-50"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  )
}

/* =========================================================
   ROOMS
========================================================= */

function Rooms({ rooms, setRooms }) {
  const [form, setForm] = useState(initialRoom)
  const [error, setError] = useState("")

  function handleChange(event) {
    const { name, value, type, checked } = event.target

    setForm((current) => ({
      ...current,
      [name]:
        type === "checkbox"
          ? checked
          : type === "number"
            ? Number(value)
            : value,
    }))
  }

  function handleSubmit(event) {
    event.preventDefault()
    setError("")

    if (!form.id.trim()) {
      setError("Room ID is required.")
      return
    }

    const roomId = form.id.trim().toUpperCase()

    if (
      rooms.some(
        (room) => room.id === roomId
      )
    ) {
      setError("A room with this ID already exists.")
      return
    }

    setRooms((current) => [
      ...current,
      {
        ...form,
        id: roomId,
      },
    ])

    setForm({
      ...initialRoom,
      id: "",
    })
  }

  function removeRoom(roomId) {
    setRooms((current) =>
      current.filter(
        (room) => room.id !== roomId
      )
    )
  }

  function toggleAvailability(roomId) {
    setRooms((current) =>
      current.map((room) =>
        room.id === roomId
          ? {
              ...room,
              available: !room.available,
            }
          : room
      )
    )
  }

  return (
    <div className="mx-auto max-w-7xl">
      <div className="mb-8">
        <h2 className="text-2xl font-semibold">
          Rooms
        </h2>

        <p className="mt-1 text-sm text-slate-500">
          Configure fictional rooms and their allocation
          constraints.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[380px_1fr]">
        {/* Add Room */}
        <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <h3 className="font-semibold">
            Add Room
          </h3>

          <p className="mt-1 text-xs text-slate-500">
            Example room IDs: R101, R102, R201.
          </p>

          <form
            onSubmit={handleSubmit}
            className="mt-6 space-y-5"
          >
            <div>
              <label className="mb-1.5 block text-sm font-medium">
                Room ID
              </label>

              <input
                type="text"
                name="id"
                value={form.id}
                onChange={handleChange}
                placeholder="R101"
                className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-slate-900"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium">
                Room Type
              </label>

              <select
                name="room_type"
                value={form.room_type}
                onChange={handleChange}
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-slate-900"
              >
                <option value="general">
                  General
                </option>

                <option value="private">
                  Private
                </option>

                <option value="icu">
                  ICU
                </option>
              </select>
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium">
                Capacity
              </label>

              <input
                type="number"
                name="capacity"
                min="1"
                value={form.capacity}
                onChange={handleChange}
                className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-slate-900"
              />
            </div>

            <label className="flex cursor-pointer items-center gap-3">
              <input
                type="checkbox"
                name="isolation"
                checked={form.isolation}
                onChange={handleChange}
                className="h-4 w-4 rounded border-slate-300"
              />

              <span className="text-sm font-medium">
                Isolation available
              </span>
            </label>

            <label className="flex cursor-pointer items-center gap-3">
              <input
                type="checkbox"
                name="available"
                checked={form.available}
                onChange={handleChange}
                className="h-4 w-4 rounded border-slate-300"
              />

              <span className="text-sm font-medium">
                Currently available
              </span>
            </label>

            {error && (
              <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2.5 text-sm text-red-700">
                {error}
              </div>
            )}

            <button
              type="submit"
              className="w-full rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-slate-800"
            >
              Add Room
            </button>
          </form>
        </section>

        {/* Room Inventory */}
        <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold">
                Room Inventory
              </h3>

              <p className="mt-1 text-xs text-slate-500">
                Rooms available to the CSP allocation engine.
              </p>
            </div>

            <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700">
              {rooms.length} room
              {rooms.length === 1 ? "" : "s"}
            </span>
          </div>

          {rooms.length === 0 ? (
            <div className="mt-8 rounded-lg border border-dashed border-slate-300 p-10 text-center">
              <p className="text-sm text-slate-500">
                No rooms have been configured yet.
              </p>
            </div>
          ) : (
            <div className="mt-6 space-y-3">
              {rooms.map((room) => (
                <div
                  key={room.id}
                  className="flex items-center justify-between rounded-lg border border-slate-200 p-4"
                >
                  <div>
                    <div className="flex items-center gap-3">
                      <p className="font-medium">
                        {room.id}
                      </p>

                      <span
                        className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                          room.available
                            ? "bg-emerald-50 text-emerald-700"
                            : "bg-slate-100 text-slate-500"
                        }`}
                      >
                        {room.available
                          ? "Available"
                          : "Unavailable"}
                      </span>
                    </div>

                    <p className="mt-1 text-xs text-slate-500">
                      {room.room_type} · Capacity{" "}
                      {room.capacity} ·{" "}
                      {room.isolation
                        ? "Isolation available"
                        : "No isolation"}
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() =>
                        toggleAvailability(room.id)
                      }
                      className="rounded-lg px-3 py-2 text-xs font-medium text-slate-600 hover:bg-slate-100"
                    >
                      {room.available
                        ? "Mark unavailable"
                        : "Mark available"}
                    </button>

                    <button
                      onClick={() =>
                        removeRoom(room.id)
                      }
                      className="rounded-lg px-3 py-2 text-xs font-medium text-red-600 hover:bg-red-50"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  )
}

/* =========================================================
   PLACEHOLDER
========================================================= */

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