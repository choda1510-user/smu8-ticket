import {useState} from "react";

function BottomPaginationBar() {
    const [currentPage, setCurrentPage] = useState(1);


    return (
        <div className="pagination-container">
            <button className="pagenation-arrow"
                    onClick={()=> setCurrentPage(p=>p-1)}
                    disabled={currentPage <= 1}> ◀
            </button>
            <button className="pagenation-arrow"
            onClick={()=> setCurrentPage(1)}>1</button>
            {/* 추후 Array 로 구현 */}
            <button className="pagenation-arrow"
                    onClick={()=> setCurrentPage(2)}>2</button>
            <button className="pagenation-arrow"
                    onClick={()=> setCurrentPage(3)}>3</button>
            <button className="pagenation-arrow"
                    onClick={()=> setCurrentPage(p=>p+1)}
                    > ▶
            </button>
        </div>
    )
}
export default BottomPaginationBar;