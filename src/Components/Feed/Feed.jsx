import React, { useEffect, useState } from "react";
import "./Feed.css";
import { Link } from "react-router-dom";
import { API_KEY, value_converter } from "../../data";
import moment from 'moment';
const Feed = ({ category }) => {
  const [data, setData] = useState([]);

  const fetchData = async () => {
    try {
      const videoList_url = `https://youtube.googleapis.com/youtube/v3/videos?part=snippet,contentDetails,statistics&chart=mostPopular&maxResults=50&regionCode=US&videoCategoryId=${category}&key=${API_KEY}`;
      const response = await fetch(videoList_url);
      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }
      const result = await response.json();
      if (result.items) {
        setData(result.items);
      } else {
        console.error("No items found in the API response.");
        setData([]);
      }
    } catch (error) {
      console.error("Fetch error:", error);
      setData([]);
    }
  };

  useEffect(() => {
    fetchData();
  }, [category]);

  return (
    <div className="feed">
      {data.map((items, index) => {
        if (!items.snippet || !items.snippet.thumbnails) {
          return null;
        }
        return (
          <Link key={index} to={`video/${items.id}`} className="card">
            <img
              src={items.snippet.thumbnails.medium.url}
              alt="Video Thumbnail"
            />
            <h2>{items.snippet.title || "No Title Available"}</h2>
            <h3>{items.snippet.channelTitle || "Unknown Channel"}</h3>
            <p>{value_converter(items.statistics?.viewCount || 0)} views &bull;{" "}  {items.snippet?.publishedAt ? moment(items.snippet.publishedAt).fromNow() : "Unknown Time"}</p>
          </Link>
        );
      })}
    </div>
  );
};

export default Feed;
