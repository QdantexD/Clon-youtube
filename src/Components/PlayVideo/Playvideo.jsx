import React, { useEffect, useState, useRef } from 'react'
import "./Playvideo.css"
import like from "../../assets/like.png"
import dislike from "../../assets/dislike.png"
import share from "../../assets/share.png"
import save from "../../assets/save.png"
import user_profile from "../../assets/user_profile.jpg"
import { fetchVideoDetails, fetchVideoComments, fetchChannelDetails } from '../../services/youtubeApi'
import { value_converter } from '../../data'
import moment from 'moment'
import { useApp } from '../../context/AppContext'

const Playvideo = ({ videoId, categoryId }) => {
  const [videoData, setVideoData] = useState(null);
  const [channelData, setChannelData] = useState(null);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [liked, setLiked] = useState(false);
  const [disliked, setDisliked] = useState(false);
  const [saved, setSaved] = useState(false);
  const iframeRef = useRef(null);
  const { addToHistory, subscribeToChannel, isSubscribed } = useApp();

  useEffect(() => {
    const loadVideoData = async () => {
      // Validate videoId
      if (!videoId || typeof videoId !== 'string' || videoId.trim() === '') {
        setError('Invalid video ID provided');
        setLoading(false);
        return;
      }
      
      const cleanVideoId = videoId.trim();
      console.log('Loading video data for ID:', cleanVideoId);
      
      setLoading(true);
      setError(null);
      setVideoData(null);
      setChannelData(null);
      setComments([]);
      setLiked(false);
      setDisliked(false);
      setSaved(false);
      
      try {
        // Fetch video details first
        const video = await fetchVideoDetails(cleanVideoId);
        
        if (!video) {
          setError('Video not found. The video may have been removed, is private, or is unavailable.');
          setLoading(false);
          return;
        }

        // Validate video data
        if (!video.snippet) {
          setError('Video data is incomplete. Please try again.');
          setLoading(false);
          return;
        }

        setVideoData(video);
        console.log('Video data loaded successfully:', video.snippet.title);
        
        // Add to watch history
        addToHistory({
          id: cleanVideoId,
          title: video.snippet.title,
          thumbnail: video.snippet.thumbnails?.medium?.url || video.snippet.thumbnails?.default?.url || '',
          channelTitle: video.snippet.channelTitle || 'Unknown',
          channelId: video.snippet.channelId || '',
        });

        // Fetch channel details and comments in parallel
        const promises = [];
        
        if (video.snippet.channelId) {
          promises.push(fetchChannelDetails(video.snippet.channelId));
        } else {
          promises.push(Promise.resolve(null));
        }
        
        promises.push(fetchVideoComments(cleanVideoId));
        
        const [channel, commentsData] = await Promise.all(promises);
        
        if (channel) {
          setChannelData(channel);
          console.log('Channel data loaded:', channel.snippet?.title);
        }
        
        setComments(commentsData || []);
        console.log('Comments loaded:', commentsData?.length || 0);
      } catch (err) {
        console.error('Error loading video:', err);
        setError(err.message || 'Failed to load video. Please check your API key and internet connection, then try again.');
      } finally {
        setLoading(false);
      }
    };

    loadVideoData();
  }, [videoId, addToHistory]);

  // Reset iframe when videoId changes
  useEffect(() => {
    if (iframeRef.current && videoId) {
      // Force iframe reload
      const iframe = iframeRef.current;
      const src = iframe.src;
      iframe.src = '';
      setTimeout(() => {
        iframe.src = src;
      }, 100);
    }
  }, [videoId]);

  const handleLike = () => {
    setLiked(!liked);
    if (disliked) setDisliked(false);
  };

  const handleDislike = () => {
    setDisliked(!disliked);
    if (liked) setLiked(false);
  };

  const handleShare = async () => {
    if (!videoData) return;
    
    const shareData = {
      title: videoData.snippet.title,
      text: videoData.snippet.description || videoData.snippet.title,
      url: window.location.href,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        // User cancelled or error occurred
        if (err.name !== 'AbortError') {
          // Fallback to copy
          try {
            await navigator.clipboard.writeText(window.location.href);
            alert('Link copied to clipboard!');
          } catch (clipboardErr) {
            console.error('Failed to copy to clipboard:', clipboardErr);
          }
        }
      }
    } else {
      // Fallback for browsers without Web Share API
      try {
        await navigator.clipboard.writeText(window.location.href);
        alert('Link copied to clipboard!');
      } catch (err) {
        console.error('Failed to copy to clipboard:', err);
        // Last resort: show the URL
        prompt('Copy this link:', window.location.href);
      }
    }
  };

  const handleSubscribe = () => {
    if (channelData && channelData.id) {
      subscribeToChannel(channelData.id, {
        title: channelData.snippet?.title || 'Unknown Channel',
        thumbnail: channelData.snippet?.thumbnails?.default?.url || '',
      });
    }
  };

  if (loading) {
    return (
      <div className="play-video-loading">
        <div className="loading-video"></div>
        <div className="loading-info">
          <div className="loading-title"></div>
          <div className="loading-stats"></div>
        </div>
      </div>
    );
  }

  if (error || !videoData) {
    return (
      <div className="play-video-error">
        <h3>Unable to load video</h3>
        <p>{error || 'Video not found'}</p>
        <div style={{ marginTop: '20px', display: 'flex', gap: '10px', justifyContent: 'center' }}>
          <button 
            onClick={() => window.location.reload()} 
            style={{ padding: '10px 20px', cursor: 'pointer' }}
          >
            Reload Page
          </button>
          <button 
            onClick={() => window.history.back()} 
            style={{ padding: '10px 20px', cursor: 'pointer' }}
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  const isSubscribedToChannel = channelData ? isSubscribed(channelData.id) : false;
  const videoTitle = videoData.snippet?.title || 'No Title';
  const videoDescription = videoData.snippet?.description || 'No description available.';
  const viewCount = value_converter(videoData.statistics?.viewCount || 0);
  const likeCount = value_converter(videoData.statistics?.likeCount || 0);
  const publishedAt = videoData.snippet?.publishedAt 
    ? moment(videoData.snippet.publishedAt).fromNow() 
    : "Unknown Time";

  return (
    <div className='play-video'>
      {videoId && (
        <div className="video-wrapper">
          <iframe
            ref={iframeRef}
            key={videoId}
            src={`https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1&playsinline=1&enablejsapi=1`}
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
            title={videoTitle}
            loading="eager"
          ></iframe>
        </div>
      )}
      
      <h3>{videoTitle}</h3>
      
      <div className="play-video-info">
        <p>
          {viewCount} views &bull; {publishedAt}
        </p>
        <div className="video-actions">
          <span 
            className={liked ? 'active' : ''} 
            onClick={handleLike}
            title="Like this video"
          >
            <img src={like} alt="Like" />
            {likeCount}
          </span>
          <span 
            className={disliked ? 'active' : ''} 
            onClick={handleDislike}
            title="Dislike this video"
          >
            <img src={dislike} alt="Dislike" />
          </span>
          <span onClick={handleShare} title="Share this video">
            <img src={share} alt="Share" />
            Share
          </span>
          <span 
            className={saved ? 'active' : ''} 
            onClick={() => setSaved(!saved)}
            title="Save this video"
          >
            <img src={save} alt="Save" />
            Save
          </span>
        </div>
      </div>
      
      <hr />
      
      <div className="publisher">
        {channelData && channelData.snippet ? (
          <>
            <img 
              src={channelData.snippet.thumbnails?.default?.url || user_profile} 
              alt={channelData.snippet.title || 'Channel'} 
              onError={(e) => {
                e.target.src = user_profile;
              }}
            />
            <div>
              <p>{channelData.snippet.title || 'Unknown Channel'}</p>
              <span>
                {value_converter(channelData.statistics?.subscriberCount || 0)} Subscribers
              </span>
            </div>
            <button 
              className={isSubscribedToChannel ? 'subscribed' : ''}
              onClick={handleSubscribe}
            >
              {isSubscribedToChannel ? 'Subscribed' : 'Subscribe'}
            </button>
          </>
        ) : videoData.snippet ? (
          <div>
            <p>{videoData.snippet.channelTitle || 'Unknown Channel'}</p>
            <span>Channel information unavailable</span>
          </div>
        ) : null}
      </div>

      <div className='vid-description'>
        <p style={{ whiteSpace: 'pre-wrap', wordWrap: 'break-word' }}>
          {videoDescription}
        </p>
        <hr />
        <h4>{comments.length} Comments</h4>
        <div className="comments-section">
          {comments.length > 0 ? (
            comments.map((commentItem, index) => {
              const comment = commentItem.snippet?.topLevelComment?.snippet;
              if (!comment) return null;
              
              return (
                <div key={commentItem.id || `comment-${index}`} className="comment">
                  <img 
                    src={comment.authorProfileImageUrl || user_profile} 
                    alt={comment.authorDisplayName || 'User'} 
                    onError={(e) => {
                      e.target.src = user_profile;
                    }}
                  />
                  <div className="comment-content">
                    <h3>
                      {comment.authorDisplayName || 'Anonymous'}{" "}
                      <span>{moment(comment.publishedAt).fromNow()}</span>
                    </h3>
                    <p style={{ wordWrap: 'break-word' }}>{comment.textDisplay || comment.textOriginal || ''}</p>
                    <div className="comment-action">
                      <img src={like} alt="Like" />
                      <span>{value_converter(comment.likeCount || 0)}</span>
                      <img src={dislike} alt="Dislike" />
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <p className="no-comments">No comments yet. Be the first to comment!</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Playvideo;
