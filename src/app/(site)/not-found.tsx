import Link from "next/link";
import { WhatsAppButton } from "@/components/WhatsAppButton";

export default function NotFound() {
  const waMessage =
    "Hi! I was browsing perugrandtravel.com and need help finding the right Peru package.";
  return (
    <div className="mx-auto max-w-2xl px-4 py-20 text-center">
      <p className="text-sm font-bold uppercase tracking-wider text-pgt-orange">404</p>
      <h1 className="mt-2 text-3xl font-bold text-stone-900">Page not found</h1>
      <p className="mt-3 text-stone-600">
        This URL may have moved during our site upgrade. Try a hub below or message us — we reply with
        package options for your dates.
      </p>
      <ul className="mt-8 flex flex-wrap justify-center gap-3 text-sm font-semibold">
        <li>
          <Link href="/" className="rounded-lg border border-stone-200 px-4 py-2 hover:bg-stone-50">
            Home
          </Link>
        </li>
        <li>
          <Link href="/packages/" className="rounded-lg border border-stone-200 px-4 py-2 hover:bg-stone-50">
            Packages
          </Link>
        </li>
        <li>
          <Link
            href="/machu-picchu-packages/"
            className="rounded-lg border border-stone-200 px-4 py-2 hover:bg-stone-50"
          >
            Machu Picchu
          </Link>
        </li>
        <li>
          <Link href="/blogs/" className="rounded-lg border border-stone-200 px-4 py-2 hover:bg-stone-50">
            Blog
          </Link>
        </li>
      </ul>
      <WhatsAppButton
        label="Ask on WhatsApp"
        message={waMessage}
        utmContent="404_help"
        contentType="static"
        contentSlug="404"
        pagePath="/404"
        className="mt-8"
      />
    </div>
  );
}
