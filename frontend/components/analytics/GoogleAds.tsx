import Script from "next/script";

export default function GoogleAds({
  id,
  beginCheckoutEvent,
}: {
  id: string;
  beginCheckoutEvent?: string;
}) {
  if (!id) return null;

  const config = JSON.stringify({ id, beginCheckoutEvent: beginCheckoutEvent ?? "" });

  return (
    <Script id="gads-config" strategy="lazyOnload">
      {`window.__GADS__=${config};gtag('config','${id}');`}
    </Script>
  );
}
