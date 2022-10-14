---
permalink: /
layout: default.liquid
title: Almaz Murzabekov
---

 {% for post in collections.posts.pages %}
 <section class="article-list">
    <article class="has-image">
        <header class="article-header">
            <div class="article-image">
                <a href="{{ post.permalink }}">
                <img src="{{ post.data.hover_img }}" srcset="{{ post.data.hover_img }} 800w, {{ post.data.hover_img }} 1600w" width="800" height="534" loading="lazy">
                </a>
            </div>
            <div class="article-details">
                <header class="article-category">
                    <a href="https://almaz.murzabekov.net/categories/{{ post.categories }}/" style="background-color:#2a9d8f;color:#fff">{{ post.categories }}</a>
                </header>
                <div class="article-title-wrapper">
                    <h2 class="article-title">
                        <a href="{{ post.permalink }}"> {{ post.title }}</a>
                    </h2>
                    <h3 class="article-subtitle">{{ post.data.subtitle }}</h3>
                </div>
                <footer class="article-time">
                    <div>
                        Published: <time class="article-time--published"> {{ post.published_date }} </time>
                    </div>
                    <span class="bm b bn bo cn">·</span>
                    <div>
                        <time class="article-time--reading">1 minute read</time>
                    </div>
                </footer>
            </div>
        </header>
    </article>
</section>
{% endfor %}


