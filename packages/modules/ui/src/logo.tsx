import React from 'react';
import { useBranding } from '../../../src/hooks/react';

export interface LogoProps {
  className?: string;
  style?: React.CSSProperties;
  width?: number;
  height?: number;
  alt?: string;
  fallback?: React.ReactNode;
}

export const Logo: React.FC<LogoProps> = ({
  className,
  style,
  width,
  height,
  alt,
  fallback = <div>Logo</div>,
}) => {
  const { logoUrl, config, isLoading } = useBranding();

  if (isLoading) {
    return (
      <div className={className} style={style}>
        Loading...
      </div>
    );
  }

  if (!logoUrl) {
    return (
      <div className={className} style={style}>
        {fallback}
      </div>
    );
  }

  const logoConfig = config?.logo;
  const finalWidth = width || logoConfig?.width || 200;
  const finalHeight = height || logoConfig?.height || 60;
  const finalAlt = alt || logoConfig?.alt || 'Company Logo';

  return (
    <img
      src={logoUrl}
      alt={finalAlt}
      width={finalWidth}
      height={finalHeight}
      className={className}
      style={{
        objectFit: 'contain',
        ...style,
      }}
    />
  );
};

export default Logo;
