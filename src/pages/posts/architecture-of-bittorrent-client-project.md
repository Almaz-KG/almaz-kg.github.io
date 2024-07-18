---
layout: '@/templates/BasePost.astro'
title: "[BitTorrent] A draft version of bittorrent client architecture"
pubDate: 2022-12-15T00:00:00Z
author: "Almaz Murzabekov"
tags: ["projects", "bittorrent", "architecture", "draft", "rust"]
imgSrc: /assets/images/posts/bittorrent_logo.png
---

It's worth to start with a basic overview of how the final project will look in terms of the organization of the code, dependencies between components, and so on. Many times I failed projects because the architecture was super weak, and after several thousand code lines the project becomes an unsupportable mess. You'll not understand the exact meaning of the particular module or code logic, so very soon you'll give up on continuing the journey.

One of the possible solutions, or painkiller at least, is the proper and well-documented architectural overview of the solution. It would give you a brief summary in case you lost. But there is a tricky, you must pay special attention to the quality of the document and its relevance of it. Otherwise, documentation will become another headache for you to maintain it. The docs should be super short but highlight many important details. There is a tacit agreement in the industry that the total time for reading the docs shouldn't take more than 6-7 minutes, otherwise, nobody will read it or procrastinate over it. These documents are usually called `one-pagers`.

Let's have a brief overview of the architecture. A BitTorrent client has a pretty obvious architectural organization. From the end user's perspective, this app has two types of deliverables: The first group is applications that are run on the user's machine completely (in the chart below are shown as CLI and GUI Applications). And the second group is the Web-based apps which have limited functionality, such as displaying information and storing data coming from the server. In this case, the server should take care of all torrent protocol logic and hide them from end users. These two groups of apps should work pretty similarly from the users' perspective.
<section>
<iframe width="100%" height="400px" src="https://miro.com/app/embed/uXjVP5SHr9c=/?pres=1&frameId=3458764541410499243&embedId=615421867115" frameborder="0" scrolling="no" allowfullscreen></iframe>
</section>