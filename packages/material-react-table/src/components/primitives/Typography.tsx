import React from 'react';
import { Text } from '@blueprintjs/core';

export type TypographyProps = {
  variant?: 'h1' | 'h2' | 'h3' | 'h4' | 'p' | 'span';
  children: React.ReactNode;
  className?: string;
  color?: string;
};

export const Typography = (props: TypographyProps) => {
  const { variant = 'p', children, className, color } = props;
  const Component = variant as keyof JSX.IntrinsicElements;

  return (
    <Text tagName={Component} className={className} style={{ color }}>
      {children}
    </Text>
  );
};
