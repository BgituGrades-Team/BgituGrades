import { Select } from "@headlessui/react";
import type { HubConnection } from "@microsoft/signalr";
import { useEffect, useState, type ChangeEvent } from "react";
import type { PresenceInterface } from "../types/fromRequests";

interface PropsInterface {
    adminSelect? : boolean;
    selectData: string[];
    backgroundColor?: string;
    presence?: "ABSENTVALID" | "ABSENTINVALID" | "PRESENT"
    classId?: number;
    studentId?: number;
    date?: string;
    changePresenceState?: (presenceState: string, studentId: number, classId: number, date: string) => void;
    changeMarkState?: (markState: string, studentId: number, workId: number, date: string, value: string, isOverdue: boolean) => void;
    connection?: HubConnection;
    disabled?: boolean;
    onInputChange?: React.Dispatch<React.SetStateAction<string>>;
}

interface DataInterface {
    studentId: number;
    name: null;
    presences: PresenceInterface[]
}

export default function CustomSelect({selectData = ["П", "Н", "У"], presence = "PRESENT", changePresenceState, studentId, classId, date, connection, disabled = false, adminSelect = false, onInputChange}: PropsInterface){ 
    const [selectedValue, setSelectedValue] = useState<string>(presence == "PRESENT" ? "П" : (presence == "ABSENTINVALID" ? "Н" : "У"))
    // Божественное откровение
    const [pIdor, setPIdor] = useState<boolean>(presence == "PRESENT" ? true : false)
    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setSelectedValue(presence == "PRESENT" ? "П" : (presence == "ABSENTINVALID" ? "Н" : "У"))
        setPIdor(presence == "PRESENT" ? true : false)
    }, [presence])
    const handleUpdate = (data: DataInterface) => {
        console.log(data)
        if (Number(data.presences[0].classId) == classId && Number(data.studentId) == studentId && data.presences[0].date == date) {
            setSelectedValue(data.presences[0].isPresent == "PRESENT" ? "П" : data.presences[0].isPresent == "ABSENTINVALID" ? "Н" : "У")
            setPIdor(data.presences[0].isPresent == "PRESENT" ? true : false)
        }
    }

    const takeColor = (val: string): string => {
        switch (val) {
            case "Н":
                return "bg-red"
            case "У":
                return "bg-orange"
            default:
                return ""
        }
    }

    if (connection) {
        connection.on("UpdatedPresence", (data) => {handleUpdate(data)})
    }

    // Долгий процесс изменения состояния посещения в одну букву
    const handleChange = (e: ChangeEvent<HTMLSelectElement>) => {
        setSelectedValue(e.target.value)
        onInputChange?.(e.target.value)
        setPIdor(e.target.value == "П")
        if (changePresenceState){
            let presenceToSet = ""
            switch (e.target.value) {
                case "Н":
                    presenceToSet = "ABSENTINVALID"
                    break;
                case "У":
                    presenceToSet = "ABSENTVALID"
                    break;
                case "П":
                    presenceToSet = "PRESENT"
                    break
                default:
                    break;
            }
            if (presenceToSet && studentId && classId && date) {
                changePresenceState(presenceToSet, studentId, classId, date)
            }
        
                
        
        }
    }
    if(adminSelect){
        //setSelectedValue("Выберите роль")

        return (
            <div>
                <p className="text-[28px] font-bold text-tLight dark:text-tLightD">Роль</p>
                <Select disabled={disabled} onChange={handleChange} value={selectedValue} className={` w-full h-11 rounded-lg z-10 appearance-none
                bg-bgModal dark:bg-bgModalD text-tDark dark:text-tDarkD text-[15px]
                text-left p-2.5 `}>
                    {selectData.map((val) => (
                        
                        <option className="bg-bgDark dark:bg-bgDarkD w-auto" key={val}>
                            {val}
                        </option>
                    ))}
                </Select>
            </div>
      )
    } else {
        return (
            <Select disabled={disabled} onChange={handleChange} value={selectedValue} className={`block w-full h-full z-10 appearance-none
            focus:not-data-focus:outline-none text-tLight dark:text-tLightD text-[15px]
            text-center ${(pIdor ? "opacity-0 " : "opacity-100 ") + takeColor(selectedValue)} `}>
                
                {selectData.map((val) => (
                    <option className="bg-bgDark dark:bg-bgDarkD" key={val}>
                        {val}
                    </option>
                ))}
            </Select>
        )
    }
}
