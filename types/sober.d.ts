/**
 * Sober - 轻量级的 Material 3 设计前端组件库
 * @see https://soberjs.com
 */

declare module "sober" {
    // ==================== Base ====================

    /** 所有 Sober 组件的基类 */
    class SoberElement extends HTMLElement {
        /** 注册自定义元素，可选指定标签名 */
        static define(name?: string): void;
    }

    // ==================== Alert ====================

    type AlertType = "info" | "success" | "warning" | "error";

    interface AlertProps {
        type?: AlertType;
    }

    /**
     * `s-alert` - 警告提示组件
     *
     * @fires show - 显示时触发
     * @fires showed - 显示动画完成后触发
     * @fires close - 关闭时触发
     * @fires closed - 关闭动画完成后触发
     */
    class Alert extends SoberElement {
        type: AlertType;

        show(): void;
        close(): void;
    }

    // ==================== Appbar ====================

    /**
     * `s-appbar` - 顶部应用栏组件
     */
    class Appbar extends SoberElement {}

    // ==================== Avatar ====================

    interface AvatarProps {
        src?: string;
    }

    /**
     * `s-avatar` - 头像组件
     */
    class Avatar extends SoberElement {
        src: string;
    }

    // ==================== Badge ====================

    /**
     * `s-badge` - 徽标组件
     */
    class Badge extends SoberElement {}

    // ==================== BottomSheet ====================

    interface BottomSheetProps {
        showed?: boolean;
        disabledGesture?: boolean;
    }

    interface BottomSheetEvents {
        show: CustomEvent;
        showed: Event;
        close: CustomEvent;
        closed: Event;
    }

    /**
     * `s-bottom-sheet` - 底部面板组件
     *
     * @fires show - 显示时触发（可取消）
     * @fires showed - 显示动画完成后触发
     * @fires close - 关闭时触发（可取消）
     * @fires closed - 关闭动画完成后触发
     */
    class BottomSheet extends SoberElement {
        showed: boolean;
        disabledGesture: boolean;

        show(): void;
        close(): void;
        toggle(): void;
    }

    // ==================== Button ====================

    type ButtonType = "filled" | "elevated" | "filled-tonal" | "outlined" | "text";

    interface ButtonProps {
        disabled?: boolean;
        type?: ButtonType;
    }

    /**
     * `s-button` - 按钮组件
     */
    class Button extends SoberElement {
        disabled: boolean;
        type: ButtonType;
    }

    // ==================== Card ====================

    type CardType = "elevated" | "filled" | "outlined";

    interface CardProps {
        type?: CardType;
        clickable?: boolean;
    }

    /**
     * `s-card` - 卡片组件
     */
    class Card extends SoberElement {
        type: CardType;
        clickable: boolean;
    }

    // ==================== Carousel ====================

    interface CarouselProps {
        value?: string;
        autoplay?: boolean;
        duration?: number;
    }

    /**
     * `s-carousel` - 轮播组件
     */
    class Carousel extends SoberElement {
        value: string;
        autoplay: boolean;
        duration: number;
    }

    // ==================== CarouselItem ====================

    interface CarouselItemProps {
        selected?: boolean;
        value?: string;
    }

    /**
     * `s-carousel-item` - 轮播项组件
     */
    class CarouselItem extends SoberElement {
        selected: boolean;
        value: string;
    }

    // ==================== Checkbox ====================

    interface CheckboxProps {
        disabled?: boolean;
        checked?: boolean;
        indeterminate?: boolean;
    }

    /**
     * `s-checkbox` - 复选框组件
     */
    class Checkbox extends SoberElement {
        disabled: boolean;
        checked: boolean;
        indeterminate: boolean;
    }

    // ==================== Chip ====================

    type ChipType = "filled" | "outlined";

    interface ChipProps {
        type?: ChipType;
        value?: string;
        checked?: boolean;
        disabled?: boolean;
        clickable?: boolean;
    }

