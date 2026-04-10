import { Button, Dialog, DialogBackdrop, DialogPanel, DialogTitle } from '@headlessui/react'
import Cross from '../components/SVG/Cross';
import toast, { Toaster } from 'react-hot-toast';
//toats  - создание уведомления которое видит пользователь Toaster - компонент, который отображает это уведомление

interface PropsInterface{
    isOpen: boolean;
    close: () => void;
    linkText?: string;
}    


export default function StudentLinkModal({isOpen, close, linkText = ""}: PropsInterface) {
    const notify = () => toast('✅ Ссылка скопирована в буфер обмена!')
    // Копирование текста в буфер обмена
    const copyToClipboard = async () => {
        try {
            await navigator.clipboard.writeText(linkText);
            notify();
        } catch (error) {
            console.log(error);
        }
    };
  return (
    <Dialog open={isOpen} as="div" className="relative z-10 focus:outline-none" onClose={close}>
    <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
        <DialogBackdrop transition className="fixed inset-0 backdrop-blur-md duration-300 ease-out data-closed:opacity-0" />
        <div className="flex min-h-full items-center justify-center p-4">
        <DialogPanel
            transition
            className="w-130 rounded-xl bg-bgMiddle dark:bg-bgMiddleD  border-bgLight dark:border-bgLightD border-2 p-6 backdrop-blur-2xl duration-300 ease-out data-closed:scale-95 data-closed:opacity-0"
        >
            <DialogTitle as="h3" className="text-base/7 font-medium text-tLight dark:text-tLightD mb-5">
            <p className="text-[24px] font-bold mb-2.5 ">Ссылка на таблицу для студентов </p>
            <input 
                type="text" 
                value={linkText}
                readOnly={true}
                name="oldDateinput" 
                className=" w-[83%] bg-bgLight dark:bg-bgLightD text-tLight dark:text-tLightD text-[20px] p-2.5 rounded-lg" 
                placeholder="date"></input>  
       
            </DialogTitle>
            <div className="mt-4 flex gap-7.5">
                <Button
                    className="inline-flex items-center gap-2 rounded-md bg-primary dark:bg-primaryD px-3 py-1.5 text-sm/6 font-semibold text-tLight dark:text-tLightD shadow-inner shadow-white/10 focus:not-data-focus:outline-none data-focus:outline data-focus:outline-white data-hover:bg-gray-600 data-open:bg-gray-700"
                    onClick={copyToClipboard}
                >
                    Копировать
                </Button>
                <Button
                    className="inline-flex items-center gap-2 rounded-md bg-bgModal dark:bg-bgModalD px-3 py-1.5 text-sm/6 font-semibold text-tLight dark:text-white shadow-inner shadow-white/10 focus:not-data-focus:outline-none data-focus:outline data-focus:outline-white data-hover:bg-gray-600 data-open:bg-gray-700"
                    onClick={close}
                >
                    Закрыть
                </Button>
                <Cross onClick={close} className='fill-tLight dark:fill-tLightD absolute top-2.5 right-2.5'/>
                
            </div>
        </DialogPanel>
        </div>
        <Toaster />
    </div>
    </Dialog>
  )
}
