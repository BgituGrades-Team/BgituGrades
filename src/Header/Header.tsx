//import { useEffect, useState } from "react";
import Logo from '../shared/components/SVG/Logo'
import DarkThemeeSwitcher from '../shared/components/SVG/DarkThemeSwitcher'





interface PropsInterface {
    handleThemeChange: () => void,
}


function Header({handleThemeChange}: PropsInterface){
    return (
        <div className={"bg-bgDarkD w-full h-[7.5vh] flex justify-center items-center"}>
            <div className="w-[90%] flex justify-between items-center ">
                <div className="h-full w-fit flex items-center gap-5">
                    <Logo />
                    <h1 className="text-6xl font-bold text-tLightD max-sm:text-2xl">BGITU.GRADES</h1>
                </div>
                <div className="h-fit w-fit max-sm:w-[48px] max-sm:h-[48px]">
                    <DarkThemeeSwitcher onClick={handleThemeChange}/>                    
                </div>
            </div>
        </div>
    )
}

export default Header