    /**
     * `s-chip` - 纸片组件
     */
    class Chip extends SoberElement {
        type: ChipType;
        value: string;
        checked: boolean;
        disabled: boolean;
        clickable: boolean;
    }

    // ==================== CircularProgress ====================

    interface CircularProgressProps {
        indeterminate?: boolean;
        animated?: boolean;
        max?: number;
        value?: number;
    }

    /**
     * `s-circular-progress` - 环形进度条组件
     */
    class CircularProgress extends SoberElement {
        indeterminate: boolean;
        animated: boolean;
        max: number;
        value: number;
    }

    // ==================== Date ====================

    interface DateProps {
        value?: string;
        locale?: string;
        max?: string;
        min?: string;
    }

    /**
     * `s-date` - 日期组件
     */
    class Date extends SoberElement {
        value: string;
        locale: string;
        max: string;
        min: string;

        /** 添加自定义语言包 */
        addLocale(name: string, locale: Record<string, string>): void;
        /** 设置当前语言 */
        setLocale(name: string): void;
    }

    // ==================== DatePicker ====================

    interface DatePickerProps {
        value?: string;
        min?: string;
        max?: string;
        label?: string;
        positiveText?: string;
        negativeText?: string;
        format?: string;
        locale?: string;
    }

    /**
     * `s-date-picker` - 日期选择器组件
     */
    class DatePicker extends SoberElement {
        value: string;
        min: string;
        max: string;
        label: string;
        positiveText: string;
        negativeText: string;
        format: string;
        locale: string;
    }

    // ==================== Dialog ====================

    type DialogSize = "standard" | "full";

    interface DialogProps {
        showed?: boolean;
        size?: DialogSize;
    }

    interface DialogEvents {
        show: CustomEvent;
        showed: Event;
        close: CustomEvent;
        closed: Event;
    }

    /**
     * `s-dialog` - 对话框组件
     *
     * @fires show - 显示时触发（可取消）
     * @fires showed - 显示动画完成后触发
     * @fires close - 关闭时触发（可取消）
     * @fires closed - 关闭动画完成后触发
     */
    class Dialog extends SoberElement {
        showed: boolean;
        size: DialogSize;

        show(): void;
        close(): void;
    }

    // ==================== Divider ====================

    /**
     * `s-divider` - 分割线组件
     */
    class Divider extends SoberElement {}

    // ==================== Drawer ====================

    /**
     * `s-drawer` - 抽屉组件
     */
    class Drawer extends SoberElement {}

    // ==================== Empty ====================

    /**
     * `s-empty` - 空状态组件
     */
    class Empty extends SoberElement {}

    // ==================== FAB ====================

    interface FABProps {
        hidden?: boolean;
        disabled?: boolean;
    }

    /**
     * `s-fab` - 浮动操作按钮组件
     */
    class FAB extends SoberElement {
        hidden: boolean;
        disabled: boolean;
    }

    // ==================== Field ====================

    interface FieldProps {
        focused?: boolean;
        fixed?: boolean;
    }

    /**
     * `s-field` - 字段组件
     */
    class Field extends SoberElement {
        focused: boolean;
        fixed: boolean;
    }

    // ==================== Fold ====================

    interface FoldProps {
        folded?: boolean;
    }

    /**
     * `s-fold` - 折叠组件
     */
    class Fold extends SoberElement {
        folded: boolean;
    }

    // ==================== Icon ====================

    /** 内置图标名称 */
    type IconName =
        | 'none'
        | 'home'
        | 'add'
        | 'search'
        | 'menu'
        | 'arrow_back'
        | 'arrow_forward'
        | 'arrow_upward'
        | 'arrow_downward'
        | 'arrow_drop_up'
        | 'arrow_drop_down'
        | 'arrow_drop_left'
        | 'arrow_drop_right'
        | 'more_vert'
        | 'more_horiz'
        | 'close'
        | 'done'
        | 'chevron_up'
        | 'chevron_down'
        | 'chevron_left'
        | 'chevron_right'
        | 'light_mode'
        | 'dark_mode'
        | 'star'
        | 'favorite';

