// src/components/DeleteOrganizationButton.jsx
import React from "react";
import { useDeleteOrganization } from "../hooks/useDeleteOrganization";

export function DeleteOrganizationButton({ orgId }) {
  const { deleteOrganization } = useDeleteOrganization();

  const handleDelete = async () => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this organization? This action cannot be undone."
    );
    if (!confirmDelete) return;

    await deleteOrganization(orgId);
  };

  return (
    <button
      onClick={handleDelete}
      className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
    >
      Delete Organization
    </button>
  );
}
