import {useState} from "react";

type BottomPaginationBarProps = {
    currentPage?: number;
    totalPages?: number;
    onPageChange?: (page: number) => void;
};

function BottomPaginationBar({
                                 currentPage: controlledCurrentPage,
                                 totalPages = 1,
                                 onPageChange,
                             }: BottomPaginationBarProps) {
    const [internalCurrentPage, setInternalCurrentPage] = useState(1);
    const currentPage = controlledCurrentPage ?? internalCurrentPage;
    const pageNumbers = Array.from({length: totalPages}, (_, index) => index + 1);

    const changePage = (page: number) => {
        const nextPage = Math.min(Math.max(page, 1), totalPages);

        if (onPageChange) {
            onPageChange(nextPage);
            return;
        }

        setInternalCurrentPage(nextPage);
    };

    return (
        <div className="pagination-container">
            <button className="pagenation-arrow"
                    onClick={() => changePage(currentPage - 1)}
                    disabled={currentPage <= 1}> ◀
            </button>
            {pageNumbers.map((page) => (
                <button
                    key={page}
                    className="pagenation-arrow"
                    onClick={() => changePage(page)}
                    aria-current={currentPage === page ? "page" : undefined}
                >
                    {page}
                </button>
            ))}
            <button className="pagenation-arrow"
                    onClick={() => changePage(currentPage + 1)}
                    disabled={currentPage >= totalPages}> ▶
            </button>
        </div>
    )
}
export default BottomPaginationBar;
