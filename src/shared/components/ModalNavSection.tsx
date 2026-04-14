import type { ReactNode } from "react";
import Visits from "./SVG/Visits";


interface PropsInterface{
    className?: string;
    childrenNode: ReactNode;
    childrenText: string;
    onClick?: (data: string) => void;
}




function ModalNavSection({className = "flex", childrenNode = <Visits />, childrenText = "Посещаемость", onClick = () => {"I,ve been clicked"}} : PropsInterface){
    const isActive = (status:boolean) => {
        if(status){
            return " bg-primary dark:bg:primaryD"
        } else {
            return " "
        }
    }
    return(
        <div className={className + isActive(false)} onClick={() => onClick(childrenText)}>
            {childrenNode}
            {childrenText}
        </div>
    )
}

export default ModalNavSection