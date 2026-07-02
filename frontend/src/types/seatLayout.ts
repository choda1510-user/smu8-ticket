export type SeatLayoutSeatType = {
    id: string;
    name: string;
    price: string;
    color: string;
};

export const unavailableSeatTypeId = "__unavailable_seat__";
export const unavailableSeatGradeName = "__UNAVAILABLE__";
export const unavailableSeatGradeDisplayName = "선택불가";
export const unavailableSeatGradeColor = "#d0d5dd";

export type SeatLayoutGrid = string[][];

export type SeatLayout = {
    rowCount: number;
    columnCount: number;
    grid: SeatLayoutGrid;
    seatTypes: SeatLayoutSeatType[];
};

export type SeatEditMode = "paint" | "structureDelete";

export type SeatLayoutChangeHandler = (seatLayout: SeatLayout) => void;

export type UseSeatLayoutEditorParams = {
    seatLayout: SeatLayout;
    onSeatLayoutChange: SeatLayoutChangeHandler;
};

export type SeatLayoutEditorModel = {
    selectedSeatType: SeatLayoutSeatType | undefined;
    canUndoSeatDelete: boolean;
    seatTypeCounts: Record<string, number>;
    seatTypeName: string;
    seatPrice: string;
    seatTypeNameError: string;
    seatPriceError: string;
    selectedSeatTypeId: string;
    seatEditMode: SeatEditMode;
    rowDropTargetIndex: number | null;
    colDropTargetIndex: number | null;
    handleSeatTypeAddClick: () => void;
    handleSeatTypeUpdateClick: () => void;
    handleSeatTypeDeleteClick: () => void;
    handleSeatTypeNameChange: (value: string) => void;
    handleSeatPriceChange: (value: string) => void;
    selectSeatType: (seatType: SeatLayoutSeatType) => void;
    selectUnavailableSeat: () => void;
    selectAisle: () => void;
    toggleSeatEditMode: () => void;
    finishSeatDrag: () => void;
    handleSeatMouseDown: (rowIndex: number, colIndex: number) => void;
    handleSeatMouseEnter: (rowIndex: number, colIndex: number) => void;
    seatZoom: number;
    handleSeatMapWheel: (deltaY: number) => void;
    addSeatColumnLeft: () => void;
    addSeatColumn: () => void;
    addSeatRow: () => void;
    handleColumnDragStart: (colIndex: number) => void;
    handleColumnDragOver: (colIndex: number) => void;
    handleColumnDragLeave: () => void;
    handleColumnDrop: (colIndex: number) => void;
    handleRowDragStart: (rowIndex: number) => void;
    handleRowDragOver: (rowIndex: number) => void;
    handleRowDragLeave: () => void;
    handleRowDrop: (rowIndex: number) => void;
    handleSeatColumnClick: (colIndex: number) => void;
    handleSeatRowClick: (rowIndex: number) => void;
    getSeatColor: (seatTypeId: string) => string | undefined;
};
