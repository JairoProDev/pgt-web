import { JsonLd } from "@/components/JsonLd";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import { faqSchema } from "@/lib/schema";

type FaqItem = { q: string; a: string };

type Props = {
  items: FaqItem[];
  heading?: string;
  waMessage: string;
  utmContent: string;
  pagePath: string;
  contentSlug: string;
};

export function HubFAQ({
  items,
  heading = "Frequently asked questions about Peru packages",
  waMessage,
  utmContent,
  pagePath,
  contentSlug,
}: Props) {
  if (items.length === 0) return null;

  return (
    <section className="border-t border-stone-200 bg-stone-50 px-4 py-14">
      <JsonLd data={faqSchema(items)} />
      <div className="mx-auto max-w-3xl">
        <h2 className="text-2xl font-bold text-stone-900">{heading}</h2>
        <p className="mt-2 text-stone-600">
          Quick answers before you message us — still have questions? We reply on WhatsApp in English.
        </p>
        <dl className="mt-8 space-y-6">
          {items.map((item) => (
            <div key={item.q} className="rounded-lg border border-stone-200 bg-white p-5">
              <dt className="font-semibold text-stone-900">{item.q}</dt>
              <dd className="mt-2 text-sm leading-relaxed text-stone-600">{item.a}</dd>
            </div>
          ))}
        </dl>
        <div className="mt-8 text-center">
          <WhatsAppButton
            label="Ask our team on WhatsApp"
            message={waMessage}
            utmContent={utmContent}
            contentType="hub"
            contentSlug={contentSlug}
            pagePath={pagePath}
          />
        </div>
      </div>
    </section>
  );
}
