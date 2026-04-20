import Button from "./Button"
import Input from "./Input"
import type { DisciplineInterface, GroupInterface, PeriodsInterface, StudentInterface } from "../types/fromRequests";
import MultipleInput from "./MultipleInput";
import type { pipeBombInterface } from "../types/interfaces";
import PeriodsInput from "./PeriodsInput";
import { useContext } from "react";
import { SingleInputValuesContext } from "../utils/contexts";

interface PropsInterface {
    groups: GroupInterface[];
    disciplines: DisciplineInterface[];
    students: StudentInterface[];
    periods: PeriodsInterface[];
    link: string;
    handleSearch: () => void;
    pipeBomb: pipeBombInterface
}


export default function StudentTopNavBar({groups, disciplines, periods, handleSearch, students, link, pipeBomb}: PropsInterface){
    const reportTypes = [{id: 0, name: "По посещению"}, {id: 1, name:"По успеваемости"}] // Типы отчетов
    const singleGroupAndDiscipline = useContext(SingleInputValuesContext)
    //янв - июнь 2024: это 2; сент - дек 2025: это 1; для периода
    if (singleGroupAndDiscipline) {
    return (
       <div className="h-25 lg:ml-34.5 max-sm:h-fit mt-13.75 flex justify-between max-sm:pl-0 pl-3.75 items-end max-sm:flex-col max-sm:items-start max-sm:mt-5">
            <div className="flex gap-6.25 items-end max-sm:flex-col">
                <PeriodsInput handleSearch={handleSearch} array={periods} textChildren="Семестр" helpText="Период..."/>  
                <MultipleInput selectors={pipeBomb.groups} handleSearch={handleSearch} inputType="group" array={groups} textChildren="Группа" helpText="Название группы..."/>
                <MultipleInput selectors={pipeBomb.disciplines} handleSearch={handleSearch} inputType="discipline" array={disciplines} textChildren="Дисциплина" helpText="Название дисциплины..."/>
                <MultipleInput selectors={pipeBomb.students} handleSearch={handleSearch} inputType="student" array={students} textChildren="Студент" helpText="Имя студента..."/>
                <Input selectedId={singleGroupAndDiscipline ? singleGroupAndDiscipline?.repTypeVal : ""} setSelectedId={singleGroupAndDiscipline.repTypeDispatcher}  array={reportTypes} textChildren="Тип отчетности" helpText="Тип отчетности..."/>
            </div> 
            <div className="flex gap-6.25 max-sm:flex-col items-center justify-center max-sm:hidden">
                <a title="downloadLink" href={link} download={"report.xlsx"}>
                <Button children="Скачать в Excel"/>
                </a>
            </div>
       </div> 
    )
}}

