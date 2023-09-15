import {defer} from '@shopify/remix-oxygen';
import {Suspense} from 'react';
import {Await, useLoaderData} from '@remix-run/react';
import {AnalyticsPageType} from '@shopify/hydrogen';

import {ProductSwimlane, Link, FeaturedCollections, Hero} from '~/components';
import {MEDIA_FRAGMENT, PRODUCT_CARD_FRAGMENT} from '~/data/fragments';
import {getHeroPlaceholder} from '~/lib/placeholders';
import {seoPayload} from '~/lib/seo.server';
import {routeHeaders} from '~/data/cache';

export const headers = routeHeaders;

export async function loader({params, context}) {
  const {language, country} = context.storefront.i18n;
  /*const mainHero = {
    spread:
      'https://cdn.shopify.com/s/files/1/0551/4566/0472/files/Hydrogen_Hero_Feature_1.jpg?v=1654902468&width=1400&height=1767&crop=center',
    spreadSecondary:
      'https://cdn.shopify.com/s/files/1/0551/4566/0472/files/Hydrogen_Hero_Feature_2.jpg?v=1654902468&width=1400&height=1767&crop=center',
  };*/

  if (
    params.locale &&
    params.locale.toLowerCase() !== `${language}-${country}`.toLowerCase()
  ) {
    // If the locale URL param is defined, yet we still are on `EN-US`
    // the the locale param must be invalid, send to the 404 page
    throw new Response(null, {status: 404});
  }

  const {shop, hero} = await context.storefront.query(HOMEPAGE_SEO_QUERY, {
    variables: {handle: 'unisex'},
  });

  const seo = seoPayload.home();

  return defer({
    shop,
    primaryHero: hero,
    // These different queries are separated to illustrate how 3rd party content
    // fetching can be optimized for both above and below the fold.
    featuredProducts: context.storefront.query(
      HOMEPAGE_FEATURED_PRODUCTS_QUERY,
      {
        variables: {
          /**
           * Country and language properties are automatically injected
           * into all queries. Passing them is unnecessary unless you
           * want to override them from the following default:
           */
          country,
          language,
        },
      },
    ),
    secondaryHero: context.storefront.query(COLLECTION_HERO_QUERY, {
      variables: {
        handle: 'backcountry',
        country,
        language,
      },
    }),
    featuredCollections: context.storefront.query(FEATURED_COLLECTIONS_QUERY, {
      variables: {
        country,
        language,
      },
    }),
    tertiaryHero: context.storefront.query(COLLECTION_HERO_QUERY, {
      variables: {
        handle: 'winter-2022',
        country,
        language,
      },
    }),
    analytics: {
      pageType: AnalyticsPageType.home,
    },
    seo,
  });
}

