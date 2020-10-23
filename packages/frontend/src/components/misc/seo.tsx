import React from 'react';
import { Helmet } from 'react-helmet';

const SEO: React.FC<{
  description?: string;
  lang?: string;
  meta?: any[];
  title: string;
}> = ({ description, lang, meta = [], title }) => {
  // todo: default
  const appName = 'Smarttodo';
  const metaDescription = description ?? 'Smarttodo';

  return (
    <Helmet
      htmlAttributes={{
        lang
      }}
      title={title}
      titleTemplate={`%s | ${appName}`}
      meta={[
        {
          name: `description`,
          content: metaDescription
        },
        {
          property: `og:title`,
          content: title
        },
        {
          property: `og:description`,
          content: metaDescription
        },
        {
          property: `og:type`,
          content: `website`
        },
        {
          name: `twitter:card`,
          content: `summary`
        },
        {
          name: `twitter:creator`,
          content: 'Kyle Pfromer'
        },
        {
          name: `twitter:title`,
          content: title
        },
        {
          name: `twitter:description`,
          content: metaDescription
        }
      ].concat(meta)}
    />
  );
};

export default SEO;
