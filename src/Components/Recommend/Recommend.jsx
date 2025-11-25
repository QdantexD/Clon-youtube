import React, { useEffect, useState } from "react"
import "./Recommend.css"
import { Link } from "react-router-dom"
import { fetchRelatedVideos, fetchVideos } from "../../services/youtubeApi"
import { value_converter } from "../../data"
import moment from 'moment'

const Recommend = ({ categoryId, currentVideoId }) => {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadRecommendedVideos = async () => {
      setLoading(true);
      setVideos([]);
      
      try {
        let recommended = [];
        
        if (currentVideoId) {
          console.log('Loading related videos for:', currentVideoId);
          // Fetch related videos
          recommended = await fetchRelatedVideos(currentVideoId, 20);
          console.log('Related videos received:', recommended.length);
        } else if (categoryId) {
          console.log('Loading videos for category:', categoryId);
          // Fetch videos from same category
          recommended = await fetchVideos(parseInt(categoryId) || 0, 20);
          console.log('Category videos received:', recommended.length);
        } else {
          console.log('Loading popular videos');
          // Fetch popular videos
          recommended = await fetchVideos(0, 20);
          console.log('Popular videos received:', recommended.length);
        }
        
        if (recommended && recommended.length > 0) {
          // Filter out current video - handle both string ID and object ID
          const filtered = recommended.filter(video => {
            const vidId = typeof video.id === 'string' ? video.id : (video.id?.videoId || video.id);
            return vidId && vidId !== currentVideoId;
          });
          
          console.log('Filtered videos (after removing current):', filtered.length);
          setVideos(filtered.slice(0, 12));
        } else {
          console.warn('No recommended videos found');
          setVideos([]);
        }
      } catch (error) {
        console.error('Error loading recommended videos:', error);
        setVideos([]);
      } finally {
        setLoading(false);
      }
    };

    loadRecommendedVideos();
  }, [currentVideoId, categoryId]);

  if (loading) {
    return (
      <div className="recommended">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="side-video-list skeleton">
            <div className="skeleton-thumbnail-small"></div>
            <div className="skeleton-info-small">
              <div className="skeleton-line-small"></div>
              <div className="skeleton-line-small short"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (videos.length === 0 && !loading) {
    return (
      <div className="recommended">
        <h3 className="recommended-title">Up next</h3>
        <p className="no-recommendations">No recommendations available. Try refreshing the page.</p>
      </div>
    );
  }

  // Helper function to extract video ID
  const getVideoId = (video) => {
    if (typeof video.id === 'string') {
      return video.id;
    }
    if (video.id && video.id.videoId) {
      return video.id.videoId;
    }
    return null;
  };

  return (
    <div className="recommended">
      <h3 className="recommended-title">Up next</h3>
      {videos.map((video, index) => {
        if (!video.snippet || !video.snippet.thumbnails) {
          return null;
        }
        
        const videoId = getVideoId(video);
        if (!videoId) {
          return null;
        }
        
        const videoCategoryId = video.snippet?.categoryId || categoryId || 0;
        
        return (
          <Link
            key={videoId || index}
            to={`/video/${videoCategoryId}/${videoId}`}
            className="side-video-list"
          >
            <div className="recommended-thumbnail">
              <img
                src={video.snippet.thumbnails.medium?.url || video.snippet.thumbnails.default?.url}
                alt={video.snippet.title}
                loading="lazy"
              />
              {video.contentDetails?.duration && (
                <span className="video-duration-small">
                  {formatDuration(video.contentDetails.duration)}
                </span>
              )}
            </div>
            <div className="vid-info">
              <h4>{video.snippet.title || "No Title"}</h4>
              <p className="channel-name">{video.snippet.channelTitle || "Unknown Channel"}</p>
              <p className="video-stats">
                {value_converter(video.statistics?.viewCount || 0)} views &bull;{" "}
                {video.snippet?.publishedAt 
                  ? moment(video.snippet.publishedAt).fromNow() 
                  : "Unknown"}
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

export default Recommend
