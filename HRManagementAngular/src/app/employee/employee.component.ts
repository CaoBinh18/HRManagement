import { Component, OnInit } from '@angular/core';
import { EmployeeService } from '../service/employee.service';
import { DataStateChangeEvent, GridDataResult, PageChangeEvent } from "@progress/kendo-angular-grid";
import { DataResult, orderBy, SortDescriptor, process, State } from "@progress/kendo-data-query";
import { Observable, of } from "rxjs";
import { FilterExpandSettings } from '@progress/kendo-angular-treeview';
import { FormBuilder, Validators } from '@angular/forms';
import { Employee } from '../models/employee';
import { positions } from '../models/position';
import { titles } from '../models/title';
import * as $ from "jquery";


@Component({
  selector: 'app-employee',
  templateUrl: './employee.component.html',
  styleUrls: ['./employee.component.css'],
  providers: [EmployeeService],
  
})
export class EmployeeComponent implements OnInit {
  // public departments = this.httpServer.allDepartment();

  public employees = this.httpServer.allEmployees();

  public defaultDepartment = { text: "Khối nhân sự", value: 3 };

  public positions = positions;
  public defaultPosition = { text: "Nhân viên", value: "Nhân viên" };

  public titles = titles;
  public defaultTitle = { text: "Nhân viên văn phòng", value: "Nhân viên văn phòng" };

  public defaultItem = { text: "Tổng tất cả các phòng ban", value: null };

  // public gridItems!: Observable<GridDataResult>;
  public gridItems! : any[]
  public pageSize: number = 10;
  public skip: number = 0;
  public sortDescriptor: SortDescriptor[] = [];
  public filterTerm: number | null = null;

  public filterExpandSettings: FilterExpandSettings = {
    expandMatches: true,
  };

  public data: any = [];  
  public dropDownDepartmentItems: any = [];

  public formCreate = this.formBuildData.group({
    Avatar:[''],
    Firstname:['', Validators.required],
    Lastname:['', Validators.required],
    Position:[this.defaultPosition.value],
    Title:[this.defaultTitle.value],
    DepartmentId: ['']
  })

  public formEdit = this.formBuildData.group({
    IdEmployee: [],
    Avatar: [''],
    Firstname: [, Validators.required],
    Lastname: [, Validators.required],
    Position: [],
    Title: [],
    DepartmentId: []
  })

  constructor(private httpServer: EmployeeService, private formBuildData: FormBuilder) { }

  public ngOnInit(): void {
    // this.loadGridItems();
    this.loadDataChange(this.filterTerm)
    this.showTreeDepartment();
    this.getAllDepartment();
  }

  public loadGridItems(): void {
    this.httpServer.getAll().subscribe((data) => {
      this.gridItems = data
      //   console.log(data)
    })
  }

  public showFormCreate(): void {
    this.formCreate = this.formBuildData.group({
      Firstname: ['', Validators.required],
      Lastname: ['', Validators.required],
      Position: [this.defaultPosition.value],
      Title: [this.defaultTitle.value],
      Avatar: [''],
      DepartmentId: [this.defaultDepartment.value]
    })
  }

  public createEmployee(): void {

    console.log(this.formCreate.value)

    const emp: Employee = {
      Firstname: this.formCreate.value.Firstname,
      Lastname: this.formCreate.value.Lastname,
      Position: this.formCreate.value.Position,
      Title: this.formCreate.value.Title,
      Avatar: $("#base64-formCreate").val(),
      DepartmentId: this.formCreate.value.DepartmentId
    }

    this.httpServer.saveEmployee(emp).subscribe((data) => {
      console.log(data)
      alert("Thêm nhân viên thành công !")

      this.loadDataChange(this.filterTerm)

      this.formCreate.reset();
      $("#base64-create").val("")
      $("#file-create").val("")
      $("#outputImageEdit").attr("src", "")
    });
  }

