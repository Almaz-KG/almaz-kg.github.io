---
layout: '@/templates/BasePost.astro'
author: "Almaz Murzabekov"
title: "[Announce] Implementing X in Rust"
pubDate: "2022-12-12"
tags: ["projects", "rust", "announce", "bittorrent", "bitcoin", "hdfs", "cassandra"]
ShowToc: false
ShowBreadCrumbs: true
---

It has been quite a while since my last post. It took almost two months to come up with a new post and try to explain my future mid-term and long-term goals in Rust. I've been playing with the Rust programming language for a couple of months, with some basic projects, and now I feel quite confident to start some bigger and more advanced projects. Maybe, in the future, this activity will turn out to be a sharable resource for the whole Rust community, but for now, let's try to get our hands dirty with the implementation of several projects to feel how it is to be a Rust Developer as a whole.

I have an idea of creating a series of posts related to the projects, that I'll do in my free time and post implementation details about these projects. The aim of these projects is to get familiar with the internal details and maybe some tradeoffs which are not obvious from the users' endpoint. These projects and implementations should give an exhaustive understanding of the technology behind these products and good programming skills. I do not expect, (and hopefully all readers will do so), that these implementations will be complete and usable in the production environment. Mostly, these projects will never be finished, and the main purpose of them is the educational aspect of the projects.

There is a list of possible projects, which I'm interested in, or want to implement on my own. This list might change over time, but the basic tech behind these projects is distributed computing and the network subsystem of the Rust ecosystem. I do believe that I must pay special attention to this area because I feel a lack of knowledge in it.

#### Projects list

- BitTorrent Client
- Bitcoin Protocol implementation 
- Hadoop Distributed File System (HDFS)
- Cassandra Like Distributed Database 


### BitTorrent Client

Most probably, I will start with this project, because from a newbie's view (which I am) - it's relatively simple. Of course, the implementation of bittorrent projects needs a huge amount of time and effort, as well as good background in both Rust and Networking. But, let's see how the project progresses, and I may adjust the whole initiative if need be. From this project, I expect the following list of features implemented to be able to state that the project is completed and has achieved its goals. So, the goals of this project are listed below:

- able to read *.torrent file
- interact with tracker via UDP
- download torrent files from peers/seeds
- a CLI interface for user with good enough support
- act as a peer for the downloaded files

There is no GUI planned, as well as no support for advanced torrent protocol features. These aforementioned features might be considered a full list of features, which allow users to download data from any torrent file.


### Bitcoin

This project seems to be an advanced one, especially for developers without a robust background in networking. As usual, I don't expect something bigger that the demo/simplified version of the protocol. It should demonstrate the basic ideas behind the Bitcoin protocol. Implementation details of this project, as well as other projects, will be described in future posts with exhaustive descriptions and code samples (I hope so). 

The testing environment will probably be laid on the docker images/containers. The reason for using docker is that the docker containers might be considered the simplest approach to testing the whole infrastructure with a mature code-first approach, like docker-compose, etc. Another reason for using docker is that the docker containers provide a reproducable envs with super small effort (also I hope so).


### Hadoop Distribute File System (HDFS)

Again, this project will not implement the full features of HDFS. Instead, it will have a fraction of the HDFS features. The following list of features might be considered as a first draft plan for the project.

- cluster, i.e. name node and data node instances with their code-bases
- download and upload data from a data node
- fail recovery (via disabling some data nodes from the cluster)

As for now, this project is not fully described and most probably the feature list, as well as the description will be updated.

### Cassandra like Distributed Database

I think this project will be the biggest challenge for me. The main difference between HDFS and Cassandra, except for the fact that both techs are completely different from the users' perspective, is that Cassandra doesn't have any single-point failure (SPF). It might be challenging to implement such kinds of projects from an architectural point of view. Again, I hope that the results of these projects will give a comprehensive understanding of the techs and network programming in Rust.