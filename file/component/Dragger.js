const VERSION_Prop = Symbol
class aDragger {
    _VERSION = "1.0.3";
    get VERSION() {
        return this._VERSION;
    }
    isToTop = false;
    timeStart = 0;
    timeEnd = 0;
    range = null;
    direction = null;
    #element = null;
    #parentElement = null;
    _isDragging = false;
    get isDragging() {
        return this._isDragging;
    }
    constructor(element, config) {
        this.#element = element;
        this.#parentElement = this.#element.parentElement;
        this.#element.setAttribute("iftc-draggable", true);
        this._isDragging = false;
        this.initPosition = {
            x: this.#element.offsetLeft,
            y: this.#element.offsetTop
        };
        this.originalPosition = {
            x: this.#element.offsetLeft,
            y: this.#element.offsetTop
        };
        this.currentPosition = this.initPosition;
        this.#element.style.position = 'absolute';
        if (config) {
            if (config.isToTop) {
                this.isToTop = true;
            }
            if (config.range) {
                this.range = config.range;
                if (this.range) {
                    if (!this.range.x1 && this.range.x1 != 0) {
                        missParam("x1");
                        this.range = null;
                    }
                }
                if (this.range) {
                    if (!this.range.y1 && this.range.y1 != 0) {
                        missParam("y1");
                        this.range = null;
                    }
                }
                if (this.range) {
                    if (!this.range.x2 && this.range.x2 != 0) {
                        missParam("x2");
                        this.range = null;
                    }
                }
                if (this.range) {
                    if (!this.range.y2 && this.range.y2 != 0) {
                        missParam("y2");
                        this.range = null;
                    }
                }
                if (this.range) {
                    const {
                        x1,
                        y1,
                        x2,
                        y2
                    } = this.range;
                    const w = x2 - x1;
                    const h = y2 - y1;
                    if (w <= 0) {
                        console.error("x2必须大于x1");
                        this.range = null;
                    } else if (h <= 0) {
                        console.error("y2必须大于y1");
                        this.range = null;
                    }
                }

                function missParam(name) {
                    console.error("range中缺少参数" + name);
                }
            }
            if (config.direction) {
                this.direction = config.direction
                if (this.direction != "Horizontal" && this.direction != "Vertical") {
                    console.error("direction参数值错误");
                    this.direction = null;
                }
            }
        }
        this.addEventListeners();
        this.onDragStart = null;
        this.onDrag = null;
    }

    addEventListeners() {
        this.#element.addEventListener('mousedown', this.onMouseDown.bind(this));
        this.#element.addEventListener('touchstart', this.onTouchStart.bind(this));
        document.addEventListener('mouseup', this.onMouseUp.bind(this));
        document.addEventListener('touchend', this.onTouchEnd.bind(this));
    }

    onMouseDown(e) {
        e.preventDefault();
        this._isDragging = true;
        this.initPosition = {
            x: e.clientX,
            y: e.clientY
        };
        this.timeStart = Date.now();
        const events = {
            element: this.#element,
            x: this.initPosition.x,
            y: this.initPosition.y,
            timestamp: Date.now()
        };
        if (typeof this.onDragStart == "function") {
            this.onDragStart(events);
        }
        if (this.isToTop) {
            this.#parentElement.removeChild(this.#element);
            this.#parentElement.appendChild(this.#element);
        }
        document.addEventListener('mousemove', this.onMouseMove.bind(this));
    }

    onTouchStart(e) {
        e.preventDefault();
        this._isDragging = true;
        const touch = e.touches[0];
        this.initPosition = {
            x: touch.clientX,
            y: touch.clientY
        };
        this.timeStart = Date.now();
        const events = {
            element: this.#element,
            x: this.initPosition.x,
            y: this.initPosition.y,
            timestamp: Date.now()
        };
        if (typeof this.onDragStart == "function") {
            this.onDragStart(events);
        }
        if (this.isToTop) {
            this.#parentElement.removeChild(this.#element);
            this.#parentElement.appendChild(this.#element);
        }
        document.addEventListener('touchmove', this.onTouchMove.bind(this));
    }

