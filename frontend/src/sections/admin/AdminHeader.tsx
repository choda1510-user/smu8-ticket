import {Link, NavLink, useNavigate} from "react-router";
import useLogin from "@/hooks/useLogin.tsx";
import "./AdminHeader.css";

type AdminMenuItem = {
    label: string;
    to: string;
    children: {
        label: string;
        to: string;
    }[];
};

const adminMenuItems: AdminMenuItem[] = [
    {
        label: "공연장",
        to: "/admin/venues",
        children: [
            {label: "공연장 목록", to: "/admin/venues"},
            {label: "공연장 등록", to: "/admin/venueadd"},
        ],
    },
    {
        label: "공연",
        to: "/admin/concerts",
        children: [
            {label: "공연 목록", to: "/admin/concerts"},
            {label: "공연 등록", to: "/admin/concertadd"},
        ],
    },
    {
        label: "예매",
        to: "/admin/reserve",
        children: [
            {label: "예매 현황 조회", to: "/admin/reserve"},
        ],
    },
];

function AdminHeader() {
    const navigate = useNavigate();
    const {logout} = useLogin();

    const handleLogoutClick = async () => {
        const confirmed = confirm("로그아웃 하시겠습니까?");

        if (!confirmed) {
            return;
        }

        await logout();
        navigate("/");
    };

    return (
        <header className="admin-header">
            <div className="admin-header__inner">
                <Link to="/admin" className="admin-header__logo" aria-label="관리자 홈으로 이동">
                    SM
                </Link>

                <div className="admin-header__menu-area">
                    <nav className="admin-header__nav" aria-label="관리자 메뉴">
                        {adminMenuItems.map((item) => (
                            <NavLink
                                key={item.label}
                                to={item.to}
                                className={({isActive}) =>
                                    isActive
                                        ? "admin-header__menu-link active"
                                        : "admin-header__menu-link"
                                }
                            >
                                {item.label}
                            </NavLink>
                        ))}
                    </nav>

                    <div className="admin-header__mega-menu">
                        <div className="admin-header__mega-inner">
                            {adminMenuItems.map((item) => (
                                <section key={item.label} className="admin-header__mega-column">
                                    <NavLink to={item.to} className="admin-header__mega-title">
                                        {item.label}
                                    </NavLink>

                                    <div className="admin-header__mega-links">
                                        {item.children.map((child) => (
                                            <NavLink key={child.to} to={child.to}>
                                                {child.label}
                                            </NavLink>
                                        ))}
                                    </div>
                                </section>
                            ))}
                        </div>
                    </div>
                </div>

                <button type="button" className="admin-header__logout" onClick={handleLogoutClick}>
                    로그아웃
                </button>
            </div>
        </header>
    );
}

export default AdminHeader;
