import { useSyncOrganization } from "../hooks/useSyncOrganization";

export default function OrganizationPage() {
  useSyncOrganization();
  return <div>My Organization Page</div>;
}
