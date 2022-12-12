---
permalink: /posts/implementing-cool-stuff-in-rust
title: '[Series] Implementing Cool Stuff in Rust'
published_date: 2022-12-12 20:19:30 +0001
layout: posts_layout.liquid
is_draft: false
categories: ["Rust"]
tags: ["Projects", "Announce"]
data: 
    hover_img: "/static/images/posts/implementing-cool-stuff-in-rust/1.jpg"
    subtitle: "Announce of long run series about implementing different techs in Rust "
---

<section class="article-content">

It was quite a while since my last post. It took almost two months to generate a new post and try to explain my future mid-term and long-term goals in Rust. Especially in the network subsystem of the Rust ecosystem. I've played with Rust programming language for a couple of months, with some basic projects, and now I feel to be quite confident to start some mode bigger and more advanced projects. Maybe, in the future, this activity will turn out to be a sharable resource for the whole Rust community, but for now, let's try to get our hand-dirty with the implementation of several projects to feel how it is to be a Rust Developer at all.

I have an idea of creating a series of posts related to the projects, that I'll do in my free time and post implementation details about these projects. These projects aim to get familiar with the internal details and maybe some tradeoffs which are not obvious from the users' endpoint. These projects and implementations should give an exhaustive understanding of the technology behind these products, as well as good skills in programming. I do not expect, (and hopefully all readers will do so), that these implementations will be complete and usable in the production environment. Mostly, these projects will be never finished, and the main purpose of them is the educational side of the projects.

There is a list of possible projects, which I'm interested in, or want to implement on my own. This list might be changed over time, but the basic tech behind these projects is Distributed computing. I do believe, that I must pay special attention to this area because I feel a lack of knowledge in this area.

#### Projects list

- BitTorrent Client
- Bitcoin Protocol implementation 
- Hadoop Distributed File System (HDFS)
- Cassandra Like Distributed Database 


### BitTorrent Client

Most probably, I will start with this project, because from a newbie's view (which I am) - it's relatively simple. Of course, the implementation of bittorrent project needs a huge amount of time and effort, as well as good background in both Rust and Networking. But, let's see how the progress will be on this project, and I may adjust the whole initiative. 

I expect from this project, the following list of features implemented to be able to state that the project is completed and achieved the goals. So, the goals of this project are listed below:
- able to read *.torrent file
- interact with tracker via UDP
- download torrent files from peers/seeds
- a CLI interface for user with good enough support
- act as a peer for the downloaded files

There is no GUI planned, as well as no support for advanced torrent protocol features. These above-listed features might be considered a full list of features, which allow users to download data from any torrent file.

### Bitcoin
This project seems to be an advanced one especially for the developers without big background in networking. As usuall, I don't expect something bigger thatn the demo/simplified version of the protocol. It should demostrate the basic ideas behind the Bitcoin. Implementation details of this project, as well as other projects, will be described in  the future posts with exhausive descriptions and code samples (I hope so). 

The testing environemtn probably will laid on the docker images/containers. The reason of using docker is that the docker containers might be considered as a simpliest approach to test the whole infrastructure with mature code-first approach, like docker-compose, etc. 

Another reason of using docker is that the docker containers provide a reproducalbe envs with super small effort (also I hope so).

### Hadoop Distribute File System (HDFS)

Again, this project will not implement the full list of features of HDFS. Instead, it will have a super small list of the features from the HDFS. The following list of features might be considered as a first draft plan for this project
- cluster, i.e. name node and data node instances with their code-bases
- download and upload data from a data node
- fail recovery (disabling some data nodes from the cluster)

As for now, this project is not fully described and most probably the feature list, as well as the description will be updated.

### Cassandra like Distributed Database

I think this project will be the biggest challenge for me. The main difference between HSDF and Cassandra, except the fact that both techs are completely different from the users' perspective, is that Cassandra doesn't have any simple point failure (SPF). It might be challenging to implement such kinds of projects from an architectural point of view. Again, I hope that the results of these projects will give a comprehensive understanding of the techs and network programming in Rust.