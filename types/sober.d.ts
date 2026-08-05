/**
 * Sober - 轻量级的 Material 3 设计前端组件库
 * @see https://soberjs.com
 */

// ==================== Base ====================

/** 所有 Sober 组件的基类 */
declare class SoberElement extends HTMLElement {
    static define(name?: string): void;
}

// ==================== Alert ====================

declare type AlertType = "info" | "success" | "warning" | "error";

declare interface AlertProps {
    type?: AlertType;
}

declare class s_Alert extends SoberElement {
    type: AlertType;
    show(): void;
    close(): void;
}

// ==================== Appbar ====================

declare class s_Appbar extends SoberElement {}

// ==================== Avatar ====================

declare interface AvatarProps {
    src?: string;
}

declare class s_Avatar extends SoberElement {
    src: string;
}

// ==================== Badge ====================

declare class s_Badge extends SoberElement {}

// ==================== BottomSheet ====================

declare interface BottomSheetProps {
    showed?: boolean;
    disabledGesture?: boolean;
}

declare class s_BottomSheet extends SoberElement {
    showed: boolean;
    disabledGesture: boolean;
    show(): void;
    close(): void;
    toggle(): void;
}

// ==================== Button ====================

declare type ButtonType = "filled" | "elevated" | "filled-tonal" | "outlined" | "text";

declare interface ButtonProps {
    disabled?: boolean;
    type?: ButtonType;
}

declare class s_Button extends SoberElement {
    disabled: boolean;
    type: ButtonType;
}

// ==================== Card ====================

declare type CardType = "elevated" | "filled" | "outlined";

declare interface CardProps {
    type?: CardType;
    clickable?: boolean;
}

declare class s_Card extends SoberElement {
    type: CardType;
    clickable: boolean;
}

// ==================== Carousel ====================

declare interface CarouselProps {
    value?: string;
    autoplay?: boolean;
    duration?: number;
}

declare class s_Carousel extends SoberElement {
    value: string;
    autoplay: boolean;
    duration: number;
}

// ==================== CarouselItem ====================

declare interface CarouselItemProps {
    selected?: boolean;
    value?: string;
}

declare class s_CarouselItem extends SoberElement {
    selected: boolean;
    value: string;
}

// ==================== Checkbox ====================

declare interface CheckboxProps {
    disabled?: boolean;
    checked?: boolean;
    indeterminate?: boolean;
}

declare class s_Checkbox extends SoberElement {
    disabled: boolean;
    checked: boolean;
    indeterminate: boolean;
}

// ==================== Chip ====================

declare type ChipType = "filled" | "outlined";

declare interface ChipProps {
    type?: ChipType;
    value?: string;
    checked?: boolean;
    disabled?: boolean;
    clickable?: boolean;
}

declare class s_Chip extends SoberElement {
    type: ChipType;
    value: string;
    checked: boolean;
    disabled: boolean;
    clickable: boolean;
}

// ==================== CircularProgress ====================

declare interface CircularProgressProps {
    indeterminate?: boolean;
    animated?: boolean;
    max?: number;
    value?: number;
}

declare class s_CircularProgress extends SoberElement {
    indeterminate: boolean;
    animated: boolean;
    max: number;
    value: number;
}

// ==================== Date ====================

declare interface DateProps {
    value?: string;
    locale?: string;
    max?: string;
    min?: string;
}

declare class s_Date extends SoberElement {
    value: string;
    locale: string;
    max: string;
    min: string;
    addLocale(name: string, locale: Record<string, string>): void;
    setLocale(name: string): void;
}

// ==================== DatePicker ====================

declare interface DatePickerProps {
    value?: string;
    min?: string;
    max?: string;
    label?: string;
    positiveText?: string;
    negativeText?: string;
    format?: string;
    locale?: string;
}

