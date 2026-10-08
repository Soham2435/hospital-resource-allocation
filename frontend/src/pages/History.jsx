function History({ allocationHistory }) {
  return (
    <div className="mx-auto max-w-7xl">
      <div className="mb-8">
        <h2 className="text-2xl font-semibold">
          Allocation History
        </h2>

        <p className="mt-1 text-sm text-slate-500">
          Previously completed AI allocation runs.
        </p>
      </div>

      {allocationHistory.length === 0 ? (
        <div className="rounded-xl border border-dashed border-slate-300 bg-white p-12 text-center">
          <h3 className="font-medium text-slate-700">
            No allocation history yet
          </h3>

          <p className="mt-2 text-sm text-slate-500">
            Completed allocation runs will appear here.
          </p>
        </div>
      ) : (
        <div className="space-y-5">
          {allocationHistory.map((record) => (
            <section
              key={record.id}
              className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm"
            >
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-semibold">
                    Allocation Run {record.id}
                  </h3>

                  <p className="mt-1 text-xs text-slate-500">
                    {record.timestamp}
                  </p>
                </div>

                <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700">
                  Successful
                </span>
              </div>

              <div className="mt-5">
                <p className="text-xs font-medium text-slate-500">
                  Patient → Resource
                </p>

                <div className="mt-3 space-y-2">
                  {Object.entries(record.allocations).map(
                    ([patientId, roomId]) => (
                      <div
                        key={patientId}
                        className="flex items-center justify-between rounded-lg bg-slate-50 px-4 py-3"
                      >
                        <span className="text-sm font-medium">
                          {patientId}
                        </span>

                        <span className="text-sm text-slate-600">
                          {roomId}
                        </span>
                      </div>
                    )
                  )}
                </div>
              </div>
            </section>
          ))}
        </div>
      )}
    </div>
  )
}

export default History