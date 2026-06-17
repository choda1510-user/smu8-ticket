/*
 * 공연/예매중인 공연 티켓팅 오픈예정 하위 컴포넌트
 * OPEN(예매중인) | D-DAY(오픈예정)
 */

type OpenStatusBadgeProps = {
    status: string;
};

function OpenStatusBadge({status}: OpenStatusBadgeProps) {
    return <span>{status}</span>;
}

export default OpenStatusBadge;
