export default function StructuredData({ data }: { data: unknown }) {
  // Escape '<' so data cannot terminate the script element.
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({ "@context": "https://schema.org", "@graph": Array.isArray(data) ? data : [data] }).replace(/</g, "\\u003c") }} />;
}
