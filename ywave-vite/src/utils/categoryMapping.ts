
export const CATEGORY_MAPPING: { [key: string]: string } = {
  'ENTERTAINMENT': '오락',
  'CAFE': '카페',
  'FOOD': '음식점',
  'LIFE_CONVENIENCE': '생활/편의',
  'MOVIE_PERFORMANCE': '영화/공연',
  'ETC': '기타',
  'APPAREL': '의류/잡화',
  'EDU_STATIONERY': '교육/문구',
  'GAS_STATION': '주유소',
  'FLOWER': '꽃집',
  'CONVENIENCE_STORE': '편의점',
  'SUPERMARKET': '슈퍼/마트',
  'LODGING': '숙박',
  'SPORTS': '체육시설',
  'HAIR': '헤어샵',
  'MEDICAL': '의료기관',
  'BEAUTY': '뷰티'
};

export const convertCategoryCodes = (categoryCodes: string[]): string[] => {
  return categoryCodes.map(code => CATEGORY_MAPPING[code] || code);
};

export const convertCategoryCode = (categoryCode: string): string => {
  return CATEGORY_MAPPING[categoryCode] || categoryCode;
};
