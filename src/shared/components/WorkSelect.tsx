import type { HubConnection } from "@microsoft/signalr";
import { useContext, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom"
import { SingleInputValuesContext } from "../utils/contexts";

interface PropsInterface{
    selectData: string[];
    studentId?: number;
    workId?: number;
    changeMarkState?: (value: string, studentId: number, workId: number, isOverdue: boolean, groupId: number, disciplineId: number) => void;
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
    const [coords, setCoords] = useState({top: 0, left: 0, width: 0})
    //const [currVal, setCurrVal] = useState<string>("")
    const wrapperRef = useRef<HTMLDivElement>(null)
    const optionsRef = useRef<HTMLDivElement>(null);
    const updateCoords = () => {
        if( wrapperRef.current){
            const rect = wrapperRef.current.getBoundingClientRect();
            setCoords({
                top: rect.bottom + window.scrollY,
                left: rect.left + window.scrollX,
                width: rect.width
            })
        }
    }

    const handleToggle = () => {
        updateCoords()
        setOptionsVisibility(!optionsVisibility)
    }
useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      if (
        wrapperRef.current && !wrapperRef.current.contains(target) &&
        optionsRef.current && !optionsRef.current.contains(target)
      ) {
        setOptionsVisibility(false);
      }
    };

    if (optionsVisibility) {
      document.addEventListener("mousedown", handleClickOutside);
      // Обновляем координаты при ресайзе или скролле, чтобы портал не "улетал"
      window.addEventListener("resize", updateCoords);
      window.addEventListener("scroll", updateCoords, true);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      window.removeEventListener("resize", updateCoords);
      window.removeEventListener("scroll", updateCoords, true);
    };
  }, [optionsVisibility]);

    const info = useContext(SingleInputValuesContext)
    const handleSelect = (val: string) => {
        
        const groupId = info?.groupVal;
        const disciplineId = info?.disciplineVal;
        if (disabled) return;
        setMarkValue(val);
        setOptionsVisibility(false);
        console.log(val, studentId, workId, val, isOverdue)
        
        onInputChange?.(val);
        if(changeMarkState && studentId &&  workId){
            changeMarkState(val, studentId, workId, isOverdue, Number(groupId), Number(disciplineId))
            console.log(val, studentId, workId, isOverdue)
        }

  };

    // 1. Убедимся, что стейт всегда актуален при смене пропсов
    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setMarkValue(mark);
        setIsOverdue(!!overdue);
    }, [mark, overdue]);

    // 2. Единый обработчик для чекбокса
    const handleOverdueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (disabled) return;
        
        const newOverdueStatus = e.target.checked;
        setIsOverdue(newOverdueStatus); // Сначала обновляем локальный стейт для UI

        // Отправляем запрос
        if (changeMarkState && studentId && workId) {
            const groupId = info?.groupVal;
            const disciplineId = info?.disciplineVal;
            // Используем markValue (текущую оценку) и новый статус просрочки
            changeMarkState(markValue || "", studentId, workId, newOverdueStatus, Number(groupId), Number(disciplineId));
        }
    };

    return (
        <div ref={wrapperRef} className="relative min-w-12.5 h-12.5 ">
            <button 
                disabled={disabled}
                title="showOptsBut" 
                type="button" 
                onClick={handleToggle} 
                className={ isOverdue  ? ` block w-full h-full  text-tLight dark:text-tLightD border-dashed border-blue-300 border-2` : ` block w-full h-full  text-tLight dark:text-tLightD`}>
                    {markValue}
            </button>
         {optionsVisibility && createPortal(<div 
            ref={optionsRef}
            style={{ 
                    position: 'absolute', 
                    top: coords.top, 
                    left: coords.left, 
                    width: coords.width,
                    zIndex: 9999 
                }}
            className={`${optionsVisibility ? "block" : "hidden"} absolute left-0 w-full z-10 text-center rounded-lg bg-bgDark dark:bg-bgDarkD border-white`}>
                {selectData.map((val) => (
                    <button 
                        disabled={disabled}
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
                    disabled={disabled}
                    type="checkbox"
                    checked={isOverdue}
                    onChange={handleOverdueChange}
                    className="cursor-pointer"
                    />
                <span className="text-xs text-tLight dark:text-tLightD">С опозданием</span>
            </label>
       
            </div>,
            document.body)}
        </div>
    )
}


