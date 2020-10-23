import React from 'react';
import { Link as RebassLink, LinkProps } from 'rebass';
import {
  Link as GatsbyLink,
  LinkProps as RouterLinkProps
} from 'react-router-dom';

interface Props {
  to: string;
  outside?: boolean;
}

export const Link: React.FC<
  Props & Omit<LinkProps, 'href'> & Omit<RouterLinkProps, 'to'>
> = ({ outside = false, to, children, ...props }) => {
  if (!outside) {
    return (
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      <RebassLink {...props} as={GatsbyLink} to={to}>
        {children}
      </RebassLink>
    );
  }
  return (
    <RebassLink {...props} rel="noopener" target="_blank" href={to}>
      {children}
    </RebassLink>
  );
};
