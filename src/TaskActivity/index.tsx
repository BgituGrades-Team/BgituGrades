import { useSearchParams } from "react-router-dom"
import LeftNavBar from "../shared/components/LeftNavBar"
import TopNavBar from "../shared/components/TopNavBar"
import WorkTableGenerator from "../shared/tableComponents/WorkTableGenerator"
import { useEffect, useState } from "react"
import type { WorkTableSample, DisciplineInterface, GroupInterface } from "../shared/types/fromRequests"
import { getDisciplines, getDisciplinesByGroups, getGroups } from "../shared/utils/apiRequests"
import { HubConnection } from "@microsoft/signalr"
import TableGeneratorSkeleton from "../shared/components/skeletons/TableGeneratorSkeleton"
import LeftNavBarSkeleton from "../shared/components/skeletons/LeftNavBarSkeleton"
import TopNavBarSkeleton from "../shared/components/skeletons/TopNavBarSkeleton"
import { setupSignalRGradesConnection } from "../shared/utils/signalRService"


export default function TaskActivity() {
    const [searchParams] = useSearchParams()
    const [isEditMode] = useState(false)
    const [isLoading, setIsLoading] = useState(true)
    const [tableIds, setTableIds] = useState<number[]>([])
    const [groups, setGroups] = useState<GroupInterface[]>([])
    const [disciplines, setDisciplines] = useState<DisciplineInterface[]>([])
    const [connection, setConnection] = useState<null | HubConnection>(null)
    const [table, setTable] = useState<WorkTableSample>()
    const [isTableReady, setIsTableReady] = useState(false)
    



    useEffect(() => {
        // Подключаем сигнал
        const establishConnection = async () => {
            const con = await setupSignalRGradesConnection(localStorage.getItem("api_key"))
            // console.log(con.state)

            setConnection(con)
        }
        if(connection == null) {
            establishConnection()
        }
    }, [connection])


    useEffect(() => {
        const reloadDisciplines = async () => {
            const res: DisciplineInterface[] | undefined = await getDisciplinesByGroups([tableIds[0]])
            if(res) {
                setDisciplines(res)
            }
        }

        // Все группы и дисциалины для полей ввода
        const getGroupsAndDisciplines = async () => {
            const respGroups: GroupInterface[] | undefined = await getGroups()
            const respDisciplines: DisciplineInterface[] | undefined = await getDisciplines()
            if(respGroups){
                setGroups(respGroups)
            }
            if(respDisciplines) {
                setDisciplines(respDisciplines)
            }
            setIsLoading(false)
        }

        // Проверка, есть ли в query параметрах и дисциплина и группа
        if(tableIds.length > 1){
            reloadDisciplines()
            connection?.invoke("GetMarkGrade", {
                disciplineId: tableIds[1],
                groupId: tableIds[0]
            })
        } else if (tableIds.length > 0){
            reloadDisciplines()
        } else{
            getGroupsAndDisciplines()

        }

        // Проверка, есть ли ключ в query параметрах
        const key = searchParams.get("key")
        if(key) {
            localStorage.setItem("api_key", key)
        }

    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [tableIds])

    // const handleInputChange = () => {
    //     setTable(undefined)
    //     if (connection) {
    //         connection.on("ReceivePresences", (data) => {
    //             setTable(data)
    //             setIsTableReady(true)
    //         })
    //     }
    //     console.log("srabotalo")
    // }


    // Поиск таблицы, если оба query параметра заполены
    const handleSearch = () => {
        const groupid = searchParams.get("groupid")
        const disciplineid = searchParams.get("disciplineid")

        if((groupid != 'null' && disciplineid != 'null') && disciplineid && groupid){
            setTableIds([Number(groupid), Number(disciplineid)])
        } else if (groupid && groupid != 'null'){
            setTableIds([Number(groupid)])
        }

    }

    // Делаем слушатели событий из сигнала, если подключение активно
    if (connection) {
        connection.on("ReceiveMarks", (data) => {
            setTable(data)
            setIsTableReady(true)

        })
    }

    

    const compClasses = {
        outerDiv: "w-full min-h-[92.5vh] bg-bgDark dark:bg-bgDarkD scroll-none flex justify-center ",

    }

    if(isTableReady && connection) {
        return (
            <div className={compClasses.outerDiv}>
                {
                    // Пришлось сделать так, чтобы не было блика при смене роута
                    isLoading ? 
                    <div className="w-[90%] animate-pulse flex flex-col gap-6.25">
                        <TopNavBarSkeleton />
                        <div className="flex gap-6.25">
                            <LeftNavBarSkeleton />
                            <TableGeneratorSkeleton/>
                        </div>
                    </div> :
                    <div className="w-[90%] flex flex-col gap-6.25">
                        <TopNavBar handleSearch={handleSearch} groups={groups} disciplines={disciplines} tableIds={tableIds}/>
                        <div className="flex gap-6.25">
                            <LeftNavBar className="max-sm:hidden" visitsStatus={false} tasksStatus={true} reportStatus={false}  adminStatus={false}/>
                            <WorkTableGenerator table={table} isEditMode={isEditMode} tableType="work" connection={connection}/>
                        </div>
                    </div>
                }
            </div>
        )
    }

    if(connection){
        return (
            <div className={compClasses.outerDiv} >
                {
                    isLoading ? 
                    <div className="w-[90%] animate-pulse flex flex-col gap-6.25">
                        <TopNavBarSkeleton />
                        <div className="flex gap-6.25">
                            <LeftNavBarSkeleton />
                            <TableGeneratorSkeleton/>
                        </div>
                    </div> :
                    <div className="w-[90%] flex flex-col gap-6.25">
                        <TopNavBar handleSearch={handleSearch} groups={groups} disciplines={disciplines} tableIds={tableIds}/>
                        <div className="flex gap-6.25">
                            <LeftNavBar className="max-sm:hidden" visitsStatus={false} tasksStatus={true} reportStatus={false} adminStatus={false}/>
                            <WorkTableGenerator isEditMode={isEditMode} tableType="work" connection={connection}/>
                        </div>
                    </div>
                }
                
            </div>
        )
    }
    return (
        <div className={compClasses.outerDiv}>
            <div className="w-[90%] animate-pulse flex flex-col gap-6.25">
                <TopNavBarSkeleton />
                <div className="flex gap-6.25">
                    <LeftNavBarSkeleton />
                    <TableGeneratorSkeleton/>
                </div>
            </div>
        </div>)
}

