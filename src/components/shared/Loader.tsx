'use client';

import React from 'react';
import { cn } from '@/lib/utils';

export enum Color {
    PRIMARY = 'primary',
    SECONDARY = 'secondary',
    WHITE = 'white',
    DARK = 'dark',
}

interface LoaderProps {
  variant?: 'spinner' | 'dots' | 'pulse' | 'bars' | 'wave' | 'ring';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  color?: Color;
  text?: string;
  className?: string;
  fullScreen?: boolean;
}

export const Loader: React.FC<LoaderProps> = ({
  variant = 'spinner',
  size = 'md',
  color = Color.PRIMARY,
  text,
  className,
  fullScreen = false,
}) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16',
  };

  const colorClasses = {
    [Color.PRIMARY]: 'text-blue-600',
    [Color.SECONDARY]: 'text-gray-600',
    [Color.WHITE]: 'text-white',
    [Color.DARK]: 'text-gray-900',
  };

  const textSizeClasses = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg',
    xl: 'text-xl',
  };

  const loaderContent = () => {
    const baseClasses = cn(
      sizeClasses[size],
      colorClasses[color],
      'animate-spin'
    );

    switch (variant) {
      case 'spinner':
        return (
          <div className={cn(baseClasses, 'border-2 border-current border-t-transparent rounded-full')} />
        );

      case 'dots':
        return (
          <div className="flex space-x-1">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className={cn(
                  'w-2 h-2 rounded-full animate-bounce',
                  colorClasses[color].replace('text-', 'bg-'),
                  size === 'sm' && 'w-1.5 h-1.5',
                  size === 'lg' && 'w-3 h-3',
                  size === 'xl' && 'w-4 h-4'
                )}
                style={{
                  animationDelay: `${i * 0.1}s`,
                  animationDuration: '0.6s',
                }}
              />
            ))}
          </div>
        );

      case 'pulse':
        return (
          <div className="relative">
            <div
              className={cn(
                'absolute rounded-full animate-ping',
                colorClasses[color].replace('text-', 'bg-'),
                sizeClasses[size],
                'opacity-75'
              )}
            />
            <div
              className={cn(
                'relative rounded-full',
                colorClasses[color].replace('text-', 'bg-'),
                sizeClasses[size]
              )}
            />
          </div>
        );

      case 'bars':
        return (
          <div className="flex items-end space-x-1">
            {[0, 1, 2, 3].map((i) => (
              <div
                key={i}
                className={cn(
                  'animate-pulse rounded-sm',
                  colorClasses[color].replace('text-', 'bg-'),
                  size === 'sm' && 'w-1 h-3',
                  size === 'md' && 'w-1.5 h-6',
                  size === 'lg' && 'w-2 h-8',
                  size === 'xl' && 'w-3 h-12'
                )}
                style={{
                  animationDelay: `${i * 0.15}s`,
                  animationDuration: '1.2s',
                }}
              />
            ))}
          </div>
        );

      case 'wave':
        return (
          <div className="flex items-center space-x-1">
            {[0, 1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className={cn(
                  'rounded-full animate-bounce',
                  colorClasses[color].replace('text-', 'bg-'),
                  size === 'sm' && 'w-1 h-1',
                  size === 'md' && 'w-2 h-2',
                  size === 'lg' && 'w-3 h-3',
                  size === 'xl' && 'w-4 h-4'
                )}
                style={{
                  animationDelay: `${i * 0.1}s`,
                  animationDuration: '0.8s',
                }}
              />
            ))}
          </div>
        );

      case 'ring':
        return (
          <div className="relative">
            <div
              className={cn(
                'border-4 border-current border-t-transparent rounded-full animate-spin',
                sizeClasses[size],
                colorClasses[color]
              )}
            />
            <div
              className={cn(
                'absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2',
                'border-2 border-current border-b-transparent rounded-full animate-spin',
                size === 'sm' && 'w-2 h-2',
                size === 'md' && 'w-4 h-4',
                size === 'lg' && 'w-6 h-6',
                size === 'xl' && 'w-8 h-8',
                colorClasses[color],
                'opacity-60'
              )}
              style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}
            />
          </div>
        );

      default:
        return (
          <div className={cn(baseClasses, 'border-2 border-current border-t-transparent rounded-full')} />
        );
    }
  };

  const content = (
    <div className={cn(
      'flex flex-col items-center justify-center space-y-3',
      className
    )}>
      {loaderContent()}
      {text && (
        <p className={cn(
          'font-medium animate-pulse',
          textSizeClasses[size],
          colorClasses[color]
        )}>
          {text}
        </p>
      )}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center z-50">
        {content}
      </div>
    );
  }

  return content;
};

