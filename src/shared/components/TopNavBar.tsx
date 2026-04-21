import Button from "./Button"
import Input from "./Input"
import Image from "../../assets/alt.png"
import { getStudentLink } from "../utils/apiRequests";
import type { DateTableSample, DisciplineInterface, GroupInterface, StudentLinkInterface } from "../types/fromRequests";
import { useContext, useState } from "react";
import StudentLinkModal from "../modals/StudentLinkModal";
import { type SetStateAction } from 'react';
import { AuthContext, SingleInputValuesContext } from "../utils/contexts";

interface PropsInterface {
    groups: GroupInterface[];
    disciplines: DisciplineInterface[];
    tableIds?:  number[];
    onUpdate?: React.Dispatch<SetStateAction<DateTableSample | undefined>> 
    handleEditModeChange?: () => void;
}


function TopNavBar({groups, disciplines, handleEditModeChange, onUpdate}: PropsInterface){
    const [link, setLink] = useState<string>()
    const [isOpen, setIsOpen] = useState<boolean>(false)

    const singleGroupAndDiscipline = useContext(SingleInputValuesContext)
    const role = useContext(AuthContext)
    // Нажатие на кнопку создать ссылку
    const createStudentLink = async () => {
        const res: StudentLinkInterface | undefined = await getStudentLink(Number(singleGroupAndDiscipline?.groupVal));
        console.log(res)
        if(res) {
            setLink(res.link.replace("maxim.", ""))
            setIsOpen(true);
        }
    };

    const closeStudentModal = () => {
        setIsOpen(false);
    }
    if (singleGroupAndDiscipline) {
    return (
       <div className="h-25 lg:ml-34.5 max-sm:h-fit mt-13.75 flex justify-between max-sm:pl-0 pl-3.75 items-end max-sm:flex-col max-sm:items-start max-sm:mt-5">
            <div className="flex gap-6.25 items-end max-sm:flex-col">
                <img className="mr-3.25 max-sm:hidden hidden" src={Image} alt="img" />
                <Input selectedId={singleGroupAndDiscipline ? singleGroupAndDiscipline.groupVal : ""} setSelectedId={singleGroupAndDiscipline.groupDispatcher} array={groups} textChildren="Группа" helpText="Название группы..."/>
                <Input selectedId={singleGroupAndDiscipline ? singleGroupAndDiscipline.disciplineVal : ""} onUpdate={onUpdate} setSelectedId={singleGroupAndDiscipline.disciplineDispatcher} isGroupSelected={singleGroupAndDiscipline.groupVal ? true : false} array={disciplines} textChildren="Дисциплина" helpText="Название дисциплины..."/>
            </div> 
            <div className="flex gap-6.25 max-sm:flex-col items-center justify-center max-sm:hidden">
                <Button children="Создать ссылку" className={singleGroupAndDiscipline?.groupVal  == undefined ? "  hidden" : ""} onClick={createStudentLink}/>
                <Button children="Редактировать" onClick={handleEditModeChange} className={role == "STUDENT" ? " hidden " : ""}/>
                {/*<Button children="Поделиться"/>*/}
            </div>
            <StudentLinkModal isOpen={isOpen} close={closeStudentModal} linkText={link} />
       </div> 
    )
}}

export default TopNavBar