import { useEffect, } from "react";
import EditableTableCell from "./EditableTableCell";
import { HubConnection } from "@microsoft/signalr";
//import { useSearchParams } from "react-router-dom";
import type { ReportTableSample, } from "../types/fromRequests";
import type { JSX } from "react/jsx-runtime";

interface PropsInterface{
    tableType?: "work" | "date" | "report";
    isEditMode: boolean;
    table?: ReportTableSample;
    connection: HubConnection
}


export default function ReportGenerator({/*tableType="report", isEditMode,*/ table, /*connection*/}: PropsInterface){
    //const [searchParams] = useSearchParams()

    const renderTable = (tableIndex:number) => {
        const rows: JSX.Element[] = [];
        let cells: JSX.Element[] = [];


        // Нужно сдеать цветые колонки для разделения и жирность текста контролировать 
        if(table){
            table.forEach((line, i) => {
                const tableCells = line.cells
                tableCells.forEach((cell, j) => {
                    cells.push(<EditableTableCell onClick={() => {console.log("I'm Alive")}} cellType="reportInfo" cellData={cell} className="min-w-12.5 h-12.5 text-[16px] font-bold text-tLight dark:text-tLightD text-center" key={"Allah" + String(i) + " " + String(j)}  />)
                })
                rows.push(<tr className="odd:bg-bgLight dark:odd:bg-bgLightD even:bg-bgMiddle dark:even:bg-bgMiddleD" key={"allah" + String(i)}>{cells}</tr>)
                cells = []
            })
            
        }
        console.log(rows)
    return (
        <table className="block border-separate border-spacing-0.5 w overflow-auto max-h-142.5" key={tableIndex}>
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
        </div>
    );
}
