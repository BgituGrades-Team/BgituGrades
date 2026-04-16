import axios from 'axios';
import type { DisciplineInterface, GroupInterface, KeyInterface, PeriodsInterface, StudentInterface, StudentLinkInterface } from '../types/fromRequests';


// Наш бекендер ебень
axios.defaults.baseURL = import.meta.env.VITE_DOTENV_API_URL
const instance = axios.create({
    baseURL: import.meta.env.VITE_DOTNET_API_URL,
    timeout: 20000,
    headers: {
        'Accept': '*/*',
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'key': sessionStorage.getItem("api_key")
    }
});

interface Response<T> {
    data: T;
}

/**
 * Запрос на получение всех групп
 * @returns Массив групп
 */
export const getGroups = async () => {
    try {
        const result: Response<GroupInterface[]> = await instance.get("/api/group/all")
        return result.data
    } catch (error) {
        console.log(error)
        
            
    }
}

/**
 * Запрос на получение всех дисциплин
 * @returns Массив дисциплин
 */
export const getDisciplines = async () => {
    try {
        const result: Response<DisciplineInterface[]> = await instance.get("/api/discipline/all")
        return result.data
    } catch (error) {
        console.log(error)
    }
}


/**
 * Получение дисциплин для группы
 * @param groupId Идентификатор группы
 * @returns Массив дисциплин для этой группы
 */
export const getDisciplinesByGroups = async (groupId: number[]) => {
    try {
        const result: Response<DisciplineInterface[]> = await instance.get(`/api/discipline?groupids=${groupId.join(",")}`)
        return result.data
    } catch (error) {
        console.log(error)
    }
}

/**
 * Получение ссылки для студентов
 * @param groupId Идентификатор группы
 * @param disciplineId Идентификатор дисциплины
 * @returns Ссылка для студентов
 */
export const getStudentLink = async (groupId: number) => {
    try {
        const result: Response<StudentLinkInterface> = await instance.get(`/api/key/shared?groupid=${groupId}`,{
            timeout: 20000
        })
        return result.data
    } catch (error){
        console.log(error)
    }
}
/**
 * Получение студентов для группы
 * @param groupId Идентификатор группы
 * @returns Массив студентов в этой группе
 */
export const getStudents = async (groupId: number[]) => {
    try {
        const result: Response<StudentInterface[]> = await instance.get(`/api/student?groupids=${groupId.join(",")}`)
        console.log(result)
        return result.data
    } catch (error) {
        console.log(error)
    }
}



/**
 * Получение ключей
 * @returns Все созданные ключи
 */

export const getAllKeys = async () => {
    try{
        const result: Response<KeyInterface[]> = await instance.get(`api/key/all`)
        return result.data
    } catch(error) {
        console.log(error)
    }
}

export const addKey = async (role: string, groupId?: number | null) => {
    try {
        const params = {
            role:  role,
            groupId: groupId
        }
        await instance.post(`api/key`, params)
        console.log("Success! New key has been added!")
    } catch (error) {
        console.log(error)
    }
}


/**
 * Удаление ключа по его имени`
 * @param key Сам непосредственно ключ
 * @returns id:0, если получилось
 */
export const deleteKeyByName = async (key: string) => {
    try {
        const res  = await instance.delete(`api/key?deleteKey=${key}`)
        return(res)
        console.log("pizda cluchu")
    } catch (error) {
        console.log(error)
    }
}


/**
 * Добавление студента в группу
 * @param groupId Идентификатор группы
 * @param studentName Имя студента
 * @returns true, если получилось
 */
export const addNewStudent = async (groupId:number, studentName: string) => {
    try {
        await instance.post('/api/student', {
            'name': studentName,
            'groupId': groupId 
        })
        return true
    } catch (error) {
        console.log(error)
    }
}

/**
 * Добавление новой работы
 * @param name Название работы
 * @param issuedDate Дата выдачи
 * @param description Описание
 * @param link Ссылка
 * @param disciplineId Идентификатор дисциплины
 * @param groupId Идентификатор группы
 * @returns true, если получилось
 */
export const addWork = async (name: string, issuedDate: string, description: string, link = "maxim.pamagiti.site", disciplineId: number, groupId: number) => {
    try {
        await instance.post('/api/work', {
            name, issuedDate, description, link, disciplineId, groupId
        })
        return true
    } catch (error) {
        console.log(error)
    }
}

export const downloadFile = async (link: string):  Promise<string | undefined> => {
    try {
        const res: Response<Blob> = await axios({
            url: link+"?key="+sessionStorage.getItem("api_key"),
            method: 'GET',
            responseType: 'blob',
        })
        console.log(res)
        const url = window.URL.createObjectURL(new Blob([res.data]))
        return url
    } catch (error) {
        console.log(error)
    }

}

export const getAllPeriods = async () => {
    try {
        const res: Response<PeriodsInterface[]> = await instance.get(`api/migrations/periods/all`)
        console.log(res.data);
        return res.data;
    } catch(error) {
        console.log(error)
    }
}

export const checkTranserPresenceDate = async(classId: number, date: string) =>{
    try {
        const res = await instance.get(`api/transfer?classId=${classId}&date=${date}`)
        console.log("Success! Prescence transfer has been got!")
        return [res.status, res.data]
    } catch(error) {
            console.log(error)
            if(error instanceof Error){
            const errorText = error.message
            if(errorText.includes('404')){
                return (404)
            } else {
                return(455)
            }
        }
    }
}


export const createTranserPresenceDate = async(classId: number, groupId: number, disciplineId: number, oldDate: string, newDate: string) =>{
    try {
        const params = {
            "originalDate": oldDate,
            "newDate": newDate,
             "classId": classId,
            "disciplineId": disciplineId,
            "groupId": groupId
        }
        console.log(params)
        await instance.post("api/transfer", params)
        console.log("Success! Date has been created!")
    } catch(error) {
        console.log(error)
    }
}

export const updateTranserPresenceDate = async(transferId: number, newDate: string) =>{
    try {
        const params = {
            "id": transferId,
            "newDate": newDate
        }
        console.log(params)
        await instance.put("api/transfer", params)
        console.log("Success! Date has been updated!")
    } catch(error) {
        console.log(error)
    }
}

export const updateStudent = async (studentId: number, name: string, groupId: number) => {
   const params ={
            "id": studentId,
            "name": name,
            "groupid": groupId
        }
    try {
        await instance.put("api/student", params)
        console.log("Success! Student's name has been updated!")
    } catch(error) {
        console.log(error, params)
    }
}


export const migrate = async() => {
    try{
        const params = {}
        await instance.post("api/migrations/migrate", params)
        console.log("Data has been written successfully!")
    } catch (error) {
        console.log(error)
    }
}

export const sendStuddents = async (file: File) => { // Лучше использовать тип File
    try {
        const formData = new FormData();
        // Первый аргумент "file" должен совпадать с тем, что ждет бэкенд (название поля)
        formData.append("file", file);

        await instance.post("api/student/import", formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            },
            timeout: 20000
        });
        
        console.log("All students have been synchronized!");
    } catch (error) {
        if (error instanceof Error) {
            console.log(error.message);
        }
    }
}

export const sendStudyData = async(url:string) => {
    try{
        const params = {
            "calendarUrl": url
        }
        console.log(params)
        await instance.put("api/settings", params)
        console.log("Calendar data has been sended!")
    } catch (error){
        if( error instanceof Error){
            console.log(error.message)
        }
    }
}