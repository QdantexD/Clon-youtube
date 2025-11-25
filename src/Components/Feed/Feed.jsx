import React, { useEffect, useState } from "react";
import "./Feed.css";
import { Link } from "react-router-dom";
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

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      let videos = [];
      if (queryParam || searchQuery) {
        videos = await searchVideos(queryParam || searchQuery);
      } else {
        videos = await fetchVideos(category);
      }
      setData(videos);
    } catch (error) {
      console.error("Fetch error:", error);
      setError("Failed to load videos. Please try again later.");
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [category, queryParam]);

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

  if (error) {
    return (
      <div className="feed-error">
        <p>{error}</p>
        <button onClick={fetchData}>Try Again</button>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="feed-empty">
        <p>No videos found. Try a different search or category.</p>
      </div>
    );
  }

  return (
    <div className="feed">
      {data.map((item, index) => {
        if (!item.snippet || !item.snippet.thumbnails) {
          return null;
        }
        const videoId = item.id;
        const categoryId = item.snippet?.categoryId || category || 0;
        
        return (
          <Link 
            key={videoId || index} 
            to={`/video/${categoryId}/${videoId}`} 
            className="card"
          >
            <div className="thumbnail-container">
              <img
                src={item.snippet.thumbnails.medium?.url || item.snippet.thumbnails.default?.url}
                alt={item.snippet.title || "Video Thumbnail"}
                loading="lazy"
              />
              {item.contentDetails?.duration && (
                <span className="video-duration">
                  {formatDuration(item.contentDetails.duration)}
                </span>
              )}
            </div>
            <div className="video-info">
              <h2>{item.snippet.title || "No Title Available"}</h2>
              <h3>{item.snippet.channelTitle || "Unknown Channel"}</h3>
              <p>
                {value_converter(item.statistics?.viewCount || 0)} views &bull;{" "}
                {item.snippet?.publishedAt 
                  ? moment(item.snippet.publishedAt).fromNow() 
                  : "Unknown Time"}
              </p>
            </div>
          </Link>
        );
      })}
    </div>
  );
};

const formatDuration = (duration) => {
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
