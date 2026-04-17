interface BreadcrumbItem {
  name: string;
  url: string;
}

interface Props {
  items: BreadcrumbItem[];
}

/**
 * BreadcrumbList JSON-LD pre Google rich results.
 *
 * Použitie:
 * <BreadcrumbJsonLd items={[
 *   { name: "Domov", url: "https://kcars.sk" },
 *   { name: "Ponuka", url: "https://kcars.sk/sk/ponuka" },
 *   { name: "Audi A4 2020", url: "https://kcars.sk/sk/ponuka/audi-a4-2020" },
 * ]} />
 */
export default function BreadcrumbJsonLd({ items }: Props) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
