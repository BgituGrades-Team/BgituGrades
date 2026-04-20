import { useNavigate } from "react-router-dom";
import NavSection from "./NavSection"
import Tasks from "./SVG/Tasks"
import Visits from "./SVG/Visits"
import Reports from "./SVG/Reports";
import Admin from "./SVG/Admin";
import { useContext } from "react";
import { AuthContext } from "../utils/contexts";

interface PropsInterface{
    visitsStatus:boolean;
    tasksStatus: boolean;
    reportStatus: boolean;
    adminStatus: boolean;
    className?: string;
}

function LeftNavBar({visitsStatus = false, tasksStatus = false, reportStatus = false, adminStatus = false, className = ""}: PropsInterface){
    const role = useContext(AuthContext)

    const navClass = {
        active: "h-[100px] w-[125px] flex pt-2.5 flex-col cursor-pointer text-tLight dark:text-tLightD justify-center items-center gap-2.5 rounded-[8px]  transition duration-300" + " " + className,
        inactive: "h-[100px] w-[125px] flex pt-2.5 flex-col cursor-pointer text-tLight dark:text-tLightD justify-center items-center gap-2.5 rounded-[8px]  transition duration-300 hover:opacity-85 hover:bg-bgModal dark:hover:bg-bgModalD" + " " + className
    }


    const navigate = useNavigate();
    function handleVisitClick(){
        navigate('/visit')

    }
    function handleTaskClick(){
        navigate('/task')

    }
    function handleReportClick(){
        navigate('/report')

    }
    function handleAdminClick(){
        navigate('/admin')

    }

    return (
       <div className={"w-31.25 h-142.5 flex flex-col items-center gap-12.5" + " " + className}>
        {/* Заменил кнопки в левом навбарек на компоненты с пропсами, также теперь можно передавать активна ли страница для подсвечивания кнопки на навбаре через activityStatus */}
            <NavSection className={visitsStatus ? navClass.active : navClass.inactive} childrenNode={<Visits />} onClick={handleVisitClick} childrenText="Посещаемость" activityStatus={visitsStatus} />
            <NavSection className={tasksStatus ? navClass.active : navClass.inactive} childrenNode={<Tasks />} childrenText="Работы" onClick={handleTaskClick} activityStatus={tasksStatus} />
            <NavSection className={(reportStatus ? navClass.active : navClass.inactive) + (role == "ADMIN" || role == "TEACHER" ? "" : " hidden")} childrenNode={<Reports />} childrenText="Отчеты" onClick={handleReportClick} activityStatus={reportStatus} />
            <NavSection className={(adminStatus ? navClass.active : navClass.inactive) + ((role == "ADMIN" ? "" : " hidden"))} childrenNode={<Admin />} childrenText="Админка" onClick={handleAdminClick} activityStatus={adminStatus} />

       </div> 
    )
}

export default LeftNavBar