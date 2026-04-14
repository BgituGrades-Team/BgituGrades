import Button from "./Button"
import Input from "./Input"
import Image from "../../assets/alt.png"
import { getStudentLink } from "../utils/apiRequests";
import type { DateTableSample, DisciplineInterface, GroupInterface, StudentLinkInterface } from "../types/fromRequests";
import { useState } from "react";
import StudentLinkModal from "../modals/StudentLinkModal";
import { type SetStateAction } from 'react';

interface PropsInterface {
    groups: GroupInterface[];
    disciplines: DisciplineInterface[];
    handleSearch: () => void;
    tableIds:  number[];
    onUpdate?: React.Dispatch<SetStateAction<DateTableSample | undefined>> 
}


function TopNavBar({groups, disciplines, handleSearch, tableIds, onUpdate}: PropsInterface){
    const [link, setLink] = useState<string>()
    const [isOpen, setIsOpen] = useState<boolean>(false)

    // Нажатие на кнопку создать ссылку
    const createStudentLink = async () => {
        const res: StudentLinkInterface | undefined = await getStudentLink(tableIds[0]);
        console.log(res)
        if(res) {
            setLink(res.link.replace("maxim.", ""))
            setIsOpen(true);
        }
    };

    const closeStudentModal = () => {
        setIsOpen(false);
    }

    return (
       <div className="h-25 lg:ml-34.5 max-sm:h-fit mt-13.75 flex justify-between pl-3.75 items-end max-sm:flex-col max-sm:items-center max-sm:mt-5">
            <div className="flex gap-6.25 items-end max-sm:flex-col">
                <img className="mr-3.25 max-sm:hidden hidden" src={Image} alt="img" />
                <Input handleSearch={handleSearch}  inputType="group" array={groups} textChildren="Группа" helpText="Название группы..."/>
                <Input handleSearch={handleSearch} onUpdate={onUpdate} inputType="discipline" array={disciplines} textChildren="Дисциплина" helpText="Название дисциплины..."/>
            </div> 
            <div className="flex gap-6.25 max-sm:flex-col items-center justify-center max-sm:hidden">
                <Button children="Создать ссылку" onClick={createStudentLink}/>
                <Button children="Редактировать"/>
                <Button children="Скачать в Excel"/>
                {/*<Button children="Поделиться"/>*/}
            </div>
            <StudentLinkModal isOpen={isOpen} close={closeStudentModal} linkText={link} />
       </div> 
    )
}

export default TopNavBar