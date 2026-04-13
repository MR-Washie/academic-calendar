"use client";

export default function CalendarTable({ data }) {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-center mb-4">
        ACADEMIC CALENDAR 2026
      </h1>

      <div className="overflow-x-auto">
        <table className="w-full border border-gray-400">
          <thead className="bg-green-600 text-white">
            <tr>
              <th className="border p-2">Academic Activity</th>
              <th className="border p-2">For</th>
              <th className="border p-2">Dates</th>
              <th className="border p-2">Remarks</th>
            </tr>
          </thead>

          <tbody>
            {data.map((item, index) => (
              <tr key={index} className="text-center">
                <td className="border p-2">{item.activity}</td>
                <td className="border p-2">{item.for}</td>
                <td className="border p-2">{item.date}</td>
                <td className="border p-2">{item.remarks}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}