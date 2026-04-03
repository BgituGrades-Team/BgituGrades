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
 * Выбирает все id из массива и собирает их в строку
 * @param item Массив групп/дисциплин/студентов
 * @returns Идентификаторы элементов массива в виде строки через запятую
 */
function mapAndJoinById(item: GroupInterface[] | DisciplineInterface[] | StudentInterface[] | []): string {
    return item.map(elem => elem.id).join(",")
}

/**
 * Проверяет, если ли id в массиве
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



export default function MultipleInput({textChildren="Группа", helpText="Название группы", array, inputType, handleSearch}: PropsInterface) {
    const [selectedValue, setSelectedValue] = useState<GroupInterface[] | DisciplineInterface[] | StudentInterface[] | ReportTypeInterface[] | [] >([])
    const [query, setQuery] = useState(``)
    const [searchParams, setSearchParams] = useSearchParams()
    //const [inverseSearch, setInverseSearch] = useState(false)
    const isSelected = (item: GroupInterface | DisciplineInterface | StudentInterface ) => {
        return selectedValue.some(selected => selected.id == item.id)
    }

    /**
     * Не допускает исчезновения query параметров
     * @param e Event
     * @param params Тип данных для работы с query параметрами
     * @param inputType Тип поля ввода 
     */
    function removeDoubles(e: GroupInterface[] | DisciplineInterface[] | StudentInterface[] | [], params: URLSearchParams, inputType: string ) {
            const groupId = searchParams.get("groupid")?.split(",")
            const disciplineId = searchParams.get("disciplineid")?.split(",")
            const studentId = searchParams.get("studentid")?.split(",")
            const reportType = searchParams.get("reporttype")?.split(",")
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
        }

    /**
     * Добаввление нового значения в query параметры
     * @param params Тип данных для работы с query параметрами
     * @param inputType Тип поля ввода 
     * @param value Значение (обычно строка id через запятую)
     */
    function addNewValue(params: URLSearchParams, inputType: string, value: string) {
        //if (!inverseSearch) {
            switch (inputType) {
                case "group" : {
                    params.append("groupid", value)

                    break
                }
                case "discipline" : {
                    params.append("disciplineid", value)

                    break
                }
                case "student" : {
                    params.append("studentid", value)

                    break
                }
                case "type" : {
                    params.append("reporttype", value)

                    break
            }}
        /*} else {
            console.log("TODO")
        }*/
    }

    useEffect(() => {
        // Поиск query параметров
        const disciplineId = searchParams.get("disciplineid")?.split(",")
        const groupId = searchParams.get("groupid")?.split(",")
        const studentId = searchParams.get("studentid")?.split(",")
        const reportTypeId = searchParams.get("reporttype")?.split(",")

        /*if (selectedValue.length >= filterValues.length/2) { // Проверка, что выбранных элементов больше половины
            setInverseSearch(true)
        }*/

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
        if (e.filter(val => val.name == "Выбрать все").length == 1) {
            setSelectedValue(filterValues) // Временно ставим ВСЕ параметры, позже напишу логику для оптимизации этого ужаса
            const params = new URLSearchParams()
            // Добавление значения
            addNewValue(params, inputType, filterValues.map(val => val.id != -1 ? val.id : null).join(",")) // Тут проверка, чтобы id -1 не попал в query
            // Добавление старых значений
            removeDoubles(e, params, inputType)
            setSearchParams(params)
        } else {
            setSelectedValue(e)
            if (e){
                const params = new URLSearchParams()
                // Добавление значения
                addNewValue(params, inputType, mapAndJoinById(e))
                // Добавление старых значений
                removeDoubles(e, params, inputType)
                setSearchParams(params)
            }
        }
    }

    // Фильтрует массив по алфавиту
    let filterValues = 
        query === ``
            ? array
            : array.filter((val) => {
                return val.name.toLowerCase().includes(query.toLowerCase())
            })
    const checkAll: DisciplineInterface[] = [{id: -1, name: "Выбрать все"}] // Да простят меня боги веба за такой костыль
    filterValues = checkAll.concat(filterValues)
            
    return(
         <div className="flex flex-col gap-2.5">
            <p className="text-[28px] font-bold text-tLight dark:text-tLightD">{textChildren}</p>
            <div className="relative">
                <Combobox value={selectedValue} virtual={{options: filterValues}} onChange={handleChange} onClose={() => setQuery(``)} multiple>
                    <ComboboxInput      
                        className="w-58 bg-bgModal dark:bg-bgModalD text-tDark dark:text-tDarkD rounded-lg p-2.5 "
                        aria-label="Assignee"
                        /*displayValue={(val: [GroupInterface] | [DisciplineInterface] | [ReportTypeInterface]) => val?.map(elem => elem.name).join(", ")}*/
                        onChange={(event) => setQuery(event.target.value)}
                        placeholder={selectedValue.length == 0 ? helpText : "Выбрано: " + selectedValue.length} />
                        <ComboboxButton className="group absolute inset-y-0 right-0 px-2.5">                            
                            <Arrow onClick={handleClick} className="h-6 w-6 absolute top-2.5 right-2.5"/>
                        </ComboboxButton>
                    <ComboboxOptions anchor="bottom" className=" bg-bgModal dark:bg-bgModalD text-tDark dark:text-tDarkD rounded-lg w-(--input-width) border border-bgModal dark:border-bgModalD empty:invisible">
                        {({option: val}) => (
                            <ComboboxOption key={val.id} id={String(val.id)}  value={val} className="bg-bgModal dark:bg-bgModalD text-tDark dark:text-tDarkD p-2.5">
                                {val.name != "Выбрать все" ? <input className="w-3.5 h-3.5 mr-2.5" title="checkStatus" checked={isSelected(val)}  onChange={() => {}} onClick={(e) => {e.stopPropagation()}} type="checkbox" key={val.id}/> : ""}
                                {val.name}
                            </ComboboxOption>
                        )}
                    </ComboboxOptions>
                </Combobox>
            </div>
        </div>
        
    )
}