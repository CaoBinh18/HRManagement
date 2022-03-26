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
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import Swal from 'sweetalert2'


@Component({
  selector: 'app-employee',
  templateUrl: './employee.component.html',
  styleUrls: ['./employee.component.css'],
  providers: [EmployeeService],

})
export class EmployeeComponent implements OnInit {

  public employees: any = [];
  public positions = positions;
  public searchPositions = positions;
  public titles = titles;
  public searchTitles = titles;

  public state: any = {
    skip: 0,
    take: 5,
    filter: {
      logic: 'and',
      filters: []
    }
  };

  public gridItems: GridDataResult = process(this.employees, this.state);
  // public pageSize: number = 5;
  // public skip: number = 0;
  public sortDescriptor: SortDescriptor[] = [];
  public filterTerm: number | null = null;

  public value = 1;
  public dataItem: Object = { id: 2, name: 'Ban tổng giám đốc', parentId: 0 };
  public changeDepartmentId: number = 2;

  public treeNode: any = [];
  public departmentTree: any = [];
  // public departmentIdChange: any;

  public filterExpandSettings: FilterExpandSettings = {
    expandMatches: true,
  };

  public formData = this.formBuildData.group({
    IdEmployee: [],
    Avatar: [''],
    Firstname: [''],
    Lastname: [''],
    Position: [],
    Title: [],
    DepartmentId: [],
    Departmentname: ['']
  })

  // public formEdit = this.formBuildData.group({
  //   IdEmployee: [],
  //   Avatar: [''],
  //   Firstname: [''],
  //   Lastname: [''],
  //   Position: [],
  //   Title: [],
  //   // DepartmentId: [{}, Validators.required]
  //   DepartmentId: [],
  //   Departmentname: ['']
  // })

  constructor(private httpServer: EmployeeService, private formBuildData: FormBuilder, private modalService: NgbModal) { }

  public ngOnInit(): void {
    this.loadDataChange(this.filterTerm)
    this.showTreeDepartment();
    // this.getAllDepartment();
  }

  public showForm(): void {
    $("#outputImage").attr("src", "")
    $("#file-create").val("")
    this.formData = this.formBuildData.group({
      IdEmployee: [],
      Firstname: [''],
      Lastname: [''],
      Position: [],
      Title: [],
      Avatar: [''],
      DepartmentId: [],
      Departmentname: ['']
    })
  }

  public getEmployee(event: any): void {
    this.httpServer.findById(event.dataItem.id).subscribe((data) => {
      this.formData = this.formBuildData.group({
        IdEmployee: [data.id],
        Firstname: [data.fisrtname],
        Lastname: [data.lastname],
        Position: [data.position],
        Title: [data.title],
        Avatar: [data.avatar],
        DepartmentId: [data.department.id],
        DepartmentName: [data.department.name]
      })
      this.value = data.department.id;
      this.dataItem = data.department;
      $("#outputImageEdit").attr("src", data.avatar)
    });
  }

  public createEmployee(): void {
    if (this.formData.valid) {
      const emp: Employee = {
        Firstname: this.formData.value.Firstname,
        Lastname: this.formData.value.Lastname,
        Position: this.formData.value.Position,
        Title: this.formData.value.Title,
        Avatar: $("#base64-formCreate").val(),
        DepartmentId: this.formData.value.DepartmentId,
        DepartmentName: this.formData.value.DepartmentName
      }

      this.httpServer.saveEmployee(emp).subscribe((data) => {
        // console.log(data)
        alert("Thêm nhân viên thành công !")
        // this.loadDataChange(this.filterTerm)
        this.gridItems = process(this.employees, this.state)
        this.formData.reset();
        $("#base64-create").val("")
        $("#file-create").val("")
        $("#outputImageEdit").attr("src", "")
      });
      this.modalService.dismissAll();
    }
  }

