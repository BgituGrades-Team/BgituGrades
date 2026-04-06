import { Button, Dialog, DialogBackdrop, DialogPanel, DialogTitle } from '@headlessui/react'
import ModalInput from './ModalInput';
import Cross from '../components/SVG/Cross';
import { useState, type ChangeEvent } from 'react';
import { useSearchParams } from 'react-router-dom';
import { addWork } from '../utils/apiRequests';

interface PropsInterface{
    isOpen: boolean;
    close: () => void;
    isEditMode: boolean;
}    

//отредактировать ее до правильного варианта

export default function WorkModal({isOpen, close, isEditMode}: PropsInterface) {
    const [searchParams,] = useSearchParams()
    const [name, setName] = useState<string>("")
    const [date, setDate] = useState<string>("")
    const [description, setDescription] = useState<string>("")

    const handleNameChange = (e: ChangeEvent<HTMLInputElement>) => {
        setName(e.target.value)
    }
    const handleDateChange = (e: ChangeEvent<HTMLInputElement>) => {
        setDate(e.target.value)
    }
    const handleDescriptionChange = (e: ChangeEvent<HTMLInputElement>) => {
        setDescription(e.target.value)
    }

    const handleClick = async () => {
        const gorupId = searchParams.get("groupid")
        const disciplineId = searchParams.get("disciplineid")
        await addWork(name, date, description, undefined, Number(disciplineId), Number(gorupId)) // Нужно будет убрать undefined, когда обновится API
        close()
        window.location.reload()
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
                {isEditMode ? "Редактирование" : "Добавление"} даты
                </DialogTitle>
                <ModalInput onChange={handleNameChange} value={name} >Название</ModalInput>
                <ModalInput onChange={handleDateChange} value={date} type='date'>Дата</ModalInput>
                <ModalInput onChange={handleDescriptionChange} value={description} type='text' >Описание</ModalInput>
                <div className="mt-4 flex gap-7.5">
                    <Button
                        className="inline-flex items-center gap-2 rounded-md bg-primary dark:bg-primaryD px-3 py-1.5 text-sm/6 font-semibold text-tDark shadow-inner shadow-white/10 focus:not-data-focus:outline-none data-focus:outline data-focus:outline-white data-hover:bg-gray-600 data-open:bg-gray-700"
                        onClick={handleClick}
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
