import LeftNavBar from "../shared/components/LeftNavBar"
import DateTableGenerator from "../shared/tableComponents/DateTableGenerator"
import TopNavBar from "../shared/components/TopNavBar"
import { useContext, useEffect, useState } from "react"
import { getGroups, getDisciplines, getDisciplinesByGroups } from "../shared/utils/apiRequests"
import type { DisciplineInterface, GroupInterface, DateTableSample } from "../shared/types/fromRequests"
import type { HubConnection } from "@microsoft/signalr"
import TableGeneratorSkeleton from "../shared/components/skeletons/TableGeneratorSkeleton"
import LeftNavBarSkeleton from "../shared/components/skeletons/LeftNavBarSkeleton"
import TopNavBarSkeleton from "../shared/components/skeletons/TopNavBarSkeleton"
import { setupSignalRGradesConnection } from "../shared/utils/signalRService"
import { SingleInputValuesContext } from "../shared/utils/contexts"

function VisitActivity() {
    const singleGroupAndDiscipline = useContext(SingleInputValuesContext)

    const [isEditMode, setIsEditMode] = useState(false)
    const [isLoading, setIsLoading] = useState(true)
    const [groups, setGroups] = useState<GroupInterface[]>([])
    const [disciplines, setDisciplines] = useState<DisciplineInterface[]>([])
    const [table, setTable] = useState<DateTableSample | undefined>()
    const [isTableReady, setIsTableReady] = useState(false)

    const [connection, setConnection] = useState<null | HubConnection>(null)
    useEffect(() => {
        // Подключаем сигнал
        const establishConnection = async () => {
                const con = await setupSignalRGradesConnection(sessionStorage.getItem("api_key"))
                setConnection(con)
            }
        if (connection == null) {
            establishConnection()
        }
    }, [connection])

    useEffect(() => {
        const reloadDisciplines = async () => {
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
            if (Array.isArray(respGroups)) {
                setGroups(respGroups)
            }
            if (Array.isArray(respDisciplines)) {
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
            connection?.invoke("GetPresenceGrade", {
                disciplineId: Number(singleGroupAndDiscipline.disciplineVal),
                groupId: Number(singleGroupAndDiscipline.groupVal)
            })
        }
          
    }, [singleGroupAndDiscipline?.disciplineVal, singleGroupAndDiscipline?.groupVal, connection, isLoading])

    useEffect(() => {
        
    })


    const handleEditModeChange = () => {
        setIsEditMode(!isEditMode)
    }


    //функция онуляющая состояние таблицы при изменении инпута с дисциплиной, дабы пометки посещаемости нне кочевали меж таблицами
    //проходит от index до input через topNavbar как крестоносец с одной целью форматнуть таблицу
    //появился баг с пропажей таблицы при повторном выборе
    //причин так делать не имеется надеюсь не критично
    const handleInputChange = () => {
        setTable(undefined)
        if (connection) {
            connection.on("ReceivePresences", (data) => {
                setTable(data)
                setIsTableReady(true)
            })
        }
    }

    // Делаем слушатели событий из сигнала, если подключение активно
    if (connection) {
        connection.on("ReceivePresences", (data) => {
            setTable(data)
            setIsTableReady(true)
        })
    }


    if (isTableReady && connection) {
        return (
        <div className="w-full min-h-[90vh] bg-bgDark dark:bg-bgDarkD scroll-none flex justify-center ">
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
                    <TopNavBar disciplines={disciplines} onUpdate={() => handleInputChange()} groups={groups} handleEditModeChange={handleEditModeChange} isEditMode={isEditMode}/>
                    <div className="flex gap-6.25">
                        <LeftNavBar className="max-sm:hidden" visitsStatus={true} tasksStatus={false} reportStatus={false} adminStatus={false}/>
                        <DateTableGenerator table={table} isEditMode={isEditMode} tableType="date" connection={connection} groupId={singleGroupAndDiscipline ? Number(singleGroupAndDiscipline.groupVal) : 0} disciplineId={singleGroupAndDiscipline ? Number(singleGroupAndDiscipline.disciplineVal) : 0}/>
                    </div>
                </div> 
            }
        </div>
        )
    }
    if (connection) {
    return (
        <div className="w-full min-h-[90vh] bg-bgDark dark:bg-bgDarkD scroll-none flex justify-center ">
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
                    <TopNavBar disciplines={disciplines} onUpdate={setTable}  handleEditModeChange={handleEditModeChange} isEditMode={isEditMode} groups={groups}/>
                    <div className="flex gap-6.25">
                        <LeftNavBar className="max-sm:hidden" visitsStatus={true} tasksStatus={false} reportStatus={false} adminStatus={false}/>
                        <DateTableGenerator isEditMode={isEditMode} tableType="date" connection={connection} groupId={singleGroupAndDiscipline ? Number(singleGroupAndDiscipline.groupVal) : 0} disciplineId={singleGroupAndDiscipline ? Number(singleGroupAndDiscipline.disciplineVal) : 0}/>
                    </div>
                </div>
            }
        </div> 
    )}
    return (
            <div className="w-full min-h-[90vh]  duration-75 bg-bgDark dark:bg-bgDarkD scroll-none flex justify-center ">
                <div className="w-[90%] animate-pulse flex flex-col gap-6.25">
                    <TopNavBarSkeleton />
                    <div className="flex gap-6.25">
                        <LeftNavBarSkeleton />
                        <TableGeneratorSkeleton/>
                    </div>
                </div>
            </div>)
}

export default VisitActivity
