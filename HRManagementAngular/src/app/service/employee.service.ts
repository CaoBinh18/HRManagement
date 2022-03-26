import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

const API_URL = `${environment.apiUrl}`;
@Injectable({
  providedIn: 'root'
})
export class EmployeeService {

  constructor(private http: HttpClient) { }

  public getAll(): Observable<any[]> {
    return this.http.get<any[]>(API_URL + '/Employee');
  }

  public saveEmployee(employee: any): Observable<any> {
    return this.http.post<any>(API_URL + '/Employee', employee);
  }

  public findById(id: number): Observable<any> {
    return this.http.get<any>(`${API_URL}/Employee/${id}`);
  }

  public updateEmployee(id: number, employee: any): Observable<any> {
    return this.http.put<any>(`${API_URL}/Employee/${id}`, employee);
  }

  public deleteEmployee(id: number): Observable<any> {
    return this.http.delete<any>(`${API_URL}/Employee/${id}`);
  }

  public getEmployeesByDepartmnetId(id: number): Observable<any[]> {
    return this.http.get<any[]>(API_URL + `/EmployeeByDepartmentId/${id}`);
  }

  public getAllDepartment(): Observable<any[]> {
    return this.http.get<any[]>(API_URL + '/Department');
  }

  public getAllEmployeesByDepartmnetId(id: number): Observable<any[]> {
    return this.http.get<any[]>(API_URL + `/EmployeeByDepartmentId/${id}`);
  }

  public getDepartmentTreeView(): Observable<any[]> {
    return this.http.get<any[]>(API_URL + `/DepartmentTreeView`)
  }

  public getAllEmployeesTreeByDepartmentId(id: number): Observable<any[]> {
    return this.http.get<any[]>(API_URL + `/EmployeeOfTreeByDepartmentId/${id}`);
  }
  
}
