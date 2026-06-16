import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs) {
  return twMerge(clsx(inputs));
}

const Card = React.forwardRef(({ className, children, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn(
        'bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden',
        'hover:shadow-md transition-shadow duration-200',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
});

Card.displayName = 'Card';

const CardHeader = ({ className, children }) => (
  <div className={cn('px-6 py-4 border-b border-gray-100', className)}>
    {children}
  </div>
);

const CardTitle = ({ className, children }) => (
  <h3 className={cn('text-lg font-semibold text-gray-900', className)}>
    {children}
  </h3>
);

const CardContent = ({ className, children }) => (
  <div className={cn('px-6 py-4', className)}>
    {children}
  </div>
);

const CardFooter = ({ className, children }) => (
  <div className={cn('px-6 py-4 border-t border-gray-100 bg-gray-50', className)}>
    {children}
  </div>
);

Card.Header = CardHeader;
Card.Title = CardTitle;
Card.Content = CardContent;
Card.Footer = CardFooter;

export default Card;