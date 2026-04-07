import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useState } from "react";
import Button from "../components/Button";
import Cross from "../components/SVG/Cross"
import {transerPresenceDate} from "../utils/apiRequests"

interface PropsInterface{
    isOpen: boolean;
    close: () => void;
    classId: number;
    oldDate: string;
    classType: string
    groupId: number;
    disciplineId: number;
}



export default function TransferNodal({oldDate, groupId, disciplineId, classId, isOpen}: PropsInterface){
    const [newDate, setNewDate] = useState<string>('')


    const handleChange = (e: string) => {
        setNewDate(e)
        console.log(newDate)
    }

    const transferDate = async () => {
        await transerPresenceDate(classId, groupId, disciplineId, oldDate, newDate);
        close()
        window.location.reload()
    }

    return (
        <Transition appear show={isOpen} as={Fragment}>
            <Dialog as="div" className="relative z-10 focus:outline-none" onClose={close}>
                <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opavity-0">
                        <div className="fixed inset-0 bg-bgModal dark:bg-bgModalD" />

                </Transition.Child>
                <div className="fixed inset-0 overflow-y-auto">
                    <div className=" flex min-h-full items-center justify-center p-4 text-center">
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0 scale-95"
                            enterTo="opacity-100 scale-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100 scale-100"
                            leaveTo="opacity-0 scale-95">
                                <Dialog.Panel className="w-full max-w-wd transform overflow-hidden">
                                    <Dialog.Title 
                                    as="h3"
                                    className="text-lg font-medium leading-6 text-tLight dark:text-tLightD">
                                        Перенос даты занятия
                                    </Dialog.Title>
                                    <div className="mt-2 flex flex-col gap-[20px]">
                                        <div className="flex flex-col gap-[5px]">
                                            <p className="text-[28px] font-bold text-tLight dark:text-tLightD">Текущая дата занятия</p>                                      
                                            <input type="date" value={oldDate} name="oldDateinput" placeholder="date"></input>    
                                        </div>
                                           <div className="flex flex-col gap-[5px]">
                                            <p className="text-[28px] font-bold text-tLight dark:text-tLightD">Новая дата занятия</p>                                      
                                            <input type="date" name="newDateinput" onChange={() => handleChange} placeholder="date"></input>    
                                        </div>
                                    </div>
                                    <div className="mt-4 flex flex-row gap-[15px]">
                                        <Button
                                            className="inline-flex items-center gap-2 rounded-md bg-primary dark:bg-primaryD px-3 py-1.5 text-sm/6 font-semibold text-tDark shadow-inner shadow-white/10 focus:not-data-focus:outline-none data-focus:outline data-focus:outline-white data-hover:bg-gray-600 data-open:bg-gray-700"
                                            onClick={transferDate}
                                            >
                                            Сохранить
                                        </Button>
                                        <Button
                                            className="inline-flex items-center gap-2 rounded-md bg-bgModal dark:bg-bgModalD px-3 py-1.5 text-sm/6 font-semibold text-tDark dark:text-white shadow-inner shadow-white/10 focus:not-data-focus:outline-none data-focus:outline data-focus:outline-white data-hover:bg-gray-600 data-open:bg-gray-700"
                                            onClick={close}
                                        >
                                            Закрыть
                                        </Button>
                                        <Cross onClick={close} className='fill-tLight dark:fill-tLightD absolute top-2.5 right-2.5'/>
                                    </div>
                                </Dialog.Panel>
                            </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition>
    )
}