
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
    if (req.method === 'OPTIONS') {
        return new Response('ok', { headers: corsHeaders })
    }

    try {
        const { url } = await req.json()

        if (!url) {
            return new Response(JSON.stringify({ error: 'URL is required' }), {
                status: 400,
                headers: { ...corsHeaders, 'Content-Type': 'application/json' }
            })
        }

        // Extract playlist ID from URL
        const playlistIdMatch = url.match(/[?&]list=([^&]+)/)
        if (!playlistIdMatch) {
            return new Response(JSON.stringify({ error: 'Invalid playlist URL' }), {
                status: 400,
                headers: { ...corsHeaders, 'Content-Type': 'application/json' }
            })
        }

        const playlistId = playlistIdMatch[1]

        // Fetch the playlist page
        const response = await fetch(`https://www.youtube.com/playlist?list=${playlistId}`, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
            }
        })

        if (!response.ok) {
            return new Response(JSON.stringify({ error: 'Failed to fetch playlist' }), {
                status: 500,
                headers: { ...corsHeaders, 'Content-Type': 'application/json' }
            })
        }

        const html = await response.text()

        // Extract video data using regex
        let data: any = null
        const patterns = [
            /var ytInitialData = ({.+?});/,
            /window\["ytInitialData"\] = ({.+?});/,
            /ytInitialData = ({.+?});/
        ]

        for (const pattern of patterns) {
            const match = html.match(pattern)
            if (match) {
                try {
                    data = JSON.parse(match[1])
                    break
                } catch (e) {
                    continue
                }
            }
        }

        if (!data) {
            return new Response(JSON.stringify({ error: 'Could not parse playlist data' }), {
                status: 500,
                headers: { ...corsHeaders, 'Content-Type': 'application/json' }
            })
        }

        // Get playlist title
        const playlistTitle = data?.header?.playlistHeaderRenderer?.title?.simpleText ||
            data?.metadata?.playlistMetadataRenderer?.title

        // Navigate the YouTube data structure
        const contents = data?.contents?.twoColumnBrowseResultsRenderer?.tabs?.[0]?.tabRenderer?.content?.sectionListRenderer?.contents?.[0]?.itemSectionRenderer?.contents?.[0]?.playlistVideoListRenderer?.contents

        const videos: Array<{ title: string; link: string }> = []
        if (contents) {
            for (const item of contents) {
                const videoRenderer = item?.playlistVideoRenderer
                const title = videoRenderer?.title?.runs?.[0]?.text
                const videoId = videoRenderer?.videoId

                if (title && videoId) {
                    videos.push({
                        title,
                        link: `https://www.youtube.com/watch?v=${videoId}`
                    })
                }
            }
        }

        return new Response(JSON.stringify({ tasks: videos, playlistTitle }), {
            status: 200,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        })

    } catch (error) {
        return new Response(JSON.stringify({ error: error.message }), {
            status: 500,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        })
    }
})
