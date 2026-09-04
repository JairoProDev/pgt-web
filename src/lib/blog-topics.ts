/** Topic chips for blog index + search — names stay in English (shared tags across markets). */
const BLOG_TOPIC_RULES: { label: string; re: RegExp }[] = [
  {
    label: "Cusco",
    re: /\bcusco\b|sacred valley|valle sagrado|vale sagrado|ollantaytambo|salkantay|inca trail|camino inca|trilha inca/,
  },
  { label: "Machu Picchu", re: /machu picchu|machupicchu|huayna|aguas calientes/ },
  { label: "Lima", re: /\blima\b|miraflores|barranco|huacachina/ },
  { label: "Amazon", re: /amazon|amazonas|selva|rainforest|maldonado|tambopata/ },
  { label: "Food", re: /food|comida|gastronom|ceviche|restaurant|restaurante|pisco|cuisine|culin/ },
  {
    label: "Planning",
    re: /itinerary|itinerario|roteiro|pack|when to|mejor epoca|melhor epoca|visa|budget|tips|consejos|guia|guide/,
  },
];

export function inferBlogTopics(slug: string, h1: string, intro: string, fallback = "Peru"): string[] {
  const text = `${slug} ${h1} ${intro}`.toLowerCase();
  const topics = BLOG_TOPIC_RULES.filter((r) => r.re.test(text)).map((r) => r.label);
  return topics.length > 0 ? topics : [fallback];
}
