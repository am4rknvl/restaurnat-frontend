import React from "react"

export default function Head() {
  const title = "RestaurantOS — Order from your favorite restaurants in minutes"
  const description = "Fast delivery, real-time tracking, and rewards with every bite. Browse menus, place orders, and discover local favorites."
  const url = "https://yourdomain.example" // update to your production URL

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "RestaurantOS",
    url,
    potentialAction: {
      "@type": "SearchAction",
      target: `${url}/?s={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  }

  return (
    <>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="viewport" content="width=device-width,initial-scale=1" />
      <meta name="theme-color" content="#0A1F44" />

      {/* Open Graph */}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content="website" />
      <meta property="og:url" content={url} />
      <meta property="og:image" content={`${url}/placeholder.jpg`} />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />

      {/* Structured data */}
      <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
      <link rel="manifest" href="/manifest.json" />
      <link rel="icon" href="/placeholder-logo.svg" />
    </>
  )
}
