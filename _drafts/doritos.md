---
ASDASD

---
title: '[Doritos] An idea of dirstributed Database'
layout: posts_layout.liquid
is_draft: true
categories: ["Projects", "Rust", "Doritos"]
tags: ["Projects", "Rust", "Doritos"]
data: 
    subtitle: ""
---

## DORITOS

Doritos is a Key-Value distributed data storage system written in pure Rust for learning purpose only. The project
was launched as a part of course project in Otus Rust Programmer course. This project is not intended to be
production ready in any meaning of it.

### Glossary

The system has the following list of items

- Namespace or database, stores the group of tables
- Table - logically grouped data
- Key - an UUID of each entity in the table
- Value - a byte array containing the key's data


### The table structure

| Key | Value | Timestamp | DataType | DataSchema |
| --- | ----- | --------- | -------- | ---------- |
| 64 length UTF string | byte array, up to 10Mb | insertion timestamp | 126 length UTF string | json string of
value's schema |


### Features

- Data Partitioning and Distribution
    - Peer2Peer leaderless topology
    - Paritions base on consistent hashing of Keys
    - Virtual node 
    - Replica based
    - Sync updates and reads
    - Append only distributed commit logs (Kafka like)
    - Memtable and SSTables (Cassandra like)
    - Bloom filter on "landed" files
- Monitoring
    - Heartbeat membership protocol
    - No quorum
    - Circular based
    - Out of the box admin panel
    - Instrumentation and Metrics
- Other features
    - Agile scalability
    - REST API client