import CRUDPanel from "../components/CRUDPanel";
import { conferenceConfig } from "../config/resourceConfigs";

export default function ConferenceCRUD() {
  return <CRUDPanel config={conferenceConfig} />;
}
