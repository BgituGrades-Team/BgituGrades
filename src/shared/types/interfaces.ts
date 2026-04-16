import type React from "react";
import type { DisciplineInterface, GroupInterface, StudentInterface } from "./fromRequests";


export interface ReverseSearchInterface {
  reverseSearchArray: boolean[];
  setReverseSearchArray: React.Dispatch<React.SetStateAction<boolean[]>>;
}

export interface pipeBombInterface {
    disciplines: [DisciplineInterface[], React.Dispatch<React.SetStateAction<DisciplineInterface[]>>];
    groups: [GroupInterface[], React.Dispatch<React.SetStateAction<GroupInterface[]>>];
    students: [StudentInterface[], React.Dispatch<React.SetStateAction<StudentInterface[]>>];
}

export interface SingleInputValuesInterface {
    groupVal: string,
    groupDispatcher: React.Dispatch<React.SetStateAction<string>>,
    disciplineVal: string,
    disciplineDispatcher: React.Dispatch<React.SetStateAction<string>>
    repTypeVal: string,
    repTypeDispatcher: React.Dispatch<React.SetStateAction<string>>
}