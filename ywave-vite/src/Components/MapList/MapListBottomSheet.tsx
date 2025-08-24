import React, { useEffect, useState } from "react";
import styled, { css } from "styled-components";
import BottomSheet from "../BottomSheet";
import MapList from "./MapList";
import { IoMdRefresh } from "react-icons/io";
import { VscSettings } from "react-icons/vsc";
import { industries } from "../../Data/Industries";
import PublicDropdown from "../PublicDropdown";
import DeleteTag from "../DeleteTag";
import { calculateDistance, formatDistance } from "../../utils/distance";

interface MapListBottomSheetProps {
  onLocationRequest: () => void;
  onSearchThisArea: () => void;
  onSearch: (query: string) => void;
  showReSearch: boolean;
  storeMarkers: Array<{
    id: string;
    position: { lat: number; lng: number };
    category: string;
    name: string;
    address: string;
    images: string[];
    rating: number;
    reviewCount: number;
  }>;
  bottomOffsetPx: number;
  userLocation?: { lat: number; lng: number } | null;
  searchQuery?: string;
}

const BottomSheetContainer = styled.div`
   display: flex;
   width: 100%;
   flex-direction: column;
   align-items: flex-start;
   gap: 16px;
   min-height: 100%;
   position: relative;
   overflow: hidden;
`

const SearchInput = styled.input`
    display: flex;
    padding: 12px;
    align-items: center;
    gap: 10px;
    align-self: stretch;
    border-radius: 30px;
    background: var(--neutral-100-2);
    color: var(--neutral-600);
    border: 1px solid var(--neutral-100-2);
    flex-shrink: 0;

    &:focus {
        border: 1px solid var(--neutral-500);
    }
`

const ReSearchButton = styled.button`
  display: inline-flex;
  padding: 8px 12px;
  justify-content: center;
  align-items: center;
  gap: 4px;
  border-radius: 15px;
  background: var(--neutral-100);
  box-shadow: 0 4px 4px 0 rgba(0, 0, 0, 0.25);
  cursor: pointer;
  color: var(--neutral-1000);
`

const SettingContainer = styled.div`
  display: flex;
  flex-wrap: nowrap;
  align-items: center;
  gap: 8px;
  width: calc(100% + 40px);
  margin-left: -20px;
  padding: 0 20px;
  overflow-x: auto;
  overflow-y: hidden;
  -webkit-overflow-scrolling: touch;
  overscroll-behavior-x: contain;
  scrollbar-width: none;
  -ms-overflow-style: none;

  &::-webkit-scrollbar { display: none; }
`

const IndustryItem = styled.div<{ $isSelect: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 8px 12px;
  border: 1px solid var(--neutral-500);
  border-radius: 15px;
  color: var(--neutral-500);
  gap: var(--spacing-2xs);
  white-space: nowrap;
  cursor: pointer;
  flex: 0 0 auto;

  &:hover {
    border-color: var(--primary-blue-500);
    color: var(--primary-blue-500);
  }

  &:active {
    border-color: var(--primary-blue-600);
    color: var(--primary-blue-600);
  }

  ${props =>
    props.$isSelect &&
    css`
      border-color: var(--primary-blue-600);
      color: var(--primary-blue-600);
    `}
`;

const RegionSetting = styled.div`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 8px 12px;
  gap: 4px;
  border-radius: 15px;
  border: 1px solid var(--neutral-500);
  background: var(--neutral-100);
  color: var(--neutral-700);
  cursor: pointer;
  white-space: nowrap;
  flex: 0 0 auto;

  &:hover {
    border-color: var(--primary-blue-500);
    color: var(--primary-blue-500);
  }

  &:active {
    border-color: var(--primary-blue-600);
    color: var(--primary-blue-600);
  }
`

const RegionOverlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.25);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 3000;
`

const RegionDialog = styled.div`
  width: calc(100% - 40px);
  max-width: 340px;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 8px 24px rgba(0,0,0,0.2);
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 12px;
`

const RegionHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-weight: 600;
  color: var(--neutral-900);
`

const RegionList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`

const RegionChips = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
`

interface Option { index: number; value: string; }

export default function MapListBottomSheet({ 
  onLocationRequest, 
  onSearchThisArea, 
  onSearch, 
  showReSearch, 
  storeMarkers, 
  bottomOffsetPx, 
  userLocation,
  searchQuery = ""
}: MapListBottomSheetProps): React.JSX.Element {
  const [selectIndustries, setSelectIndustries] = useState<number[]>([]);
  const [sheetRatio, setSheetRatio] = useState<number>(0);
  const [regionModalOpen, setRegionModalOpen] = useState<boolean>(false);
  const [selectedRegion, setSelectedRegion] = useState<string>("지역 설정");

  const [selectCity, setSelectCity] = useState<Option | null>(null);
  const [selectGu, setSelectGu] = useState<Option | null>(null);
  const [selectDong, setSelectDong] = useState<Option | null>(null);
  const [selectRegions, setSelectRegions] = useState<string[]>([]);

  const handleIndustryClick = (clickId: number): void => {
    if (selectIndustries.includes(clickId)) {
      setSelectIndustries(selectIndustries.filter((id) => id !== clickId));
    } else {
      setSelectIndustries((prev) => [...prev, clickId]);
    }
  };

  const filteredStores = storeMarkers.filter(store => {
    // 업종 필터링
    if (selectIndustries.length > 0) {
      const storeCategory = industries.find(ind => ind.name === store.category)?.id;
      if (!storeCategory || !selectIndustries.includes(storeCategory)) {
        return false;
      }
    }
    
    // 검색어 필터링
    if (searchQuery && searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      const storeName = store.name.toLowerCase();
      const storeAddress = store.address.toLowerCase();
      const storeCategory = store.category.toLowerCase();
      
      if (!storeName.includes(query) && 
          !storeAddress.includes(query) && 
          !storeCategory.includes(query)) {
        return false;
      }
    }
    
    return true;
  });
   
  const topAccessory = showReSearch && sheetRatio <= 0.5 ? (
    <ReSearchButton className="Body__MediumSmall" onClick={onSearchThisArea}>
      <IoMdRefresh size={16} />
      이 지역에서 검색
    </ReSearchButton>
  ) : undefined;

  const cityOptions: Option[] = [
    { index: 0, value: "서울특별시" },
    { index: 1, value: "부산광역시" },
    { index: 2, value: "인천광역시" },
    { index: 3, value: "대구광역시" },
    { index: 4, value: "광주광역시" },
    { index: 5, value: "대전광역시" },
    { index: 6, value: "울산광역시" },
  ];

  useEffect(() => {
    if (selectCity && selectGu && selectDong) {
      const value = `${selectCity.value} ${selectGu.value} ${selectDong.value}`;
      setSelectRegions((prev) => [...prev, value]);
      setSelectCity(null);
      setSelectGu(null);
      setSelectDong(null);
    }
  }, [selectDong]);

  const handleDeleteRegion = (value: string): void => {
    setSelectRegions(selectRegions.filter((v) => v !== value));
  };

  const handleApplyRegion = (): void => {
    if (selectRegions.length > 0) {
      setSelectedRegion(selectRegions[selectRegions.length - 1]);
    }
    setRegionModalOpen(false);
  };

  const getDistance = (storePosition: { lat: number; lng: number }) => {
    if (!userLocation) return undefined;
    
    const distanceInMeters = calculateDistance(
      userLocation.lat,
      userLocation.lng,
      storePosition.lat,
      storePosition.lng
    );
    
    return formatDistance(distanceInMeters);
  };

  return (
    <BottomSheet 
      isOpen={true} 
      onClose={() => {}} 
      snapPoints={[0.15, 0.6, 0.95]} 
      initialSnapIndex={0} 
      bottomOffsetPx={bottomOffsetPx} 
      showOverlay={false} 
      dismissible={false}
      onProgressChange={(r) => setSheetRatio(r)}
      topAccessory={topAccessory}
    >
      <BottomSheetContainer>
        <SearchInput 
          className="Body__MediumDefault" 
          placeholder="장소 검색 (예: 카페, 서울역)" 
          value={searchQuery}
          onChange={(e) => onSearch(e.target.value)}
        />
        
        <SettingContainer>
          <RegionSetting onClick={() => setRegionModalOpen(true)}>
            <VscSettings size={16} />
            <div className="Body__Small">{selectedRegion}</div>
          </RegionSetting>
          {industries.map((industry) => (
            <IndustryItem key={industry.id} $isSelect={selectIndustries.includes(industry.id)} onClick={() => handleIndustryClick(industry.id)}>
              {industry.icon({size: 14})}
              <div className="Body__Small">{industry.name}</div>
            </IndustryItem>
          ))}
        </SettingContainer>

        {regionModalOpen && (
          <RegionOverlay onClick={() => setRegionModalOpen(false)}>
            <RegionDialog onClick={(e) => e.stopPropagation()}>
              <RegionHeader>
                <div className="Body__MediumDefault">지역 설정</div>
                <button className="Body__Small" style={{ background: "transparent", border: 0, cursor: "pointer", color: "var(--neutral-600)" }} onClick={() => setRegionModalOpen(false)}>닫기</button>
              </RegionHeader>
              <RegionList>
                <PublicDropdown options={cityOptions} placeholder="시/도" value={selectCity} onChange={setSelectCity} />
                <PublicDropdown options={cityOptions} placeholder="시/구/군" value={selectGu} onChange={setSelectGu} />
                <PublicDropdown options={cityOptions} placeholder="동/읍/면" value={selectDong} onChange={setSelectDong} />
              </RegionList>
              <RegionChips>
                {selectRegions.map((v) => (
                  <DeleteTag key={v} content={<>{v}</>} color={"var(--primary-blue-600)"} onClick={() => handleDeleteRegion(v)} />
                ))}
              </RegionChips>
              <div style={{ display: 'flex', gap: 8, marginTop: 4 }}>
                <button className="Body__MediumDefault" style={{ flex: 1, padding: '10px 12px', borderRadius: 10, border: '1px solid var(--neutral-300)', background: 'var(--neutral-100)', cursor: 'pointer' }} onClick={() => { setSelectCity(null); setSelectGu(null); setSelectDong(null); setSelectRegions([]); }}>초기화</button>
                <button className="Body__MediumDefault" style={{ flex: 1, padding: '10px 12px', borderRadius: 10, border: '1px solid var(--primary-blue-500)', background: 'var(--primary-blue-500)', color: '#fff', cursor: 'pointer' }} onClick={handleApplyRegion}>적용</button>
              </div>
            </RegionDialog>
          </RegionOverlay>
        )}

        {filteredStores.length > 0 ? (
          <>
            {filteredStores.map((store, index) => (
              <React.Fragment key={store.id}>
                <MapList 
                  name={store.name}
                  bookmark={false}
                  rating={store.rating || 0}
                  address={store.address}
                  category={store.category || "기타"}
                  images={store.images || []}
                  distance={getDistance({ lat: store.position.lat, lng: store.position.lng })}
                  storeId={store.id.toString()}
                />
                {index < filteredStores.length - 1 && (
                  <div style={{height: 1, background: "var(--neutral-200)", width: "100%"}} />
                )}
              </React.Fragment>
            ))}
          </>
        ) : (
          <div style={{ 
            textAlign: 'center', 
            padding: '20px',
            color: 'var(--neutral-500)'
          }}>
            {storeMarkers.length === 0 ? (
              <>
                <div>해당 지역에 가맹점이 없습니다</div>
                <div style={{ fontSize: '12px', marginTop: '8px' }}>
                  위치 권한을 허용하고 다시 시도해주세요
                </div>
              </>
            ) : (
              <>
                <div>선택한 업종에 해당하는 가맹점이 없습니다</div>
                <div style={{ fontSize: '12px', marginTop: '8px' }}>
                  다른 업종을 선택해보세요
                </div>
              </>
            )}
          </div>
        )}
      </BottomSheetContainer>
    </BottomSheet>
  );
}