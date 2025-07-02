import React, { useState } from "react";
import {HiOutlineMenu, HiOutlineX} from "react-icons/hi";
import SideMenu from "./SideMenu";
import LogoButton from "../../LogoButton";
import { useNavigate } from "react-router-dom";

const Navbar = ({activeMenu}) => {
    const navigate = useNavigate();
    const [openSideMenu, setOpenSideMenu] = useState(false);
    return (
        <div className="flex items-center gap-2 bg-white border border-b border-gray-200/50 backdrop-blur-[2px] py-4 px-7 sticky top-0 z-30">
            <button 
                className="block lg:hidden text-black cursor-pointer"
                onClick={() => {
                    setOpenSideMenu(!openSideMenu);
                }}
            >
                {openSideMenu ? (
                    <HiOutlineX className="text-2xl" />
                ) : (
                    <HiOutlineMenu className="text-2xl" />
                )}
            </button>
            <LogoButton 
                onSeeMore={() => navigate("/dashboard")} 
            >
            </LogoButton>
            {openSideMenu && (
                <div className="fixed top-[61px] -ml-4 bg-white">
                    <SideMenu activeMenu={activeMenu} />
                </div>
            )}

        </div>
    )
}

export default Navbar