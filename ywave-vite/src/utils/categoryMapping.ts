/**
 * API 카테고리 코드를 한글 이름으로 매핑하는 유틸리티
 */

export const CATEGORY_MAPPING: { [key: string]: string } = {
  'MART_SUPER': '슈퍼/마트',
  'CAFE': '카페',
  'LIVING_CONVENIENCE': '생활편의',
  'RESTAURANT': '음식점',
  'ENTERTAINMENT': '오락',
  'MOVIE_PERFORMANCE': '영화/공연',
  'ETC': '기타',
  'CLOTHING_ACCESSORIES': '의류 잡화',
  'EDUCATION_STATIONERY': '교육/문구',
  'GAS_STATION': '주유소',
  'FLOWER_SHOP': '꽃집',
  'CONVENIENCE_STORE': '편의점',
  'ACCOMMODATION': '숙박',
  'SPORTS_FACILITY': '체육시설',
  'HAIR_SALON': '헤어샵',
  'MEDICAL_INSTITUTION': '의료기관',
  'BEAUTY': '뷰티'
};

/**
 * API 카테고리 코드 배열을 한글 이름으로 변환
 */
export const convertCategoryCodes = (categoryCodes: string[]): string[] => {
  return categoryCodes.map(code => CATEGORY_MAPPING[code] || code);
};
