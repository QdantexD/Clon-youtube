import React, { useEffect, useState } from "react";
import "./Feed.css";
import { Link, useNavigate } from "react-router-dom";
import { value_converter } from "../../data";
import { fetchVideos, searchVideos } from "../../services/youtubeApi";
import moment from 'moment';
import { useApp } from '../../context/AppContext';
import { useSearchParams } from 'react-router-dom';

const Feed = ({ category }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { searchQuery } = useApp();
  const [searchParams] = useSearchParams();
  const queryParam = searchParams.get('q');
  const navigate = useNavigate();

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      let videos = [];
      if (queryParam || searchQuery) {
        const searchTerm = queryParam || searchQuery;
        console.log('Searching videos for:', searchTerm);
        videos = await searchVideos(searchTerm);
      } else {
        console.log('Fetching popular videos for category:', category);
        videos = await fetchVideos(category);
      }
      
      console.log('Videos received:', videos.length);
      
      if (videos.length === 0) {
        setError("No videos found. Please try a different search or category.");
      } else {
        setError(null);
      }
      
      setData(videos);
    } catch (error) {
      console.error("Fetch error:", error);
      setError(error.message || "Failed to load videos. Please check your API key and try again.");
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [category, queryParam]);

  // Helper function to extract video ID - handles all cases
  const getVideoId = (item) => {
    if (!item) return null;
    
    // Case 1: item.id is a string (from popular videos API)
    if (typeof item.id === 'string' && item.id.trim() !== '') {
      return item.id.trim();
    }
    
    // Case 2: item.id is an object with videoId property (from search API before details fetch)
    if (item.id && typeof item.id === 'object' && item.id.videoId) {
      return item.id.videoId.trim();
    }
    
    // Case 3: item.id might be undefined or null
    console.warn('Unable to extract video ID from item:', item);
    return null;
  };

  const handleVideoClick = (e, videoId, categoryId) => {
    // Validate videoId before navigation
    if (!videoId || videoId.trim() === '') {
      e.preventDefault();
      console.error('Invalid video ID, navigation prevented');
      return;
    }
    
    // Optional: Add analytics or tracking here
    console.log('Navigating to video:', videoId, 'Category:', categoryId);
  };

  if (loading) {
    return (
      <div className="feed-loading">
        {[...Array(12)].map((_, i) => (
          <div key={i} className="video-skeleton">
            <div className="skeleton-thumbnail"></div>
            <div className="skeleton-info">
              <div className="skeleton-avatar"></div>
              <div className="skeleton-text">
                <div className="skeleton-line"></div>
                <div className="skeleton-line short"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error && data.length === 0) {
    return (
      <div className="feed-error">
        <p>{error}</p>
        <button onClick={fetchData} style={{ marginTop: '10px', padding: '8px 16px' }}>
          Try Again
        </button>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="feed-empty">
        <p>No videos found. Try a different search or category.</p>
        <button onClick={fetchData} style={{ marginTop: '10px', padding: '8px 16px' }}>
          Refresh
        </button>
      </div>
    );
  }

  return (
    <div className="feed">
      {data.map((item, index) => {
        // Validate item structure
        if (!item || !item.snippet || !item.snippet.thumbnails) {
          console.warn('Invalid video item at index:', index, item);
          return null;
        }
        
        const videoId = getVideoId(item);
        if (!videoId) {
          console.warn('Video ID not found for item at index:', index);
          return null;
        }
        
        const categoryId = item.snippet?.categoryId || category || 0;
        const thumbnailUrl = item.snippet.thumbnails.medium?.url || item.snippet.thumbnails.default?.url;
        const title = item.snippet.title || "No Title Available";
        const channelTitle = item.snippet.channelTitle || "Unknown Channel";
        const viewCount = value_converter(item.statistics?.viewCount || 0);
        const publishedAt = item.snippet?.publishedAt 
          ? moment(item.snippet.publishedAt).fromNow() 
          : "Unknown Time";
        
        return (
          <Link 
            key={`${videoId}-${index}`}
            to={`/video/${categoryId}/${videoId}`} 
            className="card"
            onClick={(e) => handleVideoClick(e, videoId, categoryId)}
          >
            <div className="thumbnail-container">
              <img
                src={thumbnailUrl}
                alt={title}
                loading="lazy"
                onError={(e) => {
                  console.warn('Image load error for video:', videoId);
                  e.target.src = 'https://via.placeholder.com/320x180?text=Video+Thumbnail';
                }}
              />
              {item.contentDetails?.duration && (
                <span className="video-duration">
                  {formatDuration(item.contentDetails.duration)}
                </span>
              )}
            </div>
            <div className="video-info">
              <h2>{title}</h2>
              <h3>{channelTitle}</h3>
              <p>
                {viewCount} views &bull; {publishedAt}
              </p>
            </div>
          </Link>
        );
      })}
    </div>
  );
};

const formatDuration = (duration) => {
  if (!duration || typeof duration !== 'string') return '';
  
  const match = duration.match(/PT(\d+H)?(\d+M)?(\d+S)?/);
  if (!match) return '';
  
  const hours = (match[1] || '').replace('H', '');
  const minutes = (match[2] || '').replace('M', '');
  const seconds = (match[3] || '').replace('S', '');
  
  if (hours) {
    return `${hours}:${minutes.padStart(2, '0')}:${seconds.padStart(2, '0')}`;
  }
  return `${minutes || '0'}:${seconds.padStart(2, '0')}`;
};

export default Feed;
