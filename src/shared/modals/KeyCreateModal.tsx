import { Button, Dialog, DialogBackdrop, DialogPanel, DialogTitle } from '@headlessui/react'
import Input from '../components/Input';
import { useEffect, useState } from 'react';
import type { GroupInterface } from '../types/fromRequests';
import { addKey, getGroups } from '../utils/apiRequests';
import Cross from '../components/SVG/Cross';
import CustomSelect from '../components/CustomSelect';
import toast, { Toaster } from 'react-hot-toast';


interface PropsInterface{
    isOpen: boolean;
    close: () => void;

}



export default function KeyCreateModal({isOpen, close}: PropsInterface) {
    const [groupId, setGroupId] = useState<number>(0)
    const [role, setRole] = useState<string>("STUDENT")
    const [groups, setGroups] = useState<GroupInterface[]>([])
    
    
    const getAllGroups = async () => {
        const resp: GroupInterface[] | undefined =  await getGroups()
        if(resp){
            setGroups(resp)
        }
    }
    const save = async (role: string, groupId: number | null) => {
        console.log(role, groupId, typeof role)
        if(role === "STUDENT"){
            if(groupId == 0){
                const notify = () => toast('Выберите группу!!!');
                notify()
            } else {
                await addKey(role, groupId)
                close()
                window.location.reload()
            }
        } else {
            console.log(role, groupId)
            if(groupId == 0){
                await addKey(role)
            } else {
                await addKey(role, groupId)
            }
            close()
            window.location.reload()
        }
        //
        
    }
    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        getAllGroups();
    },[])




return (
    <Dialog open={isOpen} as="div" className="relative z-10 focus:outline-none" onClose={close}>
        <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
            <Toaster />
            <DialogBackdrop transition className="fixed inset-0 backdrop-blur-md duration-300 ease-out data-closed:opacity-0" />
            <div className="flex min-h-full items-center justify-center p-4">
            <DialogPanel
                transition
                className="w-full max-w-md rounded-xl bg-bgMiddle dark:bg-bgMiddleD  border-bgLight dark:border-bgLightD border-2 p-6 backdrop-blur-2xl duration-300 ease-out data-closed:scale-95 data-closed:opacity-0"
            >
                <DialogTitle as="h3" className="text-base/7 text-[30px] font-bold text-tLight dark:text-tLightD mb-5">
                    Создать ключ
                </DialogTitle>

                <CustomSelect selectData={["Выберите роль","ADMIN","STUDENT", "TEACHER"]} adminSelect={true} onInputChange={setRole}/>
                <Input textChildren="Группа" helpText="Название группы(Опционально)" className="w-full" array={groups} inputType="group" onInputChange={setGroupId} />
               
                <div className="mt-4 flex gap-7.5">
                    <Button
                        className="inline-flex items-center gap-2 rounded-md bg-primary dark:bg-primaryD px-3 py-1.5 text-sm/6 font-semibold text-tLight dark:text-tLightD shadow-inner shadow-white/10 focus:not-data-focus:outline-none data-focus:outline data-focus:outline-white data-hover:bg-gray-600 data-open:bg-gray-700"
                        onClick={() => save(role, groupId)}
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