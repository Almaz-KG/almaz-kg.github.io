/**
 * XKE S1, 29 September 2026: "How LLMs Are Trained".
 *
 * The slides as they were given, carried over from the session deck. The
 * figures are the deck's own inline SVG, drawn on its colour tokens, so they
 * follow the reader's theme. Step-by-step reveals are gone: on a page every
 * slide is shown in its final state.
 */

import { L, type Deck, type Slide } from "../../plugins/deck/stage";

/* --- the spine: three stages by three questions --- */
const ROWS = [
  {
    n: "PRETRAINING",
    s: "a text continuer",
    tone: "a",
    c: [
      ["The whole public web,", "something like", "15 trillion tokens"],
      ["Predict", "the next token"],
      ["Thousands of GPUs,", "months,", "hundreds of millions"],
    ],
  },
  {
    n: "SFT",
    s: "an assistant",
    tone: "b",
    c: [
      ["Dialogues written", "by humans:", "prompt → ideal answer"],
      ["Exactly the same.", "Nothing changes"],
      ["Hours, not months.", "Orders of magnitude", "cheaper"],
    ],
  },
  {
    n: "RL / RLVR",
    s: "a solver",
    tone: "c",
    c: [
      ["Prompts with checkable", "answers. The model", "writes the solutions"],
      ["Same, plus", "a reward signal"],
      ["Thousands of rollouts", "per prompt.", "Expensive again"],
    ],
  },
];

function grid(): string {
  const W = 1096,
    LH = 210,
    HH = 40,
    RH = 132,
    cw = (W - LH) / 3;
  let s = `<svg viewBox="-2 -22 ${W + 4} ${HH + RH * 3 + 10}">`;
  ["DATA", "ALGORITHM", "COMPUTE"].forEach((h, i) => {
    s += `<text class="t-k" x="${LH + cw * i + 22}" y="0">${h}</text>`;
  });
  ROWS.forEach((r, ri) => {
    const y = HH + RH * ri;
    s += `<rect x="0" y="${y}" width="${W}" height="${RH - 14}" rx="14" fill="var(--faint)"/>`;
    s += `<rect x="0" y="${y}" width="4" height="${RH - 14}" rx="2" fill="var(--${r.tone})"/>`;
    s += `<text class="t-b" x="24" y="${y + 42}" style="fill:var(--${r.tone})">${r.n}</text>`;
    s += `<text class="t-s" x="24" y="${y + 68}">${r.s}</text>`;
    r.c.forEach((cell, ci) => {
      s += L(LH + cw * ci + 22, y + 40, cell, 26, "t-s");
    });
  });
  return s + `</svg>`;
}

/* --- what survives the data pipeline --- */
function funnel(): string {
  const st = [
    { p: 100, l: "Raw crawl: everything publicly on the web", t: "100%" },
    { p: 25, l: "Minus wrong language, duplicates, spam, adult, PII", t: "~25%" },
    { p: 4, l: "Minus quality filtering and a second dedup pass", t: "~4%" },
    { p: 0.7, l: "What you actually train on", t: "<1%" },
    { p: 99, l: "99% is thrown away", t: "99%", big: true },
  ];
  /* The last row is the punchline rather than another step, so it is set in
     the display size, painted in the "discarded" colour and pushed down a
     line - otherwise the eye reads it as a fifth thing that survived. */
  const X = 560,
    BW = 460,
    RH = 72;
  let s = `<svg viewBox="-2 -16 1096 ${RH * st.length + 96}">`;
  st.forEach((r, i) => {
    const big = !!r.big,
      y = i * RH + (big ? 24 : 0),
      w = Math.max((r.p / 100) * BW, 4);
    s += `<text class="${big ? "t-big" : "t-s"}" x="0" y="${y + (big ? 42 : 34)}"
         ${big ? `style="fill:var(--c)"` : ""}>${r.l}</text>`;
    s += `<rect x="${X}" y="${y + 16}" width="${w}" height="26" rx="6"
         fill="${big ? "var(--c)" : "var(--a)"}" opacity="${big ? 1 : 1 - i * 0.18}"/>`;
    if (!big) s += `<text class="t-n" x="${X + w + 14}" y="${y + 36}">${r.t}</text>`;
  });
  return s + `</svg>`;
}

