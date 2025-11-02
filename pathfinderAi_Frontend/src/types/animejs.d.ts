declare module 'animejs' {
  interface AnimeParams {
    targets?: any;
    duration?: number;
    delay?: number;
    easing?: string;
    direction?: string;
    loop?: boolean | number;
    autoplay?: boolean;
    complete?: () => void;
    update?: () => void;
    begin?: () => void;
    [key: string]: any;
  }

  interface AnimeInstance {
    play(): void;
    pause(): void;
    restart(): void;
    reverse(): void;
    seek(time: number): void;
    tick(time: number): void;
    finished: Promise<void>;
  }

  function anime(params: AnimeParams): AnimeInstance;
  
  export = anime;
}