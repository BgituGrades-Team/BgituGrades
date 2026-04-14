import { Dialog, DialogBackdrop, DialogPanel } from "@headlessui/react";
import ModalNavBar from "../components/ModalNavBar";




interface PropsInterface {
    isOpen: boolean;
    close: () => void;

}


export default function RoutesModal({isOpen, close}: PropsInterface) {

    return (
        <Dialog onClose={close} as="div" open={isOpen} className="bg-amber-200 w-[280px] h-full relative z-10 focus:outline-none">
            <div className="fixed min-h-full inset-0 z-10 w-screen overflow-y-auto">
                <DialogBackdrop transition className="fixed min-h-full inset-0 backdrop-blur-md duration-300 ease-out data-closed:opacity-0" />
                <div className="flex min-h-full items-start justify-start ">
                    <DialogPanel
                        transition
                        className="h-screen w-[80wv]  bg-bgMiddle dark:bg-bgMiddleD  border-bgLight dark:border-bgLightD border-2 p-6 backdrop-blur-2xl duration-300 ease-out data-closed:scale-95 data-closed:opacity-0"
                    >
                    
                    <ModalNavBar closeModal={close}></ModalNavBar>
                    </DialogPanel>
                </div>
            </div>
        </Dialog>
    )
}