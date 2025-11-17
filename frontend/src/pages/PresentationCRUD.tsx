import CRUDPanel from "../components/CRUDPanel";
import { presentationConfig } from "../config/resourceConfigs";

export default function PresentationCRUD() {
  return <CRUDPanel config={presentationConfig} />;
}
