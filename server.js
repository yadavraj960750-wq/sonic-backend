const express = require('express');
const cors = require('cors');
const ytdl = require('@distube/ytdl-core');
const ffmpeg = require('fluent-ffmpeg');
const ffmpegPath = require('ffmpeg-static');

const app = express();
const PORT = process.env.PORT || 4000;

// --- YOUR COOKIES (PASSPORT) ---
const cookies = [
  {
    "domain": ".youtube.com",
    "expirationDate": 1796711443.671171,
    "hostOnly": false,
    "httpOnly": false,
    "name": "__Secure-1PAPISID",
    "path": "/",
    "sameSite": "unspecified",
    "secure": true,
    "session": false,
    "storeId": "0",
    "value": "t8_5u018sWpnOqu7/ArrKRP92Mxh_CPfpT",
    "id": 1
  },
  {
    "domain": ".youtube.com",
    "expirationDate": 1796711443.671603,
    "hostOnly": false,
    "httpOnly": true,
    "name": "__Secure-1PSID",
    "path": "/",
    "sameSite": "unspecified",
    "secure": true,
    "session": false,
    "storeId": "0",
    "value": "g.a0003AgMVOy3mARk5ZhDiL5gJdBtDVlsz04bqv6c_7zeUBqSh5IIrDc3ev8GdsZwVktH5AW84AACgYKAX0SARYSFQHGX2MiE-0nEeyhgEIimp27dmB2NRoVAUF8yKptd55EKDHDBPUgP2zI_eWg0076",
    "id": 2
  },
  {
    "domain": ".youtube.com",
    "expirationDate": 1795945771.118,
    "hostOnly": false,
    "httpOnly": true,
    "name": "__Secure-1PSIDCC",
    "path": "/",
    "sameSite": "unspecified",
    "secure": true,
    "session": false,
    "storeId": "0",
    "value": "AKEyXzXw9aYp6jLgnbqAn2zdtvdYOa4Ei2_lAuRyeED7iyaecraC-pDkBY_-yUfoxoWlWAjIyA",
    "id": 3
  },
  {
    "domain": ".youtube.com",
    "expirationDate": 1793687443.669994,
    "hostOnly": false,
    "httpOnly": true,
    "name": "__Secure-1PSIDTS",
    "path": "/",
    "sameSite": "unspecified",
    "secure": true,
    "session": false,
    "storeId": "0",
    "value": "sidts-CjQBwQ9iI4Pod0CXGel5dzLFHKpDfBvAcHt3HHNxdpeA_EobSG0uMCqa3GXRoEzr_eYgj6phEAA",
    "id": 4
  },
  {
    "domain": ".youtube.com",
    "expirationDate": 1796711443.671357,
    "hostOnly": false,
    "httpOnly": false,
    "name": "__Secure-3PAPISID",
    "path": "/",
    "sameSite": "no_restriction",
    "secure": true,
    "session": false,
    "storeId": "0",
    "value": "t8_5u018sWpnOqu7/ArrKRP92Mxh_CPfpT",
    "id": 5
  },
  {
    "domain": ".youtube.com",
    "expirationDate": 1796711443.671688,
    "hostOnly": false,
    "httpOnly": true,
    "name": "__Secure-3PSID",
    "path": "/",
    "sameSite": "no_restriction",
    "secure": true,
    "session": false,
    "storeId": "0",
    "value": "g.a0003AgMVOy3mARk5ZhDiL5gJdBtDVlsz04bqv6c_7zeUBqSh5IIom9HTn43-wljeXE5SlWiMwACgYKAX0SARYSFQHGX2MizngPHB_j_CKXKjPy3xV18RoVAUF8yKrYl3MKfZweCnvqm9CAy7AM0076",
    "id": 6
  },
  {
    "domain": ".youtube.com",
    "expirationDate": 1795945771.118255,
    "hostOnly": false,
    "httpOnly": true,
    "name": "__Secure-3PSIDCC",
    "path": "/",
    "sameSite": "no_restriction",
    "secure": true,
    "session": false,
    "storeId": "0",
    "value": "AKEyXzWgioyjF1X2RGjZTGPWvslhEDaKyNRETXweyH9GjxOGRt1ZEpMxetJzWevs1MVa96dIWdE",
    "id": 7
  },
  {
    "domain": ".youtube.com",
    "expirationDate": 1793687443.670216,
    "hostOnly": false,
    "httpOnly": true,
    "name": "__Secure-3PSIDTS",
    "path": "/",
    "sameSite": "no_restriction",
    "secure": true,
    "session": false,
    "storeId": "0",
    "value": "sidts-CjQBwQ9iI4Pod0CXGel5dzLFHKpDfBvAcHt3HHNxdpeA_EobSG0uMCqa3GXRoEzr_eYgj6phEAA",
    "id": 8
  },
  {
    "domain": ".youtube.com",
    "expirationDate": 1796711443.67068,
    "hostOnly": false,
    "httpOnly": false,
    "name": "APISID",
    "path": "/",
    "sameSite": "unspecified",
    "secure": false,
    "session": false,
    "storeId": "0",
    "value": "-MNGDTqsY_jgQi2d/A_mHJigQZp7DsyHEH",
    "id": 9
  },
  {
    "domain": ".youtube.com",
    "expirationDate": 1796711443.670379,
    "hostOnly": false,
    "httpOnly": true,
    "name": "HSID",
    "path": "/",
    "sameSite": "unspecified",
    "secure": false,
    "session": false,
    "storeId": "0",
    "value": "A85a7DtA3dY808e6-",
    "id": 10
  },
  {
    "domain": ".youtube.com",
    "expirationDate": 1782400699.470009,
    "hostOnly": false,
    "httpOnly": true,
    "name": "LOGIN_INFO",
    "path": "/",
    "sameSite": "no_restriction",
    "secure": true,
    "session": false,
    "storeId": "0",
    "value": "AFmmF2swRAIgb40tH0sSfW2YsGAceG0-QfG2sugsrUfq85PxASDTR-cCIBtC_NOwyFRvx9kDV1oKPPahA1Wn8DIuYtrsqZ9GS7q3:QUQ3MjNmeHVhZ0lpVDRlSUJrUmZqYlRkRjdyM2ROZ1BVaHk5TEp4bUQ2WUI4Z3huWm4wVVc2Q1JlUFBqaDFLd0VhQm5uN0hDczdmZno1LVFKTkZRWExsRXgwUWM1d2RaZUowa2dIaU1ILVNUZE9nQkR2TlhiT0h5V1V5S2ZhbXVfd2RkV25pYThwb1hKbzhUOFc0QzRIRHN4a2ppRkd4eXVB",
    "id": 11
  },
  {
    "domain": ".youtube.com",
    "expirationDate": 1798969751.721734,
    "hostOnly": false,
    "httpOnly": false,
    "name": "PREF",
    "path": "/",
    "sameSite": "unspecified",
    "secure": true,
    "session": false,
    "storeId": "0",
    "value": "f4=4010000&tz=Asia.Calcutta&f7=150&f6=400",
    "id": 12
  },
  {
    "domain": ".youtube.com",
    "expirationDate": 1796711443.670877,
    "hostOnly": false,
    "httpOnly": false,
    "name": "SAPISID",
    "path": "/",
    "sameSite": "unspecified",
    "secure": true,
    "session": false,
    "storeId": "0",
    "value": "t8_5u018sWpnOqu7/ArrKRP92Mxh_CPfpT",
    "id": 13
  },
  {
    "domain": ".youtube.com",
    "expirationDate": 1796711443.671508,
    "hostOnly": false,
    "httpOnly": false,
    "name": "SID",
    "path": "/",
    "sameSite": "unspecified",
    "secure": false,
    "session": false,
    "storeId": "0",
    "value": "g.a0003AgMVOy3mARk5ZhDiL5gJdBtDVlsz04bqv6c_7zeUBqSh5IIiQufKkk6pODvp-CuciEeOwACgYKASQSARYSFQHGX2MiFc6rTCp4HKH8ZArnjWK8uhoVAUF8yKqGPuhPVZse0Q0ZOR17lTAM0076",
    "id": 14
  },
  {
    "domain": ".youtube.com",
    "expirationDate": 1795945771.117664,
    "hostOnly": false,
    "httpOnly": false,
    "name": "SIDCC",
    "path": "/",
    "sameSite": "unspecified",
    "secure": false,
    "session": false,
    "storeId": "0",
    "value": "AKEyXzUuH3zg4lasJfnkxZxsx2Pl65MNGr42AEA1n90wTGDpRdJBKBPDuVvBtFNsFxd0bm451A",
    "id": 15
  },
  {
    "domain": ".youtube.com",
    "expirationDate": 1796711443.670531,
    "hostOnly": false,
    "httpOnly": true,
    "name": "SSID",
    "path": "/",
    "sameSite": "unspecified",
    "secure": true,
    "session": false,
    "storeId": "0",
    "value": "Aybvvhe6yhQlFeC3x",
    "id": 16
  }
];

