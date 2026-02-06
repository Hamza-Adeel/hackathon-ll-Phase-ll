import React from 'react';

interface SpacingProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl';
  direction?: 'horizontal' | 'vertical' | 'both';
  children?: React.ReactNode;
  className?: string;
}

export const Spacing: React.FC<SpacingProps> = ({
  size = 'md',
  direction = 'vertical',
  children,
  className = ''
}) => {
  // Map size to CSS variable
  const sizeClass = `var(--spacing-${size})`;

  // Determine spacing styles based on direction
  const spacingStyle = {
    ...(direction === 'vertical' && {
      marginTop: sizeClass,
      marginBottom: sizeClass
    }),
    ...(direction === 'horizontal' && {
      marginLeft: sizeClass,
      marginRight: sizeClass
    }),
    ...(direction === 'both' && {
      margin: sizeClass
    })
  };

  return (
    <div
      style={spacingStyle}
      className={className}
    >
      {children}
    </div>
  );
};

// Spacer component for empty space
export const Spacer: React.FC<Pick<SpacingProps, 'size' | 'direction'>> = ({
  size = 'md',
  direction = 'vertical'
}) => {
  const sizeClass = `var(--spacing-${size})`;

  const spacerStyle = {
    ...(direction === 'vertical' && {
      height: sizeClass,
      minHeight: sizeClass
    }),
    ...(direction === 'horizontal' && {
      width: sizeClass,
      minWidth: sizeClass
    }),
    ...(direction === 'both' && {
      width: sizeClass,
      height: sizeClass
    })
  };

  return <div style={spacerStyle} aria-hidden="true" />;
};

// Container with consistent padding
interface ContainerProps {
  padding?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  children: React.ReactNode;
  className?: string;
}

export const Container: React.FC<ContainerProps> = ({
  padding = 'md',
  children,
  className = ''
}) => {
  const paddingClass = `var(--spacing-${padding})`;

  const containerStyle = {
    padding: paddingClass
  };

  return (
    <div
      style={containerStyle}
      className={className}
    >
      {children}
    </div>
  );
};

// Grid with consistent spacing
interface GridLayoutProps {
  gap?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  columns?: number;
  children: React.ReactNode[];
  className?: string;
}

export const GridLayout: React.FC<GridLayoutProps> = ({
  gap = 'md',
  columns = 1,
  children,
  className = ''
}) => {
  const gapSize = `var(--spacing-${gap})`;

  const gridStyle = {
    display: 'grid',
    gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`,
    gap: gapSize
  };

  return (
    <div
      style={gridStyle}
      className={className}
    >
      {children}
    </div>
  );
};