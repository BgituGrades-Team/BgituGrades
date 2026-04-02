import { useState } from "react";
import KeyCreateModal from "../modals/KeyCreateModal";
import Button from "./Button";








export default function AdminTopNavBar(){
   const [isOpen, setIsOpen] = useState<boolean>(false)
    const openKeyCreateModal = () => {
        setIsOpen(true)
    }

    const closeKeyCreateModal = () => {
        setIsOpen(false);
    }
    return (
        <div className="h-25 ml-33.5 mt-13.75 flex justify-between pl-3.75  items-end">
            <div className="flex gap-6.25 items-end w-180 rounded-lg bg-bgModal dark:bg-bgModalD rounded-lgw relative">
                <input type="url" placeholder="Ссылка на календарный учебный график" className="w-[78%] rounded-lg text-tDark outline-0 dark:text-tDarkD p-3"></input>
                <Button children="Сохранить" className="absolute right-1 bottom-1" />
            </div> 
            <div className="flex gap-6.25">
                <Button onClick={openKeyCreateModal} children="Создать ключ"/>
                <Button children="Миграция"/>
                <Button children="Список Студентов"/>
                <Button children="Очистка БД"/>
            </div>
            <KeyCreateModal isOpen={isOpen} close={closeKeyCreateModal  } />
       </div> 
    )


}