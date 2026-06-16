import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import heroImg from './assets/hero.png'
import './App.css'
import {Route, Routes} from "react-router";
import UserLayout from "@/layouts/UserLayout.tsx";
import UserMyPageLayout from "@/layouts/UserMyPageLayout.tsx";
import ConcertDetailsPage from "@/pages/ConcertDetailsPage.tsx";
/*
* 리액트 라우터가 이곳에 있어야 함
*/
function App() {
  return (
      <Routes>
        <Route element={<UserLayout/>}>
          <Route path={"/mypage"} element={<UserMyPageLayout></UserMyPageLayout>}>
            <Route path={"/reserve/:reserveId"} element={<BookingDetailsPage/>}/>
          </Route>
          <Route path={"/concerts"} element={<BookingListPage/>}></Route>
            <Route path={"/concerts/:concertld"} element={<ConcertDetailsPage/>}></Route>
          <Route path={"/search/venuse"}/>
        </Route>
      </Routes>
  )
}

export default App
