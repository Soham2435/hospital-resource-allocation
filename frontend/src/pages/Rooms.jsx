import { useState } from "react"

const initialRoom = {
  id: "",
  room_type: "general",
  capacity: 1,
  isolation: false,
  available: true,
}

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

    if (rooms.some((room) => room.id === roomId)) {
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
      current.filter((room) => room.id !== roomId)
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
          Configure fictional hospital rooms and their
          availability.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[380px_1fr]">
        <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <h3 className="font-semibold">
            Add Room
          </h3>

          <p className="mt-1 text-xs text-slate-500">
            Define the room attributes used by the CSP.
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
                <option value="general">General</option>
                <option value="private">Private</option>
                <option value="icu">ICU</option>
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
                Room currently available
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

        <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold">
                Configured Rooms
              </h3>

              <p className="mt-1 text-xs text-slate-500">
                Rooms currently available to the allocation
                system.
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
                            ? "bg-green-50 text-green-700"
                            : "bg-slate-100 text-slate-600"
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
                      className="rounded-lg px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-100"
                    >
                      {room.available
                        ? "Mark Unavailable"
                        : "Mark Available"}
                    </button>

                    <button
                      onClick={() => removeRoom(room.id)}
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

export default Rooms