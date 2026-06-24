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
import BookingWaitingPage from "@/pages/BookingWaitingPage.tsx";
import BookingSelectPage from "@/pages/BookingSelectPage.tsx";
import BookingPayDetailPage from "@/pages/BookingPayDetailPage.tsx";
import BookingPaymentPage from "@/pages/BookingPaymentPage.tsx";
import BookingSuccessPage from "@/pages/BookingSuccessPage.tsx";
import AdminLayout from "@/layouts/admin/AdminLayout.tsx";
import AdminOperationPage from "@/pages/admin/AdminOperationPage.tsx";
import AdminVenueListPage from "@/pages/admin/AdminVenueListPage.tsx";
import AdminVenueDetailPage from "@/pages/admin/AdminVenueDetailPage.tsx";
import AdminVenueCreatePage from "@/pages/admin/AdminVenueCreatePage.tsx";
import AdminVenueEditPage from "@/pages/admin/AdminVenueEditPage.tsx";
import AdminReservationListPage from "@/pages/admin/AdminReservationListPage.tsx";
import AdminReservationDetailPage from "@/pages/admin/AdminReservationDetailPage.tsx";
import AdminConcertListPage from "@/pages/admin/AdminConcertListPage.tsx";
import AdminConcertDetailPage from "@/pages/admin/AdminConcertDetailPage.tsx";
import AdminConcertCreatePage from "@/pages/admin/AdminConcertCreatePage.tsx";
/*료
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
        <Route path={"/booking/waiting/:concertId"} element={<BookingWaitingPage />} />
        <Route path={"/booking/select/:concertId"} element={<BookingSelectPage />} />
        <Route path={"/booking/paydetail/:concertId"} element={<BookingPayDetailPage />} />
        <Route path={"/booking/payment/:concertId"} element={<BookingPaymentPage />} />
        <Route path={"/booking/success/:concertId"} element={<BookingSuccessPage />} />
        <Route path={"/login"} element={<LoginPage />} />
        <Route path={"/signup"} element={<SignUpPage />} />
        <Route path={"/admin"} element={<AdminLayout />}>
          <Route path={""} element={<AdminOperationPage />} />
          <Route path={"venues"} element={<AdminVenueListPage />} />
          <Route path={"venues/:venueId"} element={<AdminVenueDetailPage />} />
          <Route path={"venueadd"} element={<AdminVenueCreatePage />} />
          <Route path={"venues/:venueId/update"} element={<AdminVenueEditPage />} />
          <Route path={"reserve"} element={<AdminReservationListPage />} />
          <Route path={"reserve/:reserveId"} element={<AdminReservationDetailPage />} />
          <Route path={"concerts"} element={<AdminConcertListPage />} />
          <Route path={"concertadd"} element={<AdminConcertCreatePage />} />
          <Route path={"concerts/:concertId"} element={<AdminConcertDetailPage />} />
        </Route>

      </Routes>
    </BrowserRouter>
  )
}

export default App
