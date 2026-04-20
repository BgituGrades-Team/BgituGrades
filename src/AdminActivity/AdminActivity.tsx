import { useContext } from "react";
import AdminTopNavBar from "../shared/components/AdminTopNavBar";
import LeftNavBar from "../shared/components/LeftNavBar";
import AdminResults from "../shared/tableComponents/AdminResults";
import { AuthContext } from "../shared/utils/contexts";






export default function AdminActivity(){
        const role = useContext(AuthContext)

        return (
            role == "ADMIN" ?
            <div className="w-full min-h-[90vh] bg-bgDark dark:bg-bgDarkD scroll-none bg- flex justify-center ">
                <div className="w-[90%] flex flex-col gap-6.25">
                    <AdminTopNavBar />
                    <div className="flex gap-6.25">
                        <LeftNavBar visitsStatus={false} tasksStatus={false} reportStatus={false} adminStatus={true}/>
                        <AdminResults  />
                    </div>
                </div>
            </div> :
            <div>
                Мимо.
            </div>
        )
}