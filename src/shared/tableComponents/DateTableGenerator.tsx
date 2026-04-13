import { useEffect, useState } from "react";
import EmptyTableCell from "./EmptyTableCell";
import FirstTableCell from "./FirstTableCell";
import EditableTableCell from "./EditableTableCell";
import StudentModal from "../modals/StudentModal";
import { HubConnection } from "@microsoft/signalr";
import { useSearchParams } from "react-router-dom";
import DateModal from "../modals/DateModal";
import type { PresenceInterface, DateTableSample } from "../types/fromRequests";
import TransferModal from "../modals/TransferModal";
import { checkTranserPresenceDate } from "../utils/apiRequests";



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
    const [searchParams] = useSearchParams()
    const [dateModal, setDateModal] = useState<boolean>(false)
    const [transferModal, setTransferModal] = useState<boolean>(false)
    const [classId, setClassId] = useState<number | undefined>()
    const [classType, setClassType] = useState<string>("")
    const [origDate, setOrigDate] = useState<string>("")
    const [studentId, setStudentId] = useState<number | undefined>()
    const [statusCode, setStatusCode] = useState<number | undefined>()
    const [transferId, setTransferId] = useState<number | undefined>()
    // Вывод информации при получении данных, УДАЛИТЬ НА ПРОДЕ
    //connection.on("ReceivePresence", (data) => console.log(data))
    //connection.on("ReceiveMarks", (data) => console.log(data))


    const openDateModal = () => {
        setDateModal(true)
    }
    const closeDateModal = () => {
        setDateModal(false)
    }
    const openTransferModal = async (date: PresenceInterface) => {
        setClassId(date.classId)
        setOrigDate(date.date)
        setClassType(date.classType)
        if(classId){
            const res = await checkTranserPresenceDate(classId, origDate)
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
    const openStudentModal = (studentId: number) => {
        setStudentId(studentId)
        setStudentModal(true)
    }
    const closeStudentModal = () => {
        setStudentModal(false)
    }

    const changePresenceState = (presenceState: string, studentId: number, classId: number, date: string) => {
        // console.log(
        //     "ya blya rabotayu",
        //     presenceState,
        //     studentId,
        //     classId,
        //     date,
        //     searchParams.get('disciplineid')
        // )
        connection.invoke("UpdatePresenceGrade", { 
            studentId,
            classId,
            date,
            isPresent: presenceState,
            disciplineId: Number(searchParams.get('disciplineid'))
        })            

    }


    // const renderTable = (tableIndex:number) => {
    //     const rows = [];
    //     let cells = [];
    //         if (table && table?.length > 0) {
    //             // Угловая ячейка
    //             const dates = table[0].presences
    //             cells.push(<FirstTableCell topTitle="Дата" botTitle="ФИО" className="min-w-56.25 h-12.5" key={"Allah"}/>)

    //             // Первая строка
    //             dates.forEach((date: PresenceInterface, dateIndex: number) => {
    //                 const dataObj = new Date(date.date);
    //                 const formattedDate = dataObj.toLocaleDateString("ru-RU", {
    //                     month: 'numeric',
    //                     day: 'numeric',
    //                 })
    //                 cells.push(<EditableTableCell onClick={openDateModal} cellType="date" cellData={formattedDate} cellDateType={date.classType == "PRACTICE" ? "Прак" : "Лек"} className="min-w-12.5 h-12.5 text-[16px] font-blod text-tLight dark:text-tLightD text-center " key={"Allah" + String(dateIndex)} />);
    //                 // Если элемент последний, добавляем доп ячейку с плюсиком
    //                 if(dateIndex == dates.length-1){
    //                     cells.push(<EditableTableCell onClick={openDateModal} cellType="date" cellData={""} cellDateType={null} className="min-w-12.5 h-12.5 text-[16px] font-blod text-tLight dark:text-tLightD text-center " key={"Allah left"} />)
    //                 }
    //             });
    //             rows.push(<tr className="odd:bg-bgLight dark:odd:bg-bgLightD even:bg-bgMiddle dark:even:bg-bgMiddleD" key={"allah2"}>{cells}</tr>)

    //             // Остальные строки
    //             table.forEach((student: DateTableSample[0], idx: number) => {
    //                 const cells = [];
    //                 const dates = student.presences
    //                 // ФИО Студента
    //                 cells.push(<EditableTableCell onClick={openStudentModal} cellType="student" cellData={student.name} className="min-w-56.25 h-12.5 text-[16px] font-blod text-tLight dark:text-tLightD" key={"Allah" + String(idx)} />)
    //                 // Посещения по датам
    //                 dates.forEach((date: PresenceInterface, index: number) => {
    //                     cells.push(<EmptyTableCell connection={connection} changePresenceState={changePresenceState} cellType={tableType} presence={date.isPresent} studentId={student.studentId} date={date.date} classId={date.classId} className="min-w-12.5 h-12.5 " key={String(idx) + " " + String(index)} />);
    //                     if(index == dates.length-1){
    //                         // Заглушка
    //                         cells.push(<EmptyTableCell disabled={true} cellType={tableType} className="min-w-12.5 h-12.5 " key={"Allah left"} />)
    //                     }
    //                 });
                
    //                 rows.push(<tr className="odd:bg-bgLight dark:odd:bg-bgLightD even:bg-bgMiddle dark:even:bg-bgMiddleD" key={idx}>{cells}</tr>)
    //             })
                
    //             cells = []
    //             // Пустая строка для добавления студента
    //             cells.push(<EditableTableCell onClick={openStudentModal} cellType="student" cellData={''} className="min-w-56.25 h-12.5 p-1.25 text-[16px] font-blod text-tLight dark:text-tLightD" key={"Allah last"} />)
    //                 // Заглушки
    //                 dates.forEach((date: PresenceInterface, index: number) => {
    //                     cells.push(<EmptyTableCell disabled={true} cellType={tableType} className="min-w-12.5 h-12.5 " key={String(date.date) + " " + String(index)} />);
    //                     if(index == dates.length-1){
    //                         // Заглушка
    //                         cells.push(<EmptyTableCell disabled={true} cellType={tableType} className="min-w-12.5 h-12.5 " key={"Allah left"} />)
    //                     }
    //             });
    //             rows.push(<tr className="odd:bg-bgLight dark:odd:bg-bgLightD even:bg-bgMiddle dark:even:bg-bgMiddleD" key={"alloe"}>{cells}</tr>)
    //         }

        
    //     return (
    //         <table className="block border-separate border-spacing-0.5 border-bgModal max-w-full max-h-142.5 rounded-lg overflow-auto" key={tableIndex}>
    //             <tbody>{rows}</tbody>
    //         </table>
    //     );
    // };
    // useEffect(() => {
    //     renderTable(1)    
            
    // }, [table])
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
                            onClick={() => openTransferModal(dates)}
                            cellType="date"
                            cellData={renderDate(dates)}
                            cellDateType={dates.classType == "PRACTICE" ? "Прак" : "Лек"}
                            className={tableCellsClasses.short}
                            key={`Work-${i}`} />
                    )),
                    // Кнопка добавления занятия
                    <EditableTableCell
                        onClick={openDateModal}
                        cellType="work"
                        cellData="+"
                        className={tableCellsClasses.short}
                        key={`WorkAdd`} />
    
                ]
                rows.push(<tr className={rowClassName} key={"FirstRow"}>{cells}</tr>)
                
                // Остальные строки
                table.forEach((student: DateTableSample[0], idx:number) => {
                    let cells = [];
                    const dates = student.presences;
                    cells = [
                        // Студент
                        <EditableTableCell
                            onClick={() => openStudentModal(student.studentId)}
                            cellType="student"
                            cellData={student.name}
                            className={tableCellsClasses.long}
                            key={`Student-${idx}`} />,
                        // Разбираем массив работ на массив ячеек
                        ...dates.map((_date: PresenceInterface, i) => (
                            <EmptyTableCell
                                connection={connection}
                                changePresenceState={changePresenceState}
                                cellType={tableType}
                                studentId={student.studentId}
                                presence={_date.isPresent} 
                                date={_date.date} 
                                classId={_date.classId}
                                className="min-w-12.5 h-12.5 "
                                key={`Date-string-${idx}-col-${i}`} />
                        )),
                        // Заглушка
                        <EmptyTableCell
                            disabled={true}
                            cellType={tableType}
                            className="min-w-12.5 h-12.5 "
                            key={`DatePlaceholder-${idx}`} />
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
                
        }, [table])
    return (
        <div key={1} className="w-full">
            {renderTable(1)}
            <StudentModal isOpen={studentModal} close={closeStudentModal} isEditMode={isEditMode} studentId={studentId}/>
            <DateModal isOpen={dateModal} close={closeDateModal} isEditMode={isEditMode}/>
            <TransferModal isOpen={transferModal} close={closeTransferModal} classId={classId}  groupId={groupId} classType={classType} disciplineId={disciplineId} oldDate={origDate} statusCode={statusCode} transferId={transferId} />
        </div>
    );
}