import { useEffect, useState } from "react";
import EmptyTableCell from "./EmptyTableCell";
import FirstTableCell from "./FirstTableCell";
import EditableTableCell from "./EditableTableCell";
import StudentModal from "../modals/StudentModal";
import WorkModal from "../modals/WorkModal";
import { HubConnection } from "@microsoft/signalr";
import { useSearchParams } from "react-router-dom";
import type { ReportTableSample, WorkInterface, WorkTableSample } from "../types/fromRequests";

interface PropsInterface{
    tableType: "work" | "date";
    isEditMode: boolean;
    table?: ReportTableSample;
    connection: HubConnection
}


export default function ReportGenerator({tableType, isEditMode, table, connection}: PropsInterface){
    const [studentModal, setStudentModal] = useState<boolean>(false)
    const [workModal, setWorkModal] = useState<boolean>(false)
    const [searchParams] = useSearchParams()

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

        // ОБЯЗАТЕЛЬНО СДЕЛАТЬ НОВУЮ МОДАЛКУ ДЛЯ ОЦЕНКИ СТУДЕНТУ
        if(table && table.length > 0){
            // Угловая ячейка
            const works = table[0].marks
            cells.push(<FirstTableCell topTitle="Работы" botTitle="ФИО" className="min-w-56.25 h-12.5" key={"Allah"} />)
            console.log(works)
            // Первая строка
            works.forEach((work: WorkInterface, workIndex: number) => {
                cells.push(<EditableTableCell onClick={openWorkModal} cellType="work" cellData={work.name} className="min-w-12.5 h-12.5 text-[16px] font-blod text-tLight dark:text-tLightD text-center " key={"Allah" + String(workIndex)} />)
                // Если элемент последний, добавляем доп ячейку с плюсиком
                if (workIndex == works.length-1){
                    cells.push(<EditableTableCell onClick={openWorkModal} cellType="work" cellData="" className="min-w-12.5 h-12.5 text-[16px] font-blod text-tLight dark:text-tLightD text-center " key={"Allahi" + String(workIndex)} />)
                }
            })
            // Заглушка, елси работ еще не добавлено
            if (works.length == 0) {
                cells.push(<EditableTableCell onClick={openWorkModal} cellType="work" cellData="" className="min-w-12.5 h-12.5 text-[16px] font-blod text-tLight dark:text-tLightD text-center " key={"Allahi" + "0"} />)
            }
            rows.push(<tr className="odd:bg-bgLight dark:odd:bg-bgLightD even:bg-bgMiddle dark:even:bg-bgMiddleD" key={"allah2"}>{cells}</tr>)
            
            // Остальные строки
            table.forEach((student: WorkTableSample[0], idx:number) => {
                const cells = [];
                const works = student.marks;
                // ФИО Студента
                cells.push(<EditableTableCell onClick={openStudentModal} cellType="student" cellData={student.name} className="min-w-56.25 h-12.5 p-1.25 text-[16px] font-blod text-tLight dark:text-tLightD" key={"Allahs" + String(idx)} />)
                // Посещения по датам
                works.forEach((_work: WorkInterface, index: number) => {
                    cells.push(<EmptyTableCell connection={connection} changeMarkState={changeMarkState} cellType={tableType} studentId={student.studentId} className="min-w-12.5 h-12.5 " key={String(idx) + " " + String(index)} />);
                    if(index == works.length-1){
                        // Заглушка
                        cells.push(<EmptyTableCell disabled={true} cellType={tableType} className="min-w-12.5 h-12.5 " key={"Allah left"} />)
                    }
                })
                // Заглушка, елси работ еще не добавлено
                if (works.length == 0) {
                    cells.push(<EmptyTableCell disabled={true} cellType={tableType} className="min-w-12.5 h-12.5 " key={"Allah left"} />)
                }
                rows.push(<tr className="odd:bg-bgLight dark:odd:bg-bgLightD even:bg-bgMiddle dark:even:bg-bgMiddleD" key={idx}>{cells}</tr>)

            })
            
            cells = []
            // Пустая строка для добавления студента
            cells.push(<EditableTableCell onClick={openStudentModal} cellType="student" cellData={''} className="min-w-56.25 h-12.5 p-1.25 text-[16px] font-blod text-tLight dark:text-tLightD" key={"Allah last"} />)
                // Заглушки
                works.forEach((date: WorkInterface, index: number) => {
                    cells.push(<EmptyTableCell disabled={true} cellType={tableType} className="min-w-12.5 h-12.5 " key={String(date.name) + " " + String(index)} />);
                    if(index == works.length-1){
                        // Заглушка
                        cells.push(<EmptyTableCell disabled={true} cellType={tableType} className="min-w-12.5 h-12.5 " key={"Allah left"} />)
                    }
            });
            // Заглушка, елси работ еще не добавлено
            if (works.length == 0) {
                cells.push(<EmptyTableCell disabled={true} cellType={tableType} className="min-w-12.5 h-12.5 " key={"Allah left"} />)
            }
            rows.push(<tr className="odd:bg-bgLight dark:odd:bg-bgLightD even:bg-bgMiddle dark:even:bg-bgMiddleD" key={"alloe"}>{cells}</tr>)
        }
    return (
        <table className="block border-separate border-spacing-0.5 w overflow-auto" key={tableIndex}>
            <tbody>{rows}</tbody>
        </table>
    );
  };
    useEffect(() => {
        renderTable(1)    
            
    })
    return (
        <div key={1} className="w-full">
            {renderTable(1)}
            <StudentModal isOpen={studentModal} close={closeStudentModal} isEditMode={isEditMode}/>
            <WorkModal isOpen={workModal} close={closeWorkModal} isEditMode={isEditMode}/>
        </div>
    );
}
