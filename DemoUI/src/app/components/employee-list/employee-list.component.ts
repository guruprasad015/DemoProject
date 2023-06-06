import { AfterViewInit, ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogRef, MatDialogConfig } from '@angular/material/dialog';
import { Employee } from 'src/app/interfaces/employee';
import { EmployeeService } from 'src/app/services/employee.service';
import { AddressListComponent } from '../address-list/address-list.component';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { CreateEmployeeComponent } from '../create-employee/create-employee.component';
import { EditEmployeeComponent } from '../edit-employee/edit-employee.component';

@Component({
  selector: 'app-employee-list',
  templateUrl: './employee-list.component.html',
  styleUrls: ['./employee-list.component.css']
})
export class EmployeeListComponent implements OnInit, AfterViewInit {

  displayedColumns: string[] = ['number', 'first_name', 'last_name', 'addresses', 'edit', 'delete']

  @ViewChild(MatTable) table!: MatTable<any>;
  @ViewChild('paginator') paginator!: MatPaginator;

  employees: Employee[] = [];

  name: Employee = {
    employeeId: '',
    firstName: '',
    lastName: '',
    addresses: [{
      streetAddress: '',
      aptNumber: '',
      city: '',
      state: '',
      zipCode: '',
    }]
  };

  employee: Employee = {
    employeeId: '',
    firstName: '',
    lastName: '',
    addresses: [{
      streetAddress: undefined,
      aptNumber: undefined,
      city: undefined,
      state: undefined,
      zipCode: undefined,
    }]
  }

  dataSource!: MatTableDataSource<Employee>;
  searchBy: string = 'Everyone';
  searchParam: string = '';
  searchParamState: string = 'Alabama';

  constructor(public dialogRef: MatDialogRef<EmployeeListComponent>, 
              private dialog: MatDialog, 
              private employeeService: EmployeeService,
              private cdr: ChangeDetectorRef) { }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    this.GetEmployees();
  }

  

  //opens mat dialog
  //sends employee data based on index clicked from mat table
  //on close, updates employee to reflect changes to address list
  viewAddresses(employee: Employee) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.height = "80%";
    dialogConfig.width = "80%";
    dialogConfig.data = {
      employee: employee
    };
    let dialogRef =this.dialog.open(AddressListComponent, dialogConfig);
  }

  //Creates new employee to add to system
  createEmployee() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.height = "60%";
    dialogConfig.width = "80%";
    let dialogRef = this.dialog.open(CreateEmployeeComponent, dialogConfig);
    dialogRef.afterClosed().subscribe((newEmployee) => {
      if(newEmployee.firstName != '' && newEmployee.length == 1){
        
        this.employees.push(newEmployee);
        this.dataSource = new MatTableDataSource(this.employees);
        this.dataSource.paginator = this.paginator;
      } else {
        console.log(newEmployee);
        for(let employee of newEmployee) {
          this.employees.push(employee);
        }
        this.dataSource = new MatTableDataSource(this.employees);
        this.dataSource.paginator = this.paginator;
      }
    })
  }

  //Edit existing name of employee in list
  editEmployee(employee: Employee) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.height = "30";
    dialogConfig.width = "50%";
    dialogConfig.data = {
      employee: employee
    }
    let dialogRef = this.dialog.open(EditEmployeeComponent, dialogConfig);
     
  }

  //Deletes an employee from the list
  //Splices that data from employees array
  //Updates DataSource and paginator to reflect new employees array
  deleteEmployee(employeeId: string, i: number) {
    console.log("deleting Employee");
    this.employeeService.deleteEmployee(employeeId).subscribe(() => {
      this.employees.splice(i, 1);
      this.dataSource = new MatTableDataSource(this.employees);
      this.dataSource.paginator = this.paginator;
    })
  }

  //Searches DB based on searchBy variable
  searchEmployees() {
    switch(this.searchBy) {
      case 'First Name': {
        this.GetEmployeesByFirstName();
        break;
      }
      case 'Last Name': {
        this.GetEmployeesByLastName();
        break;
      }
      case 'Everyone': {
        this.GetEmployees();
        break;
      }
      case 'State': {
        this.GetEmployeesByState();
        break;
      }
      case 'City': {
        this.GetEmployeesByCity();
        break;
      }
      case 'Zip Code': {
        this.GetEmployeesByZipCode();
        break;
      }
    }
  }

  //gets full list of employees
  //paginates list
  GetEmployees() {
    this.employeeService.GetAllEmployees().subscribe((list: Employee[]) =>
    {
      this.employees = list;
      this.dataSource = new MatTableDataSource(this.employees);
      this.cdr.detectChanges();
      this.dataSource.paginator = this.paginator;
    })    
  }

  GetEmployeesByFirstName() {
    this.employeeService.GetEmployeesByFirstName(this.searchParam).subscribe((newList: Employee[]) => {
      this.employees = newList;
      this.dataSource = new MatTableDataSource(this.employees);
      this.cdr.detectChanges();
      this.dataSource.paginator = this.paginator;
    })
  }

  GetEmployeesByLastName() {
    this.employeeService.GetEmployeesByLastName(this.searchParam).subscribe((newList: Employee[]) => {
      this.employees = newList;
      this.dataSource = new MatTableDataSource(this.employees);
      this.cdr.detectChanges();
      this.dataSource.paginator = this.paginator;
    })
  }

  GetEmployeesByState() {
    this.employeeService.GetEmployeesByState(this.searchParamState).subscribe((newList: Employee[]) => {
      this.employees = newList;
      this.dataSource = new MatTableDataSource(this.employees);
      this.cdr.detectChanges();
      this.dataSource.paginator = this.paginator;
    })
  }

  GetEmployeesByCity() {
    this.employeeService.GetEmployeesByCity(this.searchParam).subscribe((newList: Employee[]) => {
      this.employees = newList;
      this.dataSource = new MatTableDataSource(this.employees);
      this.cdr.detectChanges();
      this.dataSource.paginator = this.paginator;
    })
  }

  GetEmployeesByZipCode() {
    this.employeeService.GetEmployeesByZipCode(this.searchParam).subscribe((newList: Employee[]) => {
      this.employees = newList;
      this.dataSource = new MatTableDataSource(this.employees);
      this.cdr.detectChanges();
      this.dataSource.paginator = this.paginator;
    })
  }
}
