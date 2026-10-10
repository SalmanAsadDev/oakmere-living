"use client";
import { useRef, useState } from "react";
import Link from "next/link";
import { ArrowUpRight, MessageCircle, Send } from "lucide-react";
import { usePathname } from "next/navigation";
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetClose,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import {
  answerQuestion,
  type GuideProduct,
  type GuideReply,
} from "@/lib/domain/sofa-guide.mjs";
export function SofaGuide({ catalogue }: { catalogue: GuideProduct[] }) {
  const pathname = usePathname();
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<
    { question: string; reply: GuideReply }[]
  >([]);
  const end = useRef<HTMLDivElement>(null);
  if (pathname.startsWith("/admin") || pathname.startsWith("/checkout"))
    return null;
  function ask(question: string) {
    if (!question.trim()) return;
    setMessages((old) => [
      ...old.slice(-9),
      {
        question: question.slice(0, 240),
        reply: answerQuestion(question, catalogue),
      },
    ]);
    setInput("");
    requestAnimationFrame(() =>
      end.current?.scrollIntoView({ block: "nearest" }),
    );
  }
  function save() {
    const text = [
      "Oakmere Living · Guided help (not a live chat)",
      ...messages.map(
        (m) =>
          `You: ${m.question}\nGuide: ${m.reply.text}\n${m.reply.links.map((l) => `${l.label}: ${l.href}`).join("\n")}`,
      ),
    ].join("\n\n");
    const url = URL.createObjectURL(new Blob([text], { type: "text/plain" }));
    const a = document.createElement("a");
    a.href = url;
    a.download = "oakmere-sofa-guide.txt";
    a.click();
    URL.revokeObjectURL(url);
  }
  return (
    <Sheet>
      <SheetTrigger
        className="icon-action fixed right-5 bottom-5 z-40 flex min-h-12 items-center gap-3 rounded-full bg-primary px-5 py-3 text-xs text-white shadow-lg"
        aria-label="Open Oakmere sofa guide"
      >
        <MessageCircle size={18} /> Sofa guide
      </SheetTrigger>
      <SheetContent className="flex flex-col">
        <SheetHeader className="border-b px-6 py-8">
          <p className="eyebrow text-muted-foreground">
            A little help choosing
          </p>
          <SheetTitle className="font-serif text-3xl">
            The Oakmere sofa guide
          </SheetTitle>
          <SheetDescription>
            Instant catalogue guidance, not a live chat or AI adviser. Please
            keep personal and order details out of this guide.
          </SheetDescription>
        </SheetHeader>
        <div className="flex-1 overflow-y-auto px-6 py-5">
          <p className="mb-4 font-serif text-xl">
            Let’s find your kind of comfort.
          </p>
          <div className="flex flex-wrap gap-2">
            {[
              "Corner sofa under £900",
              "Can I pay on delivery?",
              "Help me measure",
              "Fabric swatches",
            ].map((q) => (
              <button
                className="filter-chip text-left"
                key={q}
                onClick={() => ask(q)}
              >
                {q}
              </button>
            ))}
          </div>
          <div
            role="log"
            aria-live="polite"
            aria-relevant="additions"
            className="mt-6 space-y-6"
          >
            {messages.map((m, i) => (
              <div key={i} className="space-y-3">
                <p className="ml-8 rounded-xl bg-primary p-4 text-sm text-white">
                  {m.question}
                </p>
                <div className="mr-3 border bg-muted/50 p-4 text-sm leading-6">
                  <p>{m.reply.text}</p>
                  <ul className="mt-3 space-y-2">
                    {m.reply.links.map((l) => (
                      <li key={l.href}>
                        <SheetClose asChild>
                          <Link
                            className="editorial-link inline-flex items-center gap-2 link-underline"
                            href={l.href}
                          >
                            {l.label}
                            <ArrowUpRight size={14} />
                          </Link>
                        </SheetClose>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
          <div ref={end} />
        </div>
        <div className="border-t p-6">
          <form
            onSubmit={(event) => {
              event.preventDefault();
              ask(input);
            }}
            className="flex gap-2"
          >
            <label className="sr-only" htmlFor="sofa-guide-question">
              Ask the sofa guide
            </label>
            <input
              id="sofa-guide-question"
              maxLength={240}
              value={input}
              onChange={(event) => setInput(event.target.value)}
              placeholder="A sofa, a budget, a question…"
              className="min-w-0 flex-1 border bg-white p-3 text-sm"
            />
            <Button
              type="submit"
              size="icon"
              className="size-12"
              disabled={!input.trim()}
              aria-label="Send question"
            >
              <Send />
            </Button>
          </form>
          <div className="mt-3 flex justify-between gap-4 text-xs">
            <button
              disabled={!messages.length}
              className="link-underline disabled:opacity-40"
              onClick={() => setMessages([])}
            >
              Clear conversation
            </button>
            <button
              disabled={!messages.length}
              className="link-underline disabled:opacity-40"
              onClick={save}
            >
              Save conversation
            </button>
          </div>
          <p className="mt-4 text-[11px] text-muted-foreground">
            Replies use this site’s catalogue and guidance. Messages stay in
            this page session.
          </p>
        </div>
      </SheetContent>
    </Sheet>
  );
}