    onMouseMove(e) {
        if (!this._isDragging) return;
        if (this.direction == "Horizontal" || this.direction == null) {
            const dx = e.clientX - this.initPosition.x;
            this.currentPosition.x += dx;
            this.#element.style.left = `${this.currentPosition.x}px`;
        }
        if (this.direction == "Vertical" || this.direction == null) {
            const dy = e.clientY - this.initPosition.y;
            this.currentPosition.y += dy;
            this.#element.style.top = `${this.currentPosition.y}px`;
        }
        this.initPosition = {
            x: e.clientX,
            y: e.clientY
        };
        if (this.range) {
            const {
                x1,
                y1,
                x2,
                y2
            } = this.range;
            const lastX = this.currentPosition.x;
            const lastY = this.currentPosition.y;
            console.log(lastX, lastY);
            const w = x2 - x1;
            const h = y2 - y1;
            const ex = this.#element.offsetLeft;
            const ey = this.#element.offsetTop;
            const ew = this.#element.offsetWidth;
            const eh = this.#element.offsetHeight;
            if (ex <= x1) {
                this.#element.style.left = `${x1}px`;
                this.initPosition.x = x1;
                this.currentPosition.x = x1;
            }
            if (ey <= y1) {
                this.#element.style.top = `${y1}px`;
                this.initPosition.y = y1;
                this.currentPosition.y = y1;
            }
            if (ex >= x2 - ew) {
                this.#element.style.left = `${x2 - ew}px`;
                this.initPosition.x = x2 - ew;
                this.currentPosition.x = x2 - ew;
            }
            if (ey >= y2 - eh) {
                this.#element.style.top = `${y2 - eh}px`;
                this.initPosition.y = y2 - eh;
                this.currentPosition.y = y2 - eh;
            }
        }
        const events = {
            element: this.#element,
            x: this.currentPosition.x,
            y: this.currentPosition.y,
            timestamp: Date.now()
        };
        if (typeof this.onDrag == "function") {
            this.onDrag(events);
        }
    }

