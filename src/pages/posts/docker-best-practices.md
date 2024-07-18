---
layout: '@/templates/BasePost.astro'
author: "Almaz Murzabekov"
title: "[Docker] docker best practices"
pubDate: "2024-01-22"
tags: ["docker", "infra", "containers", "best-practices"]
imgSrc: /assets/images/posts/docker_logo.png
draft: true
---

### Docker best practices

I've been using docker for a long time. During the usage I found some of the usage patterns are quite usefull for a long term projects.

- Improve the speed of docker build process
- Dockerfile tuning
    - right ordering of docker layers (least changeable layer last)
    - combine multiple apt-get commands under one single RUN command using backslash \\
    - remove apt-get caches as unused
- .dockerignore
    - ignore all non used files from docker image
        - .git folder
- Image size
    - use lightweight base images, but be cautious with the base image (you may need some basic utility functions like wget, bash, etc) 
- Using layer cache
    - using parameter ```--cache-from```
- Multi-stage build
- Use properly `Entrypoint` and `CMD` keywords in Dockerfile

- Docker image security
    - Don't use the `latest` tag for the base docker image
    - Always specify the version of the base images as well as any other dependencies, like python deps, etc
    - always specify the repositories where the deps are comming
    - prefer to use ENV vars for the deps versions instead of hardcoding
    - 1 process = 1 container
    - The 12-factor app
    - Security checks using tools like [snyk.io](https://snyk.io/)
- Setup the proper configuration for getting
    - container metrics and logs
- Container configuration from ENV variables


### Docker-compose best practices