/* --- the training objective --- */
function nextToken(): string {
  const toks = ["The", " capital", " of", " France", " is"];
  let s = `<svg viewBox="-2 -16 1096 330">`;
  s += `<text class="t-k" x="0" y="0">INPUT: EVERYTHING SO FAR</text>`;
  let x = 0;
  toks.forEach((t) => {
    const w = t.length * 15 + 38;
    s += `<rect x="${x}" y="18" width="${w}" height="58" rx="10" fill="var(--faint)"/>`;
    s += `<text class="t-n" x="${x + w / 2}" y="54" text-anchor="middle">${t}</text>`;
    x += w + 10;
  });
  s += `<rect x="${x}" y="18" width="72" height="58" rx="10" fill="none"
        stroke="var(--a)" stroke-dasharray="6 5"/>`;
  s += `<text class="t-n t-b" x="${x + 36}" y="54" text-anchor="middle" style="fill:var(--a)">?</text>`;
  s += `<text class="t-k" x="0" y="136">OUTPUT: A PROBABILITY FOR EVERY TOKEN IN THE VOCABULARY</text>`;
  (
    [
      ["Paris", 0.91],
      ["Lyon", 0.03],
      ["France", 0.02],
      ["?", 0.01],
      ["everything else", 0.03],
    ] as const
  ).forEach(([t, p], i) => {
    const y = 160 + i * 34;
    s += `<text class="t-n" x="0" y="${y + 18}">${t}</text>`;
    s += `<rect x="220" y="${y}" width="${p * 640}" height="22" rx="5"
         fill="${i === 0 ? "var(--a)" : "var(--faint)"}"/>`;
    s += `<text class="t-s" x="${220 + p * 640 + 12}" y="${y + 18}">${(p * 100).toFixed(0)}%</text>`;
  });
  return s + `</svg>`;
}

/* --- the size of one pretraining run --- */
function cluster(): string {
  /* 64 x 8 squares at 32 accelerators each is exactly 16,384 - the number on
     the slide next to it, so the picture and the caption cannot disagree. */
  const cols = 64,
    rows = 8,
    cell = 15,
    gap = 2;
  let s = `<svg viewBox="-2 -16 1096 ${16 + rows * (cell + gap) + 30}">`;
  s += `<text class="t-k" x="0" y="0">ONE SQUARE = 32 GPU ACCELERATORS</text>`;
  for (let r = 0; r < rows; r++)
    for (let c = 0; c < cols; c++) {
      s += `<rect x="${c * (cell + gap)}" y="${20 + r * (cell + gap)}" width="${cell}" height="${cell}" rx="2"
         fill="var(--d)" opacity="${0.3 + ((r * cols + c) % 6) * 0.07}"/>`;
    }
  return s + `</svg>`;
}

/* --- knowledge cutoff --- */
function cutoff(): string {
  let s = `<svg viewBox="-2 -22 1096 176">`;
  s += `<rect x="0" y="34" width="700" height="62" rx="12" fill="var(--faint)"/>`;
  s += `<text class="t-s" x="26" y="72">everything that made it into the snapshot</text>`;
  s += `<rect x="724" y="34" width="372" height="62" rx="12" fill="none"
        stroke="var(--faint)" stroke-dasharray="7 6"/>`;
  s += `<text class="t-s" x="750" y="72" opacity=".8">does not exist for the model</text>`;
  s += `<line x1="712" y1="14" x2="712" y2="116" stroke="var(--c)" stroke-width="3"/>`;
  s += `<text class="t-k" x="712" y="0" text-anchor="middle" style="fill:var(--c)">FROZEN</text>`;
  s += `<text class="t-s t-b" x="712" y="142" text-anchor="middle" style="fill:var(--c)">January 2022</text>`;
  s += `<text class="t-s" x="0" y="142">2019</text>`;
  s += `<text class="t-s" x="1096" y="142" text-anchor="end">today</text>`;
  return s + `</svg>`;
}

