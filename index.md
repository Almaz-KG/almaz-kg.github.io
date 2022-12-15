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
                {% for cat in post.categories %}<a style="background-color:#2a9d8f;color:#fff">{{cat}}</a>{% endfor %}
                </header>
                <div class="article-title-wrapper">
                    <h2 class="article-title">
                        <a href="{{ post.permalink }}"> {{ post.title }}</a>
                    </h2>
                </div>
                <footer class="article-time">
                    <div>Published: <time class="article-time--published"> {{ post.published_date | date: "%Y-%m-%d" }}</time></div>
                </footer>
            </div>
        </header>
    </article>
</section>
{% endfor %}


