---
title: "XKE S1: How LLMs are trained"
description: "Pretraining, Supervised Fine Tuning and Reinforcement Learning. Why it’s the data, not the algorithm, that does the work"
date: 2026-09-29
tags: [llm, xke, talks]
tone: aqua
cover: /assets/images/posts/how-llms-are-trained/cover.jpg
coverAlt: "Pretraining climbs, fine-tuning levels off below the best human, RL goes past it"
deck: how-llms-are-trained
draft: true
---

On 29 September 2026 I gave a session at Xebia, our internal knowledge exchange about building an LLM.
This is a series about what I'm learning from Stanford's [CS336, Language Modelling from Scratch](https://youtu.be/JuoVZkPBiKk).

This is the first session, the overview: Pretraining, Supervised Fine-Tuning and Reinforcement Learning.

::slide title

Pretraining, then supervised fine-tuning, then reinforcement learning.

::slide promise

Not every detail, and not at a deep level, but the high-level picture of how a modern LLM is trained at the frontier companies, and why each stage is there.
Some of the questions along the way are deliberately provocative.

::slide how-you-learn

Think about how you learn.
You read textbooks.
Each chapter walks through how a task is solved, so you see the logic behind it.
And at the end of the chapter there is a list of exercises, with the correct answers on the last page.

::slide three-ways

The same approach applies to an LLM.
First it reads a lot of text data, maybe entire web.
Then it is shown prompts together with ideal answers.
And the last part, the state of the art right now, is asking it to solve specific problems with reinforcement learning.

::slide same-algorithm

Across those three steps the algorithm stays more or less the same.
The only difference is the data.

::slide part-1

::slide data

::slide funnel

These days you do not download the internet yourself, someone has already done it for you.
You take a terabyte from Hugging Face, drop the wrong languages, duplicates, spam, adult content and PII, filter for quality and dedup again.
At the end you keep about 1% of what you started with.

::slide reddit

Around 2020 the only good signal for the quality of a web page was that somebody had posted a link to it on Reddit.
So you scraped the links, and from the links you got the content.
That was the quality bar at the time.

::slide fineweb

FineWeb is one of the datasets on Hugging Face: a couple of terabytes of raw text.
Every row is one text from one source, with its URL next to it.

::slide cutoff

Open one of the FineWeb rows and it says which crawl it came from and when.
That is all a knowledge cutoff is: the date the snapshot was taken.

::slide algorithm

::slide next-token

Predict the next token from the context so far.
Give it "The capital of France is" and it returns a probability for every token in its vocabulary, around 200,000 of them in a modern model.
Why 200,000 is a question about the tokenizer, and that is a session of its own.

::slide compute

::slide llama-405b

The frontier labs do not publish this, so the only big public number is Meta's.
That is tens of millions of dollars, just to get a base model.

::slide demo-10m

My own 10 million parameter model, trained on Tiny Shakespeare.
Asked for the capital of France, it answers with something that has nothing to do with the question.
Fair enough: it is tiny and it has never heard of France.

::slide demo-llama-1b

So the same prompt goes to Llama 3.2 1B, the base weights.
It answers San Francisco, New York, Montreal.
It has seen thousands of quizzes that start like this, so it continues the pattern with multiple choice options, and none of them is right.
Phrase the prompt as the start of a sentence and it says Paris, which is why prompt engineering was such a thing a few years ago.

::slide autocomplete

We trained it to predict the next token, so it does exactly that.
It is not an assistant, and it is not trying to be useful to us.

::slide part-2

::slide have-want

Ask the base model to write a short note and it writes more requests for short notes, because that is the pattern it saw in its training data.
It knows a lot of facts.
What it does not do is follow the behaviour we want.

::slide sft-row

For that you need a dataset of a question and its ideal answer.
Scale AI hired a lot of people for a dollar or two an hour to write them.
For narrow topics companies now look for people with the matching education.
And more and more the model drafts the answer, which is what distillation is.

::slide sft-cost

Almost the same algorithm, different data, and a cost measured in thousands rather than tens of millions.
What this step teaches is how to frame an answer, not the facts.

::slide why-not-the-end

People wrote those answers, so the answers are only as good as the people.

::slide part-3

::slide ceiling

Fine-tuning has a ceiling: imitating experts plateaus at the best human.
And the labeler writes the answer that looks good to a human, which is not the same as the best answer.

::slide deep-blue-alphago

Deep Blue beat Kasparov by searching harder.
AlphaGo beat Lee Sedol because it was trained differently.

::slide move-37

Nobody expected that move from a machine.
To the people watching it looked ridiculous, a losing move.
The model won the game.

::slide rollouts

The model already knows facts about the world and the format of an answer.
Now it generates thousands of answers to the same question, they are checked, and it is trained to produce more like the good ones.
Reinforcement learning is not one algorithm, it is an umbrella over a family of them.

::slide funny-joke

::slide judge-price

A thousand steps, a thousand prompts, a thousand rollouts each: a billion answers.
Nobody in the room is ranking a billion jokes.
So people rank a sample of a few thousand, and that trains another model to act as the judge.

::slide rlhf

That is reinforcement learning from human feedback, and the human feedback lives inside the judge.

::slide judging-is-easier

Writing the best answer, as SFT needs, is much harder than ranking a handful of answers somebody else wrote.

::slide it-breaks

Push it long enough and quality starts to drop.
The big model is being scored by a much smaller one, and at some point it finds a way to game it.

::slide the-the-the

The best joke ever, according to the judge, from one of the papers.

::slide millennium

At the same time there is news of new results on one of the Millennium Prize problems.

::slide why-math

::slide easy-to-check

A math answer can be checked by a verifier or a solver, and the big model cannot game a deterministic check.

::slide rlvr-name

::slide rlvr-loop

Same rollouts, thousands per task.
Out of them maybe 10 or 15 are correct, the rest are dropped, and the model is trained to produce more answers like those.
The verifier returns a single boolean: correct or not.

::slide rlvr-vs-rlhf

Much harder to game is not impossible.
A bug in the sandbox, or a verifier that is itself wrong, and it breaks too.

::slide comedian

Nobody knows how to write a reward function for funny.

::slide part-4

::slide recap-grid

::slide remember

::slide the-star

The star is the fourth stage I left out on purpose: alignment.
It runs in parallel with all of the others.

::slide questions
