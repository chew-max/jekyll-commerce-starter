---
layout: default
title: About
description: Learn more about our brand, products, and what inspires what we make.
---

<!-- ABOUT HERO -->
<section
  class="about-hero"
  style="--about-hero-image: url('{{ site.data.store.homepage.hero.image | relative_url }}');"
>
  <div class="page-width">
    <div class="about-hero__content">

      <p class="about-eyebrow">
        ABOUT {{ site.data.store.brand.name | upcase }}
      </p>

      <h1>
        {{ site.data.store.brand.tagline }}
      </h1>

      <p class="about-hero__intro">
        Thoughtfully designed products made for everyday life,
        with personality built in.
      </p>

    </div>
  </div>
</section>


<!-- WHERE IT STARTED -->
<section class="about-story">
  <div class="page-width">

    <div class="about-story__grid">

      <div class="about-story__content">

        <p class="about-eyebrow">
          WHERE IT STARTED
        </p>

        <h2>
          Products with a little more personality.
        </h2>

        <p>
          {{ site.data.store.brand.name }} was created around a simple idea:
          everyday products don't have to feel ordinary.
        </p>

        <p>
          We build collections around the personalities, hobbies,
          projects, and moments that make everyday life more interesting.
        </p>

        <a href="{{ '/shop/' | relative_url }}" class="button">
          Shop the Collection
        </a>

      </div>


      <div class="about-story__image">

        <img
          src="{{ site.data.store.homepage.promo.image | relative_url }}"
          alt="{{ site.data.store.brand.name }}"
          loading="lazy"
        >

      </div>

    </div>

  </div>
</section>


<!-- BRAND VALUES -->
<section class="about-values">
  <div class="page-width">

    <div class="about-section-heading">

      <p class="about-eyebrow">
        WHAT WE MAKE
      </p>

      <h2>
        Made for Everyday Life
      </h2>

      <p>
        Products designed around the personalities, hobbies, projects,
        and everyday moments that make life a little more interesting.
      </p>

    </div>


    <div class="about-values__grid">

      <article class="about-value-card">

        <span class="about-value-card__number">
          01
        </span>

        <h3>Practical</h3>

        <p>
          Products made to be worn, used, gifted, and enjoyed in
          everyday life.
        </p>

      </article>


      <article class="about-value-card">

        <span class="about-value-card__number">
          02
        </span>

        <h3>Personal</h3>

        <p>
          Designs inspired by recognizable personalities, hobbies,
          projects, and the things people actually do.
        </p>

      </article>


      <article class="about-value-card">

        <span class="about-value-card__number">
          03
        </span>

        <h3>Giftable</h3>

        <p>
          The kind of products that make you see them and immediately
          think, "Yep. That's them."
        </p>

      </article>

    </div>


    <div class="about-made-to-order">

      <h3>
        Made With Less Waste
      </h3>

      <p>
        Many of our products are made to order. This allows us to offer
        more designs and options without producing large amounts of
        unnecessary inventory.
      </p>

    </div>

  </div>
</section>


<!-- BRAND STATEMENT -->
<section class="about-cta">
  <div class="page-width">

    <div class="about-cta__inner">

      <p class="about-eyebrow">
        {{ site.data.store.brand.name | upcase }}
      </p>

      <h2>
        Ordinary products.<br>
        More personality.
      </h2>

      <p>
        We're just getting started. As {{ site.data.store.brand.name }} grows,
        we'll continue building collections inspired by everyday people,
        projects, hobbies, and moments.
      </p>

      <div class="about-cta__actions">

        <a href="{{ '/shop/' | relative_url }}" class="button">
          Shop All Products
        </a>

        <a
          href="{{ '/contact/' | relative_url }}"
          class="about-text-link"
        >
          Contact Us â†’
        </a>

      </div>

    </div>

  </div>
</section>


<!-- COMPANY INFO -->
<section class="about-company">
  <div class="page-width">

    <p>
      Questions? Contact us at
      <a href="mailto:{{ site.data.store.contact.email }}">
        {{ site.data.store.contact.email }}
      </a>.
    </p>

  </div>
</section>
