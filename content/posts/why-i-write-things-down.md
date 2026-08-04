---
title: "Why I write things down"
description: "A debugging session has a shelf life of about three weeks. What survives is the conclusion, which is exactly the wrong half to keep."
date: 2026-07-28
tags: [notes, process]
tone: aqua
draft: true
---

Every hard thing I have solved, I have solved at least twice.

The first time is honest work: reading source, printing state, arguing with a stack trace at an hour when nobody should be arguing with anything.
The second time is worse.
The second time I have the vague memory of having been here, the certainty that it was not that bad, and none of the details that actually made it work.

## The half-life of a solution

A debugging session has a shelf life of about three weeks.

After that what survives is the shape of the answer without any of its edges.
I remember that the fix involved partition pruning.
I do not remember that it only worked because the predicate had to be on the clustering column, not just any column in the `WHERE` clause, and that this is the entire reason the query went from nine minutes to four seconds.

That second sentence is the whole value of the week I spent.
It is also the sentence that disappears first.

:::note
This is not a memory problem.
It is a compression problem.
The brain stores the conclusion and throws away the derivation, which is exactly the wrong half to keep.
:::

## Writing is the debugging

The part that surprised me is that writing a thing down is not the step after understanding it.
It is often the step that produces the understanding.

I have started explanations three times and abandoned all three, because somewhere around the second paragraph it became obvious that I did not actually know why the fix worked.
I only knew that it worked.
Those are very different states, and nothing exposes the gap faster than a blank page and an imaginary reader who keeps asking "but why".

> If you cannot explain the failure mode, you did not fix it. You moved it.

So these notes are not a tutorial series and they are not a portfolio.
They are the derivations I refuse to lose.

## What goes here

Roughly three things:

- **Things that cost me a week.** Usually storage engines, query planners, or some scheduler being clever in a way nobody asked for.
- **Things that are simpler than their reputation.** A surprising amount of infrastructure is three ideas wearing a trench coat.
- **Things I got wrong in public.** The corrections are more useful than the original claim, and pretending otherwise helps nobody.

No schedule, no series, no newsletter cadence to keep up with.
When something takes long enough to understand that I would resent re-learning it, it ends up here.

If that overlaps with what you work on, there is [a feed](/rss.xml).