/* --- one row of an SFT dataset --- */
function sftRow(): string {
  let s = `<svg viewBox="-2 -16 1096 300">`;
  s += `<rect x="0" y="0" width="660" height="272" rx="16" fill="var(--faint)"/>`;
  s += `<text class="t-k" x="28" y="82">PROMPT</text>`;
  s += `<text class="t-b" x="28" y="114"> &gt; What is a monad, in plain words?</text>`;
  s += `<line x1="28" y1="140" x2="632" y2="140" stroke="var(--bg)" stroke-width="2"/>`;
  s += `<text class="t-k" x="28" y="176">IDEAL ANSWER</text>`;
  s += L(
    28,
    208,
    [
      "A monad describes a computation that",
      "carries an effect alongside its result:",
      "it may return nothing, or many things…",
    ],
    26,
    "t-s",
  );
  s += `<text class="t-k" x="716" y="42">WHO WROTE IT?</text>`;
  [
    ["A human. Following a style guide", "that runs to dozens of pages."],
    ["For narrow topics, companies hire", "people with the matching degree."],
    ["These days: the model drafts,", "the human edits."],
  ].forEach((lines, i) => {
    s += L(716, 84 + i * 74, lines, 26, "t-s");
  });
  return s + `</svg>`;
}

/* --- imitation plateaus, RL does not --- */
function ceiling(): string {
  let s = `<svg viewBox="-2 -16 1096 380">`;
  s += `<line x1="70" y1="318" x2="1080" y2="318" stroke="var(--faint)" stroke-width="2"/>`;
  s += `<line x1="70" y1="10" x2="70" y2="318" stroke="var(--faint)" stroke-width="2"/>`;
  s += `<text class="t-k" x="70" y="350">TRAINING TIME</text>`;
  s += `<text class="t-k" x="0" y="0">STRENGTH</text>`;
  s += `<line x1="70" y1="172" x2="1080" y2="172" stroke="var(--dim)" stroke-dasharray="8 7"/>`;
  s += `<text class="t-s" x="1080" y="162" text-anchor="end">best human</text>`;
  s += `<path d="M70,302 C250,256 380,210 540,192 C720,176 880,182 1080,184"
        fill="none" stroke="var(--b)" stroke-width="4"/>`;
  s += `<text class="t-s" x="556" y="228" style="fill:var(--b)">imitating experts: plateau</text>`;
  s += `<path d="M70,306 C230,294 340,214 470,152 C620,84 860,52 1080,36"
        fill="none" stroke="var(--a)" stroke-width="4"/>`;
  s += `<text class="t-s" x="900" y="112" style="fill:var(--a)">training to win</text>`;
  /* The marker is a real link: it opens the moment in the broadcast. */
  s += `<a href="https://youtu.be/WXuK6gekU1Y?t=2071" target="_blank" rel="noopener noreferrer">`;
  s += `<circle cx="560" cy="116" r="7" fill="var(--c)"/>`;
  s += `<text class="t-s" x="578" y="146" style="fill:var(--c)">move 37 ↗</text></a>`;
  return s + `</svg>`;
}

/* --- rollouts --- */
function rollouts(): string {
  const g = [
    [0, 0, 1, 0, 0],
    [1, 0, 0, 1, 0],
    [0, 1, 0, 0, 0],
  ];
  let s = `<svg viewBox="-2 -16 1096 286">`;
  s += `<rect x="0" y="96" width="230" height="84" rx="14" fill="var(--faint)"/>`;
  s += L(24, 134, ["Prompt with", "known answers"], 28, "t-s");
  s += `<path d="M230,138 L300,138" stroke="var(--faint)" stroke-width="3"/>`;
  g.forEach((row, ri) => {
    row.forEach((ok, ci) => {
      const x = 324 + ci * 148,
        y = 42 + ri * 84;
      s += `<rect x="${x}" y="${y}" width="120" height="60" rx="10"
           fill="${ok ? "var(--a)" : "var(--faint)"}" opacity="${ok ? 0.22 : 1}"/>`;
      s += `<rect x="${x}" y="${y}" width="120" height="60" rx="10" fill="none"
           stroke="${ok ? "var(--a)" : "transparent"}" stroke-width="2"/>`;
      s += `<text class="t-n" x="${x + 60}" y="${y + 38}" text-anchor="middle"
           style="fill:${ok ? "var(--a)" : "var(--dim)"}">${ok ? "✓" : "✗"}</text>`;
    });
  });
  return s + `</svg>`;
}

