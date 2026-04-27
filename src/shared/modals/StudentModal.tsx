import { Button, Dialog, DialogBackdrop, DialogPanel, DialogTitle } from '@headlessui/react'
import ModalInput from './ModalInput';
import Cross from '../components/SVG/Cross';
import { useContext, useEffect, useState, type ChangeEvent } from 'react';
import { deleteStudent, updateStudent } from '../utils/apiRequests';
import { SingleInputValuesContext } from '../utils/contexts';
//import { Toaster } from 'react-hot-toast';
import type { HubConnection } from '@microsoft/signalr';

interface PropsInterface{
    isOpen: boolean;
    close: () => void;
    isEditMode: boolean;
    studentId?: number | undefined;
    studentName?: string;
    connection: HubConnection | null;
    tableType: "work" | "date"
}    


export default function StudentModal({isOpen, close, studentId = -1, studentName = "", connection, tableType}: PropsInterface) {
    const info = useContext(SingleInputValuesContext)

    const [name, setName] = useState<string>(studentName)
    const [id, setId] = useState<number>(studentId)

    useEffect(() => {
        setName(studentName)
    }, [studentName])
    useEffect(() => {
        setId(studentId)
    }, [studentId])

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        setName(e.target.value)
    }


    const updateAndSave = async () => {
        const groupId = info?.groupVal;
        const disciplineId = info?.disciplineVal;
        if (groupId && id) {
            const res = await updateStudent(id, name, Number(groupId))
            if(tableType == "work"){
                if (res && connection) {
                    connection.invoke("GetMarkGrade", {
                        disciplineId: Number(disciplineId),
                        groupId: Number(groupId)
                    });
                }
            }
            if(tableType=="date"){
                if(res && connection) {
                    connection.invoke("GetPresenceGrade",{
                        disciplineId: Number(disciplineId),
                        groupId: Number(groupId)
                    })
                }
            }
                close()
        }
    }
    const handleDeleteClick = async (studentId: number) => {
        const groupId = info?.groupVal;
        const disciplineId = info?.disciplineVal;
        const res =   await  deleteStudent(studentId)
        if(tableType == "work"){
                if (res && connection) {
                    connection.invoke("GetMarkGrade", {
                        disciplineId: Number(disciplineId),
                        groupId: Number(groupId)
                    });
                }
            }
            if(tableType=="date"){
                if(res && connection) {
                    connection.invoke("GetPresenceGrade",{
                        disciplineId: Number(disciplineId),
                        groupId: Number(groupId)
                    })
                }
            }
         close()
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
                    Редактирование студента
                </DialogTitle>
                <ModalInput onChange={handleChange} value={name}>ФИО</ModalInput>
                <div className="mt-4 flex gap-7.5">
                    <Button
                        className="inline-flex items-center gap-2 rounded-md bg-primary dark:bg-primaryD px-3 py-1.5 text-sm/6 font-semibold text-tLightD shadow-inner shadow-white/10 focus:not-data-focus:outline-none data-focus:outline data-focus:outline-white data-hover:bg-gray-600 data-open:bg-gray-700"
                        onClick={updateAndSave}
                    >
                        Сохранить
                    </Button>
                     <Button
                        className="inline-flex items-center gap-2 rounded-md bg-red dark:bg-red px-3 py-1.5 text-sm/6 font-semibold text-tLightD shadow-inner shadow-white/10 focus:not-data-focus:outline-none data-focus:outline data-focus:outline-white data-hover:bg-gray-600 data-open:bg-gray-700"
                        onClick={() => handleDeleteClick(studentId)}
                    >
                        Удалить
                    </Button>
                    <Button
                        className="inline-flex items-center gap-2 rounded-md bg-bgModal dark:bg-bgModalD px-3 py-1.5 text-sm/6 font-semibold text-tDark dark:text-white shadow-inner shadow-white/10 focus:not-data-focus:outline-none data-focus:outline data-focus:outline-white data-hover:bg-gray-600 data-open:bg-gray-700"
                        onClick={close}
                    >
                        Закрыть
                    </Button>
                    <Cross onClick={close} className='fill-tLight dark:fill-tLightD absolute top-2.5 right-2.5'/>

                </div>
            </DialogPanel>
            {/*<Toaster />*/}
            </div>
        </div>
        </Dialog>
    )
}
