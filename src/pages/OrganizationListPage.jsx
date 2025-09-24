import React from "react";
import { useUser, OrganizationList, CreateOrganization } from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom";

export default function OrganizationListPage() {
  const { user, isLoaded: userLoaded } = useUser();
  const navigate = useNavigate();

  if (!userLoaded) return <div className="flex justify-center items-center h-screen text-white bg-black">Loading...</div>;

  return (
    <div className="p-6 min-h-screen bg-gradient-to-b from-black via-zinc-950 to-black text-white space-y-6">
      <h1 className="text-3xl font-bold text-orange-500">Your Organizations</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Create Organization */}
        <div className="bg-zinc-900/60 border border-orange-500/30 shadow rounded p-4">
          <h2 className="text-xl font-semibold text-orange-400 mb-2">Create Organization</h2>
          <CreateOrganization
            afterCreateOrganizationUrl="/organizations"
            appearance={{
              elements: {
                rootBox: "flex flex-col gap-2",
                organizationNameInput: "w-full px-3 py-2 rounded border border-orange-500 bg-black/30 text-white placeholder:text-zinc-400",
                createOrganizationButton: "bg-orange-500 text-black py-2 rounded hover:bg-orange-600 transition-colors",
              },
            }}
          />
        </div>

        {/* Organization List */}
        <div className="bg-zinc-900/60 border border-orange-500/30 shadow rounded p-4">
          <h2 className="text-xl font-semibold text-orange-400 mb-2">Organization List</h2>
          <OrganizationList
            appearance={{
              elements: {
                organizationCard: "border rounded p-3 mb-2 hover:bg-black/50 cursor-pointer flex justify-between items-center text-white",
              },
            }}
            onOrganizationClick={(org) => {
              if (org && org.id) {
                navigate(`/organization/${org.id}`); // <-- client-side navigation
              } else {
                console.warn("Organization object does not have an id:", org);
              }
            }}
          />
        </div>
      </div>
    </div>
  );
}
