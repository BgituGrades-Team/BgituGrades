import { useEffect, useState } from "react"

const useSingleGroupAndDiscipline = () => {
    const groupIdFromStorage = localStorage.getItem("singleGroupId")
    const disciplineIdFromStorage = localStorage.getItem("singleDisciplineId")
    const [groupId, setGroupId] = useState<string>(groupIdFromStorage ? groupIdFromStorage : "")
    const [disciplineId, setDisciplineId] = useState<string>(disciplineIdFromStorage ? disciplineIdFromStorage : "")
    useEffect(() => {
        localStorage.setItem("singleGroupId", groupId ? groupId : "")
        localStorage.setItem("singleDisciplineId", disciplineId ? disciplineId : "")
        

    }, [groupId, disciplineId])
    
    const returnFunc = (): [string, React.Dispatch<React.SetStateAction<string>>,
        string, React.Dispatch<React.SetStateAction<string>>] => {

        return [groupId, setGroupId, disciplineId, setDisciplineId]
    }

    return returnFunc()

}

export default useSingleGroupAndDiscipline