  public editEmployee(): void {
    const id = this.formData.value.IdEmployee
    if (this.formData.valid) {
      const empEdit: Employee = {
        EmployeeId: this.formData.value.IdEmployee,
        Firstname: this.formData.value.Firstname,
        Lastname: this.formData.value.Lastname,
        Position: this.formData.value.Position,
        Title: this.formData.value.Title,
        Avatar: $("#base64-edit").val(),
        DepartmentId: this.formData.value.DepartmentId,
        DepartmentName: this.formData.value.DepartmentName
      }

      this.httpServer.updateEmployee(id, empEdit).subscribe((data) => {
        // console.log(data)
        alert("Sửa thông tin nhân viên thành công!")
        // this.loadDataChange(this.filterTerm)
        this.gridItems = process(this.employees, this.state)
        this.formData.reset();
        $("#base64-edit").val("")
        $("#file-edit").val("")
      });
      this.modalService.dismissAll();
    }
  }

  public removeEmployee(event: any) {
    if (confirm("Bạn muốn xóa nhân viên '" + event.dataItem.firstName + " " + event.dataItem.lastName + " '!")) {
      this.httpServer.deleteEmployee(event.dataItem.id).subscribe((data) => {
        alert("Xóa nhân viên thành công !")
        // this.alertSweet
        if ((this.employees.length - 1) % this.state.pageSize == 0) {
          this.state.skip = this.state.skip - this.state.pageSize;
        }
        this.state.skip = this.state.skip;
        // this.loadDataChange(this.filterTerm)
        this.gridItems = process(this.employees, this.state)
      });
    }
  }

  public pageChange(event: PageChangeEvent): void {
    this.state.skip = event.skip;
    this.state.pageSize = event.take;
    this.state.skip = event.skip;
    this.gridItems = process(this.employees, this.state)
  }

  public handleSortChange(descriptor: SortDescriptor[]): void {
    this.sortDescriptor = descriptor;
    this.gridItems = process(this.employees, this.state)
  }

  public handleFilterChange(item: {
    text: string;
    value: number | null;
  }): void {
    this.filterTerm = item.value;
    this.state.skip = 0;
    this.loadDataChange(this.filterTerm)
  }

  public handleClickNode(event: any): void {
    this.filterTerm = event.dataItem.id
    this.state.skip = 0;
    this.loadDataChange(this.filterTerm)
  }

  private loadDataByDepartment(id: number): void {
    this.httpServer.getAllEmployeesTreeByDepartmentId(id).subscribe((data) => {
      this.employees = data;
      this.gridItems = process(this.employees, this.state)
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
      this.employees = data;
      this.gridItems = process(this.employees, this.state)
    })
  }

  public showTreeDepartment(): void {
    this.httpServer.getDepartmentTreeView().subscribe((data) => {
      // console.log(data)
      this.treeNode = [{
        name: "Tổng công ty nhân sự Việt Nam",
        children: data
      }]
      this.departmentTree = data
    })
  }

  // public getAllDepartment() {
  //   this.httpServer.getAllDepartment().subscribe((data) => {
  //     // console.log(data)
  //     this.dropDownDepartmentItems = data;
  //   })
  // }

  public handleFilterPositions(value: any): void {
    this.searchPositions = this.positions.filter(
      (s: any) => s.text.toLowerCase().indexOf(value.toLowerCase()) !== -1
    );
  }

  public handleFilterTitles(value: any): void {
    this.searchTitles = this.titles.filter(
      (s: any) => s.text.toLowerCase().indexOf(value.toLowerCase()) !== -1
    );
  }

  // public valueChangeDepartment(event: any) {
  //   this.departmentIdChange = event;
  // }

  open(content: any) {
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title', size: 'lg' }).result.then((result) => {
      result;
    }, () => {
      this.showForm();
    });
  }

  // alertSweet() {
  //   Swal.fire({
  //     title: 'Are you sure?',
  //     text: "You won't be able to revert this!",
  //     icon: 'warning',
  //     showCancelButton: true,
  //     confirmButtonColor: '#3085d6',
  //     cancelButtonColor: '#d33',
  //     confirmButtonText: 'Yes, delete it!'
  //   }).then((result) => {
  //     if (result.isConfirmed) {
  //       Swal.fire(
  //         'Deleted!',
  //         'Your file has been deleted.',
  //         'success'
  //       )
  //     }
  //   })
  // }

}
