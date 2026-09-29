function Dashboard({ patients, rooms }) {
  const availableRooms = rooms.filter(
    (room) => room.available
  ).length

  const unavailableRooms = rooms.filter(
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
      value: unavailableRooms,
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

export default Dashboard