    onTouchMove(e) {
        if (!this._isDragging) return;
        const touch = e.touches[0];
        if (touch.target != this.#element) return;
        if (this.direction == "Horizontal" || this.direction == null) {
            const dx = touch.clientX - this.initPosition.x;
            this.currentPosition.x += dx;
            this.#element.style.left = `${this.currentPosition.x}px`;
        }
        if (this.direction == "Vertical" || this.direction == null) {
            const dy = touch.clientY - this.initPosition.y;
            this.currentPosition.y += dy;
            this.#element.style.top = `${this.currentPosition.y}px`;
        }
        this.initPosition = {
            x: touch.clientX,
            y: touch.clientY
        };
        if (this.range) {
            const {
                x1,
                y1,
                x2,
                y2
            } = this.range;
            const w = x2 - x1;
            const h = y2 - y1;
            const ex = this.#element.offsetLeft;
            const ey = this.#element.offsetTop;
            const ew = this.#element.offsetWidth;
            const eh = this.#element.offsetHeight;
            if (ex <= x1) {
                this.#element.style.left = `${x1}px`;
                this.initPosition.x = x1;
                this.currentPosition.x = x1;
            }
            if (ey <= y1) {
                this.#element.style.top = `${y1}px`;
                this.initPosition.y = y1;
                this.currentPosition.y = y1;
            }
            if (ex > x2 - ew - 5) {
                this.#element.style.left = `${x2 - ew}px`;
                this.initPosition.x = x2 - ew;
                this.currentPosition.x = x2 - ew;
            }
            if (ey > y2 - eh) {
                this.#element.style.top = `${y2 - eh}px`;
                this.initPosition.y = y2 - eh;
                this.currentPosition.y = y2 - eh;
            }
        }
        const events = {
            element: this.#element,
            x: this.currentPosition.x,
            y: this.currentPosition.y,
            timestamp: Date.now()
        };
        if (typeof this.onDrag == "function") {
            this.onDrag(events);
        }
    }

    onMouseUp(e) {
        this._isDragging = false;
        this.timeEnd = Date.now();
        const duration = this.timeEnd - this.timeStart;
        const events = {
            element: this.#element,
            x: this.currentPosition.x,
            y: this.currentPosition.y,
            timestamp: Date.now(),
            duration: duration
        };
        if (e.target == this.#element) {
            if (typeof this.onDragEnd == "function") {
                this.onDragEnd(events);
            }
        }
        document.removeEventListener('mousemove', this.onMouseMove.bind(this));
    }

    onTouchEnd(e) {
        this._isDragging = false;
        this.timeEnd = Date.now();
        const duration = this.timeEnd - this.timeStart;
        const events = {
            element: this.#element,
            x: this.currentPosition.x,
            y: this.currentPosition.y,
            timestamp: Date.now(),
            duration: duration
        };
        if (e.target == this.#element) {
            if (typeof this.onDragEnd == "function") {
                this.onDragEnd(events);
            }
        }
        document.removeEventListener('touchmove', this.onTouchMove.bind(this));
    }

    setConfig(name, value) {
        if (name == "isToTop") {
            this.isToTop = value;
        } else if (name == "range") {
            this.range = value;
            if (this.range) {
                if (!this.range.x1 && this.range.x1 != 0) {
                    missParam("x1");
                    this.range = null;
                }
            }
            if (this.range) {
                if (!this.range.y1 && this.range.y1 != 0) {
                    missParam("y1");
                    this.range = null;
                }
            }
            if (this.range) {
                if (!this.range.x2 && this.range.x2 != 0) {
                    missParam("x2");
                    this.range = null;
                }
            }
            if (this.range) {
                if (!this.range.y2 && this.range.y2 != 0) {
                    missParam("y2");
                    this.range = null;
                }
            }
            if (this.range) {
                const {
                    x1,
                    y1,
                    x2,
                    y2
                } = this.range;
                const w = x2 - x1;
                const h = y2 - y1;
                if (w <= 0) {
                    console.error("x2必须大于x1");
                    this.range = null;
                } else if (h <= 0) {
                    console.error("y2必须大于y1");
                    this.range = null;
                }
            }

            function missParam(name) {
                console.error("range中缺少参数" + name);
            }
        } else if (name == "rangeX1") {
            if (this.range) {
                this.range.x1 = value;
            } else {
                console.error("请先设置range配置");
            }
        } else if (name == "rangeY1") {
            if (this.range) {
                this.range.y1 = value;
            } else {
                console.error("请先设置range配置");
            }
        } else if (name == "rangeX2") {
            if (this.range) {
                this.range.x2 = value;
            } else {
                console.error("请先设置range配置");
            }
        } else if (name == "rangeY2") {
            if (this.range) {
                this.range.y2 = value;
            } else {
                console.error("请先设置range配置");
            }
        } else {
            console.error("未知配置名");
        }
        if (name == "direction") {
            this.direction = value;
            if (this.direction != "Horizontal" && this.direction != "Vertical") {
                console.error("direction参数值错误");
                this.direction = null;
            }
        }
    }

    getConfig(name) {
        if (name == "isToTop") {
            return this.isToTop;
        } else if (name == "rangeX1") {
            if (this.range) {
                return this.range.x1;
            }
        } else if (name == "rangeY1") {
            if (this.range) {
                return this.range.Y1;
            }
        } else if (name == "rangeX2") {
            if (this.range) {
                return this.range.x2;
            }
        } else if (name == "rangeY2") {
            if (this.range) {
                return this.range.y2;
            }
        } else {
            console.error("未知配置名");
        }
        if (name == "direction") {
            return this.direction;
        }
    }

    reset() {
        this.#element.style.left = `${this.originalPosition.x}px`;
        this.#element.style.top = `${this.originalPosition.y}px`;
        this.initPosition = {
            x: this.#element.offsetLeft,
            y: this.#element.offsetTop
        };
        this.currentPosition = this.initPosition;
    }
    goto(x, y) {
        if (x || x == 0) {
            this.#element.style.left = `${x}px`;
            this.initPosition.x = x;
            this.currentPosition = this.initPosition;
        }
        if (y || y == 0) {
            this.#element.style.top = `${y}px`;
            this.initPosition.y = y;
            this.currentPosition = this.initPosition;
        }
    }

    toString() {
        return `Dragger(${this.#element.id})`;
    }
}
window.Dragger = aDragger
console.log("Dragger.js已加载")
console.log("文档：/docs/Dragger.md")