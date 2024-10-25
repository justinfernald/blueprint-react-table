import React from 'react';
import { Classes } from '@blueprintjs/core';

interface SkeletonProps {
  width?: string;
  height?: string;
  className?: string;
  style?: React.CSSProperties;
}

export const Skeleton = (props: SkeletonProps) => {
  const { width, height, className = '', style } = props;

  return (
    <div
      className={`${Classes.SKELETON} ${className}`}
      style={{
        width: width || '100%',
        height: height || '1em',
        ...style,
      }}
    />
  );
};
