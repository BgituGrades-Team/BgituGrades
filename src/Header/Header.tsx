//import { useEffect, useState } from "react";
import Logo from '../shared/components/SVG/Logo'
import DarkThemeeSwitcher from '../shared/components/SVG/DarkThemeSwitcher'
import { useContext } from 'react'
import { AuthContext } from '../shared/utils/contexts'





interface PropsInterface {
    handleThemeChange: () => void,
    openModal: () => void,
}


function Header({handleThemeChange, openModal}: PropsInterface){
    
    const authState = useContext(AuthContext)
    console.log(authState)
    return (
        <div className={"bg-bgDarkD w-full h-[10vh] flex justify-center items-center"}>
            <div className="w-[90%] flex justify-between items-center ">
                <div className="h-full w-fit flex items-center gap-5">
                    <Logo onClick={openModal}/>
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