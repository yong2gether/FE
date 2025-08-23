import React from "react";
import { Routes, Route } from "react-router-dom";
import Setting from "./Pages/Setting";
import Login from "./Pages/Login/Login";
import SignUp from "./Pages/SignUp/SignUp";
import Main from "./Pages/Main/Main";
import Map from "./Pages/Map/Map";
import Mypage from "./Pages/MyPage/Mypage";
import BookMark from "./Pages/BookMark/BookMark";
import SignUpComplete from "./Pages/SignUp/SignUpComplete";
import CategoryRegion from "./Pages/Category/CategoryRegion";
import CategoryIndustry from "./Pages/Category/CategoryIndustry";
import CategoryResult from "./Pages/Category/CategoryResult";
import MypageProfile from "./Pages/MyPage/MypageProfile";
import MypageReview from "./Pages/MyPage/MypageReview";
import MainPlace from "./Pages/MainPlace";
import BookMarkAdd from "./Pages/BookMark/BookMarkAdd";
import BookMarkDetail from "./Pages/BookMark/BookMarkDetail";
import BookMarkEdit from "./Pages/BookMark/BookMarkEdit";

export default function RouterComponent(): React.JSX.Element {
    return(
        <Routes>
            {/*셋팅 페이지 라우팅*/}
            <Route path="/" element={<Setting />} />
            {/*로그인 페이지 라우팅*/}
            <Route path="/login" element={<Login />} />
            {/*회원가입 페이지 라우팅*/}
            <Route path="/signup" element={<SignUp />} />
            {/*회원가입 완료 페이지 라우팅*/}
            <Route path="/signup/complete" element={<SignUpComplete />} />
            {/*선호 카테고리 지역 페이지 라우팅*/}
            <Route path="/category/region" element={<CategoryRegion />} />
            {/*선호 카테고리 업종 페이지 라우팅*/}
            <Route path="/category/industry" element={<CategoryIndustry />} />
            {/*선호 카테고리 결과 페이지 라우팅*/}
            <Route path="/category/result" element={<CategoryResult />} />
            {/*메인 페이지 라우팅*/}
            <Route path="/main" element={<Main />} />
            {/*메인 장소 페이지 라우팅*/}
            <Route path="/main/place/:id" element={<MainPlace />} />
            {/*지도 페이지 라우팅*/}
            <Route path="/map" element={<Map />} />
            {/*마이페이지 페이지 라우팅*/}
            <Route path="/mypage" element={<Mypage />} />
            {/*마이페이지 프로필 편집 페이지 라우팅*/}
            <Route path="/mypage/profile" element={<MypageProfile />} />
            {/*마이페이지 리뷰 수정 페이지 라우팅*/}
            <Route path="/mypage/review" element={<MypageReview />} />
            {/*즐겨찾기 페이지 라우팅*/}
            <Route path="/bookmark" element={<BookMark />} />
            {/*즐겨찾기 추가 페이지 라우팅*/}
            <Route path="/bookmark/add" element={<BookMarkAdd />} />
            {/*즐겨찾기 상세 페이지 라우팅*/}
            <Route path="/bookmark/detail" element={<BookMarkDetail />} />
            {/*즐겨찾기 수정 페이지 라우팅*/}
            <Route path="/bookmark/edit" element={<BookMarkEdit />} />
        </Routes>
    );
}
