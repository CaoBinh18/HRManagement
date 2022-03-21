export interface Employee {
    EmployeeId?: number;
    Firstname?: string;
    Lastname?: string;
    Position?:string;
    Title?:string;
    Avatar?:any,
    DepartmentId?:number;
    DepartmentName?:string;
    IsDeleted?: boolean
}