import axios from 'axios';
import type { DisciplineInterface, GroupInterface, KeyInterface, StudentInterface, StudentLinkInterface } from '../types/fromRequests';

// Наш бекендер ебень
axios.defaults.baseURL = import.meta.env.VITE_DOTENV_API_URL
const instance = axios.create({
    baseURL: import.meta.env.VITE_DOTNET_API_URL,
    timeout: 1000,
    headers: {
        'Accept': '*/*',
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'key': localStorage.getItem("api_key")
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
        const result: Response<StudentLinkInterface> = await instance.get(`/api/key/shared?groupid=${groupId}`)
        return result.data
    } catch (error){
        console.log(error)
    }
}
/**
 * Получение дисциплин для группы
 * @param groupId Идентификатор группы
 * @returns Массив студентов в этой группе
 */
export const getStudents = async (groupId: number[]) => {
    try {
        const result: Response<StudentInterface[]> = await instance.get(`/api/student?groupids=${groupId.join(",")}`)
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

export const addKey = async (role: string, groupId: number) => {
    try {
        const params = {
            role:  role,
            groupId: groupId
        }
        await instance.post(`api/key`, params)
        console.log("pizda noviy cluch")
    } catch (error) {
        console.log(error)
    }
}


/**
 * Удаление ключа по его имени
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
            url: link+"?key="+localStorage.getItem("api_key"),
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



