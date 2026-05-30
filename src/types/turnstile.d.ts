interface TurnstileRenderOptions {
  sitekey: string;
  theme?: "light" | "dark" | "auto";
  callback?: (token: string) => void;
  "expired-callback"?: () => void;
  "error-callback"?: (errorCode?: string) => void;
}

interface Window {
  turnstile?: {
    render: (container: HTMLElement, options: TurnstileRenderOptions) => string;
    reset: (widgetId: string) => void;
    remove: (widgetId: string) => void;
  };
}
