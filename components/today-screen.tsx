"use client";

import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Progress,
  ProgressLabel,
  ProgressValue,
} from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";
import { ConversationStep } from "@/components/conversation-step";
import { MimicStep } from "@/components/mimic-step";
import { NotebookView } from "@/components/notebook-view";
import { ProgressView } from "@/components/progress-view";
import { cn } from "@/lib/utils";
import { FULL_CORRECTION, SAMPLE, SAMPLE_CORRECTIONS, TOPIC } from "@/lib/data";

const MAX_LINES = 5;

function normalize(text: string) {
  return text.replace(/\s+/g, " ").trim();
}

function clampLines(value: string) {
  const lines = value.split("\n");
  if (lines.length <= MAX_LINES) return value;
  return lines.slice(0, MAX_LINES).join("\n");
}

function splitSentences(text: string) {
  return text
    .split(/\n+|(?<=[.!?])\s+/)
    .map((sentence) => sentence.trim())
    .filter(Boolean);
}

export function TodayScreen() {
  const [draft, setDraft] = useState(SAMPLE);
  const [showCorrections, setShowCorrections] = useState(false);
  const [place, setPlace] = useState<"today" | "notebook" | "progress">("today");
  const [view, setView] = useState<"writing" | "mimic" | "conversation">("writing");
  const [writingDone, setWritingDone] = useState(false);
  const [mimicDone, setMimicDone] = useState(false);
  const [conversationDone, setConversationDone] = useState(false);
  const correctionsRef = useRef<HTMLDivElement>(null);
  const practiceRef = useRef<HTMLElement>(null);

  const lineCount = draft === "" ? 0 : draft.split("\n").length;
  const usingSample = normalize(draft) === normalize(SAMPLE);
  const dayCounted = writingDone || mimicDone || conversationDone;
  const streak = dayCounted ? 7 : 6;
  const doneCount =
    (writingDone ? 1 : 0) + (mimicDone ? 1 : 0) + (conversationDone ? 1 : 0);

  const corrections = usingSample
    ? SAMPLE_CORRECTIONS
    : splitSentences(draft).map((sentence) => ({
      original: sentence,
      corrected: sentence,
      reason: "A real note will sit here.",
    }));

  const fullCorrection = usingSample
    ? FULL_CORRECTION
    : splitSentences(draft).join(" ");

  useEffect(() => {
    if (!showCorrections || view !== "writing") return;
    correctionsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [showCorrections, view]);

  useEffect(() => {
    if (view === "writing") return;
    practiceRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [view]);

  function openCorrections() {
    if (!draft.trim()) return;
    setShowCorrections(true);
    setWritingDone(true);
  }

  return (
    <main className="mx-auto w-full max-w-7xl flex-1 px-5 py-8 sm:px-8 lg:px-10 lg:py-12">
      <p className="font-heading text-2xl tracking-tight">DeuxLangues</p>
      <nav aria-label="Sections" className="mt-4 mb-8 flex gap-6">
        {(
          [
            ["today", "Today"],
            ["notebook", "Notebook"],
            ["progress", "Progress"],
          ] as const
        ).map(([id, label]) => (
          <button
            key={id}
            type="button"
            className={cn(
              "text-sm",
              place === id
                ? "font-medium text-foreground"
                : "text-muted-foreground"
            )}
            aria-current={place === id ? "page" : undefined}
            onClick={() => setPlace(id)}
          >
            {label}
          </button>
        ))}
      </nav>
      {place === "notebook" ? (
        <NotebookView />
      ) : place === "progress" ? (
        <ProgressView />
      ) : (
        <div className="lg:grid lg:grid-cols-[minmax(16rem,20rem)_minmax(0,1fr)] lg:items-start lg:gap-x-14 xl:gap-x-20">
          <aside className="lg:sticky lg:top-10">
            <header>
              <h1 className="font-heading text-4xl tracking-tight sm:text-5xl">Today</h1>
              <p className="mt-1 text-sm text-muted-foreground">
                Wednesday, November 18
              </p>
              <p className="mt-6 font-heading text-2xl tracking-tight sm:text-3xl">
                {streak} days in a row
              </p>
              <p className="text-sm text-muted-foreground">Longest was 11</p>
            </header>

            <section className="mt-8" aria-label="Today's progress">
              <Progress
                value={doneCount}
                max={3}
                aria-label="Steps done today"
                getAriaValueText={() => `${doneCount} of 3 steps`}
              >
                <ProgressLabel className="font-normal">Done today</ProgressLabel>
                <ProgressValue>{() => `${doneCount} of 3`}</ProgressValue>
              </Progress>
              <ol className="mt-2 grid grid-cols-3 text-xs">
                <li className={writingDone ? "text-primary" : "text-foreground"}>
                  Writing
                </li>
                <li
                  className={cn(
                    "text-center",
                    mimicDone
                      ? "text-primary"
                      : view === "mimic"
                        ? "text-foreground"
                        : "text-muted-foreground"
                  )}
                >
                  Mimic
                </li>
                <li
                  className={cn(
                    "text-right",
                    conversationDone
                      ? "text-primary"
                      : view === "conversation"
                        ? "text-foreground"
                        : "text-muted-foreground"
                  )}
                >
                  Conversation
                </li>
              </ol>
            </section>
          </aside>

          <section
            ref={practiceRef}
            className="mt-8 scroll-mt-8 lg:mt-0"
            aria-label={
              view === "writing"
                ? "Topic and writing"
                : view === "mimic"
                  ? "Mimic"
                  : "Conversation"
            }
          >
            {view === "mimic" ? (
              <MimicStep
                onBack={() => setView("writing")}
                onContinue={() => {
                  setMimicDone(true);
                  setView("conversation");
                }}
              />
            ) : view === "conversation" ? (
              <ConversationStep
                onBack={() => setView("mimic")}
                onDone={() => setConversationDone(true)}
              />
            ) : (
              <Card>
                <CardHeader>
                  <CardDescription>Opinion · C1</CardDescription>
                  <CardTitle>
                    <h2 className="font-heading text-xl leading-snug font-medium sm:text-2xl">
                      Topic and writing
                    </h2>
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col gap-4">
                  <p lang="fr" className="font-heading text-lg leading-snug sm:text-xl">
                    {TOPIC}
                  </p>

                  {showCorrections ? (
                    <div ref={correctionsRef} className="flex flex-col gap-4">
                      {!usingSample ? (
                        <p className="text-sm text-muted-foreground">
                          This is the layout. Real notes come later. The sample text
                          has the full example.
                        </p>
                      ) : null}
                      <ol className="grid gap-3 xl:grid-cols-2">
                        {corrections.map((item, index) => {
                          const changed = item.original !== item.corrected;
                          return (
                            <li
                              key={`${item.original}-${index}`}
                              className="rounded-xl bg-secondary/80 px-3 py-3"
                            >
                              <p className="text-xs text-muted-foreground">You wrote</p>
                              <p
                                lang="fr"
                                className={cn(
                                  "mt-1 leading-relaxed",
                                  changed && "text-muted-foreground"
                                )}
                              >
                                {item.original}
                              </p>
                              <p className="mt-3 text-xs text-muted-foreground">
                                Corrected
                              </p>
                              <p
                                lang="fr"
                                className="mt-1 font-heading text-base leading-relaxed"
                              >
                                {item.corrected}
                              </p>
                              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                                {item.reason}
                              </p>
                            </li>
                          );
                        })}
                      </ol>
                      <div className="rounded-xl bg-accent px-3 py-3">
                        <p className="text-xs text-muted-foreground">
                          Full corrected version
                        </p>
                        <p
                          lang="fr"
                          className="mt-2 font-heading text-lg leading-relaxed"
                        >
                          {fullCorrection}
                        </p>
                      </div>
                      <div className="grid gap-3 sm:grid-cols-2">
                        <Button
                          type="button"
                          variant="outline"
                          className="h-12 rounded-xl text-base"
                          onClick={() => setShowCorrections(false)}
                        >
                          Back to writing
                        </Button>
                        <Button
                          type="button"
                          className="h-12 rounded-xl text-base"
                          onClick={() => setView("mimic")}
                        >
                          Continue
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="flex flex-col gap-2">
                        <Textarea
                          lang="fr"
                          rows={5}
                          value={draft}
                          aria-label="Your French writing"
                          placeholder="Écris ici."
                          className="min-h-44 resize-none px-3 py-3 text-base leading-relaxed md:text-base"
                          onChange={(event) => setDraft(clampLines(event.target.value))}
                          onKeyDown={(event) => {
                            if (event.key === "Enter" && lineCount >= MAX_LINES) {
                              event.preventDefault();
                            }
                          }}
                        />
                        <div className="flex items-center justify-between gap-3 text-sm text-muted-foreground">
                          <p>Up to five lines.</p>
                          <p className="tabular-nums">
                            {lineCount} of {MAX_LINES}
                          </p>
                        </div>
                      </div>
                      {usingSample ? (
                        <p className="text-sm text-muted-foreground">
                          A sample is filled in, so you can open the corrections.
                        </p>
                      ) : (
                        <button
                          type="button"
                          className="self-start text-sm text-foreground underline-offset-4 hover:underline"
                          onClick={() => setDraft(SAMPLE)}
                        >
                          Use the sample
                        </button>
                      )}
                      <Button
                        type="button"
                        className="h-12 w-full rounded-xl text-base sm:w-fit sm:min-w-56 sm:px-8"
                        disabled={!draft.trim()}
                        onClick={openCorrections}
                      >
                        Show corrections
                      </Button>
                    </>
                  )}
                </CardContent>
              </Card>
            )}
          </section>
        </div>
      )}
    </main>
  );
}
