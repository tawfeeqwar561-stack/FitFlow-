import React, { useState, useEffect } from 'react';
import './QuotesSection.css';

const quotes = [
  {
    text: "The present moment is the only moment available to us, and it is the door to all moments.",
    author: "Thich Nhat Hanh",
    category: "mindfulness"
  },
  {
    text: "Meditation is not about stopping thoughts, but recognizing that we are more than our thoughts and our feelings.",
    author: "Arianna Huffington",
    category: "meditation"
  },
  {
    text: "The body benefits from movement, and the mind benefits from stillness.",
    author: "Sakyong Mipham",
    category: "balance"
  },
  {
    text: "Breathe. Let go. And remind yourself that this very moment is the only one you know you have for sure.",
    author: "Oprah Winfrey",
    category: "breathing"
  },
  {
    text: "In the midst of movement and chaos, keep stillness inside of you.",
    author: "Deepak Chopra",
    category: "peace"
  },
  {
    text: "The greatest weapon against stress is our ability to choose one thought over another.",
    author: "William James",
    category: "stress"
  },
  {
    text: "Your calm mind is the ultimate weapon against your challenges.",
    author: "Bryant McGill",
    category: "calm"
  },
  {
    text: "Almost everything will work again if you unplug it for a few minutes, including you.",
    author: "Anne Lamott",
    category: "rest"
  },
  {
    text: "Within you, there is a stillness and a sanctuary to which you can retreat at any time.",
    author: "Hermann Hesse",
    category: "inner-peace"
  },
  {
    text: "The mind is everything. What you think you become.",
    author: "Buddha",
    category: "mindset"
  },
  {
    text: "Take care of your body. It's the only place you have to live.",
    author: "Jim Rohn",
    category: "fitness"
  },
  {
    text: "Fitness is not about being better than someone else. It's about being better than you used to be.",
    author: "Khloe Kardashian",
    category: "fitness"
  },
  {
    text: "The only bad workout is the one that didn't happen.",
    author: "Unknown",
    category: "motivation"
  },
  {
    text: "Your body can stand almost anything. It's your mind that you have to convince.",
    author: "Unknown",
    category: "mindset"
  },
  {
    text: "Strength does not come from the body. It comes from the will.",
    author: "Unknown",
    category: "strength"
  },
];

const categories = [
  { id: 'all', label: 'All', icon: '' },
  { id: 'mindfulness', label: 'Mindfulness', icon: '' },
  { id: 'fitness', label: 'Fitness', icon: '' },
  { id: 'motivation', label: 'Motivation', icon: '' },
  { id: 'peace', label: 'Peace', icon: '' },
];

const QuotesSection = () => {
  const [currentQuote, setCurrentQuote] = useState(quotes[0]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [isAnimating, setIsAnimating] = useState(false);
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    const saved = localStorage.getItem('favoriteQuotes');
    if (saved) {
      setFavorites(JSON.parse(saved));
    }
  }, []);

  const getFilteredQuotes = () => {
    if (selectedCategory === 'all') return quotes;
    return quotes.filter(q => q.category === selectedCategory);
  };

  const getRandomQuote = () => {
    setIsAnimating(true);
    const filtered = getFilteredQuotes();
    const randomIndex = Math.floor(Math.random() * filtered.length);
    
    setTimeout(() => {
      setCurrentQuote(filtered[randomIndex]);
      setIsAnimating(false);
    }, 300);
  };

  const toggleFavorite = (quote) => {
    const isFavorite = favorites.some(f => f.text === quote.text);
    let newFavorites;
    
    if (isFavorite) {
      newFavorites = favorites.filter(f => f.text !== quote.text);
    } else {
      newFavorites = [...favorites, quote];
    }
    
    setFavorites(newFavorites);
    localStorage.setItem('favoriteQuotes', JSON.stringify(newFavorites));
  };

  const isFavorite = (quote) => {
    return favorites.some(f => f.text === quote.text);
  };

  const shareQuote = (quote) => {
    const text = `"${quote.text}" - ${quote.author}`;
    
    if (navigator.share) {
      navigator.share({
        title: 'Inspirational Quote',
        text: text,
      });
    } else {
      navigator.clipboard.writeText(text);
      alert('Quote copied to clipboard!');
    }
  };

  return (
    <div className="quotes-section">
      {/* Category Filter */}
      <div className="quotes-categories">
        {categories.map((cat) => (
          <button
            key={cat.id}
            className={`category-btn ${selectedCategory === cat.id ? 'active' : ''}`}
            onClick={() => {
              setSelectedCategory(cat.id);
              getRandomQuote();
            }}
          >
            <span>{cat.icon}</span>
            <span>{cat.label}</span>
          </button>
        ))}
      </div>

      {/* Quote Card */}
      <div className={`quote-card ${isAnimating ? 'animating' : ''}`}>
        <div className="quote-icon"></div>
        <blockquote className="quote-text">
          "{currentQuote.text}"
        </blockquote>
        <cite className="quote-author">— {currentQuote.author}</cite>
        
        <div className="quote-actions">
          <button 
            className={`quote-action-btn ${isFavorite(currentQuote) ? 'favorited' : ''}`}
            onClick={() => toggleFavorite(currentQuote)}
          >
            {isFavorite(currentQuote) ? '' : ''}
          </button>
          <button 
            className="quote-action-btn"
            onClick={() => shareQuote(currentQuote)}
          >
            
          </button>
        </div>
      </div>

      {/* New Quote Button */}
      <div className="quote-controls">
        <button className="btn btn-primary btn-large" onClick={getRandomQuote}>
           New Quote
        </button>
      </div>

      {/* Favorites Section */}
      {favorites.length > 0 && (
        <div className="favorites-section">
          <h3> Your Favorites ({favorites.length})</h3>
          <div className="favorites-grid">
            {favorites.map((quote, index) => (
              <div key={index} className="favorite-card">
                <p>"{quote.text}"</p>
                <cite>— {quote.author}</cite>
                <button 
                  className="remove-favorite"
                  onClick={() => toggleFavorite(quote)}
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Daily Reminder */}
      <div className="daily-reminder">
        <h4> Daily Mindfulness Reminder</h4>
        <p>Take a moment each day to reflect on a positive thought. It can transform your mindset and improve your well-being.</p>
      </div>
    </div>
  );
};

export default QuotesSection;