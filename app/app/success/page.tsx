import SuccessContent from "./success-content";

/** No useSearchParams anywhere in this route — avoids Vercel static prerender crash. */
export default function SuccessPage() {
  return <SuccessContent />;
}
