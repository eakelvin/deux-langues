import { FIRST, LATEST, POINTS } from "@/lib/data";

const WIDTH = 640;
const HEIGHT = 220;
const PAD = { left: 36, right: 36, top: 28, bottom: 36 };
const MAX_RATE = 16;

function placePoints() {
  const innerWidth = WIDTH - PAD.left - PAD.right;
  const innerHeight = HEIGHT - PAD.top - PAD.bottom;
  return POINTS.map((point, index) => ({
    ...point,
    x: PAD.left + (index / (POINTS.length - 1)) * innerWidth,
    y: PAD.top + (1 - point.rate / MAX_RATE) * innerHeight,
  }));
}

export function ProgressView() {
  const points = placePoints();
  const line = points.map((point) => `${point.x},${point.y}`).join(" ");

  return (
    <section aria-label="Progress" className="flex flex-col gap-8">
      <header>
        <h1 className="font-heading text-4xl tracking-tight sm:text-5xl">Progress</h1>
        <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
          Filler words per minute. Counted words: euh, ben, bah, tu vois, enfin.
          These recordings are samples.
        </p>
      </header>

      <div className="rounded-2xl bg-card px-4 py-5 ring-1 ring-foreground/10 sm:px-6">
        <svg
          viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
          role="img"
          aria-label="Fillers per minute, from 14 on Nov 4 to 5 on Nov 17."
          preserveAspectRatio="xMidYMid meet"
          className="block h-auto w-full"
        >
          <polyline
            points={line}
            fill="none"
            className="stroke-primary"
            strokeWidth="2.5"
            strokeLinejoin="round"
            strokeLinecap="round"
          />
          {points.map((point) => (
            <g key={point.date}>
              <circle cx={point.x} cy={point.y} r="4.5" className="fill-primary" />
              <text
                x={point.x}
                y={point.y - 12}
                textAnchor="middle"
                className="fill-foreground text-[13px]"
              >
                {point.rate}
              </text>
              <text
                x={point.x}
                y={HEIGHT - 10}
                textAnchor="middle"
                className="fill-muted-foreground text-[12px]"
              >
                {point.date}
              </text>
            </g>
          ))}
        </svg>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <RecordingCard label="First recording" recording={FIRST} />
        <RecordingCard label="Latest recording" recording={LATEST} />
      </div>
    </section>
  );
}

function RecordingCard({
  label,
  recording,
}: {
  label: string;
  recording: { date: string; rate: number; quote: string };
}) {
  return (
    <article className="flex flex-col gap-3 rounded-2xl bg-card px-5 py-5 ring-1 ring-foreground/10">
      <p className="text-sm text-muted-foreground">{label}</p>
      <p className="font-heading text-3xl tracking-tight tabular-nums">
        {recording.rate}
        <span className="ml-2 font-sans text-base font-normal text-muted-foreground">
          per minute
        </span>
      </p>
      <p className="text-sm text-muted-foreground">{recording.date}</p>
      <p lang="fr" className="font-heading text-lg leading-relaxed">
        {recording.quote}
      </p>
    </article>
  );
}
