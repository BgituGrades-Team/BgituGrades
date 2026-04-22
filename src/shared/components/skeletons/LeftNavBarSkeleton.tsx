import { useContext } from "react";
import NavSectionSkeleton from "./NavSectionSkeleton";
import { AuthContext } from "../../utils/contexts";





export default function LeftNavBarSkeleton() {
    const role = useContext(AuthContext)
    console.log(role)
    return (
       <div className="w-31.25 h-142.5  flex flex-col items-center gap-12.5  max-sm:hidden">
            <NavSectionSkeleton />
            <NavSectionSkeleton />
            {role == "STUDENT"  ?
                ""
            : role=="ADMIN" || role == "TEACHER" ? <div className="flex  flex-col items-center gap-12.5">
                    <NavSectionSkeleton />
                    <NavSectionSkeleton />
                </div> : 
            ""}
       </div> 
    )
}