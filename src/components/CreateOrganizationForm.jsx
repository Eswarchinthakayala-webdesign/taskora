import { useState } from "react";
import { useSyncOrganization } from "../hooks/useSyncOrganization";

export function CreateOrganizationForm() {
  const [orgName, setOrgName] = useState("");
  const [submittedName, setSubmittedName] = useState(null);

  // Trigger upsert when submittedName changes
  useSyncOrganization(submittedName);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!orgName.trim()) return;
    setSubmittedName(orgName.trim());
    setOrgName("");
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <input
        type="text"
        placeholder="New organization name"
        value={orgName}
        onChange={(e) => setOrgName(e.target.value)}
        className="border rounded px-2 py-1 flex-1"
      />
      <button
        type="submit"
        className="bg-blue-600 text-white px-4 py-1 rounded"
      >
        Create
      </button>
    </form>
  );
}
