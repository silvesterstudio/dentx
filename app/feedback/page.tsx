import type { Metadata } from "next";
import FeedbackClient from "./FeedbackClient";

// QR-code landing for review collection — keep it out of the search index and
// off the sitemap; it's meant to be reached only by scanning the reception QR.
export const metadata: Metadata = {
  title: "Recenzie",
  robots: { index: false, follow: false },
  alternates: { canonical: "/feedback" },
};

export default function FeedbackPage() {
  return <FeedbackClient />;
}
