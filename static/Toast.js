const mathRandomInt = (a, b) => {
    if (a > b) {
        var c = a;
        a = b;
        b = c;
    }
    return Math.floor(Math.random() * (b - a + 1) + a);
}

class Toast {
    constructor() {
        if (!document.querySelector('link[href="./Toast.css"]')) {
            const link = document.createElement("link");
            link.rel = "stylesheet";
            link.href = "./Toast.css";
            document.head.appendChild(link);
        }

        this.toasts = [];
    }

    normal(text, time) {
        const id = `toast${mathRandomInt(100000, 999999)}`;
        const html = `<div class="normal-toast" id="${id}">${text}</div>`;
        document.body.insertAdjacentHTML('beforeend', html);
        setTimeout(() => {
            const toast = document.getElementById(id);
            if (toast) {
                toast.remove();
                this.toasts = this.toasts.filter(toast => toast != id);
            }
        }, time);
        this.toasts.push(id);
        return id;
    }

    success(text, time) {
        const id = `toast${mathRandomInt(100000, 999999)}`;
        const html = `<div class="success-toast" id="${id}">${text}</div>`;
        document.body.insertAdjacentHTML('beforeend', html);
        var toast = document.getElementById(id);
        setTimeout(() => {
            const toast = document.getElementById(id);
            if (toast) {
                toast.remove();
                this.toasts = this.toasts.filter(toast => toast != id);
            }
        }, time);
        this.toasts.push(id);
        return id;
    }

    error(text, time, element) {
        const id = `toast${mathRandomInt(100000, 999999)}`;
        const html = `<div class="error-toast" id="${id}">${text}</div>`;
        if (element) {
            element.insertAdjacentHTML('beforeend', html);
        } else {
            document.body.insertAdjacentHTML('beforeend', html);
        }
        setTimeout(() => {
            const toast = document.getElementById(id);
            if (toast) {
                toast.remove();
                this.toasts = this.toasts.filter(toast => toast != id);
            }
        }, time);
        this.toasts.push(id);
        return id;
    }


    warn(text, time, element) {
        const id = `toast${mathRandomInt(100000, 999999)}`;
        const html = `<div class="warn-toast" id="${id}">${text}</div>`;
        if (element) {
            element.insertAdjacentHTML('beforeend', html);
        } else {
            document.body.insertAdjacentHTML('beforeend', html);
        }
        setTimeout(() => {
            const toast = document.getElementById(id);
            if (toast) {
                toast.remove();
                this.toasts = this.toasts.filter(toast => toast != id);
            }
        }, time);
        this.toasts.push(id);
        return id;
    }

    loading(text, element) {
        const id = `toast${mathRandomInt(100000, 999999)}`;
        const html = `<div class="toast-mask"><div class="loading-toast" id="${id}">
<div class="dot-spinner">
    <div class="dot-spinner__dot"></div>
    <div class="dot-spinner__dot"></div>
    <div class="dot-spinner__dot"></div>
    <div class="dot-spinner__dot"></div>
    <div class="dot-spinner__dot"></div>
    <div class="dot-spinner__dot"></div>
    <div class="dot-spinner__dot"></div>
    <div class="dot-spinner__dot"></div>
</div><div class="toast-loading-text">${text}</div></div></div>`;
        if (element) {
            element.insertAdjacentHTML('beforeend', html);
        } else {
            document.body.insertAdjacentHTML('beforeend', html);
        }
        this.toasts.push(id);
        return id;
    }

    loadend(id) {
        const toast = document.getElementById(id);
        const mask = toast.parentElement;
        if (toast) {
            mask.remove();
            this.toasts = this.toasts.filter(toast => toast != id);
        }
    }

    cancel(id) {
        if (!id) {
            this.toasts.forEach(id => {
                const toast = document.getElementById(id);
                if (toast) {
                    toast.remove();
                    this.toasts = this.toasts.filter(toast => toast != id);
                }
            })
            return 0;
        }
        const toast = document.getElementById(id);
        if (toast) {
            toast.remove();
            this.toasts = this.toasts.filter(toast => toast != id);
        }
    }

    custom(color, bgcolor, text, time) {
        const id = `toast${mathRandomInt(100000, 999999)}`;
        const html = `<div class="custom-toast" style="--color: ${color};--bgcolor: ${bgcolor};" id="${id}">${text}</div>`;
        document.body.insertAdjacentHTML('beforeend', html);
        var toast = document.getElementById(id);
        setTimeout(() => {
            const toast = document.getElementById(id);
            if (toast) {
                toast.remove();
                this.toasts = this.toasts.filter(toast => toast != id);
            }
        }, time);
        this.toasts.push(id);
        return id;
    }
}