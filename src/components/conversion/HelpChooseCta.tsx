import { WhatsAppButton } from "@/components/WhatsAppButton";

type Props = {
  title?: string;
  body?: string;
  waMessage: string;
  utmContent: string;
  pagePath: string;
  contentType: "home" | "hub";
  contentSlug: string;
  className?: string;
};

export function HelpChooseCta({
  title = "Not sure which package fits you?",
  body = "Most travelers message us with their dates and budget — we reply with 2–3 tailored options, no booking fee.",
  waMessage,
  utmContent,
  pagePath,
  contentType,
  contentSlug,
  className = "",
}: Props) {
  return (
    <section
      className={`rounded-2xl bg-pgt-blue px-6 py-10 text-center text-white md:px-12 ${className}`}
      aria-labelledby="help-choose-heading"
    >
      <h2 id="help-choose-heading" className="text-2xl font-bold">
        {title}
      </h2>
      <p className="mx-auto mt-3 max-w-xl text-blue-100">{body}</p>
      <WhatsAppButton
        label="Help me choose on WhatsApp"
        message={waMessage}
        utmContent={utmContent}
        contentType={contentType}
        contentSlug={contentSlug}
        pagePath={pagePath}
        className="mt-6"
      />
    </section>
  );
}
