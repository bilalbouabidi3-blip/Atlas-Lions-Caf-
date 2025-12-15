import { Match } from '../types';

const API_KEY = '003d8018c8647994c249d8b567db843b';
const BASE_URL = 'https://api.football-data.org/v4';

// Mock initial data - acting as our fallback "Backend"
let mockMatches: Match[] = [
  {
    id: 'm1',
    homeTeam: 'Morocco',
    awayTeam: 'Egypt',
    homeFlag: '🇲🇦',
    awayFlag: '🇪🇬',
    time: '45+2\'',
    date: 'Today',
    status: 'live',
    score: '1 - 0',
    isMorocco: true,
  },
  {
    id: 'm2',
    homeTeam: 'Senegal',
    awayTeam: 'Cameroon',
    homeFlag: '🇸🇳',
    awayFlag: '🇨🇲',
    time: '17:00',
    date: 'Today',
    status: 'finished',
    score: '2 - 2',
  },
  {
    id: 'm3',
    homeTeam: 'Nigeria',
    awayTeam: 'Ivory Coast',
    homeFlag: '🇳🇬',
    awayFlag: '🇨🇮',
    time: '21:00',
    date: 'Tomorrow',
    status: 'upcoming',
  },
  {
    id: 'm4',
    homeTeam: 'Algeria',
    awayTeam: 'Tunisia',
    homeFlag: '🇩🇿',
    awayFlag: '🇹🇳',
    time: '18:00',
    date: 'Tomorrow',
    status: 'upcoming',
  }
];

// Helper to simulate live updates for mock data
const updateMockLiveMatch = () => {
  const liveMatchIndex = mockMatches.findIndex(m => m.status === 'live');
  if (liveMatchIndex !== -1) {
    const match = mockMatches[liveMatchIndex];
    let minute = parseInt(match.time) || 45;
    if (minute < 90) minute += 1;
    
    mockMatches[liveMatchIndex] = {
      ...match,
      time: `${minute}'`
    };
  }
};

export const fetchMatches = async (): Promise<Match[]> => {
  try {
    // Attempt to fetch from real API
    // Note: This may be blocked by CORS on localhost without a proxy. 
    // The fallback catch block handles this gracefully.
    const response = await fetch(`${BASE_URL}/matches`, {
      headers: {
        'X-Auth-Token': API_KEY,
      },
    });

    if (!response.ok) {
      // If 403/429/500, throw to use fallback
      throw new Error(`API Error: ${response.status}`);
    }

    const data = await response.json();
    
    // Check if we actually have matches
    if (!data.matches || data.matches.length === 0) {
       console.log("No matches found in API today, using mock data.");
       updateMockLiveMatch();
       return [...mockMatches];
    }

    // Map API response to App Type
    const matches: Match[] = data.matches.map((m: any) => {
       const isLive = ['IN_PLAY', 'PAUSED'].includes(m.status);
       const isFinished = ['FINISHED', 'AWARDED'].includes(m.status);
       
       const dateObj = new Date(m.utcDate);
       const isToday = new Date().toDateString() === dateObj.toDateString();
       
       // Format time/date
       const time = isLive 
          ? `${m.minute || 0}'` 
          : dateObj.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
          
       const dateDisplay = isToday 
          ? 'Today' 
          : dateObj.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });

       // Map Status
       let status: Match['status'] = 'upcoming';
       if (isLive) status = 'live';
       if (isFinished) status = 'finished';

       return {
         id: m.id.toString(),
         homeTeam: m.homeTeam.shortName || m.homeTeam.name,
         awayTeam: m.awayTeam.shortName || m.awayTeam.name,
         homeFlag: m.homeTeam.crest, // Returns URL
         awayFlag: m.awayTeam.crest, // Returns URL
         time: time,
         date: dateDisplay,
         status: status,
         score: (isLive || isFinished) && m.score.fullTime.home !== null
            ? `${m.score.fullTime.home} - ${m.score.fullTime.away}` 
            : undefined,
         isMorocco: m.homeTeam.name.includes('Morocco') || m.awayTeam.name.includes('Morocco'),
       };
    });

    return matches;

  } catch (error) {
    console.warn("Using fallback match data (API unavailable or CORS restricted).");
    // Simulate latency and data updates for mock data
    await new Promise(resolve => setTimeout(resolve, 300));
    updateMockLiveMatch();
    return [...mockMatches];
  }
};