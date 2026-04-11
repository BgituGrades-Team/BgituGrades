import { useState } from "react";
import KeyCreateModal from "../modals/KeyCreateModal";
import Button from "./Button";








export default function AdminTopNavBar(){
   const [isOpen, setIsOpen] = useState<boolean>(false)
   const [file, setFile] = useState<Blob | null>(null)
    const openKeyCreateModal = () => {
        setIsOpen(true)
    }

    const closeKeyCreateModal = () => {
        setIsOpen(false);
    }

    const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            setFile(e.target.files[0])
            console.log(file)
        }
        
            

    }

    return (
        <div className="h-25 ml-33.5 mt-13.75 flex flex-col justify-between pl-3.75  items-start">
            <div className="flex gap-6.25 items-end w-full rounded-lg bg-bgModal dark:bg-bgModalD rounded-lgw relative">
                <input type="url" placeholder="Ссылка на календарный учебный график" className="w-[78%] rounded-lg text-tDark outline-0 dark:text-tDarkD p-3"></input>
                <Button children="Сохранить" className="absolute right-1 bottom-1" />
            </div> 
            <div className="w-full flex  gap-6.25">
                <Button onClick={openKeyCreateModal} children="Создать ключ"/>
                <Button children="Миграция"/>
                <Button children="Загрузить cтудентов"/>
                <label htmlFor="adminInput" className="cursor-pointer  p-2 bg-primaryD text-tLight dark:text-tLightD rounded-lg font-medium ">
                        Загрузить студентов .clsx
                </label>
                <input type="file" id="adminInput" name="fileUpload" onChange={() => handleChange} placeholder="Загрузить студентов .clsx"  className="hidden"/>
                
            </div>
            <KeyCreateModal isOpen={isOpen} close={closeKeyCreateModal  } />
       </div> 
    )


}