import Button from "../components/Button";


interface PropsInterface{
    isEditMode?: boolean;
    className?: string;
    cellType: "student" | "work" | "date" | "reportInfo";
    workLink?: string | null;
    cellDateType?: "Лек" | "Прак" | null;
    cellData?: string;
    onClick?: (e: React.MouseEvent<HTMLElement>) => void;
    disabled?: boolean
}



export default function EditableTableCell({isEditMode = false, className = "valuev", cellType = "student", disabled = false, /*workLink = null,*/ cellData = "inCell", cellDateType = null, onClick}: PropsInterface){
    // Проверка, что за ячейка у нас, соответственно, какие данные в ней будут
    switch (cellType) {
        case "reportInfo":
            return (
                <td className={className} onClick={onClick}>
                    <p className="pl-1.5 pr-1.5" >{cellData}</p>
                </td>
            )

        case "student":      
            return  (
                isEditMode ? 
                <td className={className} onClick={onClick}>
                    <Button disabled={disabled} />
                </td> :
                <td className={className} onClick={onClick}>
                    <p className="pl-1.5 pr-1.5" >{cellData}</p>
                </td>)
        case "work":
            return (
                isEditMode ?
                <td className={className} onClick={onClick}>
                    <Button disabled={disabled} ></Button>
                </td> : 
                <td className={className} onClick={onClick}>
                    <p className="pl-1.5 pr-1.5">{cellData}</p>
                </td>) 
        case "date":
            return  (
                isEditMode ? 
                <td className={className} onClick={onClick}>
                    <Button disabled={disabled} />
                </td> :
                <td className={className} onClick={onClick}>
                    <div>{cellData}</div>
                    <div className="h-0.5 bg-bgDark dark:bg-bgDarkD"></div>
                    <div >{cellDateType}</div>
                </td>)
        default:
            break;
    }
        
        
        
        

    
}