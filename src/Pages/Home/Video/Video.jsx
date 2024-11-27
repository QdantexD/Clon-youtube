import React from 'react'
import './Video.css'
import Playvideo from '../../../Components/PlayVideo/Playvideo'
import Recommend from '../../../Components/Recommend/Recommend'
import { useParams } from 'react-router-dom'

const Video = () => {

  const {video,categoryId} = useParams();

  return (
    <div className='play-container'>
      <Playvideo videoId={videoId} />
      <Recommend/>
    </div>
  )
}

export default Video