import LeftNavBar from "../shared/components/LeftNavBar"
import DateTableGenerator from "../shared/tableComponents/DateTableGenerator"
import TopNavBar from "../shared/components/TopNavBar"
import { useEffect, useState } from "react"
import { getGroups, getDisciplines, getDisciplinesByGroups } from "../shared/utils/apiRequests"
import { useSearchParams } from "react-router-dom"
import type { DisciplineInterface, GroupInterface, DateTableSample } from "../shared/types/fromRequests"
import type { HubConnection } from "@microsoft/signalr"
import TableGeneratorSkeleton from "../shared/components/skeletons/TableGeneratorSkeleton"
import LeftNavBarSkeleton from "../shared/components/skeletons/LeftNavBarSkeleton"
import TopNavBarSkeleton from "../shared/components/skeletons/TopNavBarSkeleton"
import { setupSignalRGradesConnection } from "../shared/utils/signalRService"

function VisitActivity() {
    const [searchParams] = useSearchParams()
    const [isEditMode] = useState(false)
    const [isLoading, setIsLoading] = useState(true)
    const [groups, setGroups] = useState<GroupInterface[]>([])
    const [disciplines, setDisciplines] = useState<DisciplineInterface[]>([])
    const [tableIds, setTableIds] = useState<number[]>([])
    const [table, setTable] = useState<DateTableSample | undefined>()
    const [isTableReady, setIsTableReady] = useState(false)

    const [connection, setConnection] = useState<null | HubConnection>(null)

    useEffect(() => {
        // Подключаем сигнал
        const establishConnection = async () => {
                const con = await setupSignalRGradesConnection(localStorage.getItem("api_key"))
                console.log(con.state)
                setConnection(con)
            }
        if (connection == null) {
            establishConnection()
        }
    }, [connection])


    useEffect(() => {
        const reloadDisciplines = async () => {
            console.log(tableIds[0])
            const res: DisciplineInterface[] | undefined = await getDisciplinesByGroups([tableIds[0]])
            if (res) {
                setDisciplines(res)
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

        // Проверка, есть ли в query параметрах и дисциплина и группа
        if (tableIds.length > 1) {
            reloadDisciplines()   
            connection?.invoke("GetPresenceGrade", {
                disciplineId: tableIds[1],
                groupId: tableIds[0]
            })       
        } else if (tableIds.length > 0) {
           
            reloadDisciplines()
        } else {
            getGroupsAndDisciplines()
        }

        // Проверка, есть ли ключ в query параметрах
        const key = searchParams.get("key")
        if (key) {
            localStorage.setItem("api_key", key)
        }     
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [tableIds])

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
        console.log("srabotalo")
    }



    // Поиск таблицы, если оба query параметра заполены
    const handleSearch = () => {
        const groupid = searchParams.get("groupid")
        const disciplineid = searchParams.get("disciplineid")

        if ((groupid != 'null' && disciplineid != 'null') && disciplineid && groupid) {
            setTableIds([Number(groupid), Number(disciplineid)])
        } else if (groupid && groupid != 'null') {
            setTableIds([Number(groupid)])
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
                    <TopNavBar handleSearch={handleSearch} disciplines={disciplines} onUpdate={setTable} groups={groups} tableIds={tableIds}/>
                    <div className="flex gap-6.25">
                        <LeftNavBar className="max-sm:hidden" visitsStatus={true} tasksStatus={false} reportStatus={false} adminStatus={false}/>
                        <DateTableGenerator table={table} isEditMode={isEditMode} tableType="date" connection={connection} groupId={tableIds[0]} disciplineId={tableIds[1]}/>
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
                    <TopNavBar handleSearch={handleSearch} disciplines={disciplines} onUpdate={() => handleInputChange} groups={groups} tableIds={tableIds}/>
                    <div className="flex gap-6.25">
                        <LeftNavBar className="max-sm:hidden" visitsStatus={true} tasksStatus={false} reportStatus={false} adminStatus={false}/>
                        <DateTableGenerator isEditMode={isEditMode} tableType="date" connection={connection} groupId={tableIds[0]} disciplineId={tableIds[1]}/>
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