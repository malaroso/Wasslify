import React, { useEffect, useState, useRef, useCallback } from 'react';
import { getAllWallpapers } from '../services/wallpaperService';
import { Wallpaper } from '../types/WallpaperTypes';
import styled from 'styled-components';

const WallpaperGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
  padding: 20px;
`;

const WallpaperCard = styled.div`
  position: relative;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s;

  &:hover {
    transform: scale(1.02);
  }

  img {
    width: 100%;
    height: 200px;
    object-fit: cover;
  }
`;

const LoadingSpinner = styled.div`
  text-align: center;
  padding: 20px;
  font-size: 1.2rem;
  color: #666;
`;

const Wallpapers: React.FC = () => {
  const [wallpapers, setWallpapers] = useState<Wallpaper[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const observer = useRef<IntersectionObserver>();
  const lastWallpaperElementRef = useCallback((node: HTMLDivElement) => {
    if (loading) return;
    if (observer.current) observer.current.disconnect();
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) {
        setPage(prevPage => prevPage + 1);
      }
    });
    if (node) observer.current.observe(node);
  }, [loading, hasMore]);

  useEffect(() => {
    const fetchWallpapers = async () => {
      try {
        setLoading(true);
        const response = await getAllWallpapers(page);
        if (response.status && response.data.length > 0) {
          setWallpapers(prev => [...prev, ...response.data]);
        } else {
          setHasMore(false);
        }
      } catch (error) {
        console.error('Duvar kağıtları yüklenirken hata oluştu:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchWallpapers();
  }, [page]);

  return (
    <WallpaperGrid>
      {wallpapers.map((wallpaper, index) => (
        <WallpaperCard
          key={wallpaper.id}
          ref={index === wallpapers.length - 1 ? lastWallpaperElementRef : null}
        >
          <img src={wallpaper.image_url} alt={wallpaper.title} />
          <div style={{ padding: '10px' }}>
            <h3>{wallpaper.title}</h3>
            <p>{wallpaper.description}</p>
          </div>
        </WallpaperCard>
      ))}
      {loading && <LoadingSpinner>Yükleniyor...</LoadingSpinner>}
    </WallpaperGrid>
  );
};

export default Wallpapers; 