// src/components/DeleteAccountButton.jsx
import React from "react";
import { useDeleteProfile } from "../hooks/useDeleteProfile";

export default function DeleteAccountButton() {
  const { deleteProfile } = useDeleteProfile();

  const handleDelete = async () => {
    await deleteProfile(); // deletes Supabase + Clerk + redirects
  };

  return (
    <button
      onClick={handleDelete}
      className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
    >
      Delete Account
    </button>
  );
}
