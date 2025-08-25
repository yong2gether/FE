/**
 * 이모지를 Google Maps 마커 아이콘으로 변환하는 유틸리티
 */

export interface EmojiMarkerOptions {
  size?: number;
  backgroundColor?: string;
  borderColor?: string;
  borderWidth?: number;
}

/**
 * 이모지를 SVG 마커로 변환
 * @param emojiUnified 이모지의 unified 코드 (예: "1f4c1")
 * @param options 마커 옵션
 * @returns Google Maps Icon 객체
 */
export const createEmojiMarker = (
  emojiUnified: string,
  options: EmojiMarkerOptions = {}
): google.maps.Icon => {
  const {
    size = 36,
    backgroundColor = "#ffffff",
    borderColor = "#1976d2",
    borderWidth = 2
  } = options;

  // 이모지를 SVG로 변환
  const svg = `
    <svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
      <!-- 배경 원 -->
      <circle 
        cx="${size / 2}" 
        cy="${size / 2}" 
        r="${(size / 2) - borderWidth}" 
        fill="${backgroundColor}" 
        stroke="${borderColor}" 
        stroke-width="${borderWidth}"
      />
      <!-- 이모지 -->
      <text 
        x="${size / 2}" 
        y="${size / 2 + 8}" 
        text-anchor="middle" 
        font-size="${size * 0.6}" 
        font-family="'Segoe UI Emoji', 'Apple Color Emoji', 'Noto Color Emoji', sans-serif"
      >
        ${String.fromCodePoint(parseInt(emojiUnified, 16))}
      </text>
    </svg>
  `;

  // SVG를 data URL로 변환
  const dataUrl = `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;

  return {
    url: dataUrl,
    scaledSize: new google.maps.Size(size, size),
    anchor: new google.maps.Point(size / 2, size / 2),
    origin: new google.maps.Point(0, 0),
  };
};

/**
 * 이모지 unified 코드를 실제 이모지 문자로 변환
 * @param unified 이모지 unified 코드
 * @returns 이모지 문자
 */
export const unifiedToEmoji = (unified: string): string => {
  try {
    return String.fromCodePoint(parseInt(unified, 16));
  } catch (error) {
    console.warn(`이모지 변환 실패: ${unified}`, error);
    return "📁"; // 기본 폴더 이모지
  }
};

/**
 * 이모지 문자를 unified 코드로 변환
 * @param emoji 이모지 문자
 * @returns unified 코드
 */
export const emojiToUnified = (emoji: string): string => {
  try {
    return emoji.codePointAt(0)?.toString(16) || "1f4c1";
  } catch (error) {
    console.warn(`이모지 unified 변환 실패: ${emoji}`, error);
    return "1f4c1"; // 기본 폴더 이모지
  }
};
