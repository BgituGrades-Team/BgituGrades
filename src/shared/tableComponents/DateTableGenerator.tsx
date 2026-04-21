import { useContext, useEffect, useState } from "react";
import EmptyTableCell from "./EmptyTableCell";
import FirstTableCell from "./FirstTableCell";
import EditableTableCell from "./EditableTableCell";
import StudentModal from "../modals/StudentModal";
import { HubConnection } from "@microsoft/signalr";
import type { PresenceInterface, DateTableSample } from "../types/fromRequests";
import TransferModal from "../modals/TransferModal";
import { checkTranserPresenceDate } from "../utils/apiRequests";
import { AuthContext } from "../utils/contexts";



interface PropsInterface{
    tableType: "work" | "date";
    isEditMode: boolean;
    table?: DateTableSample;
    connection: HubConnection;
    groupId: number;
    disciplineId: number;
}


export default function DateTableGenerator({tableType, isEditMode, table, connection, groupId, disciplineId}: PropsInterface){
    const [studentModal, setStudentModal] = useState<boolean>(false)
    const [transferModal, setTransferModal] = useState<boolean>(false)
    const [classId, setClassId] = useState<number | undefined>()
    const [classType, setClassType] = useState<string>("")
    const [statusCode, setStatusCode] = useState<number | undefined>()
    const [transferId, setTransferId] = useState<number | undefined>()
    const [currDate, setCurrDate] = useState<string>("")

    const [currStudId, setCurrStudId] = useState<number>()
    const [currName, setCurrName] = useState<string>()

    const openTransferModal = async (classId: number, currDate: string,  classType: string) => {
        setClassId(classId)
        setClassType(classType)
        setCurrDate(currDate)
        if(classId){
            console.log(classId, currDate)
            const res = await checkTranserPresenceDate(classId, currDate)
            console.log(res)
            if(typeof res != 'number' && typeof res != 'undefined'){
                setStatusCode(res[0])
                setTransferId(res[1].id)
                
            } else if (typeof res == 'number'){
                setStatusCode(404)
            }
            

            setTransferModal(true)
        }
    }
    const closeTransferModal = () => {
        setTransferModal(false)
    }
    const openStudentModal = (e: React.MouseEvent<HTMLElement>, studentId: number) => {
        setCurrName(e.currentTarget.textContent)
        setCurrStudId(studentId)
        setStudentModal(true)
    }
    const closeStudentModal = () => {
        setStudentModal(false)
    }

    const role = useContext(AuthContext)

    const changePresenceState = (presenceState: string, studentId: number, classId: number, date: string) => {
        connection.invoke("UpdatePresenceGrade", { 
            studentId,
            classId,
            date,
            isPresent: presenceState,
            disciplineId: disciplineId
        })            

    }
        const renderDate = (dates: PresenceInterface) => {
                const dataObj = new Date(dates.date);
                const formattedDate = dataObj.toLocaleDateString("ru-RU", {
                    month: 'numeric',
                    day: 'numeric',
                })
            return formattedDate
        }

        const renderTable = (tableIndex:number) => {
            const rows = [];
            let cells = [];
            const tableCellsClasses = {
                short: "min-w-12.5 h-12.5 text-[16px] font-blod text-tLight dark:text-tLightD text-center",
                long: "min-w-56.25 h-12.5 text-[16px] font-blod text-tLight dark:text-tLightD"
            }
            const rowClassName = "odd:bg-bgLight dark:odd:bg-bgLightD even:bg-bgMiddle dark:even:bg-bgMiddleD"
            // ОБЯЗАТЕЛЬНО СДЕЛАТЬ НОВУЮ МОДАЛКУ ДЛЯ ОЦЕНКИ СТУДЕНТУ
            if(table && table.length > 0){
                // Угловая ячейка
                const dates = table[0].presences
                //console.log(dates)
               
                // Первая строка
                cells = [
                    // Разделенная ячейка
                    <FirstTableCell
                        topTitle="Работы"
                        botTitle="ФИО"
                        className="min-w-56.25 h-12.5"
                        key={"Allah"} />,
                    // Разбираем массив занятий на массив ячеек
                    ...dates.map((dates, i) => (
                        
                        <EditableTableCell
                            onClick={role == "STUDENT" ? () => {} : () => openTransferModal(dates.classId, dates.date, dates.classType)}
                            cellType="date"
                            cellData={renderDate(dates)}
                            cellDateType={dates.classType == "PRACTICE" ? "Прак" : "Лек"}
                            className={tableCellsClasses.short}
                            key={`Work-${i}`} 
                            disabled={role == "STUDENT" ? true : false}/>
                    )),
                    // Кнопка добавления занятия
                    // <EditableTableCell
                    //     onClick={openDateModal}
                    //     cellType="work"
                    //     cellData="+"
                    //     className={tableCellsClasses.short}
                    //     key={`WorkAdd`} />
    
                ]
                rows.push(<tr className={rowClassName} key={"FirstRow"}>{cells}</tr>)
                
                // Остальные строки
                table.forEach((student: DateTableSample[0], idx:number) => {
                    let cells = [];
                    const dates = student.presences;
                    cells = [
                        // Студент
                        <EditableTableCell
                            onClick={role == "STUDENT" ? () => {} : (e) => openStudentModal(e, student.studentId)}
                            cellType="student"
                            cellData={student.name}
                            className={tableCellsClasses.long}
                            key={`Student-${idx}`} 
                            disabled={role == "STUDENT" ? true : false}/>,
                        // Разбираем массив работ на массив ячеек
                        ...dates.map((_date: PresenceInterface, i) => (
                            <EmptyTableCell
                                connection={connection}
                                changePresenceState={changePresenceState}
                                cellType={tableType}
                                studentId={student.studentId}
                                presence={_date.isPresent} 
                                date={_date.date} 
                                originalDate={_date.originalDate}
                                classId={_date.classId}
                                className="min-w-12.5 h-12.5 "
                                key={`Date-string-${idx}-col-${i}`} 
                                disabled={role == "STUDENT" ? true : false}/>
                        )),
                        // Заглушка
                        // <EmptyTableCell
                        //     disabled={true}
                        //     cellType={tableType}
                        //     className="min-w-12.5 h-12.5 "
                        //     key={`DatePlaceholder-${idx}`} />
                    ]
                    rows.push(<tr className={rowClassName} key={`Row-${idx}`}>{cells}</tr>)
                })
                // Последняя строка
                // cells = [
                //     // Кнопка добавления студента
                //     <EditableTableCell
                //         onClick={openStudentModal}
                //         cellType="student"
                //         cellData={'+'}
                //         className={tableCellsClasses.long + " text-center"}
                //         key={"StudentAdd"} />,
                //     // Разбираем массив дат на массив ячеек
                //     ...dates.map((date: PresenceInterface, i) => (
                //         <EmptyTableCell
                //             disabled={true}
                //             cellType={tableType}
                //             className="min-w-12.5 h-12.5 "
                //             key={String(date.classType) + " " + String(i)} />
                //     )),
                //     // Заглушка
                //     <EmptyTableCell
                //         disabled={true} 
                //         cellType={tableType}
                //         className="min-w-12.5 h-12.5 "
                //         key={"DatePlaceholder2"} />
    
                // ]
                // rows.push(<tr className={rowClassName} key={"LastRow"}>{cells}</tr>)
            }
        return (
            <table className="block border-separate border-spacing-0.5 max-w-full max-h-142.5 overflow-auto" key={tableIndex}>
                <tbody>{rows}</tbody>
            </table>
        );
      };
        useEffect(() => {
            renderTable(1)    
                
        // eslint-disable-next-line react-hooks/exhaustive-deps
        }, [table])
    return (
        <div key={1} className="overflow-auto">
            {renderTable(1)}
            <StudentModal isOpen={studentModal} close={closeStudentModal} isEditMode={isEditMode} studentId={currStudId} studentName={currName}/>
            {/*<DateModal isOpen={dateModal} close={closeDateModal} isEditMode={isEditMode}/> */}
            <TransferModal isOpen={transferModal} close={closeTransferModal} classId={classId}  groupId={groupId} classType={classType} disciplineId={disciplineId} oldDate={currDate} statusCode={statusCode} transferId={transferId} />
        </div>
    );
}