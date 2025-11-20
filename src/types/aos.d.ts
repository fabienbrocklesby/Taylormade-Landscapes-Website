declare module "aos" {
  export type AosDisableOption = boolean | string | ((element?: HTMLElement) => boolean);

  export interface AosOptions {
    disable?: AosDisableOption;
    startEvent?: string;
    initClassName?: string;
    animatedClassName?: string;
    useClassNames?: boolean;
    disableMutationObserver?: boolean;
    debounceDelay?: number;
    throttleDelay?: number;
    offset?: number;
    delay?: number;
    duration?: number;
    easing?: string;
    once?: boolean;
    mirror?: boolean;
    anchorPlacement?: string;
  }

  export interface AosInstance {
    init(options?: AosOptions): void;
    refresh(): void;
    refreshHard(): void;
    destroy(): void;
  }

  const AOS: AosInstance;
  export default AOS;
}
