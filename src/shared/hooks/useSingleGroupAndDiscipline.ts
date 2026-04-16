import { useEffect, useState } from "react"

const useSingleGroupAndDiscipline = () => {
    const groupIdFromStorage = localStorage.getItem("singleGroupId")
    const disciplineIdFromStorage = localStorage.getItem("singleDisciplineId")
    const repTypeFromStorage = localStorage.getItem("singleReportType")
    const [groupId, setGroupId] = useState<string>(groupIdFromStorage ? groupIdFromStorage : "")
    const [disciplineId, setDisciplineId] = useState<string>(disciplineIdFromStorage ? disciplineIdFromStorage : "")
    const [repType, setRepType] = useState<string>(repTypeFromStorage ? repTypeFromStorage : "")
    useEffect(() => {
        localStorage.setItem("singleGroupId", groupId ? groupId : "")
        localStorage.setItem("singleDisciplineId", disciplineId ? disciplineId : "")
        localStorage.setItem("singleReportType", repType ? repType : "")
        

    }, [groupId, disciplineId, repType])
    
    const returnFunc = (): [string, React.Dispatch<React.SetStateAction<string>>,
        string, React.Dispatch<React.SetStateAction<string>>,
    string, React.Dispatch<React.SetStateAction<string>>] => {

        return [groupId, setGroupId, disciplineId, setDisciplineId, repType, setRepType]
    }

    return returnFunc()

}

export default useSingleGroupAndDiscipline