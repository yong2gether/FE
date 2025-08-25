import React from "react";
import {
  BiSolidBowlRice,
  BiSolidCoffeeAlt,
  BiSolidCameraMovie,
  BiPlusMedical,
  BiSolidCart,
  BiSolidPencil,
  BiSolidBed,
  BiSolidTime,
  BiSolidShoppingBagAlt,
  BiDumbbell,
  BiSolidGasPump,
  BiSolidMicrophone,
  BiSolidCategory,
  BiSolidStore,
  BiCut,
} from "react-icons/bi";
import { RiFlowerFill, RiSparklingFill } from "react-icons/ri";

interface Industry {
  id: number;
  icon: (props: { size: number }) => React.ReactElement;
  name: string;
  code: string;
  size?: number;
}

const RestaurantIcon = (props: { size: number }) => <BiSolidBowlRice size={props.size} />;
const CafeIcon = (props: { size: number }) => <BiSolidCoffeeAlt size={props.size} />;
const MovieIcon = (props: { size: number }) => <BiSolidCameraMovie size={props.size} />;
const HospitalIcon = (props: { size: number }) => <BiPlusMedical size={props.size} />;
const MartIcon = (props: { size: number }) => <BiSolidCart size={props.size} />;
const StationeryIcon = (props: { size: number }) => <BiSolidPencil size={props.size} />;
const HotelIcon = (props: { size: number }) => <BiSolidBed size={props.size} />;
const ConvenienceIcon = (props: { size: number }) => <BiSolidTime size={props.size} />;
const ClothingIcon = (props: { size: number }) => <BiSolidShoppingBagAlt size={props.size} />;
const GymIcon = (props: { size: number }) => <BiDumbbell size={props.size} />;
const GasIcon = (props: { size: number }) => <BiSolidGasPump size={props.size} />;
const MicIcon = (props: { size: number }) => <BiSolidMicrophone size={props.size} />;
const EtcIcon = (props: { size: number }) => <BiSolidCategory size={props.size} />;
const FlowerIcon = (props: { size: number }) => <RiFlowerFill size={props.size} />;
const StoreIcon = (props: { size: number }) => <BiSolidStore size={props.size} />;
const HaircutIcon = (props: { size: number }) => <BiCut size={props.size} />;
const BeautyIcon = (props: { size: number }) => <RiSparklingFill size={props.size} />;

export const industries: Industry[] = [
  { id: 1, icon: MicIcon, name: "오락", code: "ENTERTAINMENT" },
  { id: 2, icon: CafeIcon, name: "카페", code: "CAFE" },
  { id: 3, icon: RestaurantIcon, name: "음식점", code: "FOOD" },
  { id: 4, icon: ConvenienceIcon, name: "생활/편의", code: "LIFE_CONVENIENCE" },
  { id: 5, icon: MovieIcon, name: "영화/공연", code: "MOVIE_PERFORMANCE" },
  { id: 6, icon: EtcIcon, name: "기타", code: "ETC" },
  { id: 7, icon: ClothingIcon, name: "의류/잡화", code: "APPAREL" },
  { id: 8, icon: StationeryIcon, name: "교육/문구", code: "EDU_STATIONERY" },
  { id: 9, icon: GasIcon, name: "주유소", code: "GAS_STATION" },
  { id: 10, icon: FlowerIcon, name: "꽃집", code: "FLOWER" },
  { id: 11, icon: StoreIcon, name: "편의점", code: "CONVENIENCE_STORE" },
  { id: 12, icon: MartIcon, name: "슈퍼/마트", code: "SUPERMARKET" },
  { id: 13, icon: HotelIcon, name: "숙박", code: "LODGING" },
  { id: 14, icon: GymIcon, name: "체육시설", code: "SPORTS" },
  { id: 15, icon: HaircutIcon, name: "헤어샵", code: "HAIR" },
  { id: 16, icon: HospitalIcon, name: "의료기관", code: "MEDICAL" },
  { id: 17, icon: BeautyIcon, name: "뷰티", code: "BEAUTY" },
];
