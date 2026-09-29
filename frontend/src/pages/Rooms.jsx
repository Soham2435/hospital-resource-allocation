function Rooms({ rooms, setRooms }) {
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

  const groupedRooms = {
    general: rooms.filter(
      (room) => room.room_type === "general"
    ),
    private: rooms.filter(
      (room) => room.room_type === "private"
    ),
    icu: rooms.filter(
      (room) => room.room_type === "icu"
    ),
  }

  const roomTypeLabels = {
    general: "General Ward",
    private: "Private Rooms",
    icu: "ICU",
  }

  return (
    <div className="mx-auto max-w-7xl">
      <div className="mb-8">
        <h2 className="text-2xl font-semibold">
          Rooms & Beds
        </h2>

        <p className="mt-1 text-sm text-slate-500">
          Fixed hospital resources available for patient
          allocation.
        </p>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-semibold">
              Hospital Resource Inventory
            </h3>

            <p className="mt-1 text-xs text-slate-500">
              These resources are predefined. Availability
              can be changed as occupancy changes.
            </p>
          </div>

          <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700">
            {rooms.length} resources
          </span>
        </div>

        <div className="mt-6 space-y-8">
          {Object.entries(groupedRooms).map(
            ([roomType, roomList]) => (
              <section key={roomType}>
                <div className="mb-3">
                  <h4 className="font-medium">
                    {roomTypeLabels[roomType]}
                  </h4>

                  <p className="mt-1 text-xs text-slate-500">
                    {roomList.length} configured resource
                    {roomList.length === 1 ? "" : "s"}
                  </p>
                </div>

                <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
                  {roomList.map((room) => (
                    <div
                      key={room.id}
                      className="rounded-lg border border-slate-200 p-4"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <p className="font-medium">
                            {room.id}
                          </p>

                          <p className="mt-1 text-xs text-slate-500">
                            Capacity: {room.capacity}
                          </p>

                          <p className="mt-1 text-xs text-slate-500">
                            {room.isolation
                              ? "Isolation capable"
                              : "Standard"}
                          </p>
                        </div>

                        <span
                          className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                            room.available
                              ? "bg-emerald-50 text-emerald-700"
                              : "bg-slate-100 text-slate-600"
                          }`}
                        >
                          {room.available
                            ? "Available"
                            : "Occupied"}
                        </span>
                      </div>

                      <button
                        onClick={() =>
                          toggleAvailability(room.id)
                        }
                        className="mt-4 w-full rounded-lg border border-slate-200 px-3 py-2 text-xs font-medium text-slate-700 transition hover:bg-slate-50"
                      >
                        Mark as{" "}
                        {room.available
                          ? "Occupied"
                          : "Available"}
                      </button>
                    </div>
                  ))}
                </div>
              </section>
            )
          )}
        </div>
      </div>
    </div>
  )
}

export default Rooms