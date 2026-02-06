import React from 'react';

interface TypographyProps {
  variant?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'subtitle1' | 'subtitle2' | 'body1' | 'body2' | 'caption' | 'overline' | 'label';
  weight?: 'normal' | 'medium' | 'semibold' | 'bold';
  size?: 'xs' | 'sm' | 'base' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl';
  color?: 'primary' | 'secondary' | 'muted' | 'error' | 'success' | 'warning';
  className?: string;
  children: React.ReactNode;
  as?: React.ElementType;
}

export const Typography: React.FC<TypographyProps> = ({
  variant = 'body1',
  weight = 'normal',
  size,
  color = 'primary',
  className = '',
  children,
  as: Element = 'p',
}) => {
  // Define default sizes for each variant if not explicitly provided
  const getSize = () => {
    if (size) return size;

    switch (variant) {
      case 'h1': return '4xl';
      case 'h2': return '3xl';
      case 'h3': return '2xl';
      case 'h4': return 'xl';
      case 'h5': return 'lg';
      case 'h6': return 'base';
      case 'subtitle1': return 'lg';
      case 'subtitle2': return 'base';
      case 'body1': return 'base';
      case 'body2': return 'sm';
      case 'caption': return 'xs';
      case 'overline': return 'xs';
      case 'label': return 'sm';
      default: return 'base';
    }
  };

  // Define default element for each variant if not explicitly provided
  const getDefaultElement = () => {
    switch (variant) {
      case 'h1': return 'h1';
      case 'h2': return 'h2';
      case 'h3': return 'h3';
      case 'h4': return 'h4';
      case 'h5': return 'h5';
      case 'h6': return 'h6';
      default: return 'p';
    }
  };

  // Use the default element if no element was explicitly provided
  const element = Element === 'p' ? getDefaultElement() : Element;

  const sizeClass = `var(--font-size-${getSize()})`;
  const weightClass = `var(--font-weight-${weight})`;
  const fontFamilyClass = `var(--font-family-primary)`;

  // Color classes
  const colorClasses = {
    primary: 'text-gray-900 dark:text-gray-100',
    secondary: 'text-gray-700 dark:text-gray-300',
    muted: 'text-gray-500 dark:text-gray-400',
    error: 'text-red-600 dark:text-red-400',
    success: 'text-green-600 dark:text-green-400',
    warning: 'text-yellow-600 dark:text-yellow-400',
  };

  const combinedClassName = `${colorClasses[color]} ${className}`;

  const typographyStyle = {
    fontSize: sizeClass,
    fontWeight: weightClass,
    fontFamily: fontFamilyClass,
  };

  return React.createElement(
    element,
    {
      style: typographyStyle,
      className: combinedClassName,
    },
    children
  );
};

// Convenience components for common typography patterns
export const H1: React.FC<Omit<TypographyProps, 'variant'>> = (props) => (
  <Typography variant="h1" {...props} />
);

export const H2: React.FC<Omit<TypographyProps, 'variant'>> = (props) => (
  <Typography variant="h2" {...props} />
);

export const H3: React.FC<Omit<TypographyProps, 'variant'>> = (props) => (
  <Typography variant="h3" {...props} />
);

export const H4: React.FC<Omit<TypographyProps, 'variant'>> = (props) => (
  <Typography variant="h4" {...props} />
);

export const H5: React.FC<Omit<TypographyProps, 'variant'>> = (props) => (
  <Typography variant="h5" {...props} />
);

export const H6: React.FC<Omit<TypographyProps, 'variant'>> = (props) => (
  <Typography variant="h6" {...props} />
);

export const Body: React.FC<Omit<TypographyProps, 'variant'>> = (props) => (
  <Typography variant="body1" {...props} />
);

export const Caption: React.FC<Omit<TypographyProps, 'variant'>> = (props) => (
  <Typography variant="caption" {...props} />
);

export const Label: React.FC<Omit<TypographyProps, 'variant'>> = (props) => (
  <Typography variant="label" {...props} />
);