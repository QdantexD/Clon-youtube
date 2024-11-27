import React from 'react'
import "./Playvideo.css"
import like from "../../assets/like.png"
import dislike from "../../assets/dislike.png"
import share from "../../assets/share.png"
import save from "../../assets/save.png"
import jack from "../../assets/jack.png"
import user_profile from "../../assets/user_profile.jpg"

const Playvideo = ({ videoId }) => {

  const comments = [
    { user: "Jack Nicholson", date: "1 day ago", comment: "A global awdihaskljdfhfsjdfhlaskjdfhlkasdfhlsadhfsad", likes: 244 },
    { user: "John Doe", date: "2 days ago", comment: "This is an awesome tutorial!", likes: 320 },
    // Agrega más comentarios según sea necesario
  ];

  return (
    <div className='play-video'>
      <iframe
  width="1864"
  height="759"
  src={`https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1`}
  frameBorder="0"
  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
  referrerPolicy="strict-origin-when-cross-origin"
  allowFullScreen
></iframe>
      <h3>Best Channel To learn Web Development</h3>
      <div className="play-video-info">
        <p>1525 Views &bull; 2 days ago</p>
        <div>
          <span><img src={like} alt="Like" />125</span>
          <span><img src={dislike} alt="Dislike" />2</span>
          <span><img src={share} alt="Share" />share</span>
          <span><img src={save} alt="Save" />save</span>
        </div>
      </div>
      <hr />
      <div className="publisher">
        <img src={jack} alt="Publisher" />
        <div>
          <p>GreatStack</p>
          <span>1M Subscribers</span>
        </div>
        <button>Subscribe</button>
      </div>

      <div className='vid-description'>
        <p>Subscribe GreatStack to Watch more Tutorials on Web Development</p>
        <hr />
        <h4>{comments.length} Comments</h4>
        {comments.map((comment, index) => (
          <div key={index}>
            <div className="comment">
              <img src={user_profile} alt="User Profile" />
            </div>
            <h3>{comment.user} <span>{comment.date}</span></h3>
            <p>{comment.comment}</p>
            <div className="comment-action">
              <img src={like} alt="Like" />
              <span>{comment.likes}</span>
              <img src={dislike} alt="Dislike" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Playvideo;
