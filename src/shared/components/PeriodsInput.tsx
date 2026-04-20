import React, { useEffect, useState } from "react";
import Arrow from "./SVG/Arrow"
import { Combobox, ComboboxInput, ComboboxOption, ComboboxOptions, ComboboxButton } from '@headlessui/react'
import { useSearchParams } from "react-router-dom";
import type { PeriodsInterface } from "../types/fromRequests";

interface PropsInterface{
    textChildren?: string;
    helpText?: string;
    array: PeriodsInterface[] ; // Массивы возможных значений в инпуте
    onChange?: () => void;
    onInputChange? : React.Dispatch<React.SetStateAction<number>>;
    handleSearch?: () => void;
    className?: string;
}




export default function PeriodsInput({textChildren="Группа", helpText="Название группы", array, handleSearch, className}: PropsInterface){
    const [selectedValue, setSelectedValue] = useState<PeriodsInterface | null>(null)
    const [query, setQuery] = useState(``)
    const [searchParams, setSearchParams] = useSearchParams()

    useEffect(() => {
        // Поиск query параметров
        const periodSem = searchParams.get("periodsem")
        const periodYear = searchParams.get("periodyear")

        // Установка выбранного параметра после перезапуска страницы
        let elementToSet: PeriodsInterface | null = null;
        array.map(element => {
            if ((element.semester == Number(periodSem) && element.year == Number(periodYear)) ) { // Каждый доступный тип инпута
                elementToSet = element
            }
        });
        setSelectedValue(elementToSet)

        // Callback на проверку, есть ли оба элемента в query и вывод таблицы
        if(handleSearch){
            handleSearch()
        }

    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [searchParams])
    const handleClick = () => {
       return filterValues
    }

    // Изменение выбранного элемента и добавление идентификатора в query параметры
    const handleChange = (e: PeriodsInterface | null) => {
        setSelectedValue(e)

        if (e){
            const params = new URLSearchParams()
            const groupId = searchParams.get("groupid")
            const disciplineId = searchParams.get("disciplineid")
            const studentId = searchParams.get("studentid")
            const reportType = searchParams.get("reporttype")
            params.append("periodsem", String(e.semester))
            params.append("periodyear", String(e.year))
               if(groupId ) { // Добавил проверки, так как параметры начинали дублироваться
                params.append("groupid", groupId)
                
            }
            if (disciplineId ) {
                params.append("disciplineid", disciplineId)
            }           
            if (studentId ) {
                params.append("studentid", studentId)
            }
            if(reportType){
                params.append("reporttype", reportType)
            }

            setSearchParams(params)
         
            
            
        }
    }

    // Фильтрует массив по алфавиту
    const filterValues = 
        query === ``
            ? array
            : array.filter((val) => {
                return val.semester + val.year
            })
            

    return(
         <div className="flex flex-col gap-2.5">
            <p className="text-[28px] font-bold text-tLight dark:text-tLightD">{textChildren}</p>
            <div className="relative ">
                <Combobox value={selectedValue} virtual={{options: filterValues}} onChange={handleChange} onClose={() => setQuery(``)}>
                    <ComboboxInput
                        className={"w-58 max-sm:w-[90vw] bg-bgModal dark:bg-bgModalD text-tDark dark:text-tDarkD rounded-lg p-2.5 " + className}
                        aria-label="Assignee"
                        displayValue={(val: PeriodsInterface) =>  val ? `${val.semester}-й Семестр ${val.year}год` : "Выберите семестр..."}
                        onChange={(event) => setQuery(event.target.value)}
                        placeholder={helpText} />
                        <ComboboxButton className="group absolute inset-y-0 right-0 px-2.5">
                            <Arrow onClick={handleClick} className="h-6 w-6 absolute top-2.5 right-2.5"/>
                        </ComboboxButton>
                    <ComboboxOptions  anchor="bottom"  className={"w-(--input-width) z-10 absolute left-0 max-h-105 border border-bgDark dark:border-bgModalD bg-bgModal dark:bg-bgModalD text-tDark dark:text-tDarkD rounded-lg " }>
                        {({option: val}) => (
                            <ComboboxOption key={val.year} id={String(val.year)}  value={val} className="bg-bgModal dark:bg-bgModalD text-tDark dark:text-tDarkD p-2.5">
                                {val.semester}-й Семестр {val.year}год
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