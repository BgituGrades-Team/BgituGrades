import { useEffect, useState } from "react";
import Arrow from "./SVG/Arrow"
import { Combobox, ComboboxInput, ComboboxOption, ComboboxOptions, ComboboxButton } from '@headlessui/react'
import { useSearchParams } from "react-router-dom";

interface BaseItem {
    id: number | string;
    name: string;
}

interface PropsInterface<T extends BaseItem> {
    textChildren?: string;
    helpText?: string;
    array: T[] ; // Массивы возможных значений в инпуте
    inputType: "group" | "discipline" | "student" | "type" | "startDate" | "endDate"
    onChange?: () => void;
    handleSearch: () => void;
    selectors: 
        [T[], React.Dispatch<React.SetStateAction<T[]>>]
}

export default function MultipleInput<T extends BaseItem>({textChildren="Группа", helpText="Название группы", array, handleSearch, selectors}: PropsInterface<T>) {
    const [query, setQuery] = useState(``)
    const [searchParams,] = useSearchParams()
    const [selectedValue, setSelectedValue] = selectors
    //const [inverseSearch, setInverseSearch] = useState(false)
    const isSelected = (item: T ) => {
        return selectedValue.some(selected => selected.id == item.id)
    }
    useEffect(() => {
        // Callback на проверку, есть ли оба элемента в query и вывод таблицы
        handleSearch()

    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [searchParams])
    const handleClick = () => {
       return filterValues
    }

    // Изменение выбранного элемента и добавление идентификатора в query параметры
    const handleChange = (e: T[] ) => {
        if (e.filter(val => val.name == "Выбрать все").length == 1) {
            setSelectedValue(filterValues.filter(val => val.id != -1)) // Временно ставим ВСЕ параметры, позже напишу логику для оптимизации этого ужаса
        } else {
            setSelectedValue(e)
        }
    }

    // Фильтрует массив по алфавиту
    let filterValues = 
        query === ``
            ? array
            : array.filter((val) => {
                return val.name.toLowerCase().includes(query.toLowerCase())
            })
    const checkAll: T[] = [{id: -1, name: "Выбрать все"} as T] // Да простят меня боги веба за такой костыль
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