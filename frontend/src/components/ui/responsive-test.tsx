'use client';

import React from 'react';
import { Typography, H1, Body } from './typography';
import { GradientCard } from './gradient-card';
import { GradientButton } from './gradient-button';
import { Spacer } from './spacing';

const ResponsiveTest: React.FC = () => {
  // Get screen size information
  const [screenInfo, setScreenInfo] = React.useState({
    width: 0,
    height: 0,
    breakpoint: 'Unknown'
  });

  React.useEffect(() => {
    const updateScreenInfo = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;

      let breakpoint = 'xs';
      if (width >= 1280) breakpoint = '2xl';
      else if (width >= 1024) breakpoint = 'xl';
      else if (width >= 768) breakpoint = 'lg';
      else if (width >= 640) breakpoint = 'md';
      else if (width >= 475) breakpoint = 'sm';

      setScreenInfo({
        width,
        height,
        breakpoint
      });
    };

    // Initial update
    updateScreenInfo();

    // Add event listener
    window.addEventListener('resize', updateScreenInfo);

    // Cleanup
    return () => window.removeEventListener('resize', updateScreenInfo);
  }, []);

  return (
    <div className="container-responsive">
      <H1>Responsive Design Test</H1>
      <Spacer size="lg" />

      <GradientCard variant="standard">
        <Typography variant="subtitle1" weight="semibold">Screen Information</Typography>
        <Spacer size="sm" />
        <Body>Width: {screenInfo.width}px</Body>
        <Body>Height: {screenInfo.height}px</Body>
        <Body>Breakpoint: {screenInfo.breakpoint}</Body>
      </GradientCard>

      <Spacer size="lg" />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[1, 2, 3, 4, 5, 6].map((item) => (
          <GradientCard key={item} variant="interactive">
            <Typography variant="subtitle2" weight="medium">Card {item}</Typography>
            <Spacer size="sm" />
            <Body>This card demonstrates responsive layout behavior.</Body>
            <Spacer size="sm" />
            <GradientButton size="sm" variant="secondary">
              Action {item}
            </GradientButton>
          </GradientCard>
        ))}
      </div>

      <Spacer size="xl" />

      <div className="responsive-padding-lg">
        <GradientCard>
          <Typography variant="subtitle1" weight="semibold">Responsive Padding Test</Typography>
          <Spacer size="sm" />
          <Body>This content demonstrates responsive padding that adjusts based on screen size.</Body>
        </GradientCard>
      </div>

      <Spacer size="xl" />

      <div className="text-responsive-xl">
        <GradientCard>
          <Typography variant="subtitle1" weight="semibold">Responsive Typography Test</Typography>
          <Spacer size="sm" />
          <div className="text-responsive-base">
            <Body>This text demonstrates responsive typography that adjusts based on screen size.</Body>
          </div>
        </GradientCard>
      </div>
    </div>
  );
};

export default ResponsiveTest;