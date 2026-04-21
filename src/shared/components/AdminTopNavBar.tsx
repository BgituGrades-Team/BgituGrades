import { useState } from "react";
import KeyCreateModal from "../modals/KeyCreateModal";
import Button from "./Button";
import { loadShcedule, migrate, sendStuddents, sendStudyData } from "../utils/apiRequests";
import { Toaster } from "react-hot-toast";








export default function AdminTopNavBar(){
   const [isOpen, setIsOpen] = useState<boolean>(false)
   const [file, setFile] = useState<Blob | null>(null)
   const [url, setUrl] = useState<string>("")
   const [inputKey, setInputKey] = useState(() => Date.now());


   
    const openKeyCreateModal = () => {
        setIsOpen(true)
    }

    const closeKeyCreateModal = () => {
        setIsOpen(false);
    }

    const sendCalendarGraph = async (url: string) =>{
        console.log(url);
        await sendStudyData(url)
    }

    const reset = () => {
        setInputKey(Date.now()); 
        setFile(null);
};

  const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
        const selectedFile = e.target.files[0];
        
        setFile(selectedFile);
        console.log(file)
        await sendStuddents(selectedFile);
        reset();
    }   
}
    const handleMigrate = async() => {
        
        await migrate();
    }

    const handleShedule = async() => {
        //toast.success("Расписание загружено")
        await loadShcedule();
    }

    return (
        <div className="h-25 ml-33.5 mt-13.75 flex flex-col justify-between pl-3.75  items-start">
            <div className="flex gap-6.25 items-end w-full rounded-lg bg-bgModal dark:bg-bgModalD rounded-lgw relative">
                <input type="url" onChange={(e) => setUrl(e.target.value)} placeholder="Ссылка на календарный учебный график" className="w-[78%] rounded-lg text-tDark outline-0 dark:text-tDarkD p-3"></input>
                <Button onClick={() => sendCalendarGraph(url)} children="Сохранить" className="absolute right-1 bottom-1" />
            </div> 
            <div className="w-full flex  gap-6.25">
                <Button onClick={openKeyCreateModal} children="Создать ключ"/>
                <Button onClick={() => handleMigrate()} children="Миграция" />
                <Button onClick={() => handleShedule()} children="Загрузить Расписание" />
                <label htmlFor="adminInput" className="cursor-pointer  p-2 bg-primaryD text-tLight dark:text-tLightD rounded-lg font-medium ">
                        Загрузить студентов .xlsx
                </label>
                <input type="file" id="adminInput" name="fileUpload" onChange={handleChange} placeholder="Загрузить студентов .xlsx" className="hidden" key={inputKey}/>
                
            </div>
            <KeyCreateModal isOpen={isOpen} close={closeKeyCreateModal  } />
            <Toaster />
       </div> 
    )


}