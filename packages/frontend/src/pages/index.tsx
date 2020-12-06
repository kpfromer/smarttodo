import { graphql, useStaticQuery } from 'gatsby';
import React from 'react';
import { Heading, Text } from 'rebass';
import { Layout } from '../components/layout/layout';
import { Banner } from '../components/misc/Banner';
import SEO from '../components/misc/seo';

export default () => {
  const data = useStaticQuery(graphql`
    {
      banner: file(name: { eq: "code" }, extension: { eq: "jpg" }) {
        childImageSharp {
          fluid(quality: 90, maxWidth: 1920) {
            ...GatsbyImageSharpFluid_withWebp
          }
        }
      }
    }
  `);
  return (
    <Layout>
      <SEO title="Home" />

      <Banner overlayColor={false} image={{ fluid: data.banner.childImageSharp.fluid }} />
      <Heading>Smarttodo</Heading>

      <Text>What we are about.</Text>
    </Layout>
  );
};