export default function Homepage() {
  const {
    primaryHero,
    secondaryHero,
    tertiaryHero,
    featuredCollections,
    featuredProducts,
  } = useLoaderData();

  // TODO: skeletons vs placeholders
  const skeletons = getHeroPlaceholder([{}, {}, {}]);

  return (
    <>
      {/*       {primaryHero && (
        <Hero {...primaryHero} height="full" top loading="eager" />
      )} */}

      <section className="relative justify-end flex flex-col w-full -mt-nav h-[32rem] lg:h-screen">
        <div className="absolute inset-0 grid flex-grow grid-flow-col pointer-events-none auto-cols-fr -z-10 content-stretch overflow-clip">
          <div>
            <img
              alt="Tracks in the snow leading to a person on a mountain top with a red jacket contrasting to an epic blue horizon with a mountain range in the distance."
              decoding="async"
              height="126.2"
              loading="eager"
              sizes="(min-width: 48em) 50vw, 100vw"
              src="images/hero1.webp"
              width="100"
              className="block object-cover w-full h-full"
            />
          </div>
        </div>
        <div className="absolute text-center lg:text-left top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2  lg:-translate-x-0 lg:-translate-y-0 lg:left-20 lg:bottom-20 flex flex-col items-baseline justify-between gap-6 px-6 py-8 sm:px-8 md:px-12  from-primary/60 text-white">
          <h2 className="whitespace-pre-wrap font-bold text-display max-w-md">
            Partners Summit 2023
          </h2>
          <p className="max-w-lg whitespace-pre-wrap inherit text-lead font-medium">
            Push your performance with our premium athletic wear
          </p>
          <div className="w-full justify-center lg:justify-start">
            <Link
              to="/collections"
              className="w-96 rounded-sm bg-transparent px-4 py-3 text-lg font-semibold border border-white text-white ring-1 ring-inset ring-gray-300"
            >
              Shop Now
            </Link>
          </div>
        </div>
      </section>

      {featuredProducts && (
        <Suspense>
          <Await resolve={featuredProducts}>
            {({products}) => {
              if (!products?.nodes) return <></>;
              return (
                <ProductSwimlane
                  products={products}
                  title="New arrivals"
                  subtitle="Fall '23"
                  count={6}
                />
              );
            }}
          </Await>
        </Suspense>
      )}
      <section className="text-[2.2rem] lg:text-[3.0rem] font-bold py-12 lg:py-20 px-10 lg:px-32 bg-white">
        <div className="word-section space-y-12">
          <p className="block">
            Hydrogen combines comfort, style, and sustainability. Our products
            are made from organic cotton and crafted in Canada.
          </p>
          <p className="block">
            Each product features a minimalist aesthetic, with clean lines and
            neutral colors.
          </p>
          <p className="block">
            Join the Hydrogen movement today and elevate your style.
          </p>
        </div>
      </section>

      <section className="relative justify-end flex flex-col w-full aspect-[4/5] sm:aspect-square md:aspect-[5/4] lg:aspect-[3/2] xl:aspect-[2/1]">
        <div className="absolute inset-0 grid flex-grow grid-flow-col pointer-events-none auto-cols-fr -z-10 content-stretch overflow-clip">
          <div>
            <img
              alt="Tracks in the snow leading to a person on a mountain top with a red jacket contrasting to an epic blue horizon with a mountain range in the distance."
              decoding="async"
              height="126.2"
              loading="eager"
              sizes="(min-width: 48em) 50vw, 100vw"
              src="images/hero2.webp"
              width="100"
              className="block object-cover w-full h-full"
            />
          </div>
        </div>
        <div className="flex flex-col absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center gap-y-6 ">
          <h2 className="whitespace-pre-wrap font-bold text-display">
            Midweight classics
          </h2>
          <h3>Clothes that work as hard as you do.</h3>
          <div>
            <Link
              to="/collections"
              className="w-96 rounded-sm bg-transparent px-4 py-3 text-lg font-semibold border border-black text-black ring-1 ring-inset ring-gray-300"
            >
              Shop Now
            </Link>
          </div>
        </div>
      </section>
      {/*       {secondaryHero && (
        <Suspense fallback={<Hero {...skeletons[1]} />}>
          <Await resolve={secondaryHero}>
            {({hero}) => {
              if (!hero) return <></>;
              return <Hero {...hero} />;
            }}
          </Await>
        </Suspense>
      )} */}

      {/*       {featuredCollections && (
        <Suspense>
          <Await resolve={featuredCollections}>
            {({collections}) => {
              if (!collections?.nodes) return <></>;
              return (
                <FeaturedCollections
                  collections={collections}
                  title="Collections"
                />
              );
            }}
          </Await>
        </Suspense>
      )}

      {tertiaryHero && (
        <Suspense fallback={<Hero {...skeletons[2]} />}>
          <Await resolve={tertiaryHero}>
            {({hero}) => {
              if (!hero) return <></>;
              return <Hero {...hero} />;
            }}
          </Await>
        </Suspense>
      )} */}
    </>
  );
}

const COLLECTION_CONTENT_FRAGMENT = `#graphql
  fragment CollectionContent on Collection {
    id
    handle
    title
    descriptionHtml
    heading: metafield(namespace: "hero", key: "title") {
      value
    }
    byline: metafield(namespace: "hero", key: "byline") {
      value
    }
    cta: metafield(namespace: "hero", key: "cta") {
      value
    }
    spread: metafield(namespace: "hero", key: "spread") {
      reference {
        ...Media
      }
    }
    spreadSecondary: metafield(namespace: "hero", key: "spread_secondary") {
      reference {
        ...Media
      }
    }
  }
  ${MEDIA_FRAGMENT}
`;

const HOMEPAGE_SEO_QUERY = `#graphql
  query seoCollectionContent($handle: String, $country: CountryCode, $language: LanguageCode)
  @inContext(country: $country, language: $language) {
    hero: collection(handle: $handle) {
      ...CollectionContent
    }
    shop {
      name
      description
    }
  }
  ${COLLECTION_CONTENT_FRAGMENT}
`;

const COLLECTION_HERO_QUERY = `#graphql
  query heroCollectionContent($handle: String, $country: CountryCode, $language: LanguageCode)
  @inContext(country: $country, language: $language) {
    hero: collection(handle: $handle) {
      ...CollectionContent
    }
  }
  ${COLLECTION_CONTENT_FRAGMENT}
`;

// @see: https://shopify.dev/api/storefront/2023-07/queries/products
export const HOMEPAGE_FEATURED_PRODUCTS_QUERY = `#graphql
  query homepageFeaturedProducts($country: CountryCode, $language: LanguageCode)
  @inContext(country: $country, language: $language) {
    products(first: 8) {
      nodes {
        ...ProductCard
      }
    }
  }
  ${PRODUCT_CARD_FRAGMENT}
`;

// @see: https://shopify.dev/api/storefront/2023-07/queries/collections
export const FEATURED_COLLECTIONS_QUERY = `#graphql
  query homepageFeaturedCollections($country: CountryCode, $language: LanguageCode)
  @inContext(country: $country, language: $language) {
    collections(
      first: 4,
      ukvufbcelfjjjhfgvglkdhdurbgtbgffekfrj

    ) {
      nodes {
        id
        title
        handle
        image {
          altText
          width
          height
          url
        }
      }
    }
  }
`;
