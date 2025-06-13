class Dialog {
    constructor(props) {
        Object.assign(this, props)
        this.events = {}
        this.__widgetId = this.id
        this.inputValue = ''
        this.cardColor = this.cardColor || "white"
        this.cardRadius = this.cardRadius || 10
        this.themeColor = this.themeColor || "#42A5F5"
        this.useMD3 = this.useMD3 || false;
    }
    showDialog(title, text, image, items, lightItem, align, dialogId) {
        this.renderDialog('select', title, text, image, items, lightItem, align, dialogId, null, null)
    }
    showInputDialog(title, text, image, placeholder, inputValue, lightItem, align, dialogId) {
        this.renderDialog('input', title, text, image, null, lightItem, align, dialogId, placeholder, inputValue)
    }
    renderDialog(type, title, text, image, items, lightItem, align, dialogId, placeholder, inputValue) {
        const hasDialog = document.querySelector(`.Qii_${this.__widgetId}`)
        if (hasDialog) this.hideDialog()
        const dialogCard = document.createElement('div')
        dialogCard.className = `card`
        dialogCard.addEventListener('click', (e) => {
            e.stopPropagation()
        })
        if (image) {
            const dialogImage = document.createElement('img')
            dialogImage.className = 'image'
            dialogImage.src = image
            dialogCard.appendChild(dialogImage)
        }
        if (title) {
            const dialogTitle = document.createElement('div')
            dialogTitle.className = 'title'
            dialogTitle.textContent = title
            dialogCard.appendChild(dialogTitle)
        }
        if (text) {
            const dialogText = document.createElement('div')
            dialogText.className = 'text'
            dialogText.innerHTML = text
            dialogCard.appendChild(dialogText)
        }
        if (type === 'input') {
            items = '取消,' + lightItem
            const dialogInput = document.createElement('input')
            dialogInput.className = 'input'
            dialogInput.placeholder = placeholder
            dialogInput.value = inputValue
            this.inputValue = inputValue
            dialogInput.addEventListener('change', (e) => {
                this.inputValue = e.target.value
            })
            dialogCard.appendChild(dialogInput)
        }
        if (items) {
            const dialogItems = document.createElement('div')
            dialogItems.className = 'itemList'
            items = items.split(',')
            if (items.length > 2) {
                dialogItems.classList.add('vertical')
            }
            for (let index = 0; index < items.length; index++) {
                const item = document.createElement('button')
                item.className = 'item'
                item.textContent = items[index]
                if (items[index] === lightItem) {
                    item.classList.add('lightItem')
                }
                item.addEventListener('click', () => {
                    if (type === 'select') {
                        this.emit('onClickItem', items[index], index + 1, dialogId)
                    }
                    if (type === 'input' && items[index] === lightItem) {
                        this.emit('onInputFinish', this.inputValue, dialogId)
                        this.inputValue = ''
                    }
                    this.hideDialog()
                })
                dialogItems.appendChild(item)
            }
            dialogCard.appendChild(dialogItems)
        }
        const style = document.createElement('style')
        console.log(this.cardColor, this.themeColor)
        style.textContent = `
            .Qii_${this.__widgetId} {
                position: fixed; left: 0; top: 0;
                display: flex;
                align-items: center;
                justify-content: center;
                width: 100%;
                height: 100%;
                z-index: 9999;
                animation: Qii_DIALOG_BG_SHOW 0.4s cubic-bezier(.3,.4,.5,1) both;
                user-select: none;
            }
            .Qii_${this.__widgetId}.hideDialog {
                pointer-events: none;
                animation: Qii_DIALOG_BG_HIDE 0.25s cubic-bezier(.3,.4,.5,1) both;
            }
            /* 卡片 */
            .Qii_${this.__widgetId} .card {
                width: 300px;
                margin-bottom: 20px;
                background: ${this.cardColor};
                border-radius: ${this.cardRadius}px;
                overflow: hidden;
                animation: Qii_DIALOG_CARD_SHOW 0.7s cubic-bezier(.35,.5,.15,1) both;
            }
            .Qii_${this.__widgetId}.hideDialog .card {
                animation: Qii_DIALOG_CARD_HIDE 0.25s cubic-bezier(.35,.5,.15,1) both;
            }
            /* 图片 */
            .Qii_${this.__widgetId} .card .image {
                margin: 10px 10px 0px 10px;
                width: calc(100% - 20px);
                max-height: 280px;
                border-radius: ${this.cardRadius - 4}px;
                object-fit: cover;
            }
            /* 标题 */
            .Qii_${this.__widgetId} .card .title {
                padding: 0 20px;
                margin-top: 20px;
                color: ${this.textColor};
                font-size: ${this.titleSize}px;
                font-weight: bold;
                text-align: center;
            }
            /* 文本 */
            .Qii_${this.__widgetId} .card .text {
                padding: 0 20px;
                margin-top: 12px;
                color: ${this.textColor};
                font-size: ${this.textSize}px;
                text-align: ${align};
                white-space: pre-line;
            }
            /* 输入框 */
            .Qii_${this.__widgetId} .card .input {
                border: none;
                outline: none;
                padding: 0 14px;
                margin: 16px 20px 0 20px;
                width: calc(300px - 68px);
                height: 42px;
                border-radius: 8px;
                background: rgba(0, 0, 20, 0.06);
                color: ${this.textColor};
                font-size: ${this.textSize}px;
            }
            .Qii_${this.__widgetId} .card .input::placeholder {
                color: ${this.placeColor};
            }
            /* 选项列表 */
            .Qii_${this.__widgetId} .itemList {
                margin-top: 20px;
                display: flex;
                border-top: 1px solid #00002008;
            }
            .Qii_${this.__widgetId} .itemList.vertical {
                flex-direction: column;
            }
            .Qii_${this.__widgetId} .itemList .item {
                width: 100%;
                height: 50px;
                line-height: 50px;
                color: ${this.textColor};
                font-size: ${this.itemSize}px;
                text-align: center;
                font-weight: bold;
                user-select: none;
                cursor: pointer;
                outline: none;
            }
            .Qii_${this.__widgetId} .itemList .item:active {
                background: rgba(0, 0, 20, 0.06);
            }
            .Qii_${this.__widgetId} .itemList .lightItem {
                color: ${this.themeColor};
            }
            /* 背景动画 */
            @keyframes Qii_DIALOG_BG_SHOW {
                0% { background: rgba(0, 0, 0, 0.0) }
                100% { background: rgba(0, 0, 0, 0.4) }
            }
            @keyframes Qii_DIALOG_BG_HIDE {
                0% { background: rgba(0, 0, 0, 0.4) }
                100% { background: rgba(0, 0, 0, 0.0) }
            }
            /* 卡片动画 */
            @keyframes Qii_DIALOG_CARD_SHOW {
                0% {
                    transform: scale(0.5);
                    opacity: 0;
                }
                25% {
                    opacity: 1;
                }
                50% {
                    transform: scale(1.01);
                }
                100% {
                    transform: scale(1);
                }
            }
            @keyframes Qii_DIALOG_CARD_HIDE {
                0% {
                    transform: scale(1);
                    opacity: 1;
                }
                100% {
                    transform: scale(0.5);
                    opacity: 0;
                }
            }
        `;
        const dialogContainer = document.createElement('div')
        dialogContainer.className = `Qii_${this.__widgetId}`
        dialogContainer.appendChild(dialogCard)
        dialogContainer.appendChild(style)
        dialogContainer.style.pointerEvent = "none";
        setTimeout(() => {
            dialogContainer.style.pointerEvent = null;
        }, 300);
        document.body.appendChild(dialogContainer)
    }
    hideDialog() {
        const dialogContainer = document.querySelectorAll(`.Qii_${this.__widgetId}`)
        if (dialogContainer) {
            dialogContainer.forEach(element => {
                element.classList.add('hideDialog')
            })
            setTimeout(() => {
                dialogContainer.forEach(element => {
                    element.remove()
                    this.emit("onClose")
                })
            }, 300)
        }
    }
    on(name, callback) {
        if (!this.events[name]) {
            this.events[name] = [];
        }
        this.events[name].push(callback);
    }
    emit(name, ...args) {
        if (this.events[name]) {
            this.events[name].forEach(callback => callback(...args));
        }
    }
}