/* --- the price of ranking --- */
function price(): string {
  let s = `<svg viewBox="-2 -16 1096 240">`;
  s += `<rect x="0" y="0" width="530" height="212" rx="16" fill="var(--faint)"/>`;
  s += `<text class="t-k" x="30" y="46" style="fill:var(--c)">TOTAL NUMBER OF ANSWERS</text>`;
  s += `<text class="t-big" x="30" y="108" style="fill:var(--c)">1,000,000,000</text>`;
  s += L(
    30,
    146,
    ["human judgements of bad jokes:", "1k steps × 1k prompts × 1k rollouts"],
    28,
    "t-s",
  );
  s += `<rect x="566" y="0" width="530" height="212" rx="16" fill="var(--faint)"/>`;
  s += `<text class="t-k" x="596" y="46" style="fill:var(--a)">TRAIN A JUDGE MODEL</text>`;
  s += `<text class="t-big" x="596" y="108" style="fill:var(--a)">5,000</text>`;
  s += L(
    596,
    146,
    ["humans only order a few options,", "and trains a reward (judge) model"],
    28,
    "t-s",
  );
  return s + `</svg>`;
}

/**
 * The base model, the thing that scores it, and the signal coming back. The
 * RLHF and RLVR slides are the same picture with a different scorer, which is
 * the point of showing them one after the other.
 */
function loop(o: {
  model: string;
  modelLines: string[];
  scorer: string;
  scorerLines: string[];
  signal: string;
  aside?: string[];
}): string {
  let s = `<svg viewBox="-2 -22 1096 372">`;
  s += `<rect x="0" y="20" width="330" height="220" rx="18" fill="var(--faint)"/>`;
  s += `<rect x="0" y="20" width="330" height="220" rx="18" fill="none"
        stroke="var(--a)" stroke-width="2"/>`;
  s += `<text class="t-k" x="28" y="60" style="fill:var(--a)">${o.model}</text>`;
  s += `<text class="t-big" x="28" y="128">405B</text>`;
  s += L(28, 168, o.modelLines, 26, "t-s");

  s += `<path d="M340,110 L470,110" stroke="var(--dim)" stroke-width="2"/>`;
  s += `<path d="M462,104 L472,110 L462,116" fill="var(--dim)"/>`;
  s += `<text class="t-s" x="352" y="96">1,000 answers</text>`;

  s += `<rect x="486" y="70" width="230" height="110" rx="14" fill="var(--faint)"/>`;
  s += `<rect x="486" y="70" width="230" height="110" rx="14" fill="none"
        stroke="var(--c)" stroke-width="2"/>`;
  s += `<text class="t-k" x="510" y="106" style="fill:var(--c)">${o.scorer}</text>`;
  s += L(510, 134, o.scorerLines, 24, "t-s");

  /* The return path goes round the outside of both boxes: routed between
     them it would run straight through the text in the big one. */
  s += `<path d="M601,180 L601,296 L165,296 L165,254" fill="none"
        stroke="var(--dim)" stroke-width="2" stroke-dasharray="6 6"/>`;
  s += `<path d="M159,262 L165,250 L171,262" fill="var(--dim)"/>`;
  s += `<text class="t-s" x="383" y="278" text-anchor="middle">${o.signal}</text>`;
  (o.aside ?? []).forEach((t, i) => {
    s += `<text class="t-s" x="748" y="${130 + i * 26}" style="fill:var(--c)">${t}</text>`;
  });
  return s + `</svg>`;
}

/* --- reward hacking --- */
function collapse(): string {
  let s = `<svg viewBox="-2 -16 1096 348">`;
  s += `<line x1="70" y1="276" x2="1080" y2="276" stroke="var(--faint)" stroke-width="2"/>`;
  s += `<line x1="70" y1="10" x2="70" y2="276" stroke="var(--faint)" stroke-width="2"/>`;
  s += `<text class="t-k" x="70" y="310">OPTIMIZATION STEPS AGAINST THE REWARD MODEL</text>`;
  s += `<text class="t-k" x="0" y="0">QUALITY</text>`;
  s += `<path d="M70,230 C180,180 300,132 430,122 C512,116 560,130 604,186 C650,244 700,262 1080,268"
        fill="none" stroke="var(--b)" stroke-width="4"/>`;
  return s + `</svg>`;
}

