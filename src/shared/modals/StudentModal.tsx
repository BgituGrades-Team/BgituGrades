import { Button, Dialog, DialogBackdrop, DialogPanel, DialogTitle } from '@headlessui/react'
import ModalInput from './ModalInput';
import Cross from '../components/SVG/Cross';
import { useState, type ChangeEvent } from 'react';
import { useSearchParams } from 'react-router-dom';
import { updateStudent } from '../utils/apiRequests';

interface PropsInterface{
    isOpen: boolean;
    close: () => void;
    isEditMode: boolean;
    studentId?: number | undefined;
}    


export default function StudentModal({isOpen, close, studentId = undefined}: PropsInterface) {
    const [searchParams,] = useSearchParams()
    const [name, setName] = useState<string>("")

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        setName(e.target.value)
    }


    const updateAndSave = async () => {
        const groupId = searchParams.get('groupid')
        console.log(studentId, name, groupId)
        if (groupId && studentId) {
            console.log(studentId, name, groupId)
            await updateStudent(studentId, name, Number(groupId))
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
