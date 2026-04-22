import { useSearchParams } from "react-router-dom"
import LeftNavBar from "../shared/components/LeftNavBar"
import { useContext, useEffect, useState } from "react"
import type {  DisciplineInterface, GroupInterface, PeriodsInterface, ReportTableSample, StudentInterface } from "../shared/types/fromRequests"
import { downloadFile, getAllPeriods, getDisciplines, getDisciplinesByGroups, getGroups, getStudents } from "../shared/utils/apiRequests"
import { HubConnection } from "@microsoft/signalr"
import TableGeneratorSkeleton from "../shared/components/skeletons/TableGeneratorSkeleton"
import TopNavBarSkeleton from "../shared/components/skeletons/TopNavBarSkeleton"
import LeftNavBarSkeleton from "../shared/components/skeletons/LeftNavBarSkeleton"
import StudentTopNavBar from "../shared/components/StudentTopNavBar"
import ReportGenerator from "../shared/tableComponents/ReportGenerator"
import { setupSignalRReportsConnection } from "../shared/utils/signalRService"
//import Loading from "../shared/components/SVG/Loading"
import { ReverseSearchContext, SingleInputValuesContext,} from "../shared/utils/contexts"
import type { pipeBombInterface } from "../shared/types/interfaces"

interface tableFromRequest {
    rows: ReportTableSample
}

