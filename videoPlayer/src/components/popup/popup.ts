import { title } from "process";

// import './popup.css'   //全局css操作
let styles = require('./popup.css')  //webpack的引入写法

console.log(styles, 'styles')


interface Ipopup {
    width?: string;
    height?: string;
    title?: string;
    pos?: string;
    mask?: boolean;
    content?: (content:HTMLElement) => void;
}

// 定义公共组件的模型，可单独新建一个文件统一导入
interface Icomponent {
    tempContainer: HTMLElement;//容器
    init: () => void;//初始化
    template: () => void;//创建模板
    handle: () => void;//事件操作
}
function popup(options: Ipopup) {
    return new Popup(options);
}

class Popup implements Icomponent {
    tempContainer;
    mask;
    constructor(private settings: Ipopup) {
        this.settings = Object.assign({
            width: "100%",
            height: "100%",
            title: "",
            pos: "center",
            mask: true,
            content: function () { }
        }, this.settings);
        this.init();
    }
    init() {
        this.template();
        this.settings.mask && this.createMask();
        this.handle();
        this.contentCallback();
    }
    template() {
        this.tempContainer = document.createElement('div');
        this.tempContainer.style.width = this.settings.width;
        this.tempContainer.style.height = this.settings.height;
        this.tempContainer.className = styles.default.popup;
        this.tempContainer.innerHTML =
            `<div class="${styles.default['popup-title']}">
            <h3>${this.settings.title}</h3>
            <i class="iconfont icon-guanbi" ></i>
        </div>
        <div class="${styles.default['popup-content']}"></div>
        `;


        document.body.appendChild(this.tempContainer);

        //设置弹窗位置
        if (this.settings.pos == "left") {
            this.tempContainer.style.left = 0;
            this.tempContainer.style.top = (window.innerHeight - this.tempContainer.offsetHeight) + "px";
        } else if (this.settings.pos == "right") {
            this.tempContainer.style.right = 0;
            this.tempContainer.style.top = (window.innerHeight - this.tempContainer.offsetHeight) + "px";

        } else {
            this.tempContainer.style.left = (window.innerWidth - this.tempContainer.offsetWidth) / 2 + "px";
            this.tempContainer.style.top = (window.innerHeight - this.tempContainer.offsetHeight) / 2 + "px";



        }


    }
    handle() {
        let popupClose = this.tempContainer.querySelector(`.${styles.default['popup-title']} i`);
        popupClose.addEventListener('click', () => {
            document.body.removeChild(this.tempContainer);
            this.settings.mask && document.body.removeChild(this.mask);
        })
    }
    createMask() {
        this.mask = document.createElement('div');
        this.mask.className = styles.default.mask;
        this.mask.style.width = '100%';
        this.mask.style.height = document.body.offsetHeight + "px";
        document.body.appendChild(this.mask);

    }
    contentCallback(){
        let popupContent=this.tempContainer.querySelector(`.${styles.default['popup-content']}`);
        this.settings.content(popupContent);
    }
}
export default popup;