/* --- verifiable vs judge --- */
function rlvr(): string {
  const rows = [
    ["what the reward is", "a deterministic check", "a neural network’s opinion"],
    ["can it be gamed", "much harder, not impossible", "yes, given time"],
    ["how long you can run it", "tens of thousands of steps", "a few hundred"],
    ["where the ceiling is", "above human", "around human"],
  ];
  const W = 1096,
    c0 = 300,
    cw = (W - c0) / 2,
    RH = 62;
  let s = `<svg viewBox="-2 -30 ${W + 4} ${RH * rows.length + 50}">`;
  s += `<text class="t-k" x="${c0 + 22}" y="-6" style="fill:var(--a)">VERIFIABLE - RLVR</text>`;
  s += `<text class="t-k" x="${c0 + cw + 22}" y="-6" style="fill:var(--c)">A JUDGE MODEL - RLHF</text>`;
  rows.forEach((r, i) => {
    const y = i * RH;
    if (i % 2 === 0)
      s += `<rect x="0" y="${y}" width="${W}" height="${RH}" rx="8" fill="var(--faint)" opacity=".6"/>`;
    s += `<text class="t-s" x="0" y="${y + 38}">${r[0]}</text>`;
    s += `<text x="${c0 + 22}" y="${y + 38}" style="fill:var(--a)">${r[1]}</text>`;
    s += `<text x="${c0 + cw + 22}" y="${y + 38}" style="fill:var(--c)">${r[2]}</text>`;
  });
  return s + `</svg>`;
}

