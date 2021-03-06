import { clearInterval } from "timers";

let styles = require('./video.css');


interface Ivideo {
    url: string;
    elem: string | HTMLElement;
    width?: string;
    height?: string;
    autoplay?: boolean;
}

interface Icomponent {
    tempContainer: HTMLElement;//容器
    init: () => void;//初始化
    template: () => void;//创建模板
    handle: () => void;//事件操作
}

function video(options: Ivideo) {
    return new Video(options);
}

class Video implements Icomponent {
    tempContainer;
    constructor(private settings: Ivideo) {
        this.settings = Object.assign({
            width: "100%",
            height: "100%",
            autoplay: false
        }, this.settings)
        this.init();
    }
    init() {
        this.template();
        this.handle();
    }
    template() {
        this.tempContainer = document.createElement('div');
        this.tempContainer.className = styles.default.video;
        this.tempContainer.style.width = this.settings.width;
        this.tempContainer.height = this.settings.height;
        this.tempContainer.innerHTML = `
            <video class="${styles.default['video-content']}" src="${this.settings.url}"></video>
            <div class="${styles.default['video-controls']}">
                <div class="${styles.default['video-progress']}">
                    <div class="${styles.default['video-progress-now']}"></div>
                    <div class="${styles.default['video-progress-suc']}"></div>
                    <div class="${styles.default['video-progress-bar']}"></div>
                </div>
                <div class="${styles.default['video-play']}">
                    <i class="iconfont icon-bofang"></i>
                </div>
                <div class="${styles.default['video-time']}">
                    <span>00:00</span> / <span>12:00</span>
                </div>
                <div class="${styles.default['video-full']}">
                    <i class="iconfont icon-quanping"></i>
                </div>
                <div class="${styles.default['video-volume']}">
                    <i class="iconfont icon-yinliang"></i>
                    <div class="${styles.default['video-volprogress']}">
                        <div class="${styles.default['video-volprogress-now']}"></div>
                        <div class="${styles.default['video-volprogress-bar']}"></div>
                    </div>
                </div>           
            </div>
        `

        if (typeof this.settings.elem == "object") {
            this.settings.elem.appendChild(this.tempContainer);//表明这个elem是DOM元素
        } else {
            document.querySelector(`${this.settings.elem}`).appendChild(this.tempContainer);
        }
    }
    handle() {
        let videoContent = this.tempContainer.querySelector(`.${styles.default['video-content']}`);
        let videoControls = this.tempContainer.querySelector(`.${styles.default['video-controls']}`);
        let videoPlay = this.tempContainer.querySelector(`.${styles.default['video-play']} i`);
        let videoTimes = this.tempContainer.querySelectorAll(`.${styles.default['video-time']} span`);
        let videoFull = this.tempContainer.querySelector(`.${styles.default['video-full']} i`);
        let videoProgress = this.tempContainer.querySelectorAll(`.${styles.default['video-progress']} div`);
        let videoVolProgress = this.tempContainer.querySelectorAll(`.${styles.default['video-volprogress']} div`);

        let timer;
        videoContent.volume = 0.5;

        if(this.settings.autoplay){
            timer=setInterval(playing,1000);
            videoContent.play();
        }

        this.tempContainer.addEventListener('mouseenter', function () {
            videoControls.style.bottom = 0;
        })
        this.tempContainer.addEventListener('mouseleave', function () {
            videoControls.style.bottom = '-50px';
        })


        //视频是否加载完毕
        videoContent.addEventListener('canplay', () => {

            videoTimes[1].innerHTML = formatTime(videoContent.duration);

        })

        //视频是否播放事件
        videoContent.addEventListener('play', () => {
            videoPlay.className = "iconfont icon-ai07";
            timer = setInterval(playing, 1000);
        })

        //视频是否暂停事件
        videoContent.addEventListener('pause', () => {
            videoPlay.className = "iconfont icon-bofang";
            // clearInterval(timer);
        })
        //全屏
        videoFull.addEventListener('click', () => {
            videoContent.requestFullscreen();

        })

        //小球拖拽
        videoProgress[2].addEventListener('mousedown', function (ev: MouseEvent) {
            let downX = ev.pageX;
            let downL = this.offsetLeft;
            document.onmousemove = (ev: MouseEvent) => {
                let scale = (ev.pageX - downX + downL + 8) / this.parentNode.offsetWidth;
                if (scale < 0) {
                    scale = 0;
                } else if (scale > 1) {
                    scale = 1;
                }

                videoProgress[0].style.width = scale * 100 + "%";
                videoProgress[1].style.width = scale * 100 + "%";
                this.style.left = scale * 100 + "%";
                videoContent.currentTime = scale * videoContent.duration;
            }

            document.onmouseup = () => {
                document.onmousemove = document.onmouseup = null;
            }

            ev.preventDefault();

        })

        videoPlay.addEventListener('click', function () {
            if (videoContent.paused) {
                videoContent.play();
            } else {
                videoContent.pause();
            }
        })

        videoVolProgress[1].addEventListener('mousedown', function (ev: MouseEvent) {
            let downX = ev.pageX;
            let downL = this.offsetLeft;
            document.onmousemove = (ev: MouseEvent) => {
                let scale = (ev.pageX - downX + downL + 8) / this.parentNode.offsetWidth;
                if (scale < 0) {
                    scale = 0;
                } else if (scale > 1) {
                    scale = 1;
                }

                videoVolProgress[0].style.width = scale * 100 + "%";
                this.style.left = scale * 100 + "%";
                videoContent.volume = scale;
            }

            document.onmouseup = () => {
                document.onmousemove = document.onmouseup = null;
            }

            ev.preventDefault();

        })

        //正在播放中
        function playing() {
            let scale = videoContent.currentTime / videoContent.duration;//加载百分比
            let scaleSuc = videoContent.buffered.end(0) / videoContent.duration;//缓存百分比


            videoTimes[0].innerHTML = formatTime(videoContent.currentTime);
            videoProgress[0].style.width = scale * 100 + "%";//播放进度
            videoProgress[1].style.width = scaleSuc * 100 + "%";//缓存进度
            videoProgress[2].style.left = scale * 100 + "%";//小球进度


        }

        function formatTime(number: number): string {
            number = Math.round(number);
            let min = Math.floor(number / 60);
            let sec = number % 60;
            return setZero(min) + ":" + setZero(sec);
        }

        function setZero(number: number): string {
            if (number < 10) {
                return "0" + number
            } else {
                return "" + number
            }
        }

    }
}

export default video;