// Preset loader variants for common use cases
export const PageLoader: React.FC<{ text?: string, color?: Color }> = ({ text = 'Loading...', color = Color.PRIMARY }) => (
  <Loader variant="ring" size="lg" text={text} color={color} fullScreen />
);

export const ButtonLoader: React.FC<{ size?: 'sm' | 'md' }> = ({ size = 'sm' }) => (
  <Loader variant="spinner" size={size} color={Color.WHITE} />
);

export const ContentLoader: React.FC<{ text?: string }> = ({ text }) => (
  <div className="flex items-center justify-center py-12">
    <Loader variant="dots" size="md" text={text} color={Color.PRIMARY} />
  </div>
);

export const InlineLoader: React.FC = () => (
  <Loader variant="spinner" size="sm" color={Color.PRIMARY} className="inline-flex" />
);

// Advanced loading component with custom animations
export const AdvancedLoader: React.FC<{
  type?: 'gradient' | 'morphing' | 'particles';
  size?: 'sm' | 'md' | 'lg';
  text?: string;
}> = ({ type = 'gradient', size = 'md', text }) => {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16',
  };

  if (type === 'gradient') {
    return (
      <div className="flex flex-col items-center space-y-4">
        <div className={cn(
          'rounded-full animate-spin',
          sizeClasses[size],
          'bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500',
          'relative overflow-hidden'
        )}>
          <div className="absolute inset-1 bg-white rounded-full" />
        </div>
        {text && (
          <p className="text-gray-600 font-medium animate-pulse">{text}</p>
        )}
      </div>
    );
  }

  if (type === 'morphing') {
    return (
      <div className="flex flex-col items-center space-y-4">
        <div className="relative">
          <div className={cn(
            'absolute animate-ping rounded-full bg-blue-400 opacity-75',
            sizeClasses[size]
          )} />
          <div className={cn(
            'relative rounded-full bg-gradient-to-r from-blue-500 to-indigo-600',
            'animate-pulse',
            sizeClasses[size]
          )} />
        </div>
        {text && (
          <p className="text-gray-600 font-medium">{text}</p>
        )}
      </div>
    );
  }

  if (type === 'particles') {
    return (
      <div className="flex flex-col items-center space-y-4">
        <div className="relative">
          {[0, 1, 2, 3, 4, 5].map((i) => (
            <div
              key={i}
              className={cn(
                'absolute w-2 h-2 bg-blue-500 rounded-full animate-bounce',
                size === 'sm' && 'w-1.5 h-1.5',
                size === 'lg' && 'w-3 h-3'
              )}
              style={{
                transform: `rotate(${i * 60}deg) translateY(-${size === 'sm' ? '16' : size === 'md' ? '24' : '32'}px)`,
                animationDelay: `${i * 0.1}s`,
                animationDuration: '1.2s',
              }}
            />
          ))}
          <div className={cn(
            'rounded-full bg-gray-200',
            sizeClasses[size]
          )} />
        </div>
        {text && (
          <p className="text-gray-600 font-medium">{text}</p>
        )}
      </div>
    );
  }

  return <Loader variant="spinner" size={size} text={text} />;
};

export default Loader;
