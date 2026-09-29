import { useState } from "react"

const initialPatient = {
  id: "",
  room_type: "general",
  capacity_required: 1,
  isolation_required: false,
  priority: 1,
}

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

export default Patients