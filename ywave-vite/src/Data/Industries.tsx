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
} from "react-icons/bi";

interface Industry {
  id: string;
  icon: (props: { size: number }) => React.ReactElement;
  name: string;
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

export const industries: Industry[] = [
    { id: "restaurant", icon: RestaurantIcon, name: "음식점", size: 16 },
  { id: "cafe", icon: CafeIcon, name: "카페", size: 16 },
  { id: "movie", icon: MovieIcon, name: "영화공연", size: 16 },
  { id: "mart", icon: MartIcon, name: "마트슈퍼", size: 16 },
  { id: "clothing", icon: ClothingIcon, name: "의류잡화" },
  { id: "gas", icon: GasIcon, name: "주유소" },
  { id: "convenience", icon: ConvenienceIcon, name: "생활편의" },
  { id: "hospital", icon: HospitalIcon, name: "의료" },
  { id: "stationery", icon: StationeryIcon, name: "교육문구" },
  { id: "hotel", icon: HotelIcon, name: "숙박" },
  { id: "gym", icon: GymIcon, name: "체육시설" },
];
