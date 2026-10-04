import { permanentRedirect } from "next/navigation";
import { techTrendPath } from "../lib/project-routes";

export default function LegacyTechTrendPage() {
  permanentRedirect(techTrendPath);
}
