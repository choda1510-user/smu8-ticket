import {useNavigate, useParams} from "react-router";
import "./AdminPages.css";

function AdminReservationDetailPage() {
    const navigate = useNavigate();
    const {reserveId = "98653287"} = useParams();

    return (
        <section className="admin-page">
            <div className="admin-page__header">
                <div>
                    <span className="admin-page__eyebrow">예매 상세 정보</span>
                    <h1 className="admin-page__title">예매내역 상세 조회</h1>
                </div>
            </div>

            <div className="admin-page__detail-card admin-page__reservation-detail">
                <div className="admin-page__info-row">
                    <span>예매번호</span>
                    <strong>{reserveId}</strong>
                    <span />
                </div>
                <div className="admin-page__info-row">
                    <span>공연명</span>
                    <strong>AESPA CONCERT</strong>
                    <span />
                </div>
                <div className="admin-page__info-row">
                    <span>공연날짜 및 시간</span>
                    <strong>2026.06.13(토)</strong>
                    <strong>18:00</strong>
                </div>
                <div className="admin-page__info-row">
                    <span>좌석번호</span>
                    <strong>1층 A구역 E열 1번</strong>
                    <span />
                </div>
                <div className="admin-page__info-row">
                    <span>예매자</span>
                    <strong>홍길동</strong>
                    <span />
                </div>
                <div className="admin-page__info-row">
                    <span>아이디</span>
                    <strong>Honggildong@gmail.com</strong>
                    <span />
                </div>
                <div className="admin-page__info-row">
                    <span>예매일시</span>
                    <strong>26.06.10</strong>
                    <span />
                </div>
                <div className="admin-page__info-row">
                    <span>결제금액</span>
                    <strong>170,000원</strong>
                    <span />
                </div>

                <div className="admin-page__field" style={{marginTop: "28px"}}>
                    <label>
                        <input type="checkbox" /> 예매취소
                    </label>
                    <textarea placeholder="취소 사유를 입력하세요." />
                </div>

                <div className="admin-page__bottom-actions">
                    <button type="button" className="admin-page__button admin-page__button--pink">
                        예매취소
                    </button>
                    <button type="button" className="admin-page__button" onClick={() => navigate("/admin/reserve")}>
                        이전
                    </button>
                </div>
            </div>
        </section>
    );
}

export default AdminReservationDetailPage;
