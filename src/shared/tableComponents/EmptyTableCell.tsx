import type { HubConnection } from "@microsoft/signalr";
import CustomSelect from "../components/CustomSelect";
import WorkSelect from "../components/WorkSelect";

interface EmptyPropsInterface{
    className?: string;
    cellType?: "work" | "date";
    presence?: "ABSENTVALID" | "ABSENTINVALID" | "PRESENT";
    studentId?: number;
    classId?: number;
    workId?: number;
    mark?: string;
    overdue?: boolean;
    date?: string;
    originalDate?: string;
    changeMarkState?: (value: string, studentId: number, workId: number, isOverdue: boolean) => void;
    changePresenceState?: (presenceState: string, studentId: number, classId: number, date: string) => void;
    connection?: HubConnection
    disabled?: boolean
}


export default function EmptyTableCell({cellType, className = "", changePresenceState, changeMarkState, studentId, classId, workId, mark, overdue, date, originalDate, connection, presence, disabled = false}: EmptyPropsInterface){
    const selectDataMarks = ["5", "4", "3", "2", "+"]
    const selectDataVisit = ["Н", "У", "П"]

    // Проверка, работа или дата
    switch (cellType) {
        case "date":
            return (
                <td className={className}>
                    <CustomSelect disabled={disabled} presence={presence} connection={connection} studentId={studentId} classId={classId} date={date} originalDate={originalDate} changePresenceState={changePresenceState} selectData={selectDataVisit} />
                </td>
            )
        case "work":
            return (
                <td className={className}>
                    <WorkSelect disabled={disabled} connection={connection} studentId={studentId}  workId={workId} mark={mark} overdue={overdue} changeMarkState={changeMarkState} selectData={selectDataMarks}/>
                </td>
            )
        default:
            break;
    }
}
