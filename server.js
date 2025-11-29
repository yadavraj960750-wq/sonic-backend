const express = require('express');
const cors = require('cors');
const ytdl = require('@distube/ytdl-core');
const ffmpeg = require('fluent-ffmpeg');
const ffmpegPath = require('ffmpeg-static');

const app = express();
// Render gives us a port automatically
const PORT = process.env.PORT || 4000;

app.use(cors({ origin: '*' }));
ffmpeg.setFfmpegPath(ffmpegPath);

app.get('/', (req, res) => res.send('SonicFlow Engine is Active!'));

app.get('/convert', async (req, res) => {
    let videoUrl = req.query.url;
    console.log(`Processing: ${videoUrl}`);

    try {
        // 1. Shorts Fix: Convert link format
        if (videoUrl.includes('/shorts/')) {
            const videoId = videoUrl.split('/shorts/')[1].split('?')[0];
            videoUrl = `https://www.youtube.com/watch?v=${videoId}`;
        }

        if (!ytdl.validateURL(videoUrl)) return res.status(400).send('Invalid URL');

        // 2. Fake Browser Headers (To prevent blocking)
        const agentOptions = {
            requestOptions: {
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
                }
            }
        };

        const info = await ytdl.getInfo(videoUrl, agentOptions);
        const title = info.videoDetails.title.replace(/[^\w\s-]/gi, '') || 'audio';

        res.header('Content-Disposition', `attachment; filename="${title}.mp3"`);
        res.header('Content-Type', 'audio/mpeg');

        // 3. Start Stream
        const stream = ytdl(videoUrl, { 
            quality: 'highestaudio', 
            filter: 'audioonly',
            ...agentOptions
        });

        ffmpeg(stream)
            .audioBitrate(req.query.quality || '128')
            .format('mp3')
            .on('error', (err) => console.log('Stream Error:', err.message))
            .pipe(res, { end: true });

    } catch (error) {
        console.error("Cloud Error:", error.message);
        res.status(500).send('Server Error');
    }
});

app.listen(PORT, () => console.log(`Cloud Engine running`));