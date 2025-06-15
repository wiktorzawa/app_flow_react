declare module "sortablejs" {
  interface SortableOptions {
    group?:
      | string
      | { name: string; pull?: boolean | string; put?: boolean | string };
    sort?: boolean;
    delay?: number;
    delayOnTouchStart?: boolean;
    delayOnTouchOnly?: boolean;
    touchStartThreshold?: number;
    disabled?: boolean;
    store?: {
      get: (sortable: Sortable) => string[];
      set: (sortable: Sortable) => void;
    };
    animation?: number;
    easing?: string;
    handle?: string;
    filter?: string;
    preventOnFilter?: boolean;
    draggable?: string;
    dataIdAttr?: string;
    ghostClass?: string;
    chosenClass?: string;
    dragClass?: string;
    swapThreshold?: number;
    invertSwap?: boolean;
    invertedSwapThreshold?: number;
    direction?: "vertical" | "horizontal";
    forceFallback?: boolean;
    fallbackClass?: string;
    fallbackOnBody?: boolean;
    fallbackTolerance?: number;
    fallbackOffset?: { x: number; y: number };
    supportPointer?: boolean;
    emptyInsertThreshold?: number;
    setData?: (dataTransfer: DataTransfer, dragEl: HTMLElement) => void;
    onChoose?: (evt: SortableEvent) => void;
    onUnchoose?: (evt: SortableEvent) => void;
    onStart?: (evt: SortableEvent) => void;
    onEnd?: (evt: SortableEvent) => void;
    onAdd?: (evt: SortableEvent) => void;
    onUpdate?: (evt: SortableEvent) => void;
    onSort?: (evt: SortableEvent) => void;
    onRemove?: (evt: SortableEvent) => void;
    onFilter?: (evt: SortableEvent) => void;
    onMove?: (evt: SortableEvent, originalEvent: Event) => boolean | -1 | 1;
    onClone?: (evt: SortableEvent) => void;
    onChange?: (evt: SortableEvent) => void;
  }

  interface SortableEvent {
    to: HTMLElement;
    from: HTMLElement;
    item: HTMLElement;
    clone: HTMLElement;
    oldIndex: number | undefined;
    newIndex: number | undefined;
    oldDraggableIndex: number | undefined;
    newDraggableIndex: number | undefined;
    pullMode: string | boolean | undefined;
    cloned: boolean;
  }

  class Sortable {
    constructor(el: HTMLElement, options?: SortableOptions);
    static create(el: HTMLElement, options?: SortableOptions): Sortable;
    static get(element: HTMLElement): Sortable | undefined;
    static utils: {
      on(
        el: HTMLElement,
        event: string,
        fn: EventListenerOrEventListenerObject,
      ): void;
      off(
        el: HTMLElement,
        event: string,
        fn: EventListenerOrEventListenerObject,
      ): void;
      css(el: HTMLElement, prop: string, val?: string): string | void;
      find(
        ctx: HTMLElement,
        tagName: string,
        iterator?: (value: HTMLElement, index: number) => void,
      ): HTMLElement[];
      bind(ctx: any, fn: Function): Function;
      is(el: HTMLElement, selector: string): boolean;
      closest(
        el: HTMLElement,
        selector: string,
        ctx?: HTMLElement,
      ): HTMLElement | null;
      clone(el: HTMLElement): HTMLElement;
      toggleClass(el: HTMLElement, name: string, state: boolean): void;
      detectDirection(el: HTMLElement): string;
    };
    destroy(): void;
    option(name: string, value?: any): any;
    closest(el: HTMLElement, selector?: string): HTMLElement | null;
    toArray(): string[];
    sort(order: readonly string[], useAnimation?: boolean): void;
    save(): void;
  }

  export = Sortable;
}
