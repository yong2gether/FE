/// <reference types="vite/client" />

declare module "*.svg" {
  const svgUrl: string;
  export default svgUrl;
}
