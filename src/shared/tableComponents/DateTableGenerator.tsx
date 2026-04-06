import { useEffect, useState } from "react";
import EmptyTableCell from "./EmptyTableCell";
import FirstTableCell from "./FirstTableCell";
import EditableTableCell from "./EditableTableCell";
import StudentModal from "../modals/StudentModal";
import { HubConnection } from "@microsoft/signalr";
import { useSearchParams } from "react-router-dom";
import DateModal from "../modals/DateModal";
import type { PresenceInterface, DateTableSample } from "../types/fromRequests";



interface PropsInterface{
    tableType: "work" | "date";
    isEditMode: boolean;
    table?: DateTableSample;
    connection: HubConnection
}


export default function DateTableGenerator({tableType, isEditMode, table, connection}: PropsInterface){
    const [studentModal, setStudentModal] = useState<boolean>(false)
    const [searchParams] = useSearchParams()
    const [dateModal, setDateModal] = useState<boolean>(false)
    
    // Вывод информации при получении данных, УДАЛИТЬ НА ПРОДЕ
    connection.on("ReceivePresence", (data) => console.log(data))
    connection.on("ReceiveMarks", (data) => console.log(data))


    const openDateModal = () => {
        setDateModal(true)
    }
    const closeDateModal = () => {
        setDateModal(false)
    }
    const openStudentModal = () => {
        setStudentModal(true)
    }
    const closeStudentModal = () => {
        setStudentModal(false)
    }

    const changePresenceState = (presenceState: string, studentId: number, classId: number, date: string) => {
        console.log(
            presenceState,
            studentId,
            classId,
            date,
            searchParams.get('disciplineid')
        )
        connection.invoke("UpdatePresenceGrade", { 
            studentId,
            classId,
            date,
            isPresent: presenceState,
            disciplineId: Number(searchParams.get('disciplineid'))
        })            

    }


    const renderTable = (tableIndex:number) => {
        const rows = [];
        let cells = [];
            if (table && table?.length > 0) {
                // Угловая ячейка
                const dates = table[0].presences
                cells.push(<FirstTableCell topTitle="Дата" botTitle="ФИО" className="min-w-56.25 h-12.5" key={"Allah"}/>)

                // Первая строка
                dates.forEach((date: PresenceInterface, dateIndex: number) => {
                    const dataObj = new Date(date.date);
                    const formattedDate = dataObj.toLocaleDateString("ru-RU", {
                        month: 'numeric',
                        day: 'numeric',
                    })
                    cells.push(<EditableTableCell onClick={openDateModal} cellType="date" cellData={formattedDate} cellDateType={date.classType == "PRACTICE" ? "Прак" : "Лек"} className="min-w-12.5 h-12.5 text-[16px] font-blod text-tLight dark:text-tLightD text-center " key={"Allah" + String(dateIndex)} />);
                    // Если элемент последний, добавляем доп ячейку с плюсиком
                    if(dateIndex == dates.length-1){
                        cells.push(<EditableTableCell onClick={openDateModal} cellType="date" cellData={""} cellDateType={null} className="min-w-12.5 h-12.5 text-[16px] font-blod text-tLight dark:text-tLightD text-center " key={"Allah left"} />)
                    }
                });
                rows.push(<tr className="odd:bg-bgLight dark:odd:bg-bgLightD even:bg-bgMiddle dark:even:bg-bgMiddleD" key={"allah2"}>{cells}</tr>)

                // Остальные строки
                table.forEach((student: DateTableSample[0], idx: number) => {
                    const cells = [];
                    const dates = student.presences
                    // ФИО Студента
                    cells.push(<EditableTableCell onClick={openStudentModal} cellType="student" cellData={student.name} className="min-w-56.25 h-12.5 text-[16px] font-blod text-tLight dark:text-tLightD" key={"Allah" + String(idx)} />)
                    // Посещения по датам
                    dates.forEach((date: PresenceInterface, index: number) => {
                        cells.push(<EmptyTableCell connection={connection} changePresenceState={changePresenceState} cellType={tableType} presence={date.isPresent} studentId={student.studentId} date={date.date} classId={date.classId} className="min-w-12.5 h-12.5 " key={String(idx) + " " + String(index)} />);
                        if(index == dates.length-1){
                            // Заглушка
                            cells.push(<EmptyTableCell disabled={true} cellType={tableType} className="min-w-12.5 h-12.5 " key={"Allah left"} />)
                        }
                    });
                
                    rows.push(<tr className="odd:bg-bgLight dark:odd:bg-bgLightD even:bg-bgMiddle dark:even:bg-bgMiddleD" key={idx}>{cells}</tr>)
                })
                
                cells = []
                // Пустая строка для добавления студента
                cells.push(<EditableTableCell onClick={openStudentModal} cellType="student" cellData={''} className="min-w-56.25 h-12.5 p-1.25 text-[16px] font-blod text-tLight dark:text-tLightD" key={"Allah last"} />)
                    // Заглушки
                    dates.forEach((date: PresenceInterface, index: number) => {
                        cells.push(<EmptyTableCell disabled={true} cellType={tableType} className="min-w-12.5 h-12.5 " key={String(date.date) + " " + String(index)} />);
                        if(index == dates.length-1){
                            // Заглушка
                            cells.push(<EmptyTableCell disabled={true} cellType={tableType} className="min-w-12.5 h-12.5 " key={"Allah left"} />)
                        }
                });
                rows.push(<tr className="odd:bg-bgLight dark:odd:bg-bgLightD even:bg-bgMiddle dark:even:bg-bgMiddleD" key={"alloe"}>{cells}</tr>)
            }

        
        return (
            <table className="block border-separate border-spacing-0.5 border-bgModal max-w-full max-h-142.5 rounded-lg overflow-auto" key={tableIndex}>
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
            <StudentModal isOpen={studentModal} close={closeStudentModal} isEditMode={isEditMode}/>
            <DateModal isOpen={dateModal} close={closeDateModal} isEditMode={isEditMode}/>
        </div>
    );
}