//import { useEffect, useState } from "react";
import Logo from '../shared/components/SVG/Logo'
import DarkThemeeSwitcher from '../shared/components/SVG/DarkThemeSwitcher'





interface PropsInterface {
    handleThemeChange: () => void,
    openModal: () => void,
}


function Header({handleThemeChange, openModal}: PropsInterface){
    
    const route = window.location.pathname.slice(1);
    let routeName = ""
    switch (route) {
        case "task": {
            routeName = "Лаб. Работы"
            break
        }
        case "visit": {
            routeName = "Посещаемость"
            break
        }
        case "report": {
            routeName = "Отчеты"
            break
        }
        case "admin": {
            routeName = "Админинтратор"
            break
        }

        default: {
            routeName = "BGITU.GRADES"
        }
    }

    return (
        <div className={"bg-bgDarkD w-full h-[10vh] flex justify-center items-center"}>
            <div className="w-[90%] flex justify-between items-center ">
                <div className="h-full w-fit flex items-center gap-5">
                    <Logo onClick={openModal}/>
                    <h1 className="text-6xl font-bold text-tLightD max-sm:hidden">BGITU.GRADES</h1>
                    <h1 className="text-2xl font-bold text-tLightD sm:hidden max-sm:visible">{routeName}</h1>
                </div>
                <div className="h-fit w-fit max-sm:w-[48px] max-sm:h-[48px]">
                    <DarkThemeeSwitcher onClick={handleThemeChange}/>                    
                </div>
            </div>
        </div>
    )
}

export default Header