declare class s_DatePicker extends SoberElement {
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

declare type DialogSize = "standard" | "full";

declare interface DialogProps {
    showed?: boolean;
    size?: DialogSize;
}

declare class s_Dialog extends SoberElement {
    showed: boolean;
    size: DialogSize;
    show(): void;
    close(): void;
}

// ==================== Divider ====================

declare class s_Divider extends SoberElement {}

// ==================== Drawer ====================

declare class s_Drawer extends SoberElement {}

// ==================== Empty ====================

declare class s_Empty extends SoberElement {}

// ==================== FAB ====================

declare interface FABProps {
    hidden?: boolean;
    disabled?: boolean;
}

declare class s_FAB extends SoberElement {
    hidden: boolean;
    disabled: boolean;
}

// ==================== Field ====================

declare interface FieldProps {
    focused?: boolean;
    fixed?: boolean;
}

declare class s_Field extends SoberElement {
    focused: boolean;
    fixed: boolean;
}

// ==================== Fold ====================

declare interface FoldProps {
    folded?: boolean;
}

declare class s_Fold extends SoberElement {
    folded: boolean;
}

// ==================== Icon ====================

declare type IconName =
    | 'none' | 'home' | 'add' | 'search' | 'menu'
    | 'arrow_back' | 'arrow_forward' | 'arrow_upward' | 'arrow_downward'
    | 'arrow_drop_up' | 'arrow_drop_down' | 'arrow_drop_left' | 'arrow_drop_right'
    | 'more_vert' | 'more_horiz' | 'close' | 'done'
    | 'chevron_up' | 'chevron_down' | 'chevron_left' | 'chevron_right'
    | 'light_mode' | 'dark_mode' | 'star' | 'favorite';

declare interface IconProps {
    name?: IconName;
    src?: string;
}

declare class s_Icon extends SoberElement {
    name: IconName;
    src: string;
}

// ==================== IconButton ====================

declare type IconButtonType = "standard" | "filled" | "filled-tonal" | "outlined";

declare interface IconButtonProps {
    disabled?: boolean;
    type?: IconButtonType;
}

declare class s_IconButton extends SoberElement {
    disabled: boolean;
    type: IconButtonType;
}

// ==================== LinearProgress ====================

declare interface LinearProgressProps {
    indeterminate?: boolean;
    animated?: boolean;
    max?: number;
    value?: number;
}

declare class s_LinearProgress extends SoberElement {
    indeterminate: boolean;
    animated: boolean;
    max: number;
    value: number;
}

// ==================== Menu ====================

declare class s_Menu extends SoberElement {}

// ==================== MenuItem ====================

declare interface MenuItemProps {
    checked?: boolean;
    folded?: boolean;
}

declare class s_MenuItem extends SoberElement {
    checked: boolean;
    folded: boolean;
}

// ==================== Navigation ====================

declare type NavigationMode = "bottom" | "rail";

declare interface NavigationProps {
    mode?: NavigationMode;
    value?: string;
}

declare class s_Navigation extends SoberElement {
    mode: NavigationMode;
    value: string;
}

// ==================== NavigationItem ====================

declare interface NavigationItemProps {
    selected?: boolean;
    value?: string;
}

declare class s_NavigationItem extends SoberElement {
    selected: boolean;
    value: string;
}

// ==================== Page ====================

declare type PageTheme = "light" | "auto" | "dark";

declare interface PageProps {
    theme?: PageTheme;
}

declare class s_Page extends SoberElement {
    theme: PageTheme;
    toggle(theme: PageTheme): Promise<void>;
}

// ==================== Pagination ====================

declare type PaginationType = "standard" | "outlined";

declare interface PaginationProps {
    value?: number;
    total?: number;
    count?: number;
    type?: PaginationType;
}

declare class s_Pagination extends SoberElement {
    value: number;
    total: number;
    count: number;
    type: PaginationType;
}

// ==================== Picker ====================

declare interface PickerProps {
    disabled?: boolean;
    label?: string;
    value?: string;
}

declare class s_Picker extends SoberElement {
    disabled: boolean;
    label: string;
    value: string;
    readonly options: s_PickerItem[];
    readonly selectedIndex: number;
    show(): void;
    toggle(): void;
    close(): void;
}

// ==================== PickerItem ====================

declare interface PickerItemProps {
    selected?: boolean;
    value?: string;
}

declare class s_PickerItem extends SoberElement {
    selected: boolean;
    value: string;
}

// ==================== Popup ====================

declare type PopupAlign = "center" | "left" | "right";

declare interface PopupProps {
    align?: PopupAlign;
}

declare class s_Popup extends SoberElement {
    align: PopupAlign;
    show(target?: HTMLElement | { x: number; y: number; origin?: string }): void;
    toggle(target?: HTMLElement | { x: number; y: number; origin?: string }): void;
    close(): void;
}

// ==================== PopupMenu ====================

declare type PopupMenuGroup = "" | "start" | "end";

declare interface PopupMenuProps {
    group?: PopupMenuGroup;
}

declare class s_PopupMenu extends SoberElement {
    group: PopupMenuGroup;
    show(): void;
    toggle(): void;
    close(): void;
}

// ==================== PopupMenuItem ====================

declare class s_PopupMenuItem extends SoberElement {}

// ==================== RadioButton ====================

declare interface RadioButtonProps {
    disabled?: boolean;
    checked?: boolean;
    name?: string;
    value?: string;
}

declare class s_RadioButton extends SoberElement {
    disabled: boolean;
    checked: boolean;
    name: string;
    value: string;
}

// ==================== Rate ====================

declare interface RateProps {
    readOnly?: boolean;
    max?: number;
    min?: number;
    value?: number;
    step?: number;
}

declare class s_Rate extends SoberElement {
    readOnly: boolean;
    max: number;
    min: number;
    value: number;
    step: number;
}

// ==================== Ripple ====================

declare interface RippleProps {
    centered?: boolean;
    attached?: boolean;
}

declare class s_Ripple extends SoberElement {
    centered: boolean;
    attached: boolean;
}

// ==================== ScrollView ====================

declare class s_ScrollView extends SoberElement {}

// ==================== Search ====================

declare interface SearchProps {
    placeholder?: string;
    disabled?: boolean;
    value?: string;
    maxLength?: number;
    readOnly?: boolean;
}

declare class s_Search extends SoberElement {
    placeholder: string;
    disabled: boolean;
    value: string;
    maxLength: number;
    readOnly: boolean;
    readonly native: HTMLInputElement;
}

// ==================== SegmentedButton ====================

declare type SegmentedButtonMode = "auto" | "fixed";

declare interface SegmentedButtonProps {
    value?: string;
    mode?: SegmentedButtonMode;
}

declare class s_SegmentedButton extends SoberElement {
    value: string;
    mode: SegmentedButtonMode;
    readonly options: s_SegmentedButtonItem[];
    readonly selectedIndex: number;
}

// ==================== SegmentedButtonItem ====================

declare interface SegmentedButtonItemProps {
    selected?: boolean;
    disabled?: boolean;
    selectable?: boolean;
    value?: string;
}

declare class s_SegmentedButtonItem extends SoberElement {
    selected: boolean;
    disabled: boolean;
    selectable: boolean;
    value: string;
}

// ==================== Skeleton ====================

declare class s_Skeleton extends SoberElement {}

// ==================== Slider ====================

declare interface SliderProps {
    disabled?: boolean;
    labeled?: boolean;
    max?: number;
    min?: number;
    step?: number;
    value?: number;
}

declare class s_Slider extends SoberElement {
    disabled: boolean;
    labeled: boolean;
    max: number;
    min: number;
    step: number;
    value: number;
}

// ==================== Snackbar ====================

declare type SnackbarType = "none" | "info" | "success" | "warning" | "error";
declare type SnackbarAlign = "auto" | "top" | "bottom";

declare interface SnackbarProps {
    type?: SnackbarType;
    align?: SnackbarAlign;
    duration?: number;
}

declare interface SnackbarAction {
    text: string;
    click: () => void;
}

declare interface SnackbarBuilderOptions {
    text?: string;
    type?: SnackbarType;
    align?: SnackbarAlign;
    duration?: number;
    icon?: Element | string;
    action?: string | SnackbarAction;
    root?: Element;
}

declare class s_Snackbar extends SoberElement {
    type: SnackbarType;
    align: SnackbarAlign;
    duration: number;
    show(): void;
    close(): void;
    static builder(options: SnackbarBuilderOptions): s_Snackbar;
}

// ==================== Switch ====================

declare interface SwitchProps {
    disabled?: boolean;
    checked?: boolean;
}

declare class s_Switch extends SoberElement {
    disabled: boolean;
    checked: boolean;
}

// ==================== Tab ====================

declare type TabMode = "scrollable" | "fixed";

declare interface TabProps {
    mode?: TabMode;
    value?: string;
}

declare class s_Tab extends SoberElement {
    mode: TabMode;
    value: string;
    readonly options: s_TabItem[];
    readonly selectedIndex: number;
}

// ==================== TabItem ====================

declare interface TabItemProps {
    selected?: boolean;
    value?: string;
}

declare class s_TabItem extends SoberElement {
    selected: boolean;
    value: string;
}

// ==================== Table ====================

declare class s_Table extends SoberElement {}

// ==================== Tbody ====================

declare class s_Tbody extends SoberElement {}

// ==================== Td ====================

declare class s_Td extends SoberElement {}

// ==================== TextField ====================

declare type TextFieldType = "text" | "number" | "password" | "multiline";

declare interface TextFieldProps {
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

declare class s_TextField extends SoberElement {
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
    readonly native: HTMLInputElement | HTMLTextAreaElement;
}

// ==================== Th ====================

declare class s_Th extends SoberElement {}

// ==================== Thead ====================

declare class s_Thead extends SoberElement {}

// ==================== Tooltip ====================

declare type TooltipAlign = "top" | "bottom" | "left" | "right";

declare interface TooltipProps {
    align?: TooltipAlign;
    disabled?: boolean;
}

declare class s_Tooltip extends SoberElement {
    align: TooltipAlign;
    disabled: boolean;
}

// ==================== Tr ====================

declare class s_Tr extends SoberElement {}

// ==================== Global sober Namespace ====================

declare namespace sober {
    type IconName = globalThis.IconName;
    type AlertType = globalThis.AlertType;
    type ButtonType = globalThis.ButtonType;
    type CardType = globalThis.CardType;
    type ChipType = globalThis.ChipType;
    type DialogSize = globalThis.DialogSize;
    type IconButtonType = globalThis.IconButtonType;
    type NavigationMode = globalThis.NavigationMode;
    type PageTheme = globalThis.PageTheme;
    type PaginationType = globalThis.PaginationType;
    type PopupAlign = globalThis.PopupAlign;
    type PopupMenuGroup = globalThis.PopupMenuGroup;
    type SegmentedButtonMode = globalThis.SegmentedButtonMode;
    type SnackbarType = globalThis.SnackbarType;
    type SnackbarAlign = globalThis.SnackbarAlign;
    type TabMode = globalThis.TabMode;
    type TextFieldType = globalThis.TextFieldType;
    type TooltipAlign = globalThis.TooltipAlign;

