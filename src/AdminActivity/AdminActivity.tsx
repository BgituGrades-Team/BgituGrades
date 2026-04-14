import AdminTopNavBar from "../shared/components/AdminTopNavBar";
import LeftNavBar from "../shared/components/LeftNavBar";
import AdminResults from "../shared/tableComponents/AdminResults";






export default function AdminActivity(){
    

        return (
            <div className="w-full min-h-[90vh] bg-bgDark dark:bg-bgDarkD scroll-none bg- flex justify-center ">
                <div className="w-[90%] flex flex-col gap-6.25">
                    <AdminTopNavBar />
                    <div className="flex gap-6.25">
                        <LeftNavBar visitsStatus={false} tasksStatus={false} reportStatus={false} adminStatus={true}/>
                        <AdminResults  />
                    </div>
                </div>
            </div>
        )
}