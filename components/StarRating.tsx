
'use client';

interface StarRatingProps {
  rating: number;
  maxRating?: number;
  size?: 'sm' | 'md' | 'lg';
  interactive?: boolean;
  onRatingChange?: (rating: number) => void;
}

export default function StarRating({
  rating,
  maxRating = 5,
  size = 'md',
  interactive = false,
  onRatingChange,
}: StarRatingProps) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
  };

  const handleClick = (newRating: number) => {
    if (interactive && onRatingChange) {
      onRatingChange(newRating);
    }
  };

  return (
    <div className="flex items-center space-x-1">
      {[...Array(maxRating)].map((_, index) => {
        const starValue = index + 1;
        const isFilled = starValue <= rating;
        
        return (
          <button
            key={index}
            type="button"
            onClick={() => handleClick(starValue)}
            disabled={!interactive}
            className={`${sizeClasses[size]} ${
              interactive ? 'cursor-pointer hover:scale-110' : 'cursor-default'
            } transition-transform duration-150`}
          >
            <i
              className={`ri-star-${isFilled ? 'fill' : 'line'} ${
                isFilled ? 'text-yellow-400' : 'text-gray-300'
              } ${sizeClasses[size]} flex items-center justify-center`}
            />
          </button>
        );
      })}
    </div>
  );
}
