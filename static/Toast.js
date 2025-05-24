class Toast {
    constructor(props) {
        Object.assign(this, props);
        this.bgColor = this.bgColor || "#38383A";
        this.textColor = this.textColor || "#FFFFFF";
        this.fontSize = this.fontSize || 14;
        this.borderRadius = this.borderRadius || 12;
        this.offset = this.offset || 80;
        this.shadow = this.shadow || true;
        this.toasts = [];
    }
    /**
     * 显示 Toast 提示框
     * @param {String} message 
     * @param {Number} duration 
     * @param {String} position 
     * @param {String} iconSize 
     * @param {String} icon 
     * @param {String} customIcon 
     * @param {Boolean} clickBg 
     * @returns {String} id
     */
    showToast(message, duration, position, iconSize, icon, customIcon, clickBg) {
        const id = this.genId();
        const successIcon = 'm64.5 173.8c5.1 5.4 17.9 6.6 25.3 0 9.6-9.2 108.1-109.2 111.1-112.3 7.6-9-2.8-23.5-15.4-15.4-1.7 1.4-103.3 96.3-103.3 96.3 0 0-4.4 4.7-11.2 0-6.4-4.6-32-29.3-38.1-35-11.9-9-26.7 5.1-16.8 16.8 9.6 10.3 46.5 47.7 48.4 49.6z';
        const errorIcon = 'm108 127.1l47.7 47.7c2.6 2.6 6 4 9.6 4 3.6 0 7-1.4 9.5-4 2.6-2.5 4-5.9 4-9.5 0-3.6-1.4-7-4-9.6l-47.7-47.7 47.7-47.7c2.5-2.6 4-6 4-9.6 0-3.6-1.5-7-4-9.5-2.5-2.6-6-4-9.5-4-3.6 0-7.1 1.5-9.6 4l-47.7 47.7-47.7-47.7c-2.5-2.6-6-4.1-9.6-4.1-3.6-0.1-7.1 1.3-9.7 3.9-2.5 2.6-4 6-3.9 9.7 0 3.6 1.5 7 4.1 9.6l47.7 47.7-47.7 47.7c-2.6 2.6-4.1 6-4.1 9.6-0.1 3.7 1.4 7.1 3.9 9.7 2.6 2.6 6.1 4 9.7 3.9 3.6 0 7.1-1.5 9.6-4.1z';
        const iconSizeValue = iconSize === 'small' ? '20px' : '34px';
        const toastElement = `
            <div class="content">
                <div class="icon">
                    <svg class="icon_svg" viewBox="0 0 216 216">
                        <path d="${icon === 'success' ? successIcon : errorIcon}"></path>
                    </svg>
                    <svg class="icon_loading" viewBox="25 25 50 50">
                        <circle r="20" cy="50" cx="50"></circle>
                    </svg>
                    <img class="icon_custom" src="${customIcon ? customIcon : ''}"/>
                </div>
                <p class="message">${message}</p>
            </div>
            <style>
                .qii_toast_container {
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100vw;
                    height: 100vh;
                    user-select: none;
                    pointer-events: ${clickBg ? 'none' : 'auto'};
                    z-index: 99999;
                    opacity: 0;
                }
                .qii_toast_container .content {
                    position: absolute;
                    left: 50%;
                    top: ${position === 'top' ? this.offset + 'px' : position === 'center' ? '50%' : 'auto'};
                    bottom: ${position === 'bottom' ? this.offset + 'px' : 'auto'};
                    transform: ${position === 'center' ? 'translate(-50%, -50%)' : 'translateX(-50%)'};
                    padding: ${iconSize === 'small' ? '9.5px 20px 8px 20px' : '20px 20px'};
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    flex-direction: ${iconSize === 'small' ? 'row' : 'column'};
                    min-width: 120px;
                    max-width: 90%;
                    background: ${this.bgColor};
                    border-radius: ${this.borderRadius}px;
                    box-shadow: ${this.shadow ? '0 6px 20px #00003010, 0 0 5px #0000300C' : 'none'};
                }
                .qii_toast_container .message {
                    margin: 0 !important;
                    display: ${message ? 'block' : 'none'};
                    color: ${this.textColor};
                    font-size: ${this.fontSize}px;
                    text-align: center;
                    word-break: break-all;
                }
                /* 图标 */
                .qii_toast_container .icon {
                    display: ${icon === 'none' ? 'none' : 'block'};
                    margin: ${iconSize === 'small' ? '0 6px 0 0' : '0 0 6px 0'};
                    fill: ${this.textColor};
                }
                .qii_toast_container .icon .icon_svg {
                    display: ${icon === 'success' || icon === 'error' ? 'block' : 'none'};
                    width: ${iconSizeValue};
                    height: ${iconSizeValue};
                }
                /* 加载图标 */
                .qii_toast_container .icon_loading {
                    display: ${icon === 'loading' ? 'block' : 'none'};
                    width: ${iconSizeValue};
                    animation: rotate 2s linear infinite;
                }
                @keyframes rotate {
                    100% {
                        transform: rotate(360deg);
                    }
                }
                .qii_toast_container .icon_loading circle {
                    fill: none;
                    stroke: ${this.textColor};
                    stroke-width: 5;
                    stroke-dasharray: 1, 200;
                    stroke-dashoffset: 0;
                    stroke-linecap: round;
                    animation: circle 1.5s ease-in-out infinite;
                }
                @keyframes circle {
                    0% {
                        stroke-dasharray: 1, 200;
                        stroke-dashoffset: 0;
                    }
                    50% {
                        stroke-dasharray: 90, 200;
                        stroke-dashoffset: -35px;
                    }
                    100% {
                        stroke-dashoffset: -125px;
                    }
                }
                /* 自定义图标 */
                .qii_toast_container .icon_custom {
                    display: ${icon === 'custom' ? 'block' : 'none'};
                    width: ${iconSizeValue};
                    height: ${iconSizeValue};
                }
            </style>
        `;
        let toastContainer = document.createElement('div');
        toastContainer.attachShadow({ mode: 'open' });
        toastContainer.className = 'qii_toast_container';
        toastContainer.id = "qii_toast-" + id;
        toastContainer.shadowRoot.innerHTML = toastElement;
        document.body.appendChild(toastContainer);
        setTimeout(() => {
            toastContainer.style.transition = 'opacity 0.15s';
            toastContainer.style.opacity = 1;
        }, 0);
        if (duration !== 0) {
            setTimeout(() => {
                toastContainer.style.transition = 'opacity 0.3s';
                toastContainer.style.opacity = 0;
                setTimeout(() => {
                    toastContainer.parentNode.removeChild(toastContainer);
                    this.toasts = this.toasts.filter(item => item !== id);
                }, 300);
            }, duration * 1000);
        }
        this.toasts.push(id);
        return id;
    }
    hideToast(id) {
        let toastContainers = document.querySelectorAll(`${id ? "#qii_toast-" + id : ".qii_toast_container"}`);
        console.log(toastContainers);
        toastContainers.forEach(toastContainer => {
            console.log
            if (toastContainer) {
                toastContainer.style.transition = 'opacity 0.3s';
                toastContainer.style.opacity = 0;
                setTimeout(() => {
                    toastContainer.parentNode.removeChild(toastContainer);
                    if (id) {
                        this.toasts = this.toasts.filter(item => item !== id);
                    } else {
                        this.toasts = [];
                    }
                }, 300);
            }
        });
    }
    genId() {
        return btoa((Math.random() * (10 ** 17)).toString(36)).replaceAll("=", "");
    }
}