
import Tasks from "./SVG/Tasks"
import Visits from "./SVG/Visits"
import Reports from "./SVG/Reports";
import Admin from "./SVG/Admin";
import ModalNavSection from "./ModalNavSection";
import { useNavigate } from "react-router-dom";

interface PropsInterface{
    closeModal: () => void
    className?: string;
}

function ModalNavBar({className = "", closeModal}: PropsInterface){
    const navClass = {
        active: "h-[100px] w-[125px] max-sm:h-[50px] max-sm:h-[62px] flex pt-2.5 flex-col cursor-pointer text-tLight dark:text-tLightD justify-center items-center gap-2.5 rounded-[8px]  transition duration-300" + " " + className,
        inactive: "h-[100px] w-[125px] max-sm:h-[50px] max-sm:h-[62px] flex pt-2.5 flex-col cursor-pointer text-tLight dark:text-tLightD justify-center items-center gap-2.5 rounded-[8px]  transition duration-300 hover:opacity-85 hover:bg-bgModal dark:hover:bg-bgModalD" + " " + className
    }

    const navigate = useNavigate();
  const hanleRouteClick = (data: string) => {
    closeModal()
    switch (data) {
      case "Посещаемость":
        navigate("/visit")
        break
      case "Работы":
        navigate("/task")
        break
      case "Отчеты":
        navigate("/report")
        break
      case "Админка":
        navigate("/admin")
        break
    
    }
  }
    return (
       <div className={"w-31.25 h-142.5 flex flex-col items-center gap-12.5" + " " + className}>
        {/* Заменил кнопки в левом навбарек на компоненты с пропсами, также теперь можно передавать активна ли страница для подсвечивания кнопки на навбаре через activityStatus */}
            <ModalNavSection className={navClass.inactive} childrenNode={<Visits />} onClick={hanleRouteClick} childrenText="Посещаемость" />
            <ModalNavSection className={navClass.inactive} childrenNode={<Tasks />} childrenText="Работы" onClick={hanleRouteClick} />
            <ModalNavSection className={navClass.inactive} childrenNode={<Reports />} childrenText="Отчеты" onClick={hanleRouteClick} />
            <ModalNavSection className={navClass.inactive} childrenNode={<Admin />} childrenText="Админка" onClick={hanleRouteClick} />

       </div> 
    )
}

export default ModalNavBar