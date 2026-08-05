interface ToastOptions {
    bgColor?: string;
    textColor?: string;
    fontSize?: number;
    borderRadius?: number;
    offset?: number;
    shadow?: boolean;
}

type ToastPosition = 'top' | 'center' | 'bottom';
type ToastIconSize = 'small' | 'large';
type ToastIcon = 'success' | 'error' | 'loading' | 'none' | 'custom';

declare class Toast {
    constructor(props?: ToastOptions);

    bgColor: string;
    textColor: string;
    fontSize: number;
    borderRadius: number;
    offset: number;
    shadow: boolean;
    toasts: string[];

    showToast(
        message: string,
        duration?: number,
        position?: ToastPosition,
        iconSize?: ToastIconSize,
        icon?: ToastIcon,
        customIcon?: string,
        clickBg?: boolean
    ): string;

    hideToast(id?: string): void;

    loading(text?: string, small?: boolean): string;
}

export default Toast;
