import React, { useState, useRef, useEffect } from 'react'
import './Navbar.css'
import menu_icon from '../../assets/menu.png'
import logo from '../../assets/logo.png'
import search_icon from '../../assets/search.png'
import upload_icon from '../../assets/upload.png'
import more_icon from '../../assets/more.png'
import notification_icon from '../../assets/notification.png'
import profile_icon from '../../assets/user_profile.jpg'
import voice_search_icon from '../../assets/voice-search.png'
import { useNavigate } from 'react-router-dom'
import { useApp } from '../../context/AppContext'

const Navbar = ({ setSidebar }) => {
  const [searchInput, setSearchInput] = useState('');
  const [showVoiceSearch, setShowVoiceSearch] = useState(false);
  const searchInputRef = useRef(null);
  const navigate = useNavigate();
  const { setSearchQuery, darkMode, toggleDarkMode } = useApp();

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchInput.trim()) {
      setSearchQuery(searchInput.trim());
      navigate(`/search?q=${encodeURIComponent(searchInput.trim())}`);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch(e);
    }
  };

  return (
    <nav className='flex-div navbar'>
      <div className='nav-left flex-div'>
        <img 
          className='menu-icon' 
          onClick={() => setSidebar(prev => !prev)}
          src={menu_icon} 
          alt="Menu"
        />
        <img 
          className='logo' 
          src={logo} 
          alt="Logo"
          onClick={() => navigate('/')}
          style={{ cursor: 'pointer' }}
        />
      </div>

      <div className='nav-middle flex-div'>
        <form className="search-box flex-div" onSubmit={handleSearch}>
          <input 
            type="text" 
            placeholder='Search' 
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            onKeyPress={handleKeyPress}
            ref={searchInputRef}
          />
          <img 
            src={search_icon} 
            alt="Search" 
            onClick={handleSearch}
            className="search-icon"
          />
        </form>
        <div className="voice-search-container">
          <img 
            src={voice_search_icon} 
            alt="Voice Search" 
            className="voice-search-icon"
            title="Voice Search"
          />
        </div>
      </div>

      <div className='nav-right flex-div'>
        <button 
          className="theme-toggle"
          onClick={toggleDarkMode}
          title={darkMode ? 'Light Mode' : 'Dark Mode'}
        >
          {darkMode ? '☀️' : '🌙'}
        </button>
        <img src={upload_icon} alt="Upload" className="nav-icon" title="Upload" />
        <img src={more_icon} alt="More" className="nav-icon" title="More" />
        <img src={notification_icon} alt="Notifications" className="nav-icon" title="Notifications" />
        <img src={profile_icon} className='user-icon' alt="User Profile" title="Profile" />
      </div>
    </nav>
  );
};

export default Navbar
