import type { HubConnection } from "@microsoft/signalr";
import { useEffect, useRef, useState } from "react";


interface PropsInterface{
    selectData: string[];
    studentId?: number;
    workId?: number;
    changeMarkState?: (value: string, studentId: number, workId: number, isOverdue: boolean) => void;
    connection?: HubConnection;
    disabled?: boolean;
    mark?: string;
    onInputChange?: React.Dispatch<React.SetStateAction<string>>;
    overdue: boolean | undefined
}






export default function WorkSelect({selectData = ["5", "4", "3", "2", "+"], studentId, workId, mark = "", overdue=false, disabled = false, onInputChange, changeMarkState}: PropsInterface){
    const [optionsVisibility, setOptionsVisibility] = useState<boolean>(false)
    const [markValue, setMarkValue] = useState<string | null>(mark)
    const [isOverdue, setIsOverdue] = useState<boolean>(overdue)
 

    const wrapperRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setOptionsVisibility(false);
      }
     
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);


    const handleSelect = (val: string) => {
        if (disabled) return;
        setMarkValue(val);
        setOptionsVisibility(false);
        console.log(val, studentId, workId, val, isOverdue)
        
        onInputChange?.(val);
        if(changeMarkState && studentId &&  workId){
            changeMarkState(val, studentId, workId, isOverdue)
            console.log(val, studentId, workId, isOverdue)
        }

  };


    return (
        <div ref={wrapperRef} className="relative min-w-12.5 h-12.5 ">
            <button 
                
                title="showOptsBut" 
                type="button" 
                onClick={() => setOptionsVisibility(!optionsVisibility)} 
                className={ isOverdue  ? ` block w-full h-full  text-tLight dark:text-tLightD border-dashed border-blue-300 border-2` : ` block w-full h-full  text-tLight dark:text-tLightD`}>
                    {markValue}
            </button>
         {optionsVisibility && (<div className={`${optionsVisibility ? "block" : "hidden"} absolute left-0 w-full z-10 text-center rounded-lg bg-bgDark dark:bg-bgDarkD border-white`}>
                {selectData.map((val) => (
                    <button 
                        type="button" 
                        onClick={() => handleSelect(val)} 
                        className="block w-full py-2 hover:bg-gray-700 text-tLight dark:text-tLightD" 
                        key={val}>
                        {val}
                    </button>
                    ))
                }
            
                <label className="flex items-center gap-2 p-2 cursor-pointer border-t border-gray-600">
                    <input
                    type="checkbox"
                    checked={isOverdue}
                    onChange={(e) => setIsOverdue(e.target.checked)}
                    className="cursor-pointer"
                    />
                <span className="text-xs text-tLight dark:text-tLightD">С опозданием</span>
            </label>
            
            </div>)}
        </div>
    )
}