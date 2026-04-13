import { Field, Input, Label } from "@headlessui/react";



export default function ModalInput() {



    return (
        <Field className="flex flex-col gap-1 text-tLight dark:text-tLightD">
            <Label>{children}</Label>
            <Input type={type} placeholder={placeholder} onChange={onChange} value={value} className="bg-bgLight dark:bg-bgLightD rounded-sm h-10 data-focus:outline-bgLightD data-focus:outline-2"/>
        </Field>
    )
}