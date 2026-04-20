import type { ReactNode } from "react";


interface PropsInterface{
    children?: ReactNode;
    onClick?: () => void;
    className?: string;
    disabled?: boolean
}


export default function Button({children = "Кнопка", disabled=false, className = "", onClick = () => {}}: PropsInterface){

    // Базовый внешний вид
    const buttonClass = "bg-primary dark:bg-primaryD text-[14px] text-center align-middle text-tLight dark:text-tLightD font-bold h-10 w-42.5 rounded-lg hover:opacity-75 transition-all duration-300 " + className;

    return (
        <button disabled={disabled} className={buttonClass} onClick={onClick}>
            {children}
        </button>
    )
}
