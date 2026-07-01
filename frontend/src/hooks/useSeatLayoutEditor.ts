import {useEffect, useMemo, useState} from "react";
import type {
    SeatLayout,
    SeatLayoutEditorModel,
    UseSeatLayoutEditorParams,
} from "@/types/seatLayout";

const colorPalette = ["#8f52ff", "#e86fa7", "#2f80ed", "#12b76a", "#f79009", "#6172f3", "#ef4444"];
const minSeatZoom = 0.5;
const maxSeatZoom = 1.6;
const seatZoomStep = 0.1;

function cloneGrid(grid: string[][]) {
    return grid.map((row) => [...row]);
}

function useSeatLayoutEditor({
    seatLayout,
    onSeatLayoutChange,
}: UseSeatLayoutEditorParams): SeatLayoutEditorModel {
    const [seatTypeName, setSeatTypeName] = useState("");
    const [seatPrice, setSeatPrice] = useState("");
    const [seatTypeNameError, setSeatTypeNameError] = useState("");
    const [seatPriceError, setSeatPriceError] = useState("");
    const [selectedSeatTypeId, setSelectedSeatTypeId] = useState("");
    const [isDragging, setIsDragging] = useState(false);
    const [seatEditMode, setSeatEditMode] = useState<"paint" | "structureDelete">("paint");
    const [seatUndoStack, setSeatUndoStack] = useState<string[][][]>([]);
    const [draggedRowIndex, setDraggedRowIndex] = useState<number | null>(null);
    const [draggedColIndex, setDraggedColIndex] = useState<number | null>(null);
    const [rowDropTargetIndex, setRowDropTargetIndex] = useState<number | null>(null);
    const [colDropTargetIndex, setColDropTargetIndex] = useState<number | null>(null);
    const [seatZoom, setSeatZoom] = useState(1);

    const selectedSeatType = seatLayout.seatTypes.find((type) => type.id === selectedSeatTypeId);
    const canUndoSeatDelete = seatUndoStack.length > 0;
    const seatTypeCounts = useMemo(() => {
        return seatLayout.seatTypes.reduce<Record<string, number>>((counts, type) => {
            counts[type.id] = seatLayout.grid.flat().filter((seat) => seat === type.id).length;
            return counts;
        }, {});
    }, [seatLayout.grid, seatLayout.seatTypes]);

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (!event.ctrlKey || event.key.toLowerCase() !== "z") {
                return;
            }

            setSeatUndoStack((currentStack) => {
                const previousGrid = currentStack[currentStack.length - 1];

                if (!previousGrid) {
                    return currentStack;
                }

                onSeatLayoutChange({
                    ...seatLayout,
                    rowCount: previousGrid.length,
                    columnCount: previousGrid[0]?.length ?? 0,
                    grid: cloneGrid(previousGrid),
                });

                return currentStack.slice(0, -1);
            });
        };

        window.addEventListener("keydown", handleKeyDown);

        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [onSeatLayoutChange, seatLayout]);

    const updateSeatLayout = (updater: (currentSeatLayout: SeatLayout) => SeatLayout) => {
        onSeatLayoutChange(updater(seatLayout));
    };

    const handleSeatTypeAddClick = () => {
        if (!seatTypeName.trim() || !seatPrice.trim()) {
            alert("좌석 타입 이름과 가격을 입력해주세요.");
            return;
        }

        const nextType = {
            id: String(Date.now()),
            name: seatTypeName.trim(),
            price: seatPrice.trim(),
            color: colorPalette[seatLayout.seatTypes.length % colorPalette.length],
        };

        updateSeatLayout((currentSeatLayout) => ({
            ...currentSeatLayout,
            seatTypes: [...currentSeatLayout.seatTypes, nextType],
        }));
        setSelectedSeatTypeId(nextType.id);
        setSeatTypeName("");
        setSeatPrice("");
    };

    const handleSeatTypeUpdateClick = () => {
        if (!selectedSeatType || !seatTypeName.trim() || !seatPrice.trim()) {
            alert("수정할 좌석 타입을 선택하고 이름과 가격을 입력해주세요.");
            return;
        }

        updateSeatLayout((currentSeatLayout) => ({
            ...currentSeatLayout,
            seatTypes: currentSeatLayout.seatTypes.map((type) =>
                type.id === selectedSeatType.id
                    ? {...type, name: seatTypeName.trim(), price: seatPrice.trim()}
                    : type,
            ),
        }));
    };

    const handleSeatTypeDeleteClick = () => {
        if (!selectedSeatType) {
            alert("삭제할 좌석 타입을 선택해주세요.");
            return;
        }

        if (!confirm("삭제 하시겠습니까?")) {
            return;
        }

        updateSeatLayout((currentSeatLayout) => ({
            ...currentSeatLayout,
            seatTypes: currentSeatLayout.seatTypes.filter((type) => type.id !== selectedSeatType.id),
            grid: currentSeatLayout.grid.map((row) =>
                row.map((seat) => (seat === selectedSeatType.id ? "" : seat)),
            ),
        }));
        setSelectedSeatTypeId("");
        setSeatTypeName("");
        setSeatPrice("");
    };

    const handleSeatTypeNameChange = (value: string) => {
        if (/[^a-zA-Z]/.test(value)) {
            setSeatTypeNameError("영문만 입력 가능");
        } else {
            setSeatTypeNameError("");
        }

        setSeatTypeName(value.replace(/[^a-zA-Z]/g, ""));
    };

    const handleSeatPriceChange = (value: string) => {
        if (/[^0-9]/.test(value)) {
            setSeatPriceError("숫자만 입력 가능합니다.");
        } else {
            setSeatPriceError("");
        }

        setSeatPrice(value.replace(/[^0-9]/g, ""));
    };

    const selectSeatType = (seatType: typeof selectedSeatType) => {
        if (!seatType) {
            return;
        }

        setSelectedSeatTypeId(seatType.id);
        setSeatTypeName(seatType.name);
        setSeatPrice(seatType.price);
    };

    const selectAisle = () => {
        setSelectedSeatTypeId("aisle");
    };

    const applySeat = (rowIndex: number, colIndex: number) => {
        updateSeatLayout((currentSeatLayout) => ({
            ...currentSeatLayout,
            grid: currentSeatLayout.grid.map((row, currentRowIndex) =>
                row.map((seat, currentColIndex) => {
                    if (currentRowIndex !== rowIndex || currentColIndex !== colIndex) {
                        return seat;
                    }

                    return selectedSeatTypeId === "aisle" ? "" : selectedSeatTypeId;
                }),
            ),
        }));
    };

    const handleSeatMouseDown = (rowIndex: number, colIndex: number) => {
        applySeat(rowIndex, colIndex);
        setIsDragging(true);
    };

    const handleSeatMouseEnter = (rowIndex: number, colIndex: number) => {
        if (!isDragging) {
            return;
        }

        applySeat(rowIndex, colIndex);
    };

    const addSeatColumn = () => {
        updateSeatLayout((currentSeatLayout) => ({
            ...currentSeatLayout,
            columnCount: currentSeatLayout.columnCount + 1,
            grid: currentSeatLayout.grid.map((row) => [...row, ""]),
        }));
    };

    const addSeatColumnLeft = () => {
        updateSeatLayout((currentSeatLayout) => ({
            ...currentSeatLayout,
            columnCount: currentSeatLayout.columnCount + 1,
            grid: currentSeatLayout.grid.map((row) => ["", ...row]),
        }));
    };

    const addSeatRow = () => {
        updateSeatLayout((currentSeatLayout) => ({
            ...currentSeatLayout,
            rowCount: currentSeatLayout.rowCount + 1,
            grid: [
                ...currentSeatLayout.grid,
                Array.from({length: currentSeatLayout.columnCount}, () => ""),
            ],
        }));
    };

    const pushSeatUndo = (grid: string[][]) => {
        setSeatUndoStack((currentStack) => [...currentStack.slice(-9), cloneGrid(grid)]);
    };

    const handleSeatRowClick = (rowIndex: number) => {
        if (seatEditMode !== "structureDelete" || seatLayout.rowCount <= 1) {
            return;
        }

        pushSeatUndo(seatLayout.grid);
        updateSeatLayout((currentSeatLayout) => ({
            ...currentSeatLayout,
            rowCount: currentSeatLayout.rowCount - 1,
            grid: currentSeatLayout.grid.filter((_, currentRowIndex) => currentRowIndex !== rowIndex),
        }));
    };

    const handleSeatColumnClick = (colIndex: number) => {
        if (seatEditMode !== "structureDelete" || seatLayout.columnCount <= 1) {
            return;
        }

        pushSeatUndo(seatLayout.grid);
        updateSeatLayout((currentSeatLayout) => ({
            ...currentSeatLayout,
            columnCount: currentSeatLayout.columnCount - 1,
            grid: currentSeatLayout.grid.map((row) =>
                row.filter((_, currentColIndex) => currentColIndex !== colIndex),
            ),
        }));
    };

    const moveSeatRow = (fromIndex: number, toIndex: number) => {
        if (fromIndex === toIndex) {
            return;
        }

        updateSeatLayout((currentSeatLayout) => {
            const nextGrid = cloneGrid(currentSeatLayout.grid);
            const [movedRow] = nextGrid.splice(fromIndex, 1);
            nextGrid.splice(toIndex, 0, movedRow);

            return {...currentSeatLayout, grid: nextGrid};
        });
    };

    const moveSeatColumn = (fromIndex: number, toIndex: number) => {
        if (fromIndex === toIndex) {
            return;
        }

        updateSeatLayout((currentSeatLayout) => ({
            ...currentSeatLayout,
            grid: currentSeatLayout.grid.map((row) => {
                const nextRow = [...row];
                const [movedSeat] = nextRow.splice(fromIndex, 1);
                nextRow.splice(toIndex, 0, movedSeat);
                return nextRow;
            }),
        }));
    };

    const handleColumnDrop = (colIndex: number) => {
        if (draggedColIndex !== null) {
            moveSeatColumn(draggedColIndex, colIndex);
            setDraggedColIndex(null);
        }

        setColDropTargetIndex(null);
    };

    const handleRowDrop = (rowIndex: number) => {
        if (draggedRowIndex !== null) {
            moveSeatRow(draggedRowIndex, rowIndex);
            setDraggedRowIndex(null);
        }

        setRowDropTargetIndex(null);
    };

    const getSeatColor = (seatTypeId: string) => {
        return seatLayout.seatTypes.find((type) => type.id === seatTypeId)?.color;
    };

    const handleSeatMapWheel = (deltaY: number) => {
        setSeatZoom((currentZoom) => {
            const nextZoom = deltaY > 0
                ? currentZoom - seatZoomStep
                : currentZoom + seatZoomStep;

            return Math.min(maxSeatZoom, Math.max(minSeatZoom, Number(nextZoom.toFixed(2))));
        });
    };

    return {
        selectedSeatType,
        canUndoSeatDelete,
        seatTypeCounts,
        seatTypeName,
        seatPrice,
        seatTypeNameError,
        seatPriceError,
        selectedSeatTypeId,
        seatEditMode,
        rowDropTargetIndex,
        colDropTargetIndex,
        handleSeatTypeAddClick,
        handleSeatTypeUpdateClick,
        handleSeatTypeDeleteClick,
        handleSeatTypeNameChange,
        handleSeatPriceChange,
        selectSeatType,
        selectAisle,
        toggleSeatEditMode: () =>
            setSeatEditMode((mode) => (mode === "paint" ? "structureDelete" : "paint")),
        finishSeatDrag: () => setIsDragging(false),
        handleSeatMouseDown,
        handleSeatMouseEnter,
        seatZoom,
        handleSeatMapWheel,
        addSeatColumnLeft,
        addSeatColumn,
        addSeatRow,
        handleColumnDragStart: setDraggedColIndex,
        handleColumnDragOver: setColDropTargetIndex,
        handleColumnDragLeave: () => setColDropTargetIndex(null),
        handleColumnDrop,
        handleRowDragStart: setDraggedRowIndex,
        handleRowDragOver: setRowDropTargetIndex,
        handleRowDragLeave: () => setRowDropTargetIndex(null),
        handleRowDrop,
        handleSeatColumnClick,
        handleSeatRowClick,
        getSeatColor,
    };
}

export default useSeatLayoutEditor;
