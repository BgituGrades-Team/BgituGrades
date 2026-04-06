



/**
 * Интерфейс группы
 */
export interface GroupInterface {
    id: number;
    name: string;
    studyStartDate: string;
    studyEndDate: string;
    startWeekNumber: string;
}

/**
 * Ссылка для студента
 */
export interface StudentLinkInterface {
    link: string;
}

export interface BaseInputInterface {
    id: number;
}

/**
 * Интерфейс дисциплины
 */
export interface DisciplineInterface extends BaseInputInterface {
    name: string;
}

/**
 * Интерфейс со студентами
 */

export interface StudentInterface extends BaseInputInterface {
    name: string;
    groupId: number;
}



export interface ReportTypeInterface extends BaseInputInterface {
    name: "По посещению" | "По успеваемости";
}


/**
 * Интерфейс доступных типов посещения
 */
export interface PresenceInterface {
    classId: number;
    classType: "PRACTICE" | "LECTURE";
    date: string;
    isPresent: "PRESENT" | "ABSENTVALID" | "ABSENTINVALID"
}

/**
 * Интерфейс информации о работе
 */
export interface WorkInterface {
    workId: number;
    name: string;
    value: null | string
}


export interface KeyInterface {
    key: string;
    role: string;
    ownerName: string;
    expiryDate: string;
}

 
/**
 * Интерфейс таблицы посещений
 */
export type DateTableSample = [
    {
        studentId: number;
        name: string;
        presences: PresenceInterface[] 
    }
]

/**
 * Интерфейс таблицы работ
 */
export type WorkTableSample = [
    {
        studentId: number;
        name: string;
        marks: WorkInterface[] 
    }
]



export type ReportTableSample = [
    {
        isGroupHeader: boolean;
        cells: [string];
    }
]