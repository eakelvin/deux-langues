"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { STARTER } from "@/lib/data";

export function NotebookView() {
  const [notes, setNotes] = useState(STARTER);
  const [filter, setFilter] = useState<"review" | "learned">("review");
  const [queue, setQueue] = useState<string[] | null>(null);
  const [index, setIndex] = useState(0);
  const [revealed, setRevealed] = useState(false);

  const visible = notes.filter((note) =>
    filter === "learned" ? note.learned : !note.learned
  );
  const current = queue ? notes.find((note) => note.id === queue[index]) : null;
  const reviewDone = queue !== null && index >= queue.length;

  function practice(id: string, learned?: boolean) {
    setNotes((items) =>
      items.map((note) =>
        note.id === id
          ? {
            ...note,
            practiced: note.practiced + 1,
            learned: learned ?? note.learned,
          }
          : note
      )
    );
  }

  function toggleLearned(id: string) {
    setNotes((items) =>
      items.map((note) =>
        note.id === id ? { ...note, learned: !note.learned } : note
      )
    );
  }

  function startReview() {
    setQueue(notes.filter((note) => !note.learned).map((note) => note.id));
    setIndex(0);
    setRevealed(false);
  }

  function answer(learned: boolean) {
    const id = queue?.[index];
    if (!id) return;
    practice(id, learned);
    setRevealed(false);
    setIndex((value) => value + 1);
  }

  return (
    <section aria-label="Notebook" className="flex flex-col gap-6">
      <header>
        <h1 className="font-heading text-4xl tracking-tight sm:text-5xl">Notebook</h1>
        <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
          Sample notes, so you can try the list. Later, words you miss will
          land here on their own.
        </p>
      </header>

      {queue ? (
        <div className="rounded-2xl bg-card px-5 py-6 ring-1 ring-foreground/10 sm:px-8">
          {reviewDone ? (
            <div className="flex flex-col gap-4">
              <p className="font-heading text-2xl">That’s the set.</p>
              <Button
                type="button"
                variant="outline"
                className="h-12 w-fit rounded-xl px-6 text-base"
                onClick={() => setQueue(null)}
              >
                Back to the list
              </Button>
            </div>
          ) : current ? (
            <div className="flex flex-col gap-5">
              <p className="text-sm text-muted-foreground">
                {index + 1} of {queue.length}
              </p>
              <p lang="fr" className="font-heading text-3xl leading-snug">
                {current.phrase}
              </p>
              {revealed ? (
                <>
                  <p lang="fr" className="font-heading text-xl leading-relaxed">
                    {current.correction}
                  </p>
                  <p lang="fr" className="text-muted-foreground">
                    {current.example}
                  </p>
                  <div className="flex flex-wrap gap-3">
                    <Button
                      type="button"
                      variant="outline"
                      className="h-12 rounded-xl px-6 text-base"
                      onClick={() => answer(false)}
                    >
                      Again
                    </Button>
                    <Button
                      type="button"
                      className="h-12 rounded-xl px-6 text-base"
                      onClick={() => answer(true)}
                    >
                      Learned
                    </Button>
                  </div>
                </>
              ) : (
                <Button
                  type="button"
                  className="h-12 w-fit rounded-xl px-6 text-base"
                  onClick={() => setRevealed(true)}
                >
                  Show the correction
                </Button>
              )}
            </div>
          ) : null}
        </div>
      ) : (
        <>
          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              className={cn(
                "text-sm",
                filter === "review" ? "text-foreground" : "text-muted-foreground"
              )}
              onClick={() => setFilter("review")}
            >
              To review
            </button>
            <button
              type="button"
              className={cn(
                "text-sm",
                filter === "learned" ? "text-foreground" : "text-muted-foreground"
              )}
              onClick={() => setFilter("learned")}
            >
              Learned
            </button>
            <Button
              type="button"
              variant="outline"
              className="ml-auto h-10 rounded-xl px-4"
              onClick={startReview}
              disabled={notes.every((note) => note.learned)}
            >
              Review
            </Button>
          </div>

          {visible.length === 0 ? (
            <p className="text-sm text-muted-foreground">Nothing in this pile.</p>
          ) : (
            <ul className="grid gap-4 lg:grid-cols-2">
              {visible.map((note) => (
                <li
                  key={note.id}
                  className="flex flex-col gap-3 rounded-2xl bg-card px-4 py-4 ring-1 ring-foreground/10"
                >
                  <div className="flex items-baseline justify-between gap-3">
                    <p lang="fr" className="font-heading text-xl">
                      {note.phrase}
                    </p>
                    <p className="shrink-0 text-sm text-muted-foreground">{note.date}</p>
                  </div>
                  <p lang="fr" className="leading-relaxed">
                    {note.correction}
                  </p>
                  <p lang="fr" className="text-sm text-muted-foreground">
                    {note.example}
                  </p>
                  <div className="mt-auto flex flex-wrap items-center gap-3 pt-1">
                    <p className="text-sm text-muted-foreground tabular-nums">
                      Practiced {note.practiced}
                    </p>
                    <button
                      type="button"
                      className="text-sm underline-offset-4 hover:underline"
                      onClick={() => practice(note.id)}
                    >
                      I practiced this
                    </button>
                    <button
                      type="button"
                      className="text-sm underline-offset-4 hover:underline"
                      onClick={() => toggleLearned(note.id)}
                    >
                      {note.learned ? "Not learned yet" : "Mark learned"}
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </>
      )}
    </section>
  );
}
