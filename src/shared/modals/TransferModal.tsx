import { Dialog, DialogBackdrop, DialogPanel, DialogTitle } from '@headlessui/react'
import Button from '../components/Button';
import { useState, type ChangeEvent } from "react";
import Cross from "../components/SVG/Cross"
import {createTranserPresenceDate, updateTranserPresenceDate} from "../utils/apiRequests"
import type { HubConnection } from '@microsoft/signalr';

interface PropsInterface{
    isOpen: boolean;
    close: () => void;
    classId: number | undefined;
    oldDate: string;
    classType: string
    groupId: number;
    disciplineId: number;
    statusCode: number | undefined;
    transferId?: number | undefined;
    connection: HubConnection | null;
}



export default function TransferNodal({oldDate, groupId, disciplineId, classId, isOpen, statusCode, transferId,  connection, close}: PropsInterface){
    const [newDate, setNewDate] = useState<string>('')


    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        setNewDate(e.currentTarget.value)
        console.log(newDate)
    }

    const transferDate = async () => {
        console.log(transferId, classId, statusCode)
        if(transferId && statusCode == 200) { 
            const  res =  await updateTranserPresenceDate(transferId, newDate) 
            if(res  && connection) {
                connection.invoke("GetPresenceGrade",{
                    disciplineId: Number(disciplineId),
                    groupId: Number(groupId)
                })
            }
        }
        if(classId && statusCode == 404) { 
            const res = await createTranserPresenceDate(classId, groupId, disciplineId, oldDate, newDate);
            if( res && connection) {
                connection.invoke("GetPresenceGrade",{
                    disciplineId: Number(disciplineId),
                    groupId: Number(groupId)
                })
            }
        }

     
        close()
    }

    return (
            <Dialog as="div" open={isOpen} className="relative z-10 focus:outline-none" onClose={close}>
                <div className="fixed inset-0 min-w-full max-w-md  p-6 backdrop-blur-xl duration-300 ease-out data-closed:scale-95 data-closed:opacity-0 overflow-y-auto">
                <DialogBackdrop 
                    transition 
                    className="fixed inset-0 backdrop-blur-md duration-300 ease-out data-closed:opacity-0" />
                    

                    <div className=" flex min-h-full items-center justify-center p-4 text-left">
                        <DialogPanel className="w-full max-w-md rounded-xl bg-bgMiddle dark:bg-bgMiddleD  border-bgLight dark:border-bgLightD border-2 p-6 backdrop-blur-2xl duration-300 ease-out data-closed:scale-95 data-closed:opacity-0">
                            <DialogTitle 
                            as="h3"
                            className="text-[24px] font-bold leading-6 text-tLight dark:text-tLightD">
                                Перенос даты занятия
                            </DialogTitle>
                            <div className="mt-2 flex flex-col gap-5">
                                <div className="flex flex-col gap-2.5">
                                    <p className="text-[18px] font-medium text-tLight dark:text-tLightD">Текущая дата занятия</p>                                      
                                    <input 
                                        type="date" 
                                        value={oldDate}
                                        readOnly={true}
                                        name="oldDateinput" 
                                        className="bg-bgLight dark:bg-bgLightD text-tLight dark:text-tLightD text-[20px] p-2.5 rounded-lg" 
                                        placeholder="date"></input>    
                                </div>
                                    <div className="flex flex-col gap-2.5">
                                    <p className="text-[18px] font-medium text-tLight dark:text-tLightD">Новая дата занятия</p>                                      
                                    <input 
                                        type="date" 
                                        name="newDateinput" 
                                        onChange={handleChange} 
                                        className="bg-bgLight dark:bg-bgLightD text-tLight dark:text-tLightD text-[20px] p-2.5 rounded-lg" 
                                        placeholder="date"></input>    
                                </div>
                            </div>
                            <div className="mt-4 flex flex-row justify-between">
                                <Button
                                    className="gap-2 text-center rounded-md bg-primary w-37.5 dark:bg-primaryD px-3 py-1.5 text-sm/6 font-semibold text-tDark shadow-inner shadow-white/10 focus:not-data-focus:outline-none data-focus:outline data-focus:outline-white data-hover:bg-gray-600 data-open:bg-gray-700"
                                    onClick={transferDate}
                                    >
                                    Сохранить
                                </Button>
                                <Button
                                    className="gap-2 text-center rounded-md bg-primary w-37.5 dark:bg-primaryD px-3 py-1.5 text-sm/6 font-semibold text-tDark shadow-inner shadow-white/10 focus:not-data-focus:outline-none data-focus:outline data-focus:outline-white data-hover:bg-gray-600 data-open:bg-gray-700"
                                    onClick={close}
                                >
                                    Закрыть
                                </Button>
                                <Cross onClick={close} className='fill-tLight dark:fill-tLightD absolute top-2.5 right-2.5'/>
                            </div>
                        </DialogPanel>
                    </div>
                </div>
            </Dialog>
    )
}