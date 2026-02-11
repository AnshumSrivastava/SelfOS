import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ request }) => {
    try {
        const { url } = await request.json();

        if (!url) {
            return new Response(JSON.stringify({ error: 'URL is required' }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        // Extract playlist ID from URL
        const playlistIdMatch = url.match(/[?&]list=([^&]+)/);
        if (!playlistIdMatch) {
            return new Response(JSON.stringify({ error: 'Invalid playlist URL' }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        const playlistId = playlistIdMatch[1];

        // Fetch the playlist page from server-side (no CORS issues)
        const response = await fetch(`https://www.youtube.com/playlist?list=${playlistId}`, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
            }
        });

        if (!response.ok) {
            return new Response(JSON.stringify({ error: 'Failed to fetch playlist' }), {
                status: 500,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        const html = await response.text();

        // Extract video data using regex
        const scriptMatch = html.match(/var ytInitialData = ({.+?});/);
        if (!scriptMatch) {
            return new Response(JSON.stringify({ error: 'Could not parse playlist data' }), {
                status: 500,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        const data = JSON.parse(scriptMatch[1]);

        // Navigate the YouTube data structure to find videos
        const contents = data?.contents?.twoColumnBrowseResultsRenderer?.tabs?.[0]?.tabRenderer?.content?.sectionListRenderer?.contents?.[0]?.itemSectionRenderer?.contents?.[0]?.playlistVideoListRenderer?.contents;

        if (!contents) {
            return new Response(JSON.stringify({ error: 'Could not find videos in playlist' }), {
                status: 500,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        const videos: Array<{ title: string; url: string }> = [];
        for (const item of contents) {
            const videoRenderer = item?.playlistVideoRenderer;
            const title = videoRenderer?.title?.runs?.[0]?.text;
            const videoId = videoRenderer?.videoId;

            if (title && videoId) {
                videos.push({
                    title,
                    url: `https://www.youtube.com/watch?v=${videoId}`
                });
            }
        }

        return new Response(JSON.stringify({ videos }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
        });

    } catch (error) {
        console.error('YouTube playlist parsing error:', error);
        return new Response(JSON.stringify({ error: 'Internal server error' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
};
