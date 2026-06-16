/*
* 검색 / 중앙 네비게이션  공연
*                     |예매중인공연|티켓팅 오픈예정|
* */


function UserSearchResultMenu() {
    return (
        <div className="search-result-container">
            <div className="search-result-title">
                <span className="search-keyword">세종문화회관</span> 검색결과
            </div>
            <div className="search-result-tabs">
                <button className="tab-btn">통합검색</button>
                <button className="tab-btn">공연</button>
                <button className="tab-btn">공연장</button>
            </div>
        </div>
    )
}
export default UserSearchResultMenu;