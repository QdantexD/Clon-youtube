import { API_KEY } from '../data';

const BASE_URL = 'https://youtube.googleapis.com/youtube/v3';

// Helper function to log API errors for debugging
const handleApiError = (error, context) => {
  console.error(`Error in ${context}:`, error);
  if (error.message) {
    console.error('Error message:', error.message);
  }
  return error;
};

export const fetchVideos = async (categoryId = 0, maxResults = 50) => {
  try {
    const url = categoryId === 0
      ? `${BASE_URL}/videos?part=snippet,contentDetails,statistics&chart=mostPopular&maxResults=${maxResults}&regionCode=US&key=${API_KEY}`
      : `${BASE_URL}/videos?part=snippet,contentDetails,statistics&chart=mostPopular&maxResults=${maxResults}&regionCode=US&videoCategoryId=${categoryId}&key=${API_KEY}`;
    
    console.log('Fetching videos from:', url.replace(API_KEY, 'API_KEY_HIDDEN'));
    const response = await fetch(url);
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const errorMessage = errorData.error?.message || `HTTP error! status: ${response.status}`;
      console.error('API Error:', errorMessage, errorData);
      throw new Error(errorMessage);
    }
    
    const data = await response.json();
    console.log(`Fetched ${data.items?.length || 0} videos`);
    
    // Ensure each item has a valid id
    const videos = (data.items || []).map(item => {
      if (!item.id) {
        console.warn('Video item missing ID:', item);
        return null;
      }
      return item;
    }).filter(Boolean);
    
    return videos;
  } catch (error) {
    handleApiError(error, 'fetchVideos');
    return [];
  }
};

export const fetchVideoDetails = async (videoId) => {
  try {
    // Validate videoId
    if (!videoId || typeof videoId !== 'string' || videoId.trim() === '') {
      throw new Error('Invalid video ID provided');
    }
    
    const cleanVideoId = videoId.trim();
    const url = `${BASE_URL}/videos?part=snippet,contentDetails,statistics&id=${cleanVideoId}&key=${API_KEY}`;
    console.log('Fetching video details for:', cleanVideoId);
    
    const response = await fetch(url);
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const errorMessage = errorData.error?.message || `HTTP error! status: ${response.status}`;
      console.error('API Error fetching video details:', errorMessage, errorData);
      
      // Provide user-friendly error messages
      if (response.status === 403) {
        throw new Error('API quota exceeded or access denied. Please check your API key.');
      } else if (response.status === 404) {
        throw new Error('Video not found. It may have been removed or is private.');
      } else if (response.status === 400) {
        throw new Error('Invalid video ID. Please try a different video.');
      }
      
      throw new Error(errorMessage);
    }
    
    const data = await response.json();
    
    if (!data.items || data.items.length === 0) {
      console.warn('No video found for ID:', cleanVideoId);
      return null;
    }
    
    const video = data.items[0];
    
    // Validate video has required data
    if (!video.snippet) {
      console.warn('Video missing snippet data:', video);
      return null;
    }
    
    console.log('Video details fetched successfully:', video.snippet.title);
    return video;
  } catch (error) {
    handleApiError(error, 'fetchVideoDetails');
    throw error;
  }
};

export const fetchChannelDetails = async (channelId) => {
  try {
    if (!channelId) {
      return null;
    }
    
    const url = `${BASE_URL}/channels?part=snippet,statistics&id=${channelId}&key=${API_KEY}`;
    const response = await fetch(url);
    if (!response.ok) {
      console.warn(`Error fetching channel ${channelId}:`, response.status);
      return null;
    }
    const data = await response.json();
    return data.items?.[0] || null;
  } catch (error) {
    console.warn('Error fetching channel details:', error);
    return null;
  }
};

export const fetchVideoComments = async (videoId, maxResults = 20) => {
  try {
    const url = `${BASE_URL}/commentThreads?part=snippet&videoId=${videoId}&maxResults=${maxResults}&order=relevance&key=${API_KEY}`;
    const response = await fetch(url);
    if (!response.ok) {
      // Some videos may have comments disabled
      if (response.status === 403 || response.status === 404) {
        console.warn('Comments may be disabled for this video');
        return [];
      }
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data.items || [];
  } catch (error) {
    console.warn('Error fetching comments:', error);
    return [];
  }
};

export const fetchRelatedVideos = async (videoId, maxResults = 20) => {
  try {
    if (!videoId) {
      console.warn('No videoId provided for related videos');
      return [];
    }
    
    console.log('Fetching related videos for:', videoId);
    const url = `${BASE_URL}/search?part=snippet&relatedToVideoId=${videoId}&type=video&maxResults=${maxResults}&key=${API_KEY}`;
    const response = await fetch(url);
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.warn('Error fetching related videos:', response.status, errorData);
      // Fallback to popular videos if related videos fail
      return await fetchVideos(0, maxResults);
    }
    
    const data = await response.json();
    console.log('Related videos search returned:', data.items?.length || 0, 'items');
    
    if (!data.items || data.items.length === 0) {
      console.warn('No related videos found, fetching popular videos instead');
      return await fetchVideos(0, maxResults);
    }
    
    // Get video details for each related video
    const videoIds = data.items
      .map(item => item.id?.videoId)
      .filter(Boolean)
      .join(',');
      
    if (!videoIds) {
      console.warn('No video IDs extracted from related videos');
      return await fetchVideos(0, maxResults);
    }
    
    console.log('Fetching details for', videoIds.split(',').length, 'related videos');
    const detailsUrl = `${BASE_URL}/videos?part=snippet,contentDetails,statistics&id=${videoIds}&key=${API_KEY}`;
    const detailsResponse = await fetch(detailsUrl);
    
    if (!detailsResponse.ok) {
      console.warn('Error fetching related video details:', detailsResponse.status);
      return await fetchVideos(0, maxResults);
    }
    
    const detailsData = await detailsResponse.json();
    console.log('Related video details fetched:', detailsData.items?.length || 0, 'videos');
    return detailsData.items || [];
  } catch (error) {
    console.error('Error fetching related videos:', error);
    // Fallback to popular videos on error
    try {
      return await fetchVideos(0, maxResults);
    } catch (fallbackError) {
      console.error('Fallback also failed:', fallbackError);
      return [];
    }
  }
};

export const searchVideos = async (query, maxResults = 50) => {
  try {
    if (!query || query.trim() === '') {
      return [];
    }
    
    const url = `${BASE_URL}/search?part=snippet&q=${encodeURIComponent(query)}&type=video&maxResults=${maxResults}&key=${API_KEY}`;
    console.log('Searching for:', query);
    
    const response = await fetch(url);
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('Search API Error:', errorData);
      throw new Error(errorData.error?.message || `HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    
    // Get video details for search results
    const videoIds = data.items?.map(item => item.id?.videoId).filter(Boolean).join(',') || '';
    if (!videoIds) {
      console.warn('No video IDs found in search results');
      return [];
    }
    
    const detailsUrl = `${BASE_URL}/videos?part=snippet,contentDetails,statistics&id=${videoIds}&key=${API_KEY}`;
    const detailsResponse = await fetch(detailsUrl);
    if (!detailsResponse.ok) {
      throw new Error(`HTTP error! status: ${detailsResponse.status}`);
    }
    const detailsData = await detailsResponse.json();
    
    console.log(`Search returned ${detailsData.items?.length || 0} videos`);
    return detailsData.items || [];
  } catch (error) {
    handleApiError(error, 'searchVideos');
    return [];
  }
};
