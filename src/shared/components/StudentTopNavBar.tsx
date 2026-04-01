import Button from "./Button"
import Input from "./Input"
import type { DisciplineInterface, GroupInterface, StudentInterface } from "../types/fromRequests";
import MultipleInput from "./MultipleInput";

interface PropsInterface {
    groups: GroupInterface[];
    disciplines: DisciplineInterface[];
    students: StudentInterface[];
    link: string;
    handleSearch: () => void;
}


export default function StudentTopNavBar({groups, disciplines, handleSearch, students, link}: PropsInterface){
    const reportTypes = [{id: 0, name: "По посещению"}, {id: 1, name:"По успеваемости"}] // Типы отчетов
    //янв - июнь 2024: это 2; сент - дек 2025: это 1; для периода
    return (
       <div className="h-25 mt-13.75 flex justify-between pl-3.75 items-end">
            <div className="flex gap-6.25 items-end">
                <Input handleSearch={handleSearch} inputType="startDate" array={groups} textChildren="Семестр" helpText="Период..."/>  
                <MultipleInput handleSearch={handleSearch} inputType="group" array={groups} textChildren="Группа" helpText="Название группы..."/>
                <MultipleInput handleSearch={handleSearch} inputType="discipline" array={disciplines} textChildren="Дисциплина" helpText="Название дисциплины..."/>
                <MultipleInput handleSearch={handleSearch} inputType="student" array={students} textChildren="Студент" helpText="Имя студента..."/>
                <Input handleSearch={handleSearch} inputType="type" array={reportTypes} textChildren="Тип отчетности" helpText="Тип отчетности..."/>
            </div> 
            <div className="flex gap-6.25">
                <a href={link} download={"report.xlsx"}>
                <Button children="Скачать в Excel"/>
                </a>
            </div>
       </div> 
    )
}

