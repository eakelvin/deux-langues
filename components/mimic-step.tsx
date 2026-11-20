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
import { EXPRESSIONS, PASSAGE } from "@/lib/data";

function pickFrenchVoice() {
  const voices = window.speechSynthesis.getVoices();
  return (
    voices.find((voice) => voice.lang === "fr-FR") ??
    voices.find((voice) => voice.lang.toLowerCase().startsWith("fr"))
  );
}

export function MimicStep({
  onBack,
  onContinue,
}: {
  onBack: () => void;
  onContinue: () => void;
}) {
  const [speaking, setSpeaking] = useState(false);
  const [recording, setRecording] = useState(false);
  const [recordingUrl, setRecordingUrl] = useState<string | null>(null);
  const [playingMine, setPlayingMine] = useState(false);
  const [micMessage, setMicMessage] = useState<string | null>(null);
  const recorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const urlRef = useRef<string | null>(null);

  useEffect(() => {
    window.speechSynthesis.getVoices();
    const loadVoices = () => {
      window.speechSynthesis.getVoices();
    };
    window.speechSynthesis.addEventListener("voiceschanged", loadVoices);
    return () => {
      window.speechSynthesis.removeEventListener("voiceschanged", loadVoices);
      window.speechSynthesis.cancel();
      streamRef.current?.getTracks().forEach((track) => track.stop());
      audioRef.current?.pause();
      if (urlRef.current) URL.revokeObjectURL(urlRef.current);
    };
  }, []);

  function pauseMine() {
    audioRef.current?.pause();
    setPlayingMine(false);
  }

  function toggleListen() {
    if (!("speechSynthesis" in window)) return;
    if (speaking) {
      window.speechSynthesis.cancel();
      setSpeaking(false);
      return;
    }
    pauseMine();
    const utterance = new SpeechSynthesisUtterance(PASSAGE.replace(/\s+/g, " "));
    utterance.lang = "fr-FR";
    utterance.rate = 0.95;
    const voice = pickFrenchVoice();
    if (voice) utterance.voice = voice;
    utterance.onend = () => setSpeaking(false);
    utterance.onerror = () => setSpeaking(false);
    setSpeaking(true);
    window.speechSynthesis.speak(utterance);
  }

  async function toggleRecord() {
    if (recording) {
      recorderRef.current?.stop();
      return;
    }
    if (!navigator.mediaDevices?.getUserMedia || typeof MediaRecorder === "undefined") {
      setMicMessage("This browser can't record yet. Listening still works.");
      return;
    }
    setMicMessage(null);
    window.speechSynthesis.cancel();
    setSpeaking(false);
    pauseMine();
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      const recorder = new MediaRecorder(stream);
      recorderRef.current = recorder;
      const chunks: Blob[] = [];
      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) chunks.push(event.data);
      };
      recorder.onstop = () => {
        const blob = new Blob(chunks, { type: recorder.mimeType || "audio/webm" });
        const url = URL.createObjectURL(blob);
        if (urlRef.current) URL.revokeObjectURL(urlRef.current);
        urlRef.current = url;
        if (audioRef.current) {
          audioRef.current.pause();
          audioRef.current = null;
        }
        setPlayingMine(false);
        setRecordingUrl(url);
        stream.getTracks().forEach((track) => track.stop());
        setRecording(false);
      };
      recorder.start();
      setRecording(true);
    } catch {
      setMicMessage(
        "The microphone stayed closed. Allow it in the browser, then try again."
      );
      setRecording(false);
    }
  }

  function toggleMine() {
    if (!recordingUrl) return;
    window.speechSynthesis.cancel();
    setSpeaking(false);
    if (!audioRef.current) {
      const audio = new Audio(recordingUrl);
      audio.onended = () => setPlayingMine(false);
      audioRef.current = audio;
    }
    if (playingMine) {
      audioRef.current.pause();
      setPlayingMine(false);
      return;
    }
    void audioRef.current.play();
    setPlayingMine(true);
  }

  const paragraphs = PASSAGE.split(/\n\n/);

  return (
    <Card>
      <CardHeader>
        <CardDescription>C1 · sample text</CardDescription>
        <CardTitle>
          <h2 className="font-heading text-xl leading-snug font-medium sm:text-2xl">
            Mimic
          </h2>
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-6">
        <div lang="fr" className="flex flex-col gap-4">
          {paragraphs.map((paragraph) => (
            <p
              key={paragraph.slice(0, 24)}
              className="font-heading text-lg leading-relaxed sm:text-xl sm:leading-relaxed"
            >
              {paragraph}
            </p>
          ))}
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <Button
            type="button"
            className="h-14 rounded-xl text-base"
            onClick={toggleListen}
          >
            {speaking ? "Stop" : "Listen"}
          </Button>
          <Button
            type="button"
            variant={recording ? "default" : "outline"}
            className="h-14 rounded-xl text-base"
            onClick={() => void toggleRecord()}
          >
            {recording ? "Stop" : recordingUrl ? "Record again" : "Record"}
          </Button>
        </div>
        {recording ? (
          <p className="text-sm text-muted-foreground">Go ahead, I’m listening.</p>
        ) : null}
        {micMessage ? (
          <p className="text-sm text-muted-foreground">{micMessage}</p>
        ) : null}

        <div>
          <h3 className="text-sm text-muted-foreground">Key expressions</h3>
          <dl className="mt-3 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
            {EXPRESSIONS.map((item) => (
              <div key={item.phrase} className="rounded-xl bg-secondary/80 px-3 py-3">
                <dt lang="fr" className="font-heading text-base">
                  {item.phrase}
                </dt>
                <dd className="mt-1 text-sm text-muted-foreground">{item.meaning}</dd>
              </div>
            ))}
          </dl>
        </div>

        {recordingUrl ? (
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="flex flex-col gap-3 rounded-xl bg-secondary/80 px-4 py-4">
              <p className="text-sm text-muted-foreground">Original</p>
              <Button
                type="button"
                variant="outline"
                className="h-12 rounded-xl text-base"
                onClick={toggleListen}
              >
                {speaking ? "Stop" : "Play original"}
              </Button>
            </div>
            <div className="flex flex-col gap-3 rounded-xl bg-accent px-4 py-4">
              <p className="text-sm text-muted-foreground">Your recording</p>
              <Button
                type="button"
                variant="outline"
                className="h-12 rounded-xl text-base"
                onClick={toggleMine}
              >
                {playingMine ? "Stop" : "Play mine"}
              </Button>
            </div>
          </div>
        ) : null}

        <div className="grid gap-3 sm:grid-cols-2">
          <Button
            type="button"
            variant="outline"
            className="h-12 rounded-xl text-base"
            onClick={onBack}
          >
            Back to writing
          </Button>
          <Button
            type="button"
            className="h-12 rounded-xl text-base"
            onClick={onContinue}
          >
            Continue
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
