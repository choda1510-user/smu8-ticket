import {useNavigate, useParams} from "react-router";
import "./AdminPages.css";

function AdminConcertDetailPage() {
    const navigate = useNavigate();
    const {concertId = "12345"} = useParams();

    return (
        <section className="admin-page">
            <div className="admin-page__header">
                <div>
                    <span className="admin-page__eyebrow">공연 상세 정보</span>
                    <h1 className="admin-page__title">공연 상세 조회</h1>
                </div>
            </div>

            <div className="admin-page__detail-card">
                <div className="admin-page__detail-actions">
                    <button type="button" className="admin-page__button">
                        변경
                    </button>
                    <button type="button" className="admin-page__button admin-page__button--muted">
                        삭제
                    </button>
                </div>

                <div className="admin-page__form-grid">
                    <label>공연 이름</label>
                    <input readOnly value="AESPA 콘서트" />
                    <span />

                    <label>공연 코드</label>
                    <input readOnly value={concertId} />
                    <span />

                    <label>공연 상태</label>
                    <input readOnly value="공연중" />
                    <span />

                    <label>공연기간</label>
                    <input readOnly value="날짜, 시간" />
                    <span />

                    <label>공연장</label>
                    <input readOnly value="고척돔" />
                    <span />

                    <label>공연장 코드</label>
                    <input readOnly value="986532" />
                    <span />

                    <label>해당공연 총좌석수</label>
                    <input readOnly value="N석" />
                    <span />

                    <label>예매완료 총좌석수</label>
                    <input readOnly value="N석" />
                    <span />

                    <label>예매 가능 기간</label>
                    <input readOnly value="예매기간" />
                    <span />
                </div>

                <section style={{marginTop: "38px"}}>
                    <h2 style={{fontSize: "15px", marginBottom: "14px"}}>좌석 정보</h2>
                    <div className="admin-page__seat-map" aria-label="좌석 정보 미리보기">
                        {Array.from({length: 32}).map((_, index) => (
                            <span key={index} />
                        ))}
                    </div>
                </section>

                <div className="admin-page__bottom-actions">
                    <button type="button" className="admin-page__button admin-page__button--pink" onClick={() => navigate("/admin/concerts")}>
                        이전
                    </button>
                    <button type="button" className="admin-page__button">
                        확인
                    </button>
                </div>
            </div>
        </section>
    );
}

export default AdminConcertDetailPage;
