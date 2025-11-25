import React, { useEffect, useState } from 'react'
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
  const { addToHistory, subscribeToChannel, isSubscribed } = useApp();

  useEffect(() => {
    const loadVideoData = async () => {
      if (!videoId) return;
      
      setLoading(true);
      setError(null);
      
      try {
        const [video, commentsData] = await Promise.all([
          fetchVideoDetails(videoId),
          fetchVideoComments(videoId)
        ]);

        if (video) {
          setVideoData(video);
          
          // Add to watch history
          addToHistory({
            id: videoId,
            title: video.snippet.title,
            thumbnail: video.snippet.thumbnails.medium.url,
            channelTitle: video.snippet.channelTitle,
            channelId: video.snippet.channelId,
          });

          // Fetch channel details
          if (video.snippet.channelId) {
            const channel = await fetchChannelDetails(video.snippet.channelId);
            setChannelData(channel);
          }
        }

        setComments(commentsData);
      } catch (err) {
        console.error('Error loading video:', err);
        setError('Failed to load video. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    loadVideoData();
  }, [videoId, addToHistory]);

  const handleLike = () => {
    setLiked(!liked);
    if (disliked) setDisliked(false);
  };

  const handleDislike = () => {
    setDisliked(!disliked);
    if (liked) setLiked(false);
  };

  const handleShare = async () => {
    if (navigator.share && videoData) {
      try {
        await navigator.share({
          title: videoData.snippet.title,
          text: videoData.snippet.description,
          url: window.location.href,
        });
      } catch (err) {
        // Fallback to copy
        navigator.clipboard.writeText(window.location.href);
        alert('Link copied to clipboard!');
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };

  const handleSubscribe = () => {
    if (channelData) {
      subscribeToChannel(channelData.id, {
        title: channelData.snippet.title,
        thumbnail: channelData.snippet.thumbnails.default.url,
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
        <p>{error || 'Video not found'}</p>
      </div>
    );
  }

  const isSubscribedToChannel = channelData ? isSubscribed(channelData.id) : false;

  return (
    <div className='play-video'>
      <div className="video-wrapper">
        <iframe
          width="100%"
          height="500"
          src={`https://www.youtube.com/embed/${videoId}?autoplay=1`}
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          referrerPolicy="strict-origin-when-cross-origin"
          allowFullScreen
          title={videoData.snippet.title}
        ></iframe>
      </div>
      
      <h3>{videoData.snippet.title}</h3>
      
      <div className="play-video-info">
        <p>
          {value_converter(videoData.statistics?.viewCount || 0)} views &bull;{" "}
          {videoData.snippet?.publishedAt 
            ? moment(videoData.snippet.publishedAt).fromNow() 
            : "Unknown Time"}
        </p>
        <div className="video-actions">
          <span 
            className={liked ? 'active' : ''} 
            onClick={handleLike}
          >
            <img src={like} alt="Like" />
            {value_converter(videoData.statistics?.likeCount || 0)}
          </span>
          <span 
            className={disliked ? 'active' : ''} 
            onClick={handleDislike}
          >
            <img src={dislike} alt="Dislike" />
          </span>
          <span onClick={handleShare}>
            <img src={share} alt="Share" />
            Share
          </span>
          <span 
            className={saved ? 'active' : ''} 
            onClick={() => setSaved(!saved)}
          >
            <img src={save} alt="Save" />
            Save
          </span>
        </div>
      </div>
      
      <hr />
      
      <div className="publisher">
        {channelData && (
          <>
            <img 
              src={channelData.snippet.thumbnails.default.url} 
              alt={channelData.snippet.title} 
            />
            <div>
              <p>{channelData.snippet.title}</p>
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
        )}
      </div>

      <div className='vid-description'>
        <p>{videoData.snippet.description || 'No description available.'}</p>
        <hr />
        <h4>{comments.length} Comments</h4>
        <div className="comments-section">
          {comments.length > 0 ? (
            comments.map((commentItem, index) => {
              const comment = commentItem.snippet?.topLevelComment?.snippet;
              if (!comment) return null;
              
              return (
                <div key={commentItem.id || index} className="comment">
                  <img 
                    src={comment.authorProfileImageUrl || user_profile} 
                    alt={comment.authorDisplayName} 
                  />
                  <div className="comment-content">
                    <h3>
                      {comment.authorDisplayName}{" "}
                      <span>{moment(comment.publishedAt).fromNow()}</span>
                    </h3>
                    <p>{comment.textDisplay}</p>
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
