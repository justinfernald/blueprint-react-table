/** @jsxImportSource @emotion/react */
import React from 'react';
import { css } from '@emotion/react';

export interface BoxProps extends React.HTMLAttributes<HTMLElement> {
  component?: React.ElementType; // Allows passing a custom component
  m?: number | string;
  mt?: number | string;
  mb?: number | string;
  ml?: number | string;
  mr?: number | string;
  mx?: number | string;
  my?: number | string;
  p?: number | string;
  pt?: number | string;
  pb?: number | string;
  pl?: number | string;
  pr?: number | string;
  px?: number | string;
  py?: number | string;
  display?: React.CSSProperties['display'];
  width?: React.CSSProperties['width'];
  height?: React.CSSProperties['height'];
  bgcolor?: string;
  className?: string;
}

export const Box: React.FC<BoxProps> = (props) => {
  const {
    children,
    component: Component = 'div', // Default to 'div' if no component is provided
    m,
    mt,
    mb,
    ml,
    mr,
    mx,
    my,
    p,
    pt,
    pb,
    pl,
    pr,
    px,
    py,
    display,
    width,
    height,
    bgcolor,
    className,
    ...rest
  } = props;

  // Create an object for styles
  const styles = css({
    margin: m,
    marginTop: mt ?? my,
    marginBottom: mb ?? my,
    marginLeft: ml ?? mx,
    marginRight: mr ?? mx,
    padding: p,
    paddingTop: pt ?? py,
    paddingBottom: pb ?? py,
    paddingLeft: pl ?? px,
    paddingRight: pr ?? px,
    display,
    width,
    height,
    backgroundColor: bgcolor,
  });

  return (
    <Component css={styles} className={className} {...rest}>
      {children}
    </Component>
  );
};
