// ==UserScript==
// @name            TikTok Live Guest
// @name:de         TikTok Live Gast
// @version         1.0.1
// @description     View TikTok Live without Login as Guest
// @description:de  TikTok Live schauen ohne Login als Gast
// @icon            https://www.tiktok.com/favicon.ico
// @author          TalkLounge (https://github.com/TalkLounge)
// @namespace       https://github.com/TalkLounge/tiktok-live-guest
// @license         MIT
// @match           https://www.tiktok.com/*
// @require         https://xqq.im/mpegts.js/dist/mpegts.js
// @grant           none
// ==/UserScript==

// 24/7 Stream: https://www.tiktok.com/@livehaf.official/live
(async () => {
    if (!window.location.pathname.endsWith("/live")) {
        return;
    }

    const room_id = document.querySelector('[property="al:ios:url"]').getAttribute("content").split("=")[1];
    let data = await fetch(`https://webcast.tiktok.com/webcast/room/info/?aid=1988&room_id=${room_id}`);
    data = await data.json();
    console.log("Stream URLs", data.data.stream_url);
    data = data.data.stream_url.flv_pull_url;

    if (!mpegts.getFeatureList().mseLivePlayback) {
        return;
    }

    const video = document.createElement("video");
    video.style.height = "100%";
    video.style.width = "100%";
    video.controls = true;
    document.querySelector('[role="video-container"] div:nth-child(2) div').append(video);

    const player = mpegts.createPlayer({
        type: "mse",
        isLive: true,
        url: data.pm_mt_video_1080p60 || data.FULL_HD1 || data.pm_mt_video_720p60 || data.HD1 || data.SD2 || data.SD1
    });
    player.attachMediaElement(video);
    player.load();
    player.play();

    for (let i = 0; i <= 10 * 4; i++) {
        document.querySelector("#login-modal")?.parentNode?.parentNode?.parentNode?.remove(); // Remove Login Modal
        document.querySelector("tiktok-cookie-banner")?.remove(); // Remove Cookie Banner
        document.querySelector('[role="video-container"] div:nth-child(2) div:nth-child(4)')?.remove(); // Remove Video Overlay
        await new Promise(r => setTimeout(r, 250));
    }
})()