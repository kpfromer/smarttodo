import React from 'react';
import { Layout } from '../components/layout/layout';
import SEO from '../components/misc/seo';

export const HomePage: React.FC = () => {
  return (
    <>
      <SEO title="Home" />
      <Layout>Home Page</Layout>
    </>
  );
};
