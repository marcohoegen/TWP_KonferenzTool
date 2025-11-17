import CRUDPanel from "../components/CRUDPanel";
import { adminConfig } from "../config/resourceConfigs";

export default function AdminCRUD() {
  return <CRUDPanel config={adminConfig} />;
}
