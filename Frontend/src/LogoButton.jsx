import React from "react";


const LogoButton = ({onSeeMore}) => {

    return (
        <button className="flex items-center cursor-pointer" onClick={onSeeMore}>
            <h2 className="text-lg front-medium text-black ml-2">GoalVault</h2>

            <div className="w-20 h-12 flex items-center justify-center">
                <img src="../../images/Icon.png" alt="logo" />
            </div>
        </button>
    )
}

export default LogoButton