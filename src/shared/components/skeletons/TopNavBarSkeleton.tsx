import { useContext } from "react";
import ButtonSkeleton from "./ButtonSkeleton";
import InputSkeleton from "./InputSkeleton";
import { AuthContext } from "../../utils/contexts";
import FullSkeleton from "./FullSkeleton";



export default function TopNavBarSkeleton(){
    const role = useContext(AuthContext)
    return (
       <div className=" ml-34 max-sm:ml-0 h-25 mt-13.75 animate-bounce flex justify-between pl-3.75 items-end max-sm:items-center">
            <div className="flex gap-6.25 items-end">
                <InputSkeleton />
                <InputSkeleton />
            </div> 
        {role == "STUDENT" ?
            "" :
            role == "ADMIN" || role == "TEACHER" ?
            <div className="flex gap-6.25">
                <ButtonSkeleton />
                <ButtonSkeleton />
            </div>
            : <FullSkeleton /> }
       </div> 
    )
}