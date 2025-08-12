import React from "react";
import { Routes, Route } from "react-router-dom";
import Setting from "./Pages/Setting";
import Login from "./Pages/Login";
import SignUp from "./Pages/SignUp";
import Main from "./Pages/Main";
import Map from "./Pages/Map";
import Mypage from "./Pages/Mypage";
import BookMark from "./Pages/BookMark";
import SignUpComplete from "./Pages/SignUpComplete";

export default function RouterComponent() {
    return(
        <Routes>
            {/*셋팅 페이지 라우팅*/}
            <Route path="/" element={<Setting />} />
            {/*로그인 페이지 라우팅*/}
            <Route path="/login" element={<Login />} />
            {/*회원가입 페이지 라우팅*/}
            <Route path="/signup" element={<SignUp />} />
            {/*회원가입 완료 페이지 라우팅*/}
            <Route path="/signupcomplete" element={<SignUpComplete />} />
            {/*메인 페이지 라우팅*/}
            <Route path="/main" element={<Main />} />
            {/*지도 페이지 라우팅*/}
            <Route path="/map" element={<Map />} />
            {/*마이페이지 페이지 라우팅*/}
            <Route path="/mypage" element={<Mypage />} />
            {/*즐겨찾기 페이지 라우팅*/}
            <Route path="/bookmark" element={<BookMark />} />
        </Routes>
    )
}