export default function ReportActivity() {
    const [searchParams] = useSearchParams()
    const [isLoading, setIsLoading] = useState(true)
    const [groups, setGroups] = useState<GroupInterface[]>([])
    const [disciplines, setDisciplines] = useState<DisciplineInterface[]>([])
    const [students, setStudents] = useState<StudentInterface[]>([])
    const [connection, setConnection] = useState<null | HubConnection>(null)
    // const [reportProgress, setReportProgress] = useState<number | null>(null)
    // const [reportDescription, setReportDescription] = useState<string | null>(null)
    const [table, setTable] = useState<tableFromRequest>()
    const [isTableReady, setIsTableReady] = useState(false)
    const [link, setLink] = useState<string | null>(null)
    const [downloadLink, setDownloadLink] = useState<string | null>(null)
    const [reverseSearchArray, setReverseSearchArray] = useState([false, false, false]);
    const [periods, setPeriods] = useState<PeriodsInterface[]>([])

    const [selectedDisciplines, setSelectedDisciplines] = useState<DisciplineInterface[]>([])
    const [selectedGroups, setSelectedGroups] = useState<GroupInterface[]>([])
    const [selectedStudents, setSelectedStudents] = useState<StudentInterface[]>([])
    //const [selectedPeriod] = useState<PeriodsInterface>()

    const repType = useContext(SingleInputValuesContext)?.repTypeVal
    
    const pipeBomb: pipeBombInterface = {
        "disciplines": [selectedDisciplines, setSelectedDisciplines],
        "groups": [selectedGroups, setSelectedGroups],
        "students": [selectedStudents, setSelectedStudents]
    }   

    useEffect(() => {
        // Подключаем сигнал
        const establishConnection = async () => {
            const con = await setupSignalRReportsConnection(sessionStorage.getItem("api_key"))
            console.log(con.state)

            setConnection(con)
        }
        if(connection == null) {
            establishConnection()
        }
    }, [connection])

    useEffect(() => {
        const getDownloadLink = async (link: string) => {
            const res: string | undefined = await downloadFile(link)
            if (res) {
                setDownloadLink(res)
                //setLink(null)
            }
        }
        if (link) {
            getDownloadLink(link)
        }
    }, [link])


    useEffect(() => {
        const reloadDisciplines = async () => {
            const res: DisciplineInterface[] | undefined = await getDisciplinesByGroups(selectedGroups.map(val => val.id)) // Исправить
            if(res) {
                setDisciplines(res)
            }
        }

        const reloadStudents = async () => {
            const res: StudentInterface[] | undefined = await getStudents(selectedGroups.map(val => val.id)) // Исправить
            if(res) {
                setStudents(res)
            }
        }

        // Все группы и дисциалины для полей ввода
        const getParams = async () => {
            const respGroups: GroupInterface[] | undefined = await getGroups()
            const respDisciplines: DisciplineInterface[] | undefined = await getDisciplines()
            const respPeriods: PeriodsInterface[] | undefined = await getAllPeriods()
            let respStudents: StudentInterface[] | undefined 

            if(periods.length == 0 && respPeriods){
                setPeriods(respPeriods)
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
        if((selectedDisciplines.length != 0 && selectedGroups.length != 0 && selectedStudents.length != 0)){
            let reporttype
            const params = repType
            switch (Number(params)){
                case 0 : {
                    reporttype = "PRESENCE"
                    break
                }
                case 1 : {
                    reporttype = "MARK"
                    break
                }
            }
            // console.log({
            //     reporttype,
            //     studentIds: selectedStudents,
            //     disciplineIds: selectedDisciplines,
            //     groupIds: selectedGroups,
            // })
            console.log("Делаю запрос в 1С")
            console.log(selectedStudents.length == students.length ? null : selectedStudents.map(val => val.id))
            connection?.invoke("GenerateReport", {
                periods,
                reporttype,
                studentIds: selectedStudents.length == students.length ? null : selectedStudents.map(val => val.id),
                disciplineIds: selectedDisciplines.length == disciplines.length ? null : selectedDisciplines.map(val => val.id),
                groupIds: selectedGroups.length == groups.length ? null : selectedGroups.map(val => val.id),
                // Группа, дисциплина, студент
                isReverse: reverseSearchArray
            })
        }
        else if((selectedDisciplines.length != 0 && selectedGroups.length != 0)){
            reloadStudents()
            reloadDisciplines()
        } else if ((selectedGroups.length != 0)){
            reloadDisciplines()
        } else {
            getParams()
        }

        // Проверка, есть ли ключ в query параметрах
        const key = searchParams.get("key")
        if(key) {
            localStorage.setItem("api_key", key)
        }

    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [connection, searchParams, selectedDisciplines, selectedGroups, selectedStudents, repType])

    // Поиск таблицы, если все query параметра заполены
    const handleSearch = () => {
        // const groupid = searchParams.get("groupid")?.split(",")
        // const disciplineid = searchParams.get("disciplineid")?.split(",")
        // const studentid = searchParams.get("studentid")?.split(",")
        // const reporttype = searchParams.get("reporttype")?.split(",")
        // if((groupid?.length != 0 && disciplineid?.length != 0 && studentid?.length != 0 && reporttype?.length != 0) && disciplineid && groupid && studentid && reporttype) {
        //     setTableIds([groupid.map(val => Number(val)), disciplineid.map(val => Number(val)), studentid.map(val => Number(val)), reporttype.map(val => Number(val))])
        // }
        // else if((groupid?.length != 0 && disciplineid?.length != 0 && studentid?.length != 0) && disciplineid && groupid && studentid){
        //     setTableIds([groupid.map(val => Number(val)), disciplineid.map(val => Number(val)), studentid.map(val => Number(val))])
        // } else  if((groupid?.length != 0 && disciplineid?.length != 0 ) && disciplineid && groupid){
        //     setTableIds([groupid.map(val => Number(val)), disciplineid.map(val => Number(val))])
        // }  else if (groupid && groupid?.length != 0){
        //     setTableIds([groupid.map(val => Number(val))])
        // }
    }
        if (connection) {
            // if (link == null && tableIds.length > 3) {
            //     setIsLoading(true)
            // }
            connection.on("ReportReady", (_, link, sperm) => {
                setTable(sperm)
                if(link != null){
                    setIsTableReady(true)
                    setLink(link)

                }
            })
            // connection.on("ReportProgress", (_, pisun, yaitsa) => {
            //     setReportProgress(pisun)
            //     setReportDescription(yaitsa)

            // })
        }


    if(isTableReady && connection && table) {
        return (
            <ReverseSearchContext value={{reverseSearchArray, setReverseSearchArray}}>
            <div className="w-full min-h-[90vh] bg-bgDark dark:bg-bgDarkD scroll-none bg- flex justify-center ">
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
                    <StudentTopNavBar
                        link={downloadLink != null ? downloadLink : ""}
                        handleSearch={handleSearch}
                        periods={periods}
                        groups={groups}
                        disciplines={disciplines}
                        students={students}
                        pipeBomb={pipeBomb}
                        />
                    <div className="flex gap-6.25">
                        <LeftNavBar visitsStatus={false} tasksStatus={false} reportStatus={true} adminStatus={false} className="max-sm:hidden"/>
                        <ReportGenerator table={table.rows} isEditMode={false} connection={connection}  />
                    </div>
                </div>
                }   
            </div>
            </ReverseSearchContext>
        )
    }

    if(connection) {
        return (
            <ReverseSearchContext value={{reverseSearchArray, setReverseSearchArray}}>
            <div className="w-full min-h-[90vh] bg-bgDark dark:bg-bgDarkD scroll-none bg- flex justify-center ">
                {
                // Пришлось сделать так, чтобы не было блика при смене роута
                isLoading ? 
                    <div className="w-full h-[90vh]  duration-75 bg-bgDark dark:bg-bgDarkD scroll-none  flex justify-center items-center">
                        {/* <Loading progress={reportProgress} description={reportDescription} /> */}
                        <div className="w-[90%]  flex bg-bgLight dark:bg-bgModalD flex-col gap-6.25"> {/* тут был blur-md */}
                            <TopNavBarSkeleton />
                            <div className="flex gap-6.25">
                                <LeftNavBarSkeleton />
                                <TableGeneratorSkeleton/>
                            </div>
                            
                        </div>
                    </div> :
                    <div className="w-[90%] flex flex-col gap-6.25">
                        <StudentTopNavBar pipeBomb={pipeBomb} link={downloadLink != null ? downloadLink : ""} handleSearch={handleSearch} groups={groups} disciplines={disciplines} students={students} periods={periods}/>
                        <div className="flex gap-6.25">
                            <LeftNavBar visitsStatus={false} tasksStatus={false} reportStatus={true} adminStatus={false} className="max-sm:hidden"/>
                        </div>
                    </div>
                }   
            </div>
            </ReverseSearchContext>
        )
    }

    return (
        <div className="w-full h-[90vh]  duration-75 bg-bgDark dark:bg-bgDarkD scroll-none  flex justify-center items-center">
            <div className="w-[90%]  flex  flex-col gap-6.25"> {/* тут был blur-md   bg-bgLight dark:bg-bgModalD*/}
                <TopNavBarSkeleton />
                <div className="flex gap-6.25">
                    <LeftNavBarSkeleton />
                    <TableGeneratorSkeleton/>
                </div>
                
            </div>
        </div>
        )
}
