import Link from "next/link";
import { notFound } from "next/navigation";
import { articles } from "@/lib/data/journal";
export function generateStaticParams() {
  return articles.map((a) => ({ slug: a.slug }));
}
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const article = articles.find((a) => a.slug === slug);
  return { title: article?.title, description: article?.intro };
}
export default async function ArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const a = articles.find((a) => a.slug === slug);
  if (!a) notFound();
  return (
    <article className="container section max-w-3xl">
      <Link href="/blog" className="text-xs link-underline">
        ← The journal
      </Link>
      <p className="eyebrow mt-10 mb-5 text-muted-foreground">{a.category}</p>
      <h1 className="display text-5xl sm:text-6xl">{a.title}</h1>
      <p className="my-8 font-serif text-2xl leading-relaxed">{a.intro}</p>
      <div className="space-y-6 text-sm leading-8 text-muted-foreground">
        {a.paragraphs.map((p) => (
          <p key={p}>{p}</p>
        ))}
      </div>
      <div className="mt-10 flex flex-wrap gap-6 border-t pt-8 text-sm">
        <Link className="link-underline" href={a.href}>
          {a.action} →
        </Link>
        <Link className="link-underline" href="/shop">
          Explore the collection →
        </Link>
      </div>
    </article>
  );
}
