import './App.css'
import {BrowserRouter, Navigate, Route, Routes} from "react-router";
import UserLayout from "@/layouts/UserLayout.tsx";
import UserMyPageLayout from "@/layouts/UserMyPageLayout.tsx";
import ConcertDetailsPage from "@/pages/ConcertDetailsPage.tsx";
import BookingDetailsPage from './pages/BookingDetailsPage'
import BookingListPage from './pages/BookingListPage'
import MyInfoPage from './pages/MyInfoPage'
import UserSearchResultLayout from './layouts/UserSearchResultLayout'
import ConcertListPage from './pages/ConcertListPage'
import GlobalConcertSearchPage from './pages/GlobalConcertSearchPage'
import ConcertHoleSearchResultPage from './pages/ConcertHoleSearchResultPage'
import LoginPage from './pages/LoginPage'
import SignUpPage from './pages/SignUpPage'
import ConcertSearchResultPage from "@/pages/ConcertSearchResultPage.tsx";
import HomePage from "@/pages/HomePage.tsx";
/*
* 리액트 라우터가 이곳에 있어야 함
*/
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<UserLayout/>}>
          <Route path={"/mypage"} element={<UserMyPageLayout></UserMyPageLayout>}>
            <Route path={"reserve/:reserveId"} element={<BookingDetailsPage/>}/>
            <Route path={"reserve"} element={<BookingListPage />} />
            <Route path={""} element={<MyInfoPage />} />
          </Route>
          <Route path={"/search"} element={<UserSearchResultLayout />}>
            <Route path={""} element={<Navigate to={'/search/all'} />} />
            <Route path={"all"} element={<GlobalConcertSearchPage />} />
            <Route path={"concerts"} element={<ConcertSearchResultPage />} />
            <Route path={"venues"} element={<ConcertHoleSearchResultPage />} />
          </Route>
          <Route path={"/concerts"}>
            <Route path={""} element={<ConcertListPage />} />
            <Route path={":concertId"} element={<ConcertDetailsPage />} />
            <Route path={":status"} element={<ConcertListPage />} />
          </Route>
          <Route path={""} element={<HomePage></HomePage>}/>
        </Route>
        <Route path={"/login"} element={<LoginPage />} />
        <Route path={"/signup"} element={<SignUpPage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
