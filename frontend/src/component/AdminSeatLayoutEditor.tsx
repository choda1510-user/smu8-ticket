import {useEffect, useLayoutEffect, useRef} from "react";
import useSeatLayoutEditor from "@/hooks/useSeatLayoutEditor";
import type {SeatLayout, SeatLayoutChangeHandler} from "@/types/seatLayout";

interface AdminSeatLayoutEditorProps {
    seatLayout: SeatLayout;
    onSeatLayoutChange: SeatLayoutChangeHandler;
}

function AdminSeatLayoutEditor({
    seatLayout,
    onSeatLayoutChange,
}: AdminSeatLayoutEditorProps) {
    const editor = useSeatLayoutEditor({seatLayout, onSeatLayoutChange});
    const seatMapEditorRef = useRef<HTMLDivElement | null>(null);
    const seatMapScrollRef = useRef<HTMLDivElement | null>(null);
    const shouldCenterSeatViewRef = useRef(true);

    useEffect(() => {
        const seatMapEditor = seatMapEditorRef.current;

        if (!seatMapEditor) {
            return;
        }

        const handleWheel = (event: WheelEvent) => {
            if (!event.ctrlKey) {
                return;
            }

            event.preventDefault();
            editor.handleSeatMapWheel(event.deltaY);
        };

        seatMapEditor.addEventListener("wheel", handleWheel, {passive: false});

        return () => {
            seatMapEditor.removeEventListener("wheel", handleWheel);
        };
    }, [editor]);

    useLayoutEffect(() => {
        if (!shouldCenterSeatViewRef.current) {
            return;
        }

        const seatMapScroll = seatMapScrollRef.current;

        if (seatMapScroll) {
            seatMapScroll.scrollLeft = (seatMapScroll.scrollWidth - seatMapScroll.clientWidth) / 2;
        }

        shouldCenterSeatViewRef.current = false;
    }, [editor.seatZoom, seatLayout.columnCount]);

    const handleAddSeatColumnLeftClick = () => {
        shouldCenterSeatViewRef.current = true;
        editor.addSeatColumnLeft();
    };

    const handleAddSeatColumnRightClick = () => {
        shouldCenterSeatViewRef.current = true;
        editor.addSeatColumn();
    };

    return (
        <section className="admin-page__concert-section">
            <h2>좌석 / 가격 정책</h2>
            <div className="admin-page__seat-policy">
                <div className="admin-page__seat-controls">
                    <div className="admin-page__seat-counts">
                        <span>전체좌석 행 {seatLayout.rowCount}</span>
                        <span>열 {seatLayout.columnCount}</span>
                    </div>
                    <div className="admin-page__seat-type-form">
                        <div className="admin-page__input-stack">
                            <input
                                className={editor.seatTypeNameError ? "admin-page__input--error" : undefined}
                                value={editor.seatTypeName}
                                onChange={(event) => editor.handleSeatTypeNameChange(event.target.value)}
                                placeholder="좌석 타입 이름"
                            />
                            {editor.seatTypeNameError && (
                                <p className="admin-page__error-text">{editor.seatTypeNameError}</p>
                            )}
                        </div>
                        <div className="admin-page__input-stack">
                            <input
                                className={editor.seatPriceError ? "admin-page__input--error" : undefined}
                                value={editor.seatPrice}
                                onChange={(event) => editor.handleSeatPriceChange(event.target.value)}
                                placeholder="가격"
                                inputMode="numeric"
                            />
                            {editor.seatPriceError && (
                                <p className="admin-page__error-text">{editor.seatPriceError}</p>
                            )}
                        </div>
                        <button
                            type="button"
                            className="admin-page__button admin-page__button--add"
                            onClick={editor.handleSeatTypeAddClick}
                        >
                            새로추가
                        </button>
                    </div>
                    <div className="admin-page__seat-type-list">
                        {seatLayout.seatTypes.map((type) => (
                            <button
                                key={type.id}
                                type="button"
                                className={editor.selectedSeatTypeId === type.id ? "active" : undefined}
                                onClick={() => editor.selectSeatType(type)}
                            >
                                <span style={{background: type.color}} />
                                <small>{editor.seatTypeCounts[type.id] ?? 0}개 생성</small>
                                <strong>{type.name}</strong>
                                <em>{Number(type.price).toLocaleString()}원</em>
                            </button>
                        ))}
                        <button
                            type="button"
                            className={editor.selectedSeatTypeId === "aisle" ? "active" : undefined}
                            onClick={editor.selectAisle}
                        >
                            <span className="admin-page__aisle-color" />
                            통로/부분삭제
                        </button>
                    </div>
                    <div className="admin-page__seat-type-actions">
                        <button
                            type="button"
                            className="admin-page__button admin-page__button--light"
                            onClick={editor.handleSeatTypeUpdateClick}
                        >
                            수정
                        </button>
                        <button
                            type="button"
                            className="admin-page__button admin-page__button--muted"
                            onClick={editor.handleSeatTypeDeleteClick}
                        >
                            삭제
                        </button>
                    </div>
                </div>

                <div className="admin-page__seat-editor-area">
                    <div className="admin-page__seat-mode-bar">
                        <button
                            type="button"
                            className={editor.seatEditMode === "structureDelete" ? "active" : undefined}
                            onClick={editor.toggleSeatEditMode}
                        >
                            {editor.seatEditMode === "paint" ? "모드변경" : "삭제모드"}
                        </button>
                        <span>
                            {editor.seatEditMode === "paint"
                                ? "행/열 핸들을 드래그해 위치 변경"
                                : "행/열 핸들을 누르면 행/열 삭제"}
                            {editor.canUndoSeatDelete ? " · Ctrl+Z 복구 가능" : ""}
                        </span>
                    </div>

                <div
                    ref={seatMapEditorRef}
                    className="admin-page__seat-map-editor"
                    onMouseLeave={editor.finishSeatDrag}
                    onMouseUp={editor.finishSeatDrag}
                >
                    <button
                        type="button"
                        className="admin-page__seat-add admin-page__seat-add--left"
                        onClick={handleAddSeatColumnLeftClick}
                        aria-label="왼쪽 열 추가"
                    >
                        +
                    </button>
                    <button
                        type="button"
                        className="admin-page__seat-add admin-page__seat-add--right"
                        onClick={handleAddSeatColumnRightClick}
                        aria-label="오른쪽 열 추가"
                    >
                        +
                    </button>

                    <div ref={seatMapScrollRef} className="admin-page__seat-map-scroll">
                        <div className="admin-page__seat-map-scroll-inner">
                            <div className="admin-page__seat-map-content">
                                <div className="admin-page__seat-stage">STAGE</div>
                                <div className="admin-page__seat-map-canvas" style={{zoom: editor.seatZoom}}>
                                    <div
                                        className="admin-page__seat-column-handles"
                                        style={{gridTemplateColumns: `repeat(${seatLayout.columnCount}, 28px)`}}
                                    >
                                        {Array.from({length: seatLayout.columnCount}).map((_, colIndex) => (
                                            <button
                                                key={`col-${colIndex}`}
                                                type="button"
                                                draggable={editor.seatEditMode === "paint"}
                                                onClick={() => editor.handleSeatColumnClick(colIndex)}
                                                onDragStart={() => editor.handleColumnDragStart(colIndex)}
                                                onDragOver={(event) => {
                                                    event.preventDefault();
                                                    editor.handleColumnDragOver(colIndex);
                                                }}
                                                onDragLeave={editor.handleColumnDragLeave}
                                                onDrop={() => editor.handleColumnDrop(colIndex)}
                                                className={editor.colDropTargetIndex === colIndex ? "drop-target" : undefined}
                                                aria-label={`${colIndex + 1}열 핸들`}
                                            >
                                                {editor.seatEditMode === "structureDelete" ? "-" : ""}
                                            </button>
                                        ))}
                                    </div>
                                    <div className="admin-page__seat-grid-wrap">
                                        <div
                                            className="admin-page__seat-row-handles"
                                            style={{gridTemplateRows: `repeat(${seatLayout.rowCount}, 28px)`}}
                                        >
                                            {Array.from({length: seatLayout.rowCount}).map((_, rowIndex) => (
                                                <button
                                                    key={`row-${rowIndex}`}
                                                    type="button"
                                                    draggable={editor.seatEditMode === "paint"}
                                                    onClick={() => editor.handleSeatRowClick(rowIndex)}
                                                    onDragStart={() => editor.handleRowDragStart(rowIndex)}
                                                    onDragOver={(event) => {
                                                        event.preventDefault();
                                                        editor.handleRowDragOver(rowIndex);
                                                    }}
                                                    onDragLeave={editor.handleRowDragLeave}
                                                    onDrop={() => editor.handleRowDrop(rowIndex)}
                                                    className={editor.rowDropTargetIndex === rowIndex ? "drop-target" : undefined}
                                                    aria-label={`${rowIndex + 1}행 핸들`}
                                                >
                                                    {editor.seatEditMode === "structureDelete" ? "-" : ""}
                                                </button>
                                            ))}
                                        </div>
                                        <div
                                            className="admin-page__seat-grid"
                                            style={{gridTemplateColumns: `repeat(${seatLayout.columnCount}, 28px)`}}
                                        >
                                            {seatLayout.grid.map((row, rowIndex) =>
                                                row.map((seat, colIndex) => (
                                    <button
                                        key={`${rowIndex}-${colIndex}`}
                                        type="button"
                                        className={[
                                            "admin-page__seat-cell",
                                            editor.rowDropTargetIndex === rowIndex ? "row-drop-target" : "",
                                            editor.colDropTargetIndex === colIndex ? "col-drop-target" : "",
                                        ].filter(Boolean).join(" ")}
                                        style={{background: seat ? editor.getSeatColor(seat) : undefined}}
                                        onMouseDown={() => editor.handleSeatMouseDown(rowIndex, colIndex)}
                                        onMouseEnter={() => editor.handleSeatMouseEnter(rowIndex, colIndex)}
                                    />
                                                )),
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <button
                        type="button"
                        className="admin-page__seat-add admin-page__seat-add--bottom"
                        onClick={editor.addSeatRow}
                    >
                        +
                    </button>
                </div>
                <p className="admin-page__seat-zoom-guide">
                    Ctrl + 스크롤로 좌석맵 확대/축소 ({Math.round(editor.seatZoom * 100)}%)
                </p>
                </div>
            </div>
        </section>
    );
}

export default AdminSeatLayoutEditor;
