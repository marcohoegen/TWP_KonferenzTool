import CRUDPanel from "../components/CRUDPanel";
import { ratingConfig } from "../config/resourceConfigs";

export default function RatingCRUD() {
  return <CRUDPanel config={ratingConfig} />;
}
