import React from "react";

const ViewUserDetails = ({ user, onClose }) => {
  if (!user) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      {/* Scrollable wrapper */}
      <div className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-white rounded-2xl shadow-2xl mx-4 md:mx-0 p-6 md:p-8 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent animate-fadeIn">
        {/* Header */}

        <h2 className="text-2xl font-bold text-white mb-6 text-center p-2 rounded-md bg-gradient-to-r from-amber-600 via-amber-700 to-orange-600 shadow-md">
          {user.fullName || "User Details"}
        </h2>

        {/* Content Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <Detail label="User ID" value={user.userId} />
          <Detail label="Full Name" value={user.fullName} />
          <Detail label="Phone Number" value={user.phoneNumber} />
          <Detail label="Email Address" value={user.emailAddress} />
          <Detail
            label="Date of Birth"
            value={
              user.dateOfBirth
                ? new Date(user.dateOfBirth).toLocaleDateString()
                : "—"
            }
          />
          <Detail label="Gender" value={user.gender} />
          <Detail label="Marital Status" value={user.maritalStatus} />
          <Detail label="Number of Children" value={user.numberOfChildren} />
          <Detail label="Residential Address" value={user.residentialAddress} />
          <Detail label="Work Address" value={user.workAddress} />
          <Detail
            label="Educational Background"
            value={user.educationalBackground}
          />
          <Detail label="Occupation" value={user.occupation} />
          <Detail label="Skills" value={user.skills?.join(", ")} />
          <Detail label="Local Church Name" value={user.localChurchName} />
          <Detail
            label="Local Church Address"
            value={user.localChurchAddress}
          />
          <Detail
            label="Role in Local Church"
            value={user.roleInLocalChurch?.join(", ")}
          />
          <Detail
            label="Role in Yadah Ministry"
            value={user.roleInYadahMinistry?.join(", ")}
          />
          <Detail
            label="Batch in Yadah Ministry"
            value={user.batchInYadahMinistry}
          />
          <Detail
            label="Created At"
            value={
              user.createdAt ? new Date(user.createdAt).toLocaleString() : "—"
            }
          />
          <Detail
            label="Updated At"
            value={
              user.updatedAt ? new Date(user.updatedAt).toLocaleString() : "—"
            }
          />
        </div>

        {/* Footer */}
        <div className="mt-8 text-center md:text-right">
          <button
            onClick={onClose}
            className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-6 rounded-lg font-medium transition-all"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

/* Small reusable component for consistent style */
const Detail = ({ label, value }) => (
  <div className="border-b border-gray-200 pb-2">
    <p className="text-gray-500 text-sm font-medium">{label}</p>
    <p className="text-gray-800 font-semibold break-words">{value || "—"}</p>
  </div>
);

export default ViewUserDetails;
