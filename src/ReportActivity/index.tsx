import { useSearchParams } from "react-router-dom"
import LeftNavBar from "../shared/components/LeftNavBar"
import { useEffect, useState } from "react"
import type {  DisciplineInterface, GroupInterface, ReportTableSample, StudentInterface } from "../shared/types/fromRequests"
import { getDisciplines, getDisciplinesByGroup, getGroups, getStudents } from "../shared/utils/apiRequests"
import { HubConnection } from "@microsoft/signalr"
import TableGeneratorSkeleton from "../shared/components/skeletons/TableGeneratorSkeleton"
import TopNavBarSkeleton from "../shared/components/skeletons/TopNavBarSkeleton"
import LeftNavBarSkeleton from "../shared/components/skeletons/LeftNavBarSkeleton"
import StudentTopNavBar from "../shared/components/StudentTopNavBar"
import ReportGenerator from "../shared/tableComponents/ReportGenerator"
import { setupSignalRReportsConnection } from "../shared/utils/signalRService"
import Loading from "../shared/components/SVG/Loading"

interface tableFromRequest {
    rows: ReportTableSample
}

export default function ReportActivity() {
    const [searchParams] = useSearchParams()
    const [isLoading, setIsLoading] = useState(true)
    const [tableIds, setTableIds] = useState<number[]>([])
    const [groups, setGroups] = useState<GroupInterface[]>([])
    const [disciplines, setDisciplines] = useState<DisciplineInterface[]>([])
    const [students, setStudents] = useState<StudentInterface[]>([])
    const [connection, setConnection] = useState<null | HubConnection>(null)
    const [reportProgress, setReportProgress] = useState<number | null>(null)
    const [reportDescription, setReportDescription] = useState<string | null>(null)
    const [table, setTable] = useState<tableFromRequest>()
    const [isTableReady, setIsTableReady] = useState(false)
    const [/*link*/, setLink] = useState<string | null>(null)



    useEffect(() => {
        // Подключаем сигнал
        const establishConnection = async () => {
            const con = await setupSignalRReportsConnection(localStorage.getItem("api_key"))
            console.log(con.state)

            setConnection(con)
        }
        if(connection == null) {
            establishConnection()
        }
    }, [connection])


    useEffect(() => {
        console.log(tableIds)
        const reloadDisciplines = async () => {
            const res: DisciplineInterface[] | undefined = await getDisciplinesByGroup(tableIds[0])
            if(res) {
                setDisciplines(res)
            }
        }

        const reloadStudents= async () => {
            const res: StudentInterface[] | undefined = await getStudents(tableIds[0])
            if(res) {
                setStudents(res)
            }
        }


        // Все группы и дисциалины для полей ввода
        const getParams = async () => {
            const respGroups: GroupInterface[] | undefined = await getGroups()
            const respDisciplines: DisciplineInterface[] | undefined = await getDisciplines()
            
            let respStudents: StudentInterface[] | undefined 

            const groupId = searchParams.get("groupid")
            if(groupId != undefined){
                respStudents = await getStudents(Number(groupId))
            }

            if(respGroups && groups.length == 0){
                setGroups(respGroups)
            }
            if(respDisciplines && disciplines.length == 0) {

                setDisciplines(respDisciplines)
            }
            if(respStudents && students.length == 0){
                setStudents(respStudents)
            }
            setIsLoading(false)
        }

        // Проверка, есть ли в query параметрах и дисциплина и группа и студент
        if(tableIds.length > 3){
            let reporttype
            switch (tableIds[3]){
                case 0 : {
                    reporttype = "PRESENCE"
                    break
                }
                case 1 : {
                    reporttype = "MARK"
                    break
                }
            }
            console.log("reportype: ", reporttype, "studentid: ", tableIds[2], tableIds[2] + 1, "disciplineid: ", tableIds[1], tableIds[1] + 1, "groupid: ", tableIds[0], tableIds[0] + 1)
            connection?.invoke("GenerateReport", {
                reporttype,
                studentIds: null,
                disciplineIds: [tableIds[1]],
                groupIds: [tableIds[0]]
            })
        }

        else if (tableIds.length > 2) {
            console.log(tableIds)
            reloadStudents()
            reloadDisciplines()
        } else if(tableIds.length > 1){
            reloadStudents()
            reloadDisciplines()
        } else if (tableIds.length > 0){
            reloadDisciplines()
        } else if (tableIds.length == 0) {
            getParams()
            
        }

        // Проверка, есть ли ключ в query параметрах
        const key = searchParams.get("key")
        if(key) {
            localStorage.setItem("api_key", key)
        }

    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [connection, searchParams, tableIds])




    // Поиск таблицы, если все query параметра заполены
    const handleSearch = () => {
        const groupid = searchParams.get("groupid")
        const disciplineid = searchParams.get("disciplineid")
        const studentid = searchParams.get("studentid")
        const reporttype = searchParams.get("reporttype")
        if((groupid != 'null' && disciplineid != 'null' && studentid != 'null' && reporttype != 'null') && disciplineid && groupid && studentid && reporttype) {
            setTableIds([Number(groupid), Number(disciplineid), Number(studentid), Number(reporttype)])
        }
        else if((groupid != 'null' && disciplineid != 'null' && studentid != 'null') && disciplineid && groupid && studentid){
            setTableIds([Number(groupid), Number(disciplineid), Number(studentid)])
        } else  if((groupid != 'null' && disciplineid != 'null' ) && disciplineid && groupid){
            setTableIds([Number(groupid), Number(disciplineid)])
        }  else if (groupid && groupid != 'null'){
            setTableIds([Number(groupid)])
        }
    }
        if (connection) {
            // if (link == null && tableIds.length > 3) {
            //     setIsLoading(true)
            // }
            connection.on("ReportReady", (_, link, sperm) => {
                setTable(sperm)
                if(link != null){
                    setIsTableReady(true)
                    console.log(link)
                    setLink(link)

                }
            })
            connection.on("ReportProgress", (_, pisun, yaitsa) => {
                setReportProgress(pisun)
                setReportDescription(yaitsa)

            })
        }


    if(isTableReady && connection && table) {
        console.log("Даю таблицу")
        return (
            <div className="w-full h-[90vh] bg-bgDark dark:bg-bgDarkD scroll-none bg- flex justify-center ">
                {
                // Пришлось сделать так, чтобы не было блика при смене роута
                isLoading ? 
                <div className="w-full h-[90vh]  duration-75 bg-bgDark dark:bg-bgDarkD scroll-none  flex justify-center items-center">
                    <div className="w-[90%]  flex blur-md bg-bgLight dark:bg-bgModalD flex-col gap-6.25">
                        <TopNavBarSkeleton />
                        <div className="flex gap-6.25">
                            <LeftNavBarSkeleton />
                            <TableGeneratorSkeleton/>
                        </div>
                        
                    </div>
                </div> :
                <div className="w-[90%] flex flex-col gap-6.25">
                    <StudentTopNavBar handleSearch={handleSearch} groups={groups} disciplines={disciplines} students={students}/>
                    <div className="flex gap-6.25">
                        <LeftNavBar visitsStatus={false} tasksStatus={false} reportStatus={true} adminStatus={false}/>
                        <ReportGenerator table={table.rows} isEditMode={false} connection={connection}  />
                    </div>
                </div>
                }   
            </div>
        )
    }

    if(connection) {
        console.log("возвращаю кал")
        return (
            <div className="w-full h-[90vh] bg-bgDark dark:bg-bgDarkD scroll-none bg- flex justify-center ">
                {
                // Пришлось сделать так, чтобы не было блика при смене роута
                isLoading ? 
                    <div className="w-full h-[90vh]  duration-75 bg-bgDark dark:bg-bgDarkD scroll-none  flex justify-center items-center">
                        <Loading progress={reportProgress} description={reportDescription} />
                        <div className="w-[90%]  flex blur-md bg-bgLight dark:bg-bgModalD flex-col gap-6.25">
                            <TopNavBarSkeleton />
                            <div className="flex gap-6.25">
                                <LeftNavBarSkeleton />
                                <TableGeneratorSkeleton/>
                            </div>
                            
                        </div>
                    </div> :
                    <div className="w-[90%] flex flex-col gap-6.25">
                        <StudentTopNavBar handleSearch={handleSearch} groups={groups} disciplines={disciplines} students={students}/>
                        <div className="flex gap-6.25">
                            <LeftNavBar visitsStatus={false} tasksStatus={false} reportStatus={true} adminStatus={false}/>
                        </div>
                    </div>
                }   
            </div>
        )
    }

    return (
        <div className="w-full h-[90vh]  duration-75 bg-bgDark dark:bg-bgDarkD scroll-none  flex justify-center items-center">
            <div className="w-[90%]  flex blur-md bg-bgLight dark:bg-bgModalD flex-col gap-6.25">
                <TopNavBarSkeleton />
                <div className="flex gap-6.25">
                    <LeftNavBarSkeleton />
                    <TableGeneratorSkeleton/>
                </div>
                
            </div>
        </div>
        )
}


