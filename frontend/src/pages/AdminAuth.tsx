import { useAdminAdminControllerMe } from "../api/generate/hooks/AdminService.hooks";
import BasicSpinner from "../common/BasicSpinner";

export function AdminAuth() {
  const {
    data: admin,
    isLoading,
    error,
  } = useAdminAdminControllerMe(undefined, undefined);

  if (isLoading) {
    return <BasicSpinner />;
  }

  if (error) {
    return (
      <header className="p-4 bg-red-100">
        <h1>Not Logged In</h1>
        <p>{error.toString() || "Authentication failed"}</p>
      </header>
    );
  }

  if (!admin) {
    return (
      <header className="p-4 bg-yellow-100">
        <h1>No Admin Data</h1>
      </header>
    );
  }

  return (
    <header className="p-4 bg-green-100">
      <h1>Logged In as {admin.name}</h1>
    </header>
  );
}
