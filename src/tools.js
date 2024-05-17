import fa_comment from "@fortawesome/fontawesome-free/svgs/solid/comment.svg";
import fa_paper_plane from "@fortawesome/fontawesome-free/svgs/solid/paper-plane.svg";
import fa_user_circle from "@fortawesome/fontawesome-free/svgs/solid/circle-user.svg";
import fa_street_view from "@fortawesome/fontawesome-free/svgs/solid/street-view.svg";
import fa_camera_retro from "@fortawesome/fontawesome-free/svgs/solid/camera-retro.svg";
import fa_info_circle from "@fortawesome/fontawesome-free/svgs/solid/circle-info.svg";
import fa_xmark from "@fortawesome/fontawesome-free/svgs/solid/xmark.svg";
import fa_audio_description from "@fortawesome/fontawesome-free/svgs/solid/audio-description.svg";

import showMessage from "./message.js";
import axios from "axios";

function showHitokoto() {
    // 增加 hitokoto.cn 的 API
    fetch("https://v1.hitokoto.cn")
        .then(response => response.json())
        .then(result => {
            const text = `这句一言来自 <span>「${result.from}」</span>，是 <span>${result.creator}</span> 在 hitokoto.cn 投稿的。`;
            showMessage(result.hitokoto, 6000, 9);
            setTimeout(() => {
                showMessage(text, 4000, 9);
            }, 6000);
        });
}

// 增加语音聊天功能
async function chat() {
    const baseUrl = "http://localhost:8000"
    await axios.get(baseUrl + "/chat?question=美国")
        .then(response => {
            console.log(response.data)
            const text = `这是我找到的信息：${response.data}`;
            showMessage(text, 4000, 9);

            setTimeout(() => {
                showMessage(text, 4000, 9);
            }, 6000);
        })
    // fetch(baseUrl+"/search/timeline?searchText=美国")
    //     .then(response => response.json())
    //     .then(result => {
    //         const text = `result`;
    //         setTimeout(() => {
    //             showMessage(text, 4000, 9);
    //         }, 6000);
    //     });
}

let audioContext;
let microphone;
let audioOutput;
let isPlaying = false;

async function toggleAudio() {
    if (!isPlaying) {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({audio: true});
            audioContext = new (window.AudioContext || window.webkitAudioContext)();
            microphone = audioContext.createMediaStreamSource(stream);
            audioOutput = audioContext.destination;

            microphone.connect(audioOutput);
            // document.getElementById('status').innerText = 'Status: Listening and Playing...';
            // document.getElementById('audioControl').innerText = 'Stop Audio';
            isPlaying = true;
        } catch (err) {
            console.error('Error accessing audio stream:', err);
            // document.getElementById('status').innerText = 'Status: Error';
        }
    } else {
        if (microphone) {
            microphone.disconnect(audioOutput);
            audioContext.close();
            // document.getElementById('status').innerText = 'Status: Stopped';
            // document.getElementById('audioControl').innerText = 'Start Audio';
            isPlaying = false;
        }
    }
}

// 大模型交流

// 增加新闻查询功能

const tools = {
    "hitokoto": {
        icon: fa_comment,
        callback: showHitokoto
    },
    "chat": {
        icon: fa_audio_description,
        callback: chat
    },

    "audio": {
        icon: fa_audio_description,
        callback: toggleAudio
    },

    "asteroids": {
        icon: fa_paper_plane,
        callback: () => {
            if (window.Asteroids) {
                if (!window.ASTEROIDSPLAYERS) window.ASTEROIDSPLAYERS = [];
                window.ASTEROIDSPLAYERS.push(new Asteroids());
            } else {
                const script = document.createElement("script");
                script.src = "https://fastly.jsdelivr.net/gh/stevenjoezhang/asteroids/asteroids.js";
                document.head.appendChild(script);
            }
        }
    },
    "switch-model": {
        icon: fa_user_circle,
        callback: () => {
        }
    },
    "switch-texture": {
        icon: fa_street_view,
        callback: () => {
        }
    },
    "photo": {
        icon: fa_camera_retro,
        callback: () => {
            showMessage("照好了嘛，是不是很可爱呢？", 6000, 9);
            Live2D.captureName = "photo.png";
            Live2D.captureFrame = true;
        }
    },
    "info": {
        icon: fa_info_circle,
        callback: () => {
            open("https://github.com/stevenjoezhang/live2d-widget");
        }
    },
    "quit": {
        icon: fa_xmark,
        callback: () => {
            localStorage.setItem("waifu-display", Date.now());
            showMessage("愿你有一天能与重要的人重逢。", 2000, 11);
            document.getElementById("waifu").style.bottom = "-500px";
            setTimeout(() => {
                document.getElementById("waifu").style.display = "none";
                document.getElementById("waifu-toggle").classList.add("waifu-toggle-active");
            }, 3000);
        }
    }
};

export default tools;