// Create the Agent using your cookies
const agent = ytdl.createAgent(cookies);

app.use(cors({ origin: '*' }));
ffmpeg.setFfmpegPath(ffmpegPath);

app.get('/', (req, res) => res.send('SonicFlow Cloud is Active with Cookies!'));

app.get('/convert', async (req, res) => {
    let videoUrl = req.query.url;
    console.log(`Processing: ${videoUrl}`);

    try {
        if (videoUrl.includes('/shorts/')) {
            const videoId = videoUrl.split('/shorts/')[1].split('?')[0];
            videoUrl = `https://www.youtube.com/watch?v=${videoId}`;
        }

        if (!ytdl.validateURL(videoUrl)) return res.status(400).send('Invalid URL');

        // Pass Agent to getInfo
        const info = await ytdl.getInfo(videoUrl, { agent });
        const title = info.videoDetails.title.replace(/[^\w\s-]/gi, '') || 'audio';

        res.header('Content-Disposition', `attachment; filename="${title}.mp3"`);
        res.header('Content-Type', 'audio/mpeg');

        // Pass Agent to download stream
        const stream = ytdl(videoUrl, { 
            quality: 'highestaudio', 
            filter: 'audioonly',
            agent 
        });

        ffmpeg(stream)
            .audioBitrate(req.query.quality || '128')
            .format('mp3')
            .on('error', (err) => console.log('Stream Error:', err.message))
            .pipe(res, { end: true });

    } catch (error) {
        console.error("Cloud Error:", error.message);
        res.status(500).send(`Cloud Error: ${error.message}`);
    }
});

app.listen(PORT, () => console.log(`Cloud Engine running`));