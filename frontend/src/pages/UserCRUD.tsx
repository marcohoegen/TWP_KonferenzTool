import CRUDPanel from "../components/CRUDPanel";
import { userConfig } from "../config/resourceConfigs";

export default function UserCRUD() {
  return <CRUDPanel config={userConfig} />;
}
