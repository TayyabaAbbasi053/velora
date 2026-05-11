import React, { useState } from 'react';
import { Star } from 'lucide-react';

const StarRating = ({ rating = 0, onRate, size = 18, interactive = false }) => {
  const [hover, setHover] = useState(0);

  return (
    <div style={{ display: 'inline-flex', gap: '2px' }}>
      {[1, 2, 3, 4, 5].map(star => (
        <Star
          key={star}
          size={size}
          style={{
            cursor: interactive ? 'pointer' : 'default',
            transition: 'color 0.2s, fill 0.2s',
          }}
          fill={(interactive ? (hover || rating) : rating) >= star ? '#9ca88b' : 'transparent'}
          color={(interactive ? (hover || rating) : rating) >= star ? '#9ca88b' : '#555'}
          onClick={() => interactive && onRate?.(star)}
          onMouseEnter={() => interactive && setHover(star)}
          onMouseLeave={() => interactive && setHover(0)}
        />
      ))}
    </div>
  );
};

export default StarRating;
