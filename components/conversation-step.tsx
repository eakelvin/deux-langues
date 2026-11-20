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
import { cn } from "@/lib/utils";
import { SCENES } from "@/lib/data";

function pickFrenchVoice() {
  const voices = window.speechSynthesis.getVoices();
  return (
    voices.find((voice) => voice.lang === "fr-FR") ??
    voices.find((voice) => voice.lang.toLowerCase().startsWith("fr"))
  );
}

export function ConversationStep({
  onBack,
  onDone,
}: {
  onBack: () => void;
  onDone: () => void;
}) {
  const [sceneId, setSceneId] = useState(SCENES[0].id);
  const [shown, setShown] = useState(0);
  const [listening, setListening] = useState(false);
  const [finished, setFinished] = useState(false);
  const [speakingKey, setSpeakingKey] = useState<string | null>(null);
  const alive = useRef(true);
  const scene = SCENES.find((item) => item.id === sceneId) ?? SCENES[0];
  const visibleTurns = scene.turns.slice(0, shown);
  const sampleLeft = shown < scene.turns.length;

  useEffect(() => {
    alive.current = true;
    window.speechSynthesis.getVoices();
    const loadVoices = () => {
      window.speechSynthesis.getVoices();
    };
    window.speechSynthesis.addEventListener("voiceschanged", loadVoices);
    return () => {
      alive.current = false;
      window.speechSynthesis.removeEventListener("voiceschanged", loadVoices);
      window.speechSynthesis.cancel();
    };
  }, []);

  function stopSpeech() {
    window.speechSynthesis.cancel();
    setSpeakingKey(null);
  }

  function speak(text: string, key: string) {
    if (!("speechSynthesis" in window)) return;
    if (speakingKey === key) {
      stopSpeech();
      return;
    }
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "fr-FR";
    utterance.rate = 0.95;
    const voice = pickFrenchVoice();
    if (voice) utterance.voice = voice;
    utterance.onend = () => {
      if (alive.current) {
        setSpeakingKey((current) => (current === key ? null : current));
      }
    };
    utterance.onerror = () => {
      if (alive.current) setSpeakingKey(null);
    };
    setSpeakingKey(key);
    window.speechSynthesis.speak(utterance);
  }

  function chooseScene(nextId: string) {
    stopSpeech();
    setSceneId(nextId);
    setShown(0);
    setListening(false);
    setFinished(false);
  }

  function commitTurn() {
    const turn = scene.turns[shown];
    if (!turn) {
      setListening(false);
      return;
    }
    const nextShown = shown + 1;
    setShown(nextShown);
    setListening(false);
    speak(turn.reply, `reply-${nextShown - 1}`);
  }

  function finish() {
    stopSpeech();
    setListening(false);
    setFinished(true);
    onDone();
  }

  const correctedTogether = visibleTurns.map((turn) => turn.corrected).join(" ");

  return (
    <Card>
      <CardHeader>
        <CardDescription>
          {scene.label} · you are {scene.you}
        </CardDescription>
        <CardTitle>
          <h2 className="font-heading text-xl leading-snug font-medium sm:text-2xl">
            Conversation
          </h2>
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-6">
        <div className="flex flex-wrap gap-2">
          {SCENES.map((item) => (
            <Button
              key={item.id}
              type="button"
              variant={item.id === scene.id ? "default" : "outline"}
              className="h-10 rounded-xl px-4"
              onClick={() => chooseScene(item.id)}
            >
              {item.label}
            </Button>
          ))}
        </div>
        <p className="text-sm text-muted-foreground">
          You are {scene.you}. The agent is {scene.partner}. Sample lines, so
          you can try the shape of a chat.
        </p>

        <div className="flex flex-col gap-3" aria-live="polite">
          <AgentLine
            partner={scene.partner}
            text={scene.opening}
            playing={speakingKey === "opening"}
            onPlay={() => speak(scene.opening, "opening")}
          />
          {visibleTurns.map((turn, index) => (
            <div key={`${scene.id}-${turn.said}`} className="flex flex-col gap-3">
              <p
                lang="fr"
                className="max-w-[85%] self-end rounded-2xl bg-accent px-4 py-3 font-heading text-lg leading-relaxed"
              >
                <span className="mb-1 block font-sans text-xs text-muted-foreground">
                  You
                </span>
                {turn.said}
              </p>
              <AgentLine
                partner={scene.partner}
                text={turn.reply}
                playing={speakingKey === `reply-${index}`}
                onPlay={() => speak(turn.reply, `reply-${index}`)}
              />
            </div>
          ))}
        </div>

        {finished ? (
          <div className="flex flex-col gap-4">
            <h3 className="font-heading text-lg">After you finished</h3>
            <ol className="grid gap-3 xl:grid-cols-2">
              {visibleTurns.map((turn) => {
                const changed = turn.said !== turn.corrected;
                return (
                  <li
                    key={turn.said}
                    className="rounded-xl bg-secondary/80 px-3 py-3"
                  >
                    <p className="text-xs text-muted-foreground">You said</p>
                    <p
                      lang="fr"
                      className={cn(
                        "mt-1 leading-relaxed",
                        changed && "text-muted-foreground"
                      )}
                    >
                      {turn.said}
                    </p>
                    <p className="mt-3 text-xs text-muted-foreground">Corrected</p>
                    <p lang="fr" className="mt-1 font-heading text-base leading-relaxed">
                      {turn.corrected}
                    </p>
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                      {turn.reason}
                    </p>
                  </li>
                );
              })}
            </ol>
            <div className="rounded-xl bg-accent px-3 py-3">
              <p className="text-xs text-muted-foreground">
                What you said, cleared up
              </p>
              <p lang="fr" className="mt-2 font-heading text-lg leading-relaxed">
                {correctedTogether}
              </p>
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {listening ? (
              <p className="text-sm text-muted-foreground">
                Take your time. I’ll answer when you’re done.
              </p>
            ) : null}
            {!listening && shown > 0 && !sampleLeft ? (
              <p className="text-sm text-muted-foreground">
                That’s the sample. Finish when you want the notes.
              </p>
            ) : null}
            {sampleLeft ? (
              <Button
                type="button"
                className="h-14 rounded-xl text-base"
                onClick={() => {
                  if (listening) {
                    commitTurn();
                    return;
                  }
                  stopSpeech();
                  setListening(true);
                }}
              >
                {listening ? "Done speaking" : "Speak"}
              </Button>
            ) : null}
            {shown > 0 && !listening ? (
              <Button
                type="button"
                variant="outline"
                className="h-12 rounded-xl text-base"
                onClick={finish}
              >
                Finish
              </Button>
            ) : null}
          </div>
        )}

        <Button
          type="button"
          variant="outline"
          className="h-12 rounded-xl text-base sm:w-fit sm:px-8"
          onClick={() => {
            stopSpeech();
            onBack();
          }}
        >
          Back to mimic
        </Button>
      </CardContent>
    </Card>
  );
}

function AgentLine({
  partner,
  text,
  playing,
  onPlay,
}: {
  partner: string;
  text: string;
  playing: boolean;
  onPlay: () => void;
}) {
  return (
    <div className="max-w-[85%] self-start rounded-2xl bg-secondary/80 px-4 py-3">
      <p className="text-xs text-muted-foreground">{partner}</p>
      <p lang="fr" className="mt-1 font-heading text-lg leading-relaxed">
        {text}
      </p>
      <button
        type="button"
        className="mt-2 text-sm text-foreground underline-offset-4 hover:underline"
        onClick={onPlay}
      >
        {playing ? "Stop" : "Play"}
      </button>
    </div>
  );
}
