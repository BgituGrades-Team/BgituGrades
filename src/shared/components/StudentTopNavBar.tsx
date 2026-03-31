import Button from "./Button"
import Input from "./Input"
import type { DisciplineInterface, GroupInterface, StudentInterface } from "../types/fromRequests";
import MultipleInput from "./MultipleInput";

interface PropsInterface {
    groups: GroupInterface[];
    disciplines: DisciplineInterface[];
    students: StudentInterface[];
    
    handleSearch: () => void;
}


export default function StudentTopNavBar({groups, disciplines, handleSearch, students}: PropsInterface){
    const reportTypes = [{id: 0, name: "По посещению"}, {id: 1, name:"По успеваемости"}] // Типы отчетов
    return (
       <div className="h-25 mt-13.75 flex justify-between pl-3.75 items-end">
            <div className="flex gap-6.25 items-end">
                <MultipleInput handleSearch={handleSearch} inputType="group" array={groups} textChildren="Группа" helpText="Название группы..."/>
                <MultipleInput handleSearch={handleSearch} inputType="discipline" array={disciplines} textChildren="Дисциплина" helpText="Название дисциплины..."/>
                <MultipleInput handleSearch={handleSearch} inputType="student" array={students} textChildren="Студент" helpText="Имя студента..."/>
                <Input handleSearch={handleSearch} inputType="type" array={reportTypes} textChildren="Тип отчетности" helpText="Тип отчетности..."/>
                <Input handleSearch={handleSearch} inputType="startDate" array={groups} textChildren="Начало периода" helpText="Начало периода..."/>
                <Input handleSearch={handleSearch} inputType="endDate" array={groups} textChildren="Конец периода" helpText="Окончание периода..."/>
            </div> 
            <div className="flex gap-6.25">
                <Button children="Скачать в Excel"/>
            </div>
       </div> 
    )
}

