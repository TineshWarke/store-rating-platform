import React from 'react';
import { Star } from 'lucide-react';

interface StarRatingProps {
    rating: number;
    onRatingChange?: (rating: number) => void;
    readonly?: boolean;
    size?: number;
}

const StarRating: React.FC<StarRatingProps> = ({
    rating,
    onRatingChange,
    readonly = false,
    size = 20
}) => {
    const stars = [1, 2, 3, 4, 5];

    return (
        <div className="flex space-x-1">
            {stars.map((star) => (
                <button
                    key={star}
                    type="button"
                    disabled={readonly}
                    onClick={() => !readonly && onRatingChange?.(star)}
                    className={`${readonly ? 'cursor-default' : 'cursor-pointer hover:scale-110'} transition-transform`}
                >
                    <Star
                        size={size}
                        className={`${star <= rating
                                ? 'text-yellow-400 fill-yellow-400'
                                : 'text-gray-300'
                            } ${!readonly && 'hover:text-yellow-400'}`}
                    />
                </button>
            ))}
            {rating > 0 && (
                <span className="ml-2 text-sm text-gray-600">
                    {rating.toFixed(1)}
                </span>
            )}
        </div>
    );
};

export default StarRating;