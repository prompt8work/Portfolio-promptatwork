import { getSiteSettings } from "../lib/content";
import SiteFooterView from "./SiteFooterView";

// The site footer with its blurb, social links and copyright line from Site
// settings. The markup is SiteFooterView.
export default async function SiteFooter() {
  return <SiteFooterView settings={await getSiteSettings()} />;
}
