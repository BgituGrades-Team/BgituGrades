import React, { useContext, useEffect, useState } from "react";
import Arrow from "./SVG/Arrow"
import { Combobox, ComboboxInput, ComboboxOption, ComboboxOptions, ComboboxButton } from '@headlessui/react'
import type { DateTableSample, DisciplineInterface, GroupInterface, ReportTypeInterface, StudentInterface } from "../types/fromRequests";
import { type SetStateAction } from 'react';
import { AuthContext } from "../utils/contexts";

interface PropsInterface{
    textChildren?: string;
    helpText?: string;
    array: GroupInterface[] | DisciplineInterface[] | StudentInterface[] | ReportTypeInterface[] ; // Массивы возможных значений в инпуте
    className?: string;
    selectedId: string;
    setSelectedId: React.Dispatch<SetStateAction<string>>;
    onUpdate?: React.Dispatch<SetStateAction<DateTableSample | undefined>> 
    isGroupSelected?: boolean;
    selectType?: "group" | "discipline"
}


export default function Input({textChildren="Группа", helpText="Название группы", array, className, selectedId, onUpdate, setSelectedId , isGroupSelected, selectType}: PropsInterface){
    const value = array.find((arr) => String(arr.id) == selectedId)
    const [selectedValue, setSelectedValue] = useState<GroupInterface | DisciplineInterface | StudentInterface | ReportTypeInterface | null>(value ? value : null)
    const [query, setQuery] = useState(``)
    const handleClick = () => {
       return filterValues
    }

    const role = useContext(AuthContext)
    
    useEffect(() => {
        if (role == "STUDENT") {
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setSelectedValue(array[0])
            setSelectedId(String(array[0].id))
        }

    }, [array, role, setSelectedId])

    useEffect(() => {
        // Сбрасываем только если мы в режиме выбора дисциплины
        // И группа была целенаправленно снята (стала false)
        if (selectType === "discipline" && isGroupSelected === false) {
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setSelectedValue(null);
            setSelectedId("");
            onUpdate?.(undefined);
        }
    }, [isGroupSelected, selectType]);



    // Изменение выбранного элемента и добавление идентификатора в query параметры
    const handleChange = (e: GroupInterface | DisciplineInterface | StudentInterface | null) => {
        
        setSelectedValue(e)
         
        setSelectedId(e ? String(e.id) : "")
        onUpdate?.(undefined)
        
        
    }

    // Фильтрует массив по алфавиту
    const filterValues = 
        query === ``
            ? array
            : array.filter((val) => {
                return val.name.toLowerCase().includes(query.toLowerCase())
            })
            

    return(
         <div className="flex flex-col gap-2.5">
            <p className="text-[28px] max-sm:text-[18px] font-bold text-tLight dark:text-tLightD ">{textChildren}</p>
            <div className="relative ">
                <Combobox 
                        // Если группа не выбрана для дисциплины — принудительно null, иначе — текущее значение
                        value={(selectType === "discipline" && !isGroupSelected) ? null : selectedValue} 
                        virtual={{options: filterValues}} 
                        onChange={handleChange} 
                        disabled={((isGroupSelected || isGroupSelected == undefined) && role != "STUDENT") ? false : true} 
                        onClose={() => setQuery(``)}
                    >
                    <ComboboxInput
                        className={"w-58 max-sm:w-[90vw] bg-bgModal dark:bg-bgModalD text-tDark dark:text-tDarkD rounded-lg p-2.5 " + className}
                        aria-label="Assignee"
                        displayValue={(val: GroupInterface | DisciplineInterface | ReportTypeInterface) => val?.name}
                        onChange={(event) => setQuery(event.target.value)}
                        placeholder={helpText} />
                        <ComboboxButton className="group absolute inset-y-0 right-0 px-2.5">
                            <Arrow onClick={handleClick} className="h-6 w-6 absolute top-2.5 right-2.5"/>
                        </ComboboxButton>
                    <ComboboxOptions  anchor="bottom"  className={"w-(--input-width) z-10 absolute left-0 max-h-105 border border-bgDark dark:border-bgModalD bg-bgModal dark:bg-bgModalD text-tDark dark:text-tDarkD rounded-lg " }>
                        {({option: val}) => (
                            <ComboboxOption key={val.id} id={String(val.id)}  value={val} className="bg-bgModal dark:bg-bgModalD text-tDark dark:text-tDarkD p-2.5">
                                {val.name}
                            </ComboboxOption>
                        )}
                        
                        {/* {filterValues.map((val) => (
                            <ComboboxOption key={val.id} id={String(val.id)}  value={val} className="bg-bgModal dark:bg-bgModalD text-tDark dark:text-tDarkD p-2.5">
                                {val.name}
                            </ComboboxOption>
                        ))} */}
                    </ComboboxOptions>
                </Combobox>
            </div>
        </div>
        
    )
}