    const Alert: typeof s_Alert;
    const Appbar: typeof s_Appbar;
    const Avatar: typeof s_Avatar;
    const Badge: typeof s_Badge;
    const BottomSheet: typeof s_BottomSheet;
    const Button: typeof s_Button;
    const Card: typeof s_Card;
    const Carousel: typeof s_Carousel;
    const CarouselItem: typeof s_CarouselItem;
    const Checkbox: typeof s_Checkbox;
    const Chip: typeof s_Chip;
    const CircularProgress: typeof s_CircularProgress;
    const Date: typeof s_Date;
    const DatePicker: typeof s_DatePicker;
    const Dialog: typeof s_Dialog;
    const Divider: typeof s_Divider;
    const Drawer: typeof s_Drawer;
    const Empty: typeof s_Empty;
    const FAB: typeof s_FAB;
    const Field: typeof s_Field;
    const Fold: typeof s_Fold;
    const Icon: typeof s_Icon;
    const IconButton: typeof s_IconButton;
    const LinearProgress: typeof s_LinearProgress;
    const Menu: typeof s_Menu;
    const MenuItem: typeof s_MenuItem;
    const Navigation: typeof s_Navigation;
    const NavigationItem: typeof s_NavigationItem;
    const Page: typeof s_Page;
    const Pagination: typeof s_Pagination;
    const Picker: typeof s_Picker;
    const PickerItem: typeof s_PickerItem;
    const Popup: typeof s_Popup;
    const PopupMenu: typeof s_PopupMenu;
    const PopupMenuItem: typeof s_PopupMenuItem;
    const RadioButton: typeof s_RadioButton;
    const Rate: typeof s_Rate;
    const Ripple: typeof s_Ripple;
    const ScrollView: typeof s_ScrollView;
    const Search: typeof s_Search;
    const SegmentedButton: typeof s_SegmentedButton;
    const SegmentedButtonItem: typeof s_SegmentedButtonItem;
    const Skeleton: typeof s_Skeleton;
    const Slider: typeof s_Slider;
    const Snackbar: typeof s_Snackbar;
    const Switch: typeof s_Switch;
    const Tab: typeof s_Tab;
    const TabItem: typeof s_TabItem;
    const Table: typeof s_Table;
    const Tbody: typeof s_Tbody;
    const Td: typeof s_Td;
    const TextField: typeof s_TextField;
    const Th: typeof s_Th;
    const Thead: typeof s_Thead;
    const Tooltip: typeof s_Tooltip;
    const Tr: typeof s_Tr;
}

declare var sober: typeof sober;
