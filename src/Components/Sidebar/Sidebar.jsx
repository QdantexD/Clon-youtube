import React from 'react'
import "./Sidebar.css"
import home from '../../assets/home.png'
import game_icon from '../../assets/game_icon.png'
import automobiles from '../../assets/automobiles.png'
import sport from '../../assets/sports.png'
import entertainment from '../../assets/entertainment.png'
import tech from '../../assets/tech.png'
import music from '../../assets/music.png'
import blogs from '../../assets/blogs.png'
import news from '../../assets/news.png'
import history from '../../assets/history.png'
import library from '../../assets/library.png'
import subscription from '../../assets/subscriprion.png'
import { useNavigate } from 'react-router-dom'
import { useApp } from '../../context/AppContext'

const Sidebar = ({ sidebar, category, setCategory }) => {
  const navigate = useNavigate();
  const { subscribedChannels, watchHistory } = useApp();

  const categories = [
    { id: 0, name: 'Home', icon: home },
    { id: 20, name: 'Gaming', icon: game_icon },
    { id: 2, name: 'Automobiles', icon: automobiles },
    { id: 17, name: 'Sport', icon: sport },
    { id: 24, name: 'Entertainment', icon: entertainment },
    { id: 28, name: 'Tech', icon: tech },
    { id: 10, name: 'Music', icon: music },
    { id: 22, name: 'Blogs', icon: blogs },
    { id: 25, name: 'News', icon: news },
  ];

  const handleCategoryClick = (catId) => {
    setCategory(catId);
    navigate('/');
  };

  return (
    <div className={`sidebar ${sidebar ? "" : "small-sidebar"}`}>
      <div className="shortcut-links">
        {categories.map((cat) => (
          <div
            key={cat.id}
            className={`side-link ${category === cat.id ? "active" : ""}`}
            onClick={() => handleCategoryClick(cat.id)}
            title={cat.name}
          >
            <img src={cat.icon} alt={cat.name} />
            <p>{cat.name}</p>
          </div>
        ))}

        <hr />

        <div
          className="side-link"
          onClick={() => navigate('/library')}
          title="Library"
        >
          <img src={library} alt="Library" />
          <p>Library</p>
        </div>

        <div
          className="side-link"
          onClick={() => navigate('/history')}
          title="History"
        >
          <img src={history} alt="History" />
          <p>History</p>
          {watchHistory.length > 0 && (
            <span className="badge">{watchHistory.length}</span>
          )}
        </div>

        <hr />

        {subscribedChannels.length > 0 && (
          <div className="subscribed-section">
            <h3>Subscriptions</h3>
            {subscribedChannels.map((channel) => (
              <div key={channel.id} className="sidelink" title={channel.title}>
                <img src={channel.thumbnail} alt={channel.title} />
                <p>{channel.title}</p>
              </div>
            ))}
          </div>
        )}

        {subscribedChannels.length === 0 && (
          <div className="subscribed-section">
            <h3>Subscriptions</h3>
            <p className="no-subscriptions">No subscriptions yet</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Sidebar
