import SuccessClient from "./SuccessClient";

type PageProps = {
  searchParams?: { session_id?: string | string[] };
};

export default function CheckoutSuccessPage({ searchParams }: PageProps) {
  const raw = searchParams?.session_id;
  const sessionId = Array.isArray(raw) ? raw[0] : raw;

  return <SuccessClient sessionId={sessionId ?? ""} />;
}