const slides: Slide[] = [
  {
    id: "title",
    k: "title",
    eyebrow: "XKE S1 September 29",
    h: "How LLMs Are Trained",
    lede: "pretraining → supervised fine-tuning → reinforcement learning",
  },
  {
    id: "promise",
    k: "statement",
    text: "By the end of this session you will be able to explain <b>the whole pipeline</b> behind a modern LLM.",
  },
  {
    id: "how-you-learn",
    k: "statement",
    text: "How did you learn anything?",
    items: [
      "You <b>read</b>. Textbooks, lectures, the internet.",
      "You <b>watch</b> someone solve problems.",
      "You <b>do</b> the exercises.",
    ],
  },
  {
    id: "three-ways",
    k: "statement",
    text: "A model learns the same three ways,<br>in the same order.",
    items: [
      "Reading the internet -> <b>pretraining</b>",
      "Copying worked examples -> <b>supervised fine-tuning</b>, SFT",
      "Solving problems with known answers -> <b>reinforcement learning</b>, RL",
    ],
  },
  {
    id: "same-algorithm",
    k: "statement",
    text: "Same algorithm almost all the way <br/> the only changing part is the <b>data</b>.",
    sm: true,
  },

  { id: "part-1", k: "section", no: "01", n: "Part one", h: "Building the base model" },
  { id: "data", k: "statement", text: "<b>Data</b>" },
  { id: "funnel", k: "visual", h: "Download the internet", svg: funnel },
  {
    id: "reddit",
    k: "statement",
    text: "Early web datasets were scraped from <b>links posted on Reddit</b> that had karma.",
  },
  {
    id: "fineweb",
    k: "demo",
    eyebrow: "Demo",
    text: "Huggingface Datasets",
    cue: "FineWeb viewer",
    href: "https://huggingface.co/datasets/HuggingFaceFW/fineweb/viewer/sample-10BT/train",
  },
  {
    id: "cutoff",
    k: "visual",
    h: "This is what “knowledge cutoff” actually means",
    svg: cutoff,
  },
  { id: "algorithm", k: "statement", text: "The <b>algorithm</b>" },
  {
    id: "next-token",
    k: "visual",
    h: "The whole objective: predict the next token",
    svg: nextToken,
  },
  { id: "compute", k: "statement", text: "<b>Compute</b>" },
  {
    id: "llama-405b",
    k: "visual",
    h: "Llama 3, 405B",
    svg: cluster,
    stats: [
      ["16,384", "H100s in the largest run"],
      ["54 days", "the paper’s snapshot window, 466 interruptions"],
      ["30.8M", "H100-hours for the 405B"],
    ],
    tail: "That is <b>tens of millions of dollars</b> of compute. For one model.",
    tailSm: true,
  },
  {
    id: "demo-10m",
    k: "demoCode",
    eyebrow: "DEMO",
    h: "A 10M base model",
    lede: "Tiny Shakespeare, one machine downstairs in Oost office",
    facts: ["10,788,929 parameters", "1.1 MB"],
    code: [
      ["c", "# lets-build-gpt-from-scratch"],
      ["p", "$ uv run python sample.py \\"],
      ["p", '      --prompt "$PROMPT" --tokens 400'],
      ["", ""],
      ["c", "DEVICE: mps"],
      ["c", "TRAINED TO: train 1.0470, val 1.4869"],
      ["c", "PARAMETERS: 10,788,929"],
    ],
  },
  {
    id: "demo-llama-1b",
    k: "demoCode",
    eyebrow: "DEMO",
    h: "Llama 3.2, 1B — base",
    lede: "The same objective, the same loss. Pretraining only: no SFT, no RL in the weights.",
    facts: ["1.2B parameters", "9T tokens"],
    code: [
      ["c", "# ollama serve & ; ollama pull llama3.2:1b-text-q8_0"],
      ["p", "$ python3 base-model-demo.py"],
      ["", ""],
      ["c", "BASE: llama3.2:1b-text-q8_0"],
    ],
  },
  {
    id: "autocomplete",
    k: "punch",
    text: "So we spent tens of millions of dollars<br>on a very expensive <b>autocomplete</b>.",
    sub: "A base model is the lossy compressed version of internet.<br>It is not an assistant.",
  },

  {
    id: "part-2",
    k: "section",
    no: "02",
    n: "Supervised Fine Tuning",
    h: "Turning it into an assistant",
  },
  {
    id: "have-want",
    k: "cols",
    h: "What we have and what we want",
    left: {
      k: "BASE MODEL",
      tone: "c",
      lines: [
        "&gt; Write a short note to a colleague asking to move our meeting.",
        " ",
        "&gt; Write a short note to your manager asking for a day off. Write a short note to the bank asking to close an account. Write a short…",
      ],
      tag: "It does not comply. It continues.",
    },
    right: {
      k: "A DESIRED MODEL",
      tone: "a",
      lines: [
        "&gt; Write a short note to a colleague asking to move our meeting.",
        "",
        "&gt; Hi! My three o’clock moved. Could we push our meeting to Thursday, same time? If that does not work, name any slot on Friday.",
      ],
      tag: "Different behaviour.",
    },
  },
  { id: "sft-row", k: "visual", h: "So we show it what a good answer looks like", svg: sftRow },
  {
    id: "sft-cost",
    k: "statement",
    text: "Same algorithm. Different <b>data</b>.<br><b>Hours</b> on a single machine.",
    items: ["And what it teaches is the <b>shape of an answer</b>."],
  },
  {
    id: "why-not-the-end",
    k: "punch",
    text: "So why is that not the end of the story?",
    sub: "Because everything so far has been imitation, and imitation has a ceiling.",
  },

  {
    id: "part-3",
    k: "section",
    no: "03",
    n: "Reinforcement Learning",
    h: "Past the ceiling that imitation sets",
  },
  {
    id: "ceiling",
    k: "visual",
    h: "You cannot get better than humans by imitating humans",
    svg: ceiling,
    tail: "Because the labeler writes the answer that <b>looks good to a human</b>.",
  },
  {
    id: "deep-blue-alphago",
    k: "statement",
    text: "1997: Deep Blue beats Kasparov by <b>searching harder</b>.<br>2016: AlphaGo beats Lee Sedol by <b>playing to win</b>.",
  },
  {
    id: "move-37",
    k: "demo",
    eyebrow: "LIVE",
    text: "Move 37",
    cue: "youtube",
    href: "https://youtu.be/WXuK6gekU1Y?t=2071",
  },
  { id: "rollouts", k: "visual", h: "Guess. Check. Repeat.", svg: rollouts },
  {
    id: "funny-joke",
    k: "ask",
    text: 'Prompt: <span class="d-mono">“write a funny joke”</span><br>Answer: a thousand jokes.',
    tail: "So how do you rank them?",
  },
  { id: "judge-price", k: "visual", h: "A judge model", svg: price },
  {
    id: "rlhf",
    k: "visual",
    h: "Reinforcement Learning from Human Feedback - RLHF",
    svg: () =>
      loop({
        model: "THE BASE MODEL BEING TRAINED",
        modelLines: ["parameters, months of", "pretraining, raw datasets"],
        scorer: "THE JUDGE MODEL",
        scorerLines: ["a much smaller model", "trained on human taste"],
        signal: "one number per answer: how good was that?",
        aside: ["and whatever it scores 1.0,", "the big model learns to produce"],
      }),
  },
  {
    id: "judging-is-easier",
    k: "cols",
    h: "Judging is easier than writing",
    left: {
      k: "WHAT SFT NEEDS FROM A HUMAN",
      tone: "b",
      lines: ["Write the ideal answer.", "", "“Write a genuinely good poem about pelicans.”"],
      tag: "Slow, expensive, and for narrow topics you need a specialist.",
    },
    right: {
      k: "WHAT RL NEEDS FROM A HUMAN",
      tone: "a",
      lines: ["Put five answers in order.", "", "“Which of these five pelican poems is the best one?”"],
      tag: "Fast, cheap, and almost anyone can do it.",
    },
  },
  { id: "it-breaks", k: "visual", h: "And then it breaks", svg: collapse },
  {
    id: "the-the-the",
    k: "punch",
    eyebrow: "Funniest joke in the world, apparently",
    text: "&gt; the the the the the …",
    reveal: "The answer the judge scored <b>1.0</b>.",
    sub: "This is what winning looks like when the judge is a neural network.",
  },
  {
    id: "millennium",
    k: "punch",
    eyebrow: "Meanwhile, in mathematics",
    bg: "/assets/images/posts/how-llms-are-trained/navier-stokes.webp",
    text: "New results on a <b>Millennium Prize problem</b>.",
    sub: "Plus a long list of smaller open problems.",
  },
  { id: "why-math", k: "ask", text: "Why is it always mathematics?<br>Why never poetry?" },
  { id: "easy-to-check", k: "statement", text: "Because it is easy to <b>check</b> math answers." },
  {
    id: "rlvr-name",
    k: "punch",
    text: "Reinforcement Learning with Verifiable Rewards - RLVR",
    sub: "The reward is a deterministic check",
  },
  {
    id: "rlvr-loop",
    k: "visual",
    h: "Reinforcement Learning with Verifiable Rewards - RLVR",
    svg: () =>
      loop({
        model: "THE BASE MODEL AFTER SFT",
        modelLines: ["parameters, months of", "pretraining, raw datasets,", "SFT on top of it"],
        scorer: "THE VERIFIER APP",
        scorerLines: ["a deterministic", "problem solver"],
        signal: "a boolean per answer: is it correct?",
      }),
  },
  {
    id: "rlvr-vs-rlhf",
    k: "visual",
    h: "What that changes",
    svg: rlvr,
    note: "Much harder, not impossible: a bug in the checker, etc",
  },
  {
    id: "comedian",
    k: "punch",
    text: "There is no headline about an LLM becoming <b>a stand-up comedian</b>.",
    sub: "Because nobody knows how to write a reward function for funny.",
  },

  { id: "part-4", k: "section", no: "04", n: "Recap", h: "Three* stages of building an LLM" },
  { id: "recap-grid", k: "visual", h: "Everything we just walked through", svg: grid },
  {
    id: "remember",
    k: "statement",
    text: "Three things worth remembering.",
    items: [
      "Training is <b>three separate projects</b>: pretraining, SFT, RL - each with its own data and its own bill.",
      "The algorithm barely changes. The <b>data</b> does all the work.",
      "How far this goes is bounded by <b>what we can check</b>.",
    ],
  },
  { id: "the-star", k: "ask", text: "Why there was a * in the title of the previous slide?" },
  { id: "questions", k: "end", h: "Questions", lede: "Thank you!" },
];

export const deck: Deck = {
  title: "How LLMs Are Trained",
  slides,
  kinds: {
    /* S1's own take on a shared kind: the demo cue is set at full statement
       size rather than the smaller one later sessions use, as it was given. */
    demo: (s) => `
      <div class="d-eyebrow d-eyebrow--a">${s.eyebrow}</div>
      <div class="d-statement" style="margin-top:calc(30 * var(--u))">${s.text}</div>
      <div><a class="d-cue d-cue--link" href="${s.href}" target="_blank" rel="noopener noreferrer">↗ ${s.cue}</a></div>`,
  },
};
