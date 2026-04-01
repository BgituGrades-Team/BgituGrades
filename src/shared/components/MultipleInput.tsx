import { useEffect, useState } from "react";
import Arrow from "./SVG/Arrow"
import { Combobox, ComboboxInput, ComboboxOption, ComboboxOptions, ComboboxButton } from '@headlessui/react'
import { useSearchParams } from "react-router-dom";
import type { DisciplineInterface, GroupInterface, ReportTypeInterface, StudentInterface } from "../types/fromRequests";

interface PropsInterface{
    textChildren?: string;
    helpText?: string;
    array: GroupInterface[] | DisciplineInterface[] | StudentInterface[] | ReportTypeInterface[] ; // Массивы возможных значений в инпуте
    inputType: "group" | "discipline" | "student" | "type" | "startDate" | "endDate"
    onChange?: () => void;
    handleSearch: () => void;
}

/**
 * 
 * @param item Массив групп/дисциплин/студентов
 * @returns Идентификаторы элементов массива в виде строки через запятую
 */
function mapAndJoinById(item: GroupInterface[] | DisciplineInterface[] | StudentInterface[] | []): string {
    return item.map(elem => elem.id).join(",")
}

/**
 * 
 * @param item Массив индентификаторов в виде строк
 * @param id Идентификатор для проверки
 * @returns Есть ли id в item
 */
function checkIfIdInParam(item: string[] | undefined, id: number): boolean {
    if (item) {
        return item.map(elem => Number(elem)).includes(id)
    } else {
        return false
    }
    
}


export default function MultipleInput({textChildren="Группа", helpText="Название группы", array, inputType, handleSearch}: PropsInterface){
    const [selectedValue, setSelectedValue] = useState<GroupInterface[] | DisciplineInterface[] | StudentInterface[] | ReportTypeInterface[] | [] >([])
    const [query, setQuery] = useState(``)
    const [searchParams, setSearchParams] = useSearchParams()

    useEffect(() => {
        // Поиск query параметров
        const disciplineId = searchParams.get("disciplineid")?.split(",")
        const groupId = searchParams.get("groupid")?.split(",")
        const studentId = searchParams.get("studentid")?.split(",")
        const reportTypeId = searchParams.get("reporttype")?.split(",")

        // Установка выбранного параметра после перезапуска страницы
        const elementsToSet: GroupInterface[] | DisciplineInterface[] | StudentInterface[] | ReportTypeInterface[] = [];
        array.forEach(element => {
            if ((checkIfIdInParam(groupId, element.id) && inputType == "group") ||
               (checkIfIdInParam(disciplineId, element.id) && inputType == "discipline") ||
               (checkIfIdInParam(studentId, element.id) && inputType == "student") ||
               (checkIfIdInParam(reportTypeId, element.id) && inputType == "type" && reportTypeId != undefined) ) { // Каждый доступный тип инпута
                
                elementsToSet.push(element as GroupInterface & DisciplineInterface & StudentInterface & ReportTypeInterface)
            }
        });
        setSelectedValue(elementsToSet)

        // Callback на проверку, есть ли оба элемента в query и вывод таблицы
        handleSearch()

    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [searchParams])
    const handleClick = () => {
       return filterValues
    }

    // Изменение выбранного элемента и добавление идентификатора в query параметры
    const handleChange = (e: GroupInterface[] | DisciplineInterface[] | StudentInterface[] | [] ) => {
        setSelectedValue(e)
        if (e){
            const params = new URLSearchParams()
            const groupId = searchParams.get("groupid")?.split(",")
            const disciplineId = searchParams.get("disciplineid")?.split(",")
            const studentId = searchParams.get("studentid")?.split(",")
            const reportType = searchParams.get("reporttype")?.split(",")
            switch(inputType){
                case "group" : {
                    params.append("groupid", mapAndJoinById(e))
                    break
                }
                case "discipline" : {
                    params.append("disciplineid", mapAndJoinById(e))
                    break
                }
                case "student" : {
                    params.append("studentid", mapAndJoinById(e))
                    break
                }
                case "type" : {
                    params.append("reporttype", mapAndJoinById(e))
                    break
                }
            }
            if(groupId && inputType != "group") { // Добавил проверки, так как параметры начинали дублироваться
                params.append("groupid", groupId ? groupId.join(",") : mapAndJoinById(e))
            }
            if (disciplineId && inputType != "discipline") {
                params.append("disciplineid", disciplineId ? disciplineId.join(",") : mapAndJoinById(e))
            }           
            if (studentId && inputType != "student") {
                params.append("studentid", studentId ? studentId.join(",") : mapAndJoinById(e))
            }
            if(reportType && inputType != "type"){
                params.append("reporttype", reportType ? reportType.join(",") : mapAndJoinById(e))
            }
            setSearchParams(params)
           
        }
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
            <p className="text-[28px] font-bold text-tLight dark:text-tLightD">{textChildren}</p>
            <div className="relative">
                <Combobox value={selectedValue}  onChange={handleChange} onClose={() => setQuery(``)} multiple>
                    <ComboboxInput
                        className="w-58 bg-bgModal dark:bg-bgModalD text-tDark dark:text-tDarkD rounded-lg p-2.5 "
                        aria-label="Assignee"
                        /*displayValue={(val: [GroupInterface] | [DisciplineInterface] | [ReportTypeInterface]) => val?.map(elem => elem.name).join(", ")}*/
                        onChange={(event) => setQuery(event.target.value)}
                        placeholder={selectedValue.length == 0 ? helpText : "Выбрано: " + selectedValue.length} />
                        <ComboboxButton className="group absolute inset-y-0 right-0 px-2.5">                            
                            <Arrow onClick={handleClick} className="h-6 w-6 absolute top-2.5 right-2.5"/>
                        </ComboboxButton>
                    <ComboboxOptions  anchor="bottom" className="w-65 bg-bgModal dark:bg-bgModalD text-tDark dark:text-tDarkD rounded-lg">
                        {filterValues.map((val) => (
                            <ComboboxOption key={val.id} id={String(val.id)}  value={val} className="bg-bgModal dark:bg-bgModalD text-tDark dark:text-tDarkD p-2.5">
                                {val.name}
                            </ComboboxOption>
                        ))}
                    </ComboboxOptions>
                </Combobox>
            </div>
        </div>
        
    )
}