  // public getEmployee(
  //   skip: number,
  //   pageSize: number,
  //   sortDescriptor: SortDescriptor[],
  //   filterTerm: number | null,
  //   employees: any
  // ): Observable<DataResult> {
  //   let data;
  //   if (filterTerm) {
  //     data = process(orderBy(employees, sortDescriptor), {
  //       filter: {
  //         logic: 'and',
  //         filters: [
  //           {
  //             field: 'department.id',
  //             operator: 'eq',
  //             value: filterTerm
  //           }
  //         ]
  //       }
  //     }).data;
  //   } else {
  //     data = orderBy(employees, sortDescriptor);
  //   }
  //   return of({
  //     data: data.slice(skip, skip + pageSize),
  //     total: data.length
  //   });
  // }
  
  public getEmployee(event: any): void {
    this.httpServer.findById(event.dataItem.id).subscribe((data) => {
      this.formEdit = this.formBuildData.group({
        IdEmployee: [data.id],
        Firstname: [data.fisrtname, Validators.required],
        Lastname: [data.lastname, Validators.required],
        Position: [data.position],
        Title: [data.title],
        Avatar: [data.avatar],
        DepartmentId: [data.department.id]
      })

      $("#outputImageEdit").attr("src", data.avatar)
    });
  }

  public editEmployee(): void {
    const id = this.formEdit.value.IdEmployee

    const empEdit: Employee = {
      EmployeeId: this.formEdit.value.IdEmployee,
      Firstname: this.formEdit.value.Firstname,
      Lastname: this.formEdit.value.Lastname,
      Position: this.formEdit.value.Position,
      Title: this.formEdit.value.Title,
      Avatar: $("#base64-edit").val(),
      DepartmentId: this.formEdit.value.DepartmentId
    }


    this.httpServer.updateEmployee(id, empEdit).subscribe((data) => {
      console.log(data)
      alert("Sửa thông tin nhân viên thành công !")
      this.loadDataChange(this.filterTerm)

      this.formEdit.reset();
      $("#base64-edit").val("")
      $("#file-edit").val("")
    });
  }

  public removeHandler(event: any) {
    console.log(event.dataItem)
    if(confirm("Bạn muốn xóa nhân viên '"+ event.dataItem.firstName +" "+ event.dataItem.lastName  +" '!")){
   
    this.httpServer.deleteEmployee(event.dataItem.id).subscribe((data) => {
      alert("Xóa nhân viên thành công !")
      this.loadDataChange(this.filterTerm)
    });}
  }

  public pageChange(event: PageChangeEvent): void {
    this.skip = event.skip;
    this.loadDataChange(this.filterTerm)
  }

  public handleSortChange(descriptor: SortDescriptor[]): void {
    this.sortDescriptor = descriptor;
    // this.gridItems = this.employees;
    this.loadDataChange(this.filterTerm)
  }

  public handleFilterChange(item: {
    text: string;
    value: number | null;
  }): void {
    this.filterTerm = item.value;
    this.skip = 0;
    this.loadDataChange(this.filterTerm)
  }

  public handleClickNode(event: any): void {
    // console.log(event);
    this.filterTerm = event.dataItem.id
    // console.log(this.filterTerm)
    this.skip = 0;
    this.loadDataChange(this.filterTerm)

  }

  private loadDataByDepartment(id: number): void {
    this.httpServer.getAllEmployeesTreeByDepartmentId(id).subscribe((data) => {
      this.gridItems = data
    })
  }

  public loadDataChange(id: number | null = null) {
    if (id != null) {
      this.loadDataByDepartment(id)
    }
    else {
      this.loadData()

    }
  }

  public loadData(): void {
    this.httpServer.getAll().subscribe((data) => {
      this.gridItems = data;
    })
  }

  public showTreeDepartment(): void {
    this.httpServer.getDepartmentTreeView().subscribe((data) => {
      console.log(data)
      this.data = [{
        name: "Tổng công ty nhân sự Việt Nam",
        children: data
      }]
    })
  }

  public getAllDepartment() {
    this.httpServer.getAllDepartment().subscribe((data) => {
      // console.log(data)
      this.dropDownDepartmentItems = data
    })
  }
}
