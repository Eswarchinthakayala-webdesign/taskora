// src/pages/OrganizationsPage.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import { useUserOrganizations } from "../hooks/useUserOrganizations";

export default function OrganizationsPage() {
  const { orgs, loading } = useUserOrganizations();
  const navigate = useNavigate();

  if (loading) return <p>Loading...</p>;

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">My Organizations</h1>
      <ul className="space-y-2">
        {orgs.map((org) => (
          <li
            key={org.id}
            className="p-3 bg-gray-100 rounded cursor-pointer hover:bg-gray-200"
            onClick={() => navigate(`/organization/${org.id}`)}
          >
            {org.name}
          </li>
        ))}
      </ul>
    </div>
  );
}
