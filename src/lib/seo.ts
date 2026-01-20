type MovieSchema = {
  title: string;
  description: string;
  image: string;
  rating: number;
  dateCreated: string;
  director?: string; // Optional if we add later
};

export function generateWebSiteSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Botad Movies',
    url: 'https://botad-movie.vercel.app',
    potentialAction: {
      '@type': 'SearchAction',
      target: 'https://botad-movie.vercel.app/?q={search_term_string}',
      'query-input': 'required name=search_term_string',
    },
  };
}

export function generateMovieSchema(movie: MovieSchema) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Movie',
    name: movie.title,
    description: movie.description,
    image: movie.image,
    dateCreated: movie.dateCreated,
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: movie.rating,
      bestRating: '10',
      worstRating: '1',
      ratingCount: '100', // Placeholder or real ID count if available
    },
    offers: {
      '@type': 'Offer',
      availability: 'https://schema.org/InStock',
      price: '0',
      priceCurrency: 'USD',
    },
  };
}

export function generateBreadcrumbSchema(items: { name: string; item: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.item,
    })),
  };
}
export function generateFAQSchema(movieTitle: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: `How to download ${movieTitle} in HD?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: `You can download ${movieTitle} by clicking on the Highspeed Download buttons provided in the download section. We recommend using a download manager for the best experience.`,
        },
      },
      {
        '@type': 'Question',
        name: `Is ${movieTitle} available in Hindi Dubbed?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: `Please check the "Technical Specifications" section for audio details. We try to provide dual audio (Hindi-English) formats whenever possible.`,
        },
      },
      {
        '@type': 'Question',
        name: `What is the quality of the ${movieTitle} download?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: `We provide ${movieTitle} in various qualities including 480p, 720p, and 1080p Full HD depending on availability.`,
        },
      },
    ],
  };
}
