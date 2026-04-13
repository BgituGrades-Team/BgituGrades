import { useEffect, useState } from "react";
import type { KeyInterface } from "../types/fromRequests"
import { deleteKeyByName, getAllKeys } from "../utils/apiRequests";








export default function AdminResults() {
    const [keys, setKeys] = useState<KeyInterface[]>([]);
    const [keyToDelete, setKeyToDelete] = useState<KeyInterface | null>()
    //пока костыль
    const getKeys = async () => {
        const res: KeyInterface[] | undefined = await getAllKeys();
        if(res){
            setKeys(res)
        }
    }
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
                    index == 0 ? 
                    <div key={index} className="grid grid-cols-10 w-full text-tLight dark:text-tLightD text-[18px]"> 
                        <p className="col-span-5" >{key.key}</p>
                        <p className="col-span-1">{key.role}</p>
                        <p className="col-span-2">{key.expiryDate}</p>
                        <p className="col-span-2">Это главный ключ, его нельзя удалить</p>
                    </div>
                    :
                    <div key={index} className="grid grid-cols-10 w-full text-tLight dark:text-tLightD text-[18px]"> 
                        <p className="col-span-5" >{key.key}</p>
                        <p className="col-span-1">{key.role}</p>
                        <p className="col-span-2">{key.expiryDate}</p>
                        
                        <button onClick={() => {setKeyToDelete(key)}} className="bg-red text-[14px] text-center align-middle text-tLight dark:text-tLightD font-bold h-10 w-42.5 rounded-lg hover:opacity-75 transition-all duration-300">Удалить</button>
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