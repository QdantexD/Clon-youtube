import { API_KEY } from '../data';

const BASE_URL = 'https://youtube.googleapis.com/youtube/v3';

export const fetchVideos = async (categoryId = 0, maxResults = 50) => {
  try {
    const url = categoryId === 0
      ? `${BASE_URL}/videos?part=snippet,contentDetails,statistics&chart=mostPopular&maxResults=${maxResults}&regionCode=US&key=${API_KEY}`
      : `${BASE_URL}/videos?part=snippet,contentDetails,statistics&chart=mostPopular&maxResults=${maxResults}&regionCode=US&videoCategoryId=${categoryId}&key=${API_KEY}`;
    
    const response = await fetch(url);
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    const data = await response.json();
    return data.items || [];
  } catch (error) {
    console.error('Error fetching videos:', error);
    return [];
  }
};

export const fetchVideoDetails = async (videoId) => {
  try {
    const url = `${BASE_URL}/videos?part=snippet,contentDetails,statistics&id=${videoId}&key=${API_KEY}`;
    const response = await fetch(url);
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    const data = await response.json();
    return data.items?.[0] || null;
  } catch (error) {
    console.error('Error fetching video details:', error);
    return null;
  }
};

export const fetchChannelDetails = async (channelId) => {
  try {
    const url = `${BASE_URL}/channels?part=snippet,statistics&id=${channelId}&key=${API_KEY}`;
    const response = await fetch(url);
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    const data = await response.json();
    return data.items?.[0] || null;
  } catch (error) {
    console.error('Error fetching channel details:', error);
    return null;
  }
};

export const fetchVideoComments = async (videoId, maxResults = 20) => {
  try {
    const url = `${BASE_URL}/commentThreads?part=snippet&videoId=${videoId}&maxResults=${maxResults}&order=relevance&key=${API_KEY}`;
    const response = await fetch(url);
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    const data = await response.json();
    return data.items || [];
  } catch (error) {
    console.error('Error fetching comments:', error);
    return [];
  }
};

export const fetchRelatedVideos = async (videoId, maxResults = 20) => {
  try {
    const url = `${BASE_URL}/search?part=snippet&relatedToVideoId=${videoId}&type=video&maxResults=${maxResults}&key=${API_KEY}`;
    const response = await fetch(url);
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    const data = await response.json();
    
    // Get video details for each related video
    const videoIds = data.items?.map(item => item.id.videoId).join(',') || '';
    if (!videoIds) return [];
    
    const detailsUrl = `${BASE_URL}/videos?part=snippet,contentDetails,statistics&id=${videoIds}&key=${API_KEY}`;
    const detailsResponse = await fetch(detailsUrl);
    if (!detailsResponse.ok) throw new Error(`HTTP error! status: ${detailsResponse.status}`);
    const detailsData = await detailsResponse.json();
    return detailsData.items || [];
  } catch (error) {
    console.error('Error fetching related videos:', error);
    return [];
  }
};

export const searchVideos = async (query, maxResults = 50) => {
  try {
    const url = `${BASE_URL}/search?part=snippet&q=${encodeURIComponent(query)}&type=video&maxResults=${maxResults}&key=${API_KEY}`;
    const response = await fetch(url);
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    const data = await response.json();
    
    // Get video details for search results
    const videoIds = data.items?.map(item => item.id.videoId).join(',') || '';
    if (!videoIds) return [];
    
    const detailsUrl = `${BASE_URL}/videos?part=snippet,contentDetails,statistics&id=${videoIds}&key=${API_KEY}`;
    const detailsResponse = await fetch(detailsUrl);
    if (!detailsResponse.ok) throw new Error(`HTTP error! status: ${detailsResponse.status}`);
    const detailsData = await detailsResponse.json();
    return detailsData.items || [];
  } catch (error) {
    console.error('Error searching videos:', error);
    return [];
  }
};

