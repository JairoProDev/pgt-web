import Link from "next/link";
import { siteConfig } from "@/lib/site";

export function Footer() {
  return (
    <footer className="mt-auto border-t border-stone-200 bg-pgt-blue text-white">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 md:grid-cols-3">
        <div>
          <p className="text-lg font-semibold">{siteConfig.name}</p>
          <p className="mt-2 text-sm text-blue-100">{siteConfig.address}</p>
        </div>
        <div className="text-sm text-blue-100">
          <p className="font-semibold text-white">Quick links</p>
          <ul className="mt-2 space-y-1">
            <li><Link href="/packages/" className="hover:text-white">Peru Packages</Link></li>
            <li><Link href="/tour/the-classic-salkantay-trek-5d/" className="hover:text-white">Salkantay Trek 5D</Link></li>
            <li><Link href="/blog/things-to-do-in-machu-picchu/" className="hover:text-white">Machu Picchu Guide</Link></li>
          </ul>
        </div>
        <div className="text-sm text-blue-100">
          <p className="font-semibold text-white">Contact</p>
          <p className="mt-2">
            WhatsApp:{" "}
            <a href={`https://wa.me/${siteConfig.phonePeWa}`} className="text-white hover:underline">
              {siteConfig.phonePe}
            </a>
          </p>
          <p>{siteConfig.email}</p>
        </div>
      </div>
      <div className="border-t border-blue-800 px-4 py-4 text-center text-xs text-blue-200">
        © {new Date().getFullYear()} {siteConfig.name}. All rights reserved.
      </div>
    </footer>
  );
}
