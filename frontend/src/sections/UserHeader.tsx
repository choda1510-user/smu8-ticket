/*
* 로고 |검색창|검색or돋보기    로그인 회원가입
*   홈|공연
* */


function UserHeader() {
    return (
        <div className={"header-container"}>
            {/*헤더 상단 로그인/회원가입 */}
            <div className="header-top">
                <button>
                    로그인
                </button>
                <button>회원가입</button>
            </div>
            {/*헤더 미들 로고 / 검색창 */}
            <div className="header-middle">
                <div className="header-log">이미지 삽입해서 넣기</div>
                <div className="header-search"><input type="text" placeholder="검색어를 입력하세요"/>
                <button>🔍</button>
                </div>
            </div>
            <div className="header-bottom">
                <button>홈</button>
                <button>공연</button>
            </div>


        </div>
    )
}
export default UserHeader;