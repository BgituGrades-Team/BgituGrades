import { useEffect, useState } from "react";
import type { KeyInterface } from "../types/fromRequests"
import { deleteKeyByName, getAllKeys } from "../utils/apiRequests";
import Delete from "../components/SVG/Delete";
import Copy from "../components/SVG/Copy";
import toast, { Toaster } from "react-hot-toast";








export default function AdminResults() {
    const [keys, setKeys] = useState<KeyInterface[]>([]);
    const [keyToDelete, setKeyToDelete] = useState<KeyInterface | null>()
    const location = window.location.origin;
    //пока костыль
    const getKeys = async () => {
        const res: KeyInterface[] | undefined = await getAllKeys();
        if(res){
            setKeys(res)
        }
    }

    const renderDate = (date: string) => {
                
                if(date == null){
                    return null
                } else {
                    const dataObj = new Date(date);
                     const formattedDate = dataObj.toLocaleDateString("ru-RU", {
                        month: 'numeric',
                        day: 'numeric',
                        year: 'numeric',
                        hour: 'numeric',
                        minute: 'numeric'
                    })
                    return formattedDate
                }
                
            }
    const notify = () => toast('✅ Ссылка скопирована в буфер обмена!')
    const copyToClipboard = async (key: string) => {
        
        try {
            await navigator.clipboard.writeText(String(location) + "/visit?key=" +  key);
            notify();
        } catch (error) {
            console.log(error);
        }
    };
    useEffect(() => {
        const deleteKey = async (key: KeyInterface) => {
            const res = await deleteKeyByName(key.key)
            if(res){
                setKeys(keys.filter((keyInner) => {
                    return keyInner != key
                }))
            }
        }

        // eslint-disable-next-line react-hooks/set-state-in-effect
        getKeys();
        if(keyToDelete){
            deleteKey(keyToDelete)
        }
    }, [keyToDelete])
    if(keys){
        return (
            <div className="w-full flex flex-col gap-6.25 h-170 overflow-y-auto"> 
                <div className="grid grid-cols-10  w-full text-tLight dark:text-tLightD text-[24px]">
                    <p className="col-span-5">Ключ</p>
                    <p className="col-span-1">Роль</p>
                    <p className="col-span-2">Дата истечения</p>
                </div>
                {keys?.map((key, index) => (
                    key.key == localStorage.getItem('api_key') ? 
                    <div key={index} className="grid grid-cols-10 w-full text-tLight dark:text-tLightD text-[18px]"> 
                        <p className="col-span-5 wrap-break-word" >{key.key}</p>
                        <p className="col-span-1">{key.role}</p>
                        <p className="col-span-2">{key.expiryDate}</p>
                        <p className="col-span-2">Это ваш ключ, его нельзя удалить</p>
                    </div>
                    :
                    <div key={index} className="grid grid-cols-10 w-full flex-wrap items-center text-tLight dark:text-tLightD text-[18px]"> 
                        <p className="col-span-5 wrap-break-word" >{key.key}</p>
                        <p className="col-span-1 wrap-break-word">{key.role}</p>
                        <p className="col-span-2">{renderDate(key.expiryDate)}</p>
                        <div className="w-full flex gap-2.5"> 
                            <button onClick={() => {copyToClipboard(key.key)}} className="bg-primary text-[14px] flex justify-center items-center col-span-2 align-middle text-tLight dark:text-tLightD font-bold h-10 w-42.5 rounded-lg hover:opacity-75 transition-all duration-300">
                                &#160;&#8203;
                                <Copy />
                            </button>
                            <button type="button" name="delete" onClick={() => {setKeyToDelete(key)}} className="bg-red text-[14px] flex justify-center items-center col-span-2 align-middle text-tLight dark:text-tLightD font-bold h-10 w-42.5 rounded-lg hover:opacity-75 transition-all duration-300">
                                &#160;&#8203;
                                <Delete />   
                            </button>
                            <Toaster />
                            </div>
                    </div>
                ))}
            </div>
        ) 
    } else {
        return (
            <div>bottle of water</div>
        )
    }
    
}