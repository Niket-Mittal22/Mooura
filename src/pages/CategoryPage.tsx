import React, { useState, useEffect } from 'react';
import { WideMovieCard } from '../components/WideMovieCard';
import './CategoryPage.css';

interface CategoryPageProps {
  title: string;
  fetchUrl: string;
  description?: string;
}

export const CategoryPage: React.FC<CategoryPageProps> = ({ title, fetchUrl, description }) => {
  const [items, setItems] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    window.scrollTo(0, 0);
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(fetchUrl);
        const data = await response.json();
        setItems(data.results || []);
      } catch (error) {
        console.error(`Error fetching ${title}:`, error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [fetchUrl, title]);

  return (
    <div className="category-page-container">
      <div className="category-header">
        <h1 className="category-title">{title}</h1>
        {description && <p className="category-description">{description}</p>}
      </div>

      {isLoading ? (
        <div className="category-loading"><div className="modern-spinner"></div></div>
      ) : (
        <div className="category-grid">
          {items.map((item) => (
            <WideMovieCard key={item.id} item={item} />
          ))}
        </div>
      )}
    </div>
  );
};

export default CategoryPage;