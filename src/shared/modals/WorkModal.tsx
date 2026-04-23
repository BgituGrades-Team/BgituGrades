import { Button, Dialog, DialogBackdrop, DialogPanel, DialogTitle } from '@headlessui/react'
import ModalInput from './ModalInput';
import Cross from '../components/SVG/Cross';
import { useContext, useEffect, useState, type ChangeEvent } from 'react';
import { addWork, deleteWork, editWork } from '../utils/apiRequests';
import { SingleInputValuesContext } from '../utils/contexts';
import type { HubConnection } from '@microsoft/signalr';

interface PropsInterface{
    isOpen: boolean;
    close: () => void;
    isEditMode: boolean;
    currWorkId?: number;
    currName?: string;
    currDate?: string;
    currDescription?: string;
    connection: HubConnection | null;
}    

//отредактировать ее до правильного варианта

export default function WorkModal({isOpen, close, currWorkId, currName = "", currDate = "", currDescription = "", isEditMode, connection}: PropsInterface) {
    const [name, setName] = useState<string>("")
    const [date, setDate] = useState<string>("")
    const [description, setDescription] = useState<string>("")
    const singleGroupAndDiscipline = useContext(SingleInputValuesContext)
    const info = useContext(SingleInputValuesContext)
    const groupId = info?.groupVal;
    const disciplineId = info?.disciplineVal;
    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setName(currName)
        setDate(currDate)
        setDescription(currDescription)
    }, [currDate, currDescription, currName])



    const handleNameChange = (e: ChangeEvent<HTMLInputElement>) => {
        setName(e.target.value)
    }
    const handleDateChange = (e: ChangeEvent<HTMLInputElement>) => {
        setDate(e.target.value)
    }
    const handleDescriptionChange = (e: ChangeEvent<HTMLInputElement>) => {
        setDescription(e.target.value)
    }
    
    const handleCreateClick = async () => {
    
        const  res = await addWork(name, date, description, undefined, Number(singleGroupAndDiscipline?.disciplineVal), Number(singleGroupAndDiscipline?.groupVal)) // Нужно будет убрать undefined, когда обновится API
         if (res && connection) {
                connection.invoke("GetMarkGrade", {
                    disciplineId: Number(disciplineId),
                    groupId: Number(groupId)
                });
            }
            close()
    }
    const handleEditClick = async () => {
        if(currWorkId){
        const  res = await editWork(currWorkId, name, date, description, Number(singleGroupAndDiscipline?.disciplineVal), Number(singleGroupAndDiscipline?.groupVal)) // Нужно будет убрать undefined, когда обновится API
        if (res && connection) {
                connection.invoke("GetMarkGrade", {
                    disciplineId: Number(disciplineId),
                    groupId: Number(groupId)
                });
            }
            close()
        }
    }
    const handleDeleteClick = async () => {
        if(currWorkId){
        const res = await deleteWork(currWorkId)
         if (res && connection) {
                connection.invoke("GetMarkGrade", {
                    disciplineId: Number(disciplineId),
                    groupId: Number(groupId)
                });
            }
            close()
        }
    }

    return (
        <Dialog open={isOpen} as="div" className="relative z-10 focus:outline-none" onClose={close}>
        <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
            <DialogBackdrop transition className="fixed inset-0 backdrop-blur-md duration-300 ease-out data-closed:opacity-0" />
            <div className="flex min-h-full items-center justify-center p-4">
            <DialogPanel
                transition
                className="w-full max-w-md rounded-xl bg-bgMiddle dark:bg-bgMiddleD  border-bgLight dark:border-bgLightD border-2 p-6 backdrop-blur-2xl duration-300 ease-out data-closed:scale-95 data-closed:opacity-0"
            >
                <DialogTitle as="h3" className="text-base/7 font-medium text-tLight dark:text-tLightD mb-5">
                {isEditMode ? "Редактирование" : "Добавление"} работы
                </DialogTitle>
                <ModalInput onChange={handleNameChange} value={name} >Название</ModalInput>
                {isEditMode ? <ModalInput onChange={handleDateChange} value={date} type='date'>Дата</ModalInput> : ""}
                <ModalInput onChange={handleDescriptionChange} value={description} type='text' >Описание</ModalInput>
                <div className="mt-4 flex gap-7.5">
                     { isEditMode ?
                        <div>
                                <Button
                                    className="inline-flex items-center gap-2 rounded-md bg-primary dark:bg-primaryD px-3 py-1.5 text-sm/6 font-semibold text-tLight dark:text-tLightD  shadow-inner shadow-white/10 focus:not-data-focus:outline-none data-focus:outline data-focus:outline-white data-hover:bg-gray-600 data-open:bg-gray-700"
                                    onClick={handleEditClick}
                                >
                                    Сохранить
                                </Button>
                                <Button
                                        className="inline-flex items-center gap-2 rounded-md ml-7.5 bg-red dark:bg-red px-3 py-1.5 text-sm/6 font-semibold text-tLight dark:text-tLightD shadow-inner shadow-white/10 focus:not-data-focus:outline-none data-focus:outline data-focus:outline-white data-hover:bg-gray-600 data-open:bg-gray-700"
                                        onClick={handleDeleteClick}
                                    >
                                        Удалить
                            </Button>
                            </div>: 
                         <Button
                            className="inline-flex items-center gap-2 rounded-md bg-primary dark:bg-primaryD px-3 py-1.5 text-sm/6 font-semibold text-tLight dark:text-tLightD  shadow-inner shadow-white/10 focus:not-data-focus:outline-none data-focus:outline data-focus:outline-white data-hover:bg-gray-600 data-open:bg-gray-700"
                            onClick={handleCreateClick}
                        >
                            Сохранить
                        </Button>}
                    <Button
                        className="inline-flex items-center gap-2 rounded-md bg-bgModal dark:bg-bgModalD px-3 py-1.5 text-sm/6 font-semibold text-tDark dark:text-white shadow-inner shadow-white/10 focus:not-data-focus:outline-none data-focus:outline data-focus:outline-white data-hover:bg-gray-600 data-open:bg-gray-700"
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
