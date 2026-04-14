import { useEffect, useState } from "react";
import EmptyTableCell from "./EmptyTableCell";
import FirstTableCell from "./FirstTableCell";
import EditableTableCell from "./EditableTableCell";
import StudentModal from "../modals/StudentModal";
import WorkModal from "../modals/WorkModal";
import { HubConnection } from "@microsoft/signalr";
import { useSearchParams } from "react-router-dom";
import type { WorkInterface, WorkTableSample } from "../types/fromRequests";



interface PropsInterface{
    tableType: "work" | "date";
    isEditMode: boolean;
    table?: WorkTableSample;
    connection: HubConnection
}


export default function WorkTableGenerator({tableType, isEditMode, table, connection}: PropsInterface){
    const [studentModal, setStudentModal] = useState<boolean>(false)
    const [workModal, setWorkModal] = useState<boolean>(false)
    const [searchParams] = useSearchParams()

    // Вывод информации при получении данных, УДАЛИТЬ НА ПРОДЕ
    connection.on("ReceiveMarks", (data) => console.log(data))


    const openStudentModal = () => {
        setStudentModal(true)
    }
    const closeStudentModal = () => {
        setStudentModal(false)
    }
    const openWorkModal = () => {
        setWorkModal(true)
    }
    const closeWorkModal = () => {
        setWorkModal(false)
    }


    const changeMarkState  = (markState: string, studentId: number, workId: number, date: string, value: string, isOverdue: boolean) => {
        console.log(
            markState,
            studentId,
            workId,
            date,
            value,
            isOverdue,
            searchParams.get('disciplineid')
        )
        connection.invoke("UpdateMarkGrade", {
            date,
            value,
            isOverdue,
            studentId,
            workId,
            disciplineId: Number(searchParams.get('disciplineid'))
        })
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
            const works = table[0].marks
            console.log(works)
            // Первая строка
            cells = [
                // Разделенная ячейка
                <FirstTableCell
                    topTitle="Работы"
                    botTitle="ФИО"
                    className="min-w-56.25 h-12.5"
                    key={"Allah"} />,
                // Разбираем массив работ на массив ячеек
                ...works.map((work, i) => (
                    <EditableTableCell
                        onClick={openWorkModal}
                        cellType="work"
                        cellData={work.name}
                        className={tableCellsClasses.short}
                        key={`Work-${i}`} />
                )),
                // Кнопка добавления работы
                <EditableTableCell
                    onClick={openWorkModal}
                    cellType="work"
                    cellData="+"
                    className={tableCellsClasses.short}
                    key={`WorkAdd`} />

            ]
            rows.push(<tr className={rowClassName} key={"FirstRow"}>{cells}</tr>)
            
            // Остальные строки
            table.forEach((student: WorkTableSample[0], idx:number) => {
                let cells = [];
                const works = student.marks;
                cells = [
                    // Студент
                    <EditableTableCell
                        onClick={openStudentModal}
                        cellType="student"
                        cellData={student.name}
                        className={tableCellsClasses.long}
                        key={`Student-${idx}`} />,
                    // Разбираем массив работ на массив ячеек
                    ...works.map((_work: WorkInterface, i) => (
                        <EmptyTableCell
                            connection={connection}
                            changeMarkState={changeMarkState}
                            cellType={tableType}
                            studentId={student.studentId}
                            className="min-w-12.5 h-12.5 "
                            key={`Work-string-${idx}-col-${i}`} />
                    )),
                    // Заглушка
                    <EmptyTableCell
                        disabled={true}
                        cellType={tableType}
                        className="min-w-12.5 h-12.5 "
                        key={`WorkPlaceholder-${idx}`} />
                ]
                rows.push(<tr className={rowClassName} key={`Row-${idx}`}>{cells}</tr>)
            })
            // Последняя строка
            cells = [
                // Кнопка добавления студента
                <EditableTableCell
                    onClick={openStudentModal}
                    cellType="student"
                    cellData={'+'}
                    className={tableCellsClasses.long + " text-center"}
                    key={"StudentAdd"} />,
                // Разбираем массив работ на массив ячеек
                ...works.map((date: WorkInterface, i) => (
                    <EmptyTableCell
                        disabled={true}
                        cellType={tableType}
                        className="min-w-12.5 h-12.5 "
                        key={String(date.name) + " " + String(i)} />
                )),
                // Заглушка
                <EmptyTableCell
                    disabled={true} 
                    cellType={tableType}
                    className="min-w-12.5 h-12.5 "
                    key={"WorkPlaceholder2"} />

            ]
            rows.push(<tr className={rowClassName} key={"LastRow"}>{cells}</tr>)
        }
    return (
        <table className="block border-separate border-spacing-0.5 max-w-full max-h-142.5 overflow-scroll" key={tableIndex}>
            <tbody>{rows}</tbody>
        </table>
    );
  };
    useEffect(() => {
        renderTable(1)    
            
    })
    return (
        <div key={1} className="overflow-scroll">
            {renderTable(1)}
            <StudentModal isOpen={studentModal} close={closeStudentModal} isEditMode={isEditMode}/>
            <WorkModal isOpen={workModal} close={closeWorkModal} isEditMode={isEditMode}/>
        </div>
    );
}