    interface IconProps {
        name?: IconName;
        src?: string;
    }

    /**
     * `s-icon` - 图标组件
     *
     * 内置 25 个 Material Design 图标，支持通过 `src` 属性加载自定义 SVG
     */
    class Icon extends SoberElement {
        name: IconName;
        src: string;
    }

    // ==================== IconButton ====================

    type IconButtonType = "standard" | "filled" | "filled-tonal" | "outlined";

    interface IconButtonProps {
        disabled?: boolean;
        type?: IconButtonType;
    }

    /**
     * `s-icon-button` - 图标按钮组件
     */
    class IconButton extends SoberElement {
        disabled: boolean;
        type: IconButtonType;
    }

    // ==================== LinearProgress ====================

    interface LinearProgressProps {
        indeterminate?: boolean;
        animated?: boolean;
        max?: number;
        value?: number;
    }

    /**
     * `s-linear-progress` - 线性进度条组件
     */
    class LinearProgress extends SoberElement {
        indeterminate: boolean;
        animated: boolean;
        max: number;
        value: number;
    }

    // ==================== Menu ====================

    /**
     * `s-menu` - 菜单组件
     */
    class Menu extends SoberElement {}

    // ==================== MenuItem ====================

    interface MenuItemProps {
        checked?: boolean;
        folded?: boolean;
    }

    /**
     * `s-menu-item` - 菜单项组件
     */
    class MenuItem extends SoberElement {
        checked: boolean;
        folded: boolean;
    }

    // ==================== Navigation ====================

    type NavigationMode = "bottom" | "rail";

    interface NavigationProps {
        mode?: NavigationMode;
        value?: string;
    }

    /**
     * `s-navigation` - 导航组件
     */
    class Navigation extends SoberElement {
        mode: NavigationMode;
        value: string;
    }

    // ==================== NavigationItem ====================

    interface NavigationItemProps {
        selected?: boolean;
        value?: string;
    }

    /**
     * `s-navigation-item` - 导航项组件
     */
    class NavigationItem extends SoberElement {
        selected: boolean;
        value: string;
    }

    // ==================== Page ====================

    type PageTheme = "light" | "auto" | "dark";

    interface PageProps {
        theme?: PageTheme;
    }

    /**
     * `s-page` - 页面组件
     */
    class Page extends SoberElement {
        theme: PageTheme;

        /** 切换主题，支持视图过渡动画 */
        toggle(theme: PageTheme): Promise<void>;
    }

    // ==================== Pagination ====================

    type PaginationType = "standard" | "outlined";

    interface PaginationProps {
        value?: number;
        total?: number;
        count?: number;
        type?: PaginationType;
    }

    /**
     * `s-pagination` - 分页组件
     */
    class Pagination extends SoberElement {
        value: number;
        total: number;
        count: number;
        type: PaginationType;
    }

    // ==================== Picker ====================

    interface PickerProps {
        disabled?: boolean;
        label?: string;
        value?: string;
    }

    /**
     * `s-picker` - 选择器组件
     */
    class Picker extends SoberElement {
        disabled: boolean;
        label: string;
        value: string;

        /** 获取所有选项 */
        readonly options: PickerItem[];
        /** 获取当前选中索引 */
        readonly selectedIndex: number;

        show(): void;
        toggle(): void;
        close(): void;
    }

    // ==================== PickerItem ====================

    interface PickerItemProps {
        selected?: boolean;
        value?: string;
    }

    /**
     * `s-picker-item` - 选择器项组件
     */
    class PickerItem extends SoberElement {
        selected: boolean;
        value: string;
    }

    // ==================== Popup ====================

    type PopupAlign = "center" | "left" | "right";

    interface PopupProps {
        align?: PopupAlign;
    }

    interface PopupEvents {
        show: Event;
        showed: Event;
        closed: Event;
    }

    /**
     * `s-popup` - 弹出层组���
     *
     * @fires show - 显示时触发（可取消）
     * @fires showed - 显示动画完成后触发
     * @fires closed - 关闭动画完成后触发
     */
    class Popup extends SoberElement {
        align: PopupAlign;

        show(target?: HTMLElement | { x: number; y: number; origin?: string }): void;
        toggle(target?: HTMLElement | { x: number; y: number; origin?: string }): void;
        close(): void;
    }

    // ==================== PopupMenu ====================

    type PopupMenuGroup = "" | "start" | "end";

    interface PopupMenuProps {
        group?: PopupMenuGroup;
    }

    /**
     * `s-popup-menu` - 弹出菜单组件
     */
    class PopupMenu extends SoberElement {
        group: PopupMenuGroup;

        show(): void;
        toggle(): void;
        close(): void;
    }

    // ==================== PopupMenuItem ====================

    /**
     * `s-popup-menu-item` - 弹出菜单项组件
     */
    class PopupMenuItem extends SoberElement {}

    // ==================== RadioButton ====================

    interface RadioButtonProps {
        disabled?: boolean;
        checked?: boolean;
        name?: string;
        value?: string;
    }

    /**
     * `s-radio-button` - 单选按钮组件
     */
    class RadioButton extends SoberElement {
        disabled: boolean;
        checked: boolean;
        name: string;
        value: string;
    }

    // ==================== Rate ====================

    interface RateProps {
        readOnly?: boolean;
        max?: number;
        min?: number;
        value?: number;
        step?: number;
    }

    /**
     * `s-rate` - 评分组件
     */
    class Rate extends SoberElement {
        readOnly: boolean;
        max: number;
        min: number;
        value: number;
        step: number;
    }

    // ==================== Ripple ====================

    interface RippleProps {
        centered?: boolean;
        attached?: boolean;
    }

    /**
     * `s-ripple` - 水波纹组件
     */
    class Ripple extends SoberElement {
        centered: boolean;
        attached: boolean;
    }

    // ==================== ScrollView ====================

    /**
     * `s-scroll-view` - 滚动视图组件
     */
    class ScrollView extends SoberElement {}

    // ==================== Search ====================

    interface SearchProps {
        placeholder?: string;
        disabled?: boolean;
        value?: string;
        maxLength?: number;
        readOnly?: boolean;
    }

    /**
     * `s-search` - 搜索组件
     */
    class Search extends SoberElement {
        placeholder: string;
        disabled: boolean;
        value: string;
        maxLength: number;
        readOnly: boolean;

        /** 获取原生 input 元素 */
        readonly native: HTMLInputElement;
    }

    // ==================== SegmentedButton ====================

    type SegmentedButtonMode = "auto" | "fixed";

    interface SegmentedButtonProps {
        value?: string;
        mode?: SegmentedButtonMode;
    }

    /**
     * `s-segmented-button` - 分段按钮组件
     */
    class SegmentedButton extends SoberElement {
        value: string;
        mode: SegmentedButtonMode;

        /** 获取所有选项 */
        readonly options: SegmentedButtonItem[];
        /** 获取当前选中索引 */
        readonly selectedIndex: number;
    }

    // ==================== SegmentedButtonItem ====================

    interface SegmentedButtonItemProps {
        selected?: boolean;
        disabled?: boolean;
        selectable?: boolean;
        value?: string;
    }

    /**
     * `s-segmented-button-item` - 分段按钮项组件
     */
    class SegmentedButtonItem extends SoberElement {
        selected: boolean;
        disabled: boolean;
        selectable: boolean;
        value: string;
    }

    // ==================== Skeleton ====================

    /**
     * `s-skeleton` - 骨架屏组件
     */
    class Skeleton extends SoberElement {}

    // ==================== Slider ====================

    interface SliderProps {
        disabled?: boolean;
        labeled?: boolean;
        max?: number;
        min?: number;
        step?: number;
        value?: number;
    }

    /**
     * `s-slider` - 滑块组件
     */
    class Slider extends SoberElement {
        disabled: boolean;
        labeled: boolean;
        max: number;
        min: number;
        step: number;
        value: number;
    }

    // ==================== Snackbar ====================

    type SnackbarType = "none" | "info" | "success" | "warning" | "error";
    type SnackbarAlign = "auto" | "top" | "bottom";

    interface SnackbarProps {
        type?: SnackbarType;
        align?: SnackbarAlign;
        duration?: number;
    }

    interface SnackbarEvents {
        show: Event;
        showed: Event;
        closed: Event;
    }

    interface SnackbarAction {
        text: string;
        click: () => void;
    }

    interface SnackbarBuilderOptions {
        text?: string;
        type?: SnackbarType;
        align?: SnackbarAlign;
        duration?: number;
        icon?: Element | string;
        action?: string | SnackbarAction;
        root?: Element;
    }

    /**
     * `s-snackbar` - 消息条组件
     *
     * @fires show - 显示时触发
     * @fires showed - 显示动画完成后触发
     * @fires closed - 关闭动画完成后触发
     */
    class Snackbar extends SoberElement {
        type: SnackbarType;
        align: SnackbarAlign;
        duration: number;

        show(): void;
        close(): void;

        /** 快速创建消息条的静态方法 */
        static builder(options: SnackbarBuilderOptions): Snackbar;
    }

    // ==================== Switch ====================

    interface SwitchProps {
        disabled?: boolean;
        checked?: boolean;
    }

    /**
     * `s-switch` - 开关组件
     */
    class Switch extends SoberElement {
        disabled: boolean;
        checked: boolean;
    }

    // ==================== Tab ====================

    type TabMode = "scrollable" | "fixed";

    interface TabProps {
        mode?: TabMode;
        value?: string;
    }

    /**
     * `s-tab` - 标签栏组件
     */
    class Tab extends SoberElement {
        mode: TabMode;
        value: string;

        /** 获取所有选项 */
        readonly options: TabItem[];
        /** 获取当前选中索引 */
        readonly selectedIndex: number;
    }

    // ==================== TabItem ====================

    interface TabItemProps {
        selected?: boolean;
        value?: string;
    }

    /**
     * `s-tab-item` - 标签项组件
     */
    class TabItem extends SoberElement {
        selected: boolean;
        value: string;
    }

    // ==================== Table ====================

    /**
     * `s-table` - 表格组件
     */
    class Table extends SoberElement {}

    // ==================== Tbody ====================

    /**
     * `s-tbody` - 表格主体组件
     */
    class Tbody extends SoberElement {}

    // ==================== Td ====================

    /**
     * `s-td` - 表格单元格组件
     */
    class Td extends SoberElement {}

    // ==================== TextField ====================

    type TextFieldType = "text" | "number" | "password" | "multiline";

    interface TextFieldProps {
        label?: string;
        placeholder?: string;
        disabled?: boolean;
        type?: TextFieldType;
        error?: boolean;
        value?: string;
        maxLength?: number;
        readOnly?: boolean;
        multiLine?: boolean;
        countered?: boolean;
    }

    /**
     * `s-text-field` - 文本框组件
     */
    class TextField extends SoberElement {
        label: string;
        placeholder: string;
        disabled: boolean;
        type: TextFieldType;
        error: boolean;
        value: string;
        maxLength: number;
        readOnly: boolean;
        multiLine: boolean;
        countered: boolean;

        /** 获取原生 input 或 textarea 元素 */
        readonly native: HTMLInputElement | HTMLTextAreaElement;
    }

    // ==================== Th ====================

    /**
     * `s-th` - 表格表头单元格组件
     */
    class Th extends SoberElement {}

    // ==================== Thead ====================

    /**
     * `s-thead` - 表格表头组件
     */
    class Thead extends SoberElement {}

    // ==================== Tooltip ====================

    type TooltipAlign = "top" | "bottom" | "left" | "right";

    interface TooltipProps {
        align?: TooltipAlign;
        disabled?: boolean;
    }

    /**
     * `s-tooltip` - 工具提示组件
     */
    class Tooltip extends SoberElement {
        align: TooltipAlign;
        disabled: boolean;
    }

    // ==================== Tr ====================

    /**
     * `s-tr` - 表格行组件
     */
    class Tr extends SoberElement {}
}

// ==================== Global Declaration ====================

declare global {
    namespace sober {
        type AlertType = import("sober").AlertType;
        type ButtonType = import("sober").ButtonType;
        type CardType = import("sober").CardType;
        type ChipType = import("sober").ChipType;
        type DialogSize = import("sober").DialogSize;
        type IconButtonType = import("sober").IconButtonType;
        type NavigationMode = import("sober").NavigationMode;
        type PageTheme = import("sober").PageTheme;
        type PaginationType = import("sober").PaginationType;
        type PopupAlign = import("sober").PopupAlign;
        type PopupMenuGroup = import("sober").PopupMenuGroup;
        type SegmentedButtonMode = import("sober").SegmentedButtonMode;
        type SnackbarType = import("sober").SnackbarType;
        type SnackbarAlign = import("sober").SnackbarAlign;
        type TabMode = import("sober").TabMode;
        type TextFieldType = import("sober").TextFieldType;
        type TooltipAlign = import("sober").TooltipAlign;
    }

    interface sober {
        Alert: typeof import("sober").Alert;
        Appbar: typeof import("sober").Appbar;
        Avatar: typeof import("sober").Avatar;
        Badge: typeof import("sober").Badge;
        BottomSheet: typeof import("sober").BottomSheet;
        Button: typeof import("sober").Button;
        Card: typeof import("sober").Card;
        Carousel: typeof import("sober").Carousel;
        CarouselItem: typeof import("sober").CarouselItem;
        Checkbox: typeof import("sober").Checkbox;
        Chip: typeof import("sober").Chip;
        CircularProgress: typeof import("sober").CircularProgress;
        Date: typeof import("sober").Date;
        DatePicker: typeof import("sober").DatePicker;
        Dialog: typeof import("sober").Dialog;
        Divider: typeof import("sober").Divider;
        Drawer: typeof import("sober").Drawer;
        Empty: typeof import("sober").Empty;
        FAB: typeof import("sober").FAB;
        Field: typeof import("sober").Field;
        Fold: typeof import("sober").Fold;
        Icon: typeof import("sober").Icon;
        IconButton: typeof import("sober").IconButton;
        LinearProgress: typeof import("sober").LinearProgress;
        Menu: typeof import("sober").Menu;
        MenuItem: typeof import("sober").MenuItem;
        Navigation: typeof import("sober").Navigation;
        NavigationItem: typeof import("sober").NavigationItem;
        Page: typeof import("sober").Page;
        Pagination: typeof import("sober").Pagination;
        Picker: typeof import("sober").Picker;
        PickerItem: typeof import("sober").PickerItem;
        Popup: typeof import("sober").Popup;
        PopupMenu: typeof import("sober").PopupMenu;
        PopupMenuItem: typeof import("sober").PopupMenuItem;
        RadioButton: typeof import("sober").RadioButton;
        Rate: typeof import("sober").Rate;
        Ripple: typeof import("sober").Ripple;
        ScrollView: typeof import("sober").ScrollView;
        Search: typeof import("sober").Search;
        SegmentedButton: typeof import("sober").SegmentedButton;
        SegmentedButtonItem: typeof import("sober").SegmentedButtonItem;
        Skeleton: typeof import("sober").Skeleton;
        Slider: typeof import("sober").Slider;
        Snackbar: typeof import("sober").Snackbar;
        Switch: typeof import("sober").Switch;
        Tab: typeof import("sober").Tab;
        TabItem: typeof import("sober").TabItem;
        Table: typeof import("sober").Table;
        Tbody: typeof import("sober").Tbody;
        Td: typeof import("sober").Td;
        TextField: typeof import("sober").TextField;
        Th: typeof import("sober").Th;
        Thead: typeof import("sober").Thead;
        Tooltip: typeof import("sober").Tooltip;
        Tr: typeof import("sober").Tr;
    }

    var sober: sober;
}

// ==================== Custom Elements Registry ====================

declare module "*.html" {
    const value: string;
    export default value;
}

// ==================== JSX Type Augmentation ====================

declare global {
    namespace JSX {
        interface IntrinsicElements {
            "s-alert": Partial<import("sober").AlertProps>;
            "s-appbar": {};
            "s-avatar": Partial<import("sober").AvatarProps>;
            "s-badge": {};
            "s-bottom-sheet": Partial<import("sober").BottomSheetProps>;
            "s-button": Partial<import("sober").ButtonProps>;
            "s-card": Partial<import("sober").CardProps>;
            "s-carousel": Partial<import("sober").CarouselProps>;
            "s-carousel-item": Partial<import("sober").CarouselItemProps>;
            "s-checkbox": Partial<import("sober").CheckboxProps>;
            "s-chip": Partial<import("sober").ChipProps>;
            "s-circular-progress": Partial<import("sober").CircularProgressProps>;
            "s-date": Partial<import("sober").DateProps>;
            "s-date-picker": Partial<import("sober").DatePickerProps>;
            "s-dialog": Partial<import("sober").DialogProps>;
            "s-divider": {};
            "s-drawer": {};
            "s-empty": {};
            "s-fab": Partial<import("sober").FABProps>;
            "s-field": Partial<import("sober").FieldProps>;
            "s-fold": Partial<import("sober").FoldProps>;
            "s-icon": Partial<import("sober").IconProps>;
            "s-icon-button": Partial<import("sober").IconButtonProps>;
            "s-linear-progress": Partial<import("sober").LinearProgressProps>;
            "s-menu": {};
            "s-menu-item": Partial<import("sober").MenuItemProps>;
            "s-navigation": Partial<import("sober").NavigationProps>;
            "s-navigation-item": Partial<import("sober").NavigationItemProps>;
            "s-page": Partial<import("sober").PageProps>;
            "s-pagination": Partial<import("sober").PaginationProps>;
            "s-picker": Partial<import("sober").PickerProps>;
            "s-picker-item": Partial<import("sober").PickerItemProps>;
            "s-popup": Partial<import("sober").PopupProps>;
            "s-popup-menu": Partial<import("sober").PopupMenuProps>;
            "s-popup-menu-item": {};
            "s-radio-button": Partial<import("sober").RadioButtonProps>;
            "s-rate": Partial<import("sober").RateProps>;
            "s-ripple": Partial<import("sober").RippleProps>;
            "s-scroll-view": {};
            "s-search": Partial<import("sober").SearchProps>;
            "s-segmented-button": Partial<import("sober").SegmentedButtonProps>;
            "s-segmented-button-item": Partial<import("sober").SegmentedButtonItemProps>;
            "s-skeleton": {};
            "s-slider": Partial<import("sober").SliderProps>;
            "s-snackbar": Partial<import("sober").SnackbarProps>;
            "s-switch": Partial<import("sober").SwitchProps>;
            "s-tab": Partial<import("sober").TabProps>;
            "s-tab-item": Partial<import("sober").TabItemProps>;
            "s-table": {};
            "s-tbody": {};
            "s-td": {};
            "s-text-field": Partial<import("sober").TextFieldProps>;
            "s-th": {};
            "s-thead": {};
            "s-tooltip": Partial<import("sober").TooltipProps>;
            "s-tr": {};
        }
    }
}
