import React, { useEffect } from 'react'
import './Video.css'
import Sidebar from '../../../Components/Sidebar/Sidebar'
import Playvideo from '../../../Components/PlayVideo/Playvideo'
import Recommend from '../../../Components/Recommend/Recommend'
import { useParams, useNavigate } from 'react-router-dom'

const Video = ({ sidebar }) => {
  const { videoId, categoryId } = useParams();
  const navigate = useNavigate();

  // Scroll to top when video changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [videoId]);

  const handleCategoryChange = (catId) => {
    navigate('/');
  };

  // Validate videoId
  if (!videoId || videoId.trim() === '') {
    return (
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <p>Invalid video ID. Please select a video from the feed.</p>
        <button onClick={() => navigate('/')} style={{ marginTop: '10px', padding: '8px 16px' }}>
          Go to Home
        </button>
      </div>
    );
  }

  return (
    <>
      <Sidebar sidebar={sidebar} category={parseInt(categoryId) || 0} setCategory={handleCategoryChange} />
      <div className={`play-container ${sidebar ? '' : 'large-container'}`}>
        <Playvideo videoId={videoId} categoryId={categoryId} />
        <Recommend categoryId={categoryId} currentVideoId={videoId} />
      </div>
    </>
  )
}

export default Video
