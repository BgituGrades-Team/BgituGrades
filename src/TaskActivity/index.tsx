import LeftNavBar from "../shared/components/LeftNavBar"
import TopNavBar from "../shared/components/TopNavBar"
import WorkTableGenerator from "../shared/tableComponents/WorkTableGenerator"
import { useContext, useEffect, useState } from "react"
import type { WorkTableSample, DisciplineInterface, GroupInterface } from "../shared/types/fromRequests"
import { getDisciplines, getDisciplinesByGroups, getGroups } from "../shared/utils/apiRequests"
import { HubConnection } from "@microsoft/signalr"
import TableGeneratorSkeleton from "../shared/components/skeletons/TableGeneratorSkeleton"
import LeftNavBarSkeleton from "../shared/components/skeletons/LeftNavBarSkeleton"
import TopNavBarSkeleton from "../shared/components/skeletons/TopNavBarSkeleton"
import { setupSignalRGradesConnection } from "../shared/utils/signalRService"
import { SingleInputValuesContext } from "../shared/utils/contexts"


export default function TaskActivity() {
    const singleGroupAndDiscipline = useContext(SingleInputValuesContext)

    const [isEditMode, setIsEditMode] = useState(false)
    const [isLoading, setIsLoading] = useState(true)
    const [groups, setGroups] = useState<GroupInterface[]>([])
    const [disciplines, setDisciplines] = useState<DisciplineInterface[]>([])
    const [connection, setConnection] = useState<null | HubConnection>(null)
    const [table, setTable] = useState<WorkTableSample>()
    const [isTableReady, setIsTableReady] = useState(false)
    



    useEffect(() => {
        // Подключаем сигнал
        const establishConnection = async () => {
            const con = await setupSignalRGradesConnection(sessionStorage.getItem("api_key"))
            // console.log(con.state)

            setConnection(con)
        }
        if(connection == null) {
            establishConnection()
        }
    }, [connection])


    const handleInputChange = () => {
        setTable(undefined)
        if (connection) {
            connection.on("ReceiveMarks", (data) => {
                setTable(data)
                setIsTableReady(true)
            })
        }
    }

    useEffect(() => {
        const reloadDisciplines = async () => {
            console.log("зашло")
            const res: DisciplineInterface[] | undefined = await getDisciplinesByGroups([singleGroupAndDiscipline?.groupVal ? Number(singleGroupAndDiscipline?.groupVal) : 0])
            if (res) {
                setDisciplines(res)
                setIsLoading(false)
            }
        }

        // Все группы и дисциалины для полей ввода
        const getGroupsAndDisciplines = async () => {
            const respGroups: GroupInterface[] | undefined = await getGroups()
            const respDisciplines: DisciplineInterface[] | undefined = await getDisciplines()
            if (respGroups) {
                setGroups(respGroups)
            }
            if (respDisciplines) {
                setDisciplines(respDisciplines)
            }
            setIsLoading(false)
        }



        if (isLoading) {
            getGroupsAndDisciplines()
        }
        if (singleGroupAndDiscipline?.groupVal) {
            reloadDisciplines()
        }
        if (singleGroupAndDiscipline?.disciplineVal && singleGroupAndDiscipline.groupVal) {
            console.log(singleGroupAndDiscipline.disciplineVal, singleGroupAndDiscipline.groupVal)
            connection?.invoke("GetMarkGrade", {
                disciplineId: Number(singleGroupAndDiscipline.disciplineVal),
                groupId: Number(singleGroupAndDiscipline.groupVal)
            })
        }

    }, [connection, isLoading, singleGroupAndDiscipline?.disciplineVal, singleGroupAndDiscipline?.groupVal])


    const rerenderTable = (connection: HubConnection | null) => {
        console.log("rerender")
        if (connection) {
            connection.on("ReceiveMarks", (data) => {
                setTable(data)
                setIsTableReady(true)

            })
    }
    }



    // Делаем слушатели событий из сигнала, если подключение активно
    if (connection) {
        connection.on("ReceiveMarks", (data) => {
            setTable(data)
            setIsTableReady(true)

        })
    }
    //обработчик нажатия на кнопку "редактировать" переводит нас в режим редактирования и обратно
    const handleEditModeChange = () => {
        setIsEditMode(!isEditMode)
    }

    const compClasses = {
        outerDiv: "w-full min-h-[90vh] bg-bgDark dark:bg-bgDarkD scroll-none flex justify-center ",

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
                        <TopNavBar groups={groups} disciplines={disciplines} onUpdate={() => handleInputChange()} handleEditModeChange={handleEditModeChange} isEditMode={isEditMode}/>
                        <div className="flex gap-6.25">
                            <LeftNavBar className="max-sm:hidden" visitsStatus={false} tasksStatus={true} reportStatus={false}  adminStatus={false}/>
                            <WorkTableGenerator table={table} isEditMode={isEditMode} tableType="work" connection={connection} onUpdate={() => rerenderTable(connection)}/>
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
                        <TopNavBar groups={groups} disciplines={disciplines} onUpdate={() => handleInputChange()} handleEditModeChange={() => handleEditModeChange} isEditMode={isEditMode}/>
                        <div className="flex gap-6.25">
                            <LeftNavBar className="max-sm:hidden" visitsStatus={false} tasksStatus={true} reportStatus={false} adminStatus={false}/>
                            <WorkTableGenerator isEditMode={isEditMode} tableType="work" connection={connection} onUpdate={() => rerenderTable(connection)}/>
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

