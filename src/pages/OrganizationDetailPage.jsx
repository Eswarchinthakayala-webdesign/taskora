// src/pages/OrganizationDetailsPage.jsx
import React from "react";
import { useParams } from "react-router-dom";
import { useOrganizationDetails } from "../hooks/useOrganizationDetails";

export default function OrganizationDetailsPage() {
  const { id } = useParams();
  const { org, loading } = useOrganizationDetails(id);

  if (loading) return <p>Loading...</p>;
  if (!org) return <p>Organization not found</p>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">{org.name}</h1>
      <p className="text-gray-600">ID: {org.id}</p>
      <p className="text-gray-600">Owner ID: {org.owner_id}</p>
      <p className="text-gray-600">Created: {new Date(org.created_at).toLocaleString()}</p>
    </div>
  );
}
