import React from "react";

const Recruitment = () => {
  // Hardcoded recruitment data
  const recruitmentData = {
    openPositions: 4,
    totalCandidates: 28,
    interviews: 12,
    selected: 5,

    candidates: [
      {
        id: 1,
        name: "Rahul Kumar",
        position: "Software Engineer",
        stage: "Interview",
        status: "In Progress",
      },
      {
        id: 2,
        name: "Priya Sharma",
        position: "Python Developer",
        stage: "Screening",
        status: "Pending",
      },
      {
        id: 3,
        name: "Arjun Reddy",
        position: "React Developer",
        stage: "Selected",
        status: "Selected",
      },
      {
        id: 4,
        name: "Sneha Rao",
        position: "HR Executive",
        stage: "Assessment",
        status: "In Progress",
      },
    ],
  };

  return (
    <div className="space-y-6">

      {/* Header */}
      <div>
        <h2 className="text-xl font-semibold text-gray-900">
          Recruitment
        </h2>

        <p className="mt-1 text-sm text-gray-500">
          Manage recruitment and candidate activities.
        </p>
      </div>

      {/* Recruitment Summary */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">

        <RecruitmentCard
          title="Open Positions"
          value={recruitmentData.openPositions}
        />

        <RecruitmentCard
          title="Total Candidates"
          value={recruitmentData.totalCandidates}
        />

        <RecruitmentCard
          title="Interviews"
          value={recruitmentData.interviews}
        />

        <RecruitmentCard
          title="Selected"
          value={recruitmentData.selected}
        />

      </div>

      {/* Candidate List */}
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">

        <div className="border-b border-gray-200 px-6 py-4">
          <h3 className="text-lg font-semibold text-gray-900">
            Candidates
          </h3>
        </div>

        <div className="overflow-x-auto">

          <table className="w-full text-left text-sm">

            <thead className="bg-gray-50">
              <tr>

                <th className="px-6 py-3 font-medium text-gray-600">
                  Candidate
                </th>

                <th className="px-6 py-3 font-medium text-gray-600">
                  Position
                </th>

                <th className="px-6 py-3 font-medium text-gray-600">
                  Stage
                </th>

                <th className="px-6 py-3 font-medium text-gray-600">
                  Status
                </th>

              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100">

              {recruitmentData.candidates.map((candidate) => (
                <tr key={candidate.id}>

                  <td className="px-6 py-4 font-medium text-gray-900">
                    {candidate.name}
                  </td>

                  <td className="px-6 py-4 text-gray-600">
                    {candidate.position}
                  </td>

                  <td className="px-6 py-4 text-gray-600">
                    {candidate.stage}
                  </td>

                  <td className="px-6 py-4">
                    <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-700">
                      {candidate.status}
                    </span>
                  </td>

                </tr>
              ))}

            </tbody>

          </table>

        </div>

      </div>

    </div>
  );
};


/* =========================
   RECRUITMENT CARD
========================= */

const RecruitmentCard = ({ title, value }) => {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">

      <p className="text-sm font-medium text-gray-500">
        {title}
      </p>

      <p className="mt-2 text-3xl font-bold text-gray-900">
        {value}
      </p>

    </div>
  );
};


export default Recruitment;