using HRManagement.Domain.DTO;
using HRManagement.Domain.Models;
using HRManagement.Service.DepartmentService;
using HRManagement.Service.EmployeeService;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace HRManagement.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class EmployeeController : ControllerBase
    {
        private readonly IEmployeeService employeeService;
        private readonly IDepartmentService departmentService;

        public EmployeeController(IEmployeeService employeeService, IDepartmentService departmentService)
        {
            this.employeeService = employeeService;
            this.departmentService = departmentService;
        }

        // GET: api/<EmployeeController>
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Employee>>> GetEmployees()
        {
            return await employeeService.GetEmployees();
        }

        // GET api/<EmployeeController>/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Employee>> GetEmployee(int id)
        {
            var employee = await employeeService.GetEmployeeById(id);

            if (employee == null)
            {
                return NotFound();
            }

            return employee;
        }

        // POST api/<EmployeeController>
        [HttpPost]
        public async Task<ActionResult<Employee>> PostEmployee([FromBody] CreateEmployee createEmployee)
        {
            Department department = await departmentService.GetDepartmentById(createEmployee.DepartmentId);

            Employee employee = new Employee();
            if (department != null)
            {
                employee.Fisrtname = createEmployee.FirstName;
                employee.Lastname = createEmployee.LastName;
                employee.Position = createEmployee.Position;
                employee.Title = createEmployee.Title;
                employee.Avatar = createEmployee.Avatar;
                employee.Deleted = false;
                employee.Department = department;
            }
            else
            {
                return BadRequest();
            }

            if (ModelState.IsValid)
            {
                await employeeService.Create(employee);

                return CreatedAtAction("GetEmployee", new { id = employee.Id }, employee);
            }
            return BadRequest();
        }

        // PUT api/<EmployeeController>/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutEmployee(int id, [FromBody] CreateEmployee createEmployee)
        {
            if (id != createEmployee.EmployeeId)
            {
                return BadRequest();
            }

            Department department = await departmentService.GetDepartmentById(createEmployee.DepartmentId);

            Employee employee = await employeeService.GetEmployeeById(id);
            if (department != null && employee != null)
            {
                employee.Fisrtname = createEmployee.FirstName;
                employee.Lastname = createEmployee.LastName;
                employee.Position = createEmployee.Position;
                employee.Title = createEmployee.Title;
                employee.Avatar = createEmployee.Avatar;
                employee.Deleted = false;
                employee.Department = department;
            }
            else
            {
                return BadRequest();
            }

            try
            {
                await employeeService.Modify(employee);
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!employeeService.EmployeeExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        // DELETE api/<EmployeeController>/5
        [HttpDelete("{id}")]
        public async Task<ActionResult<Employee>> DeleteEmployee(int id)
        {
            var employee = await employeeService.GetEmployeeById(id);
            if (employee == null)
            {
                return NotFound();
            }


            await employeeService.Remove(id);

            return employee;
        }

        [HttpGet("/api/EmployeeByDepartmentId/{id}")]
        public async Task<ActionResult<IEnumerable<Employee>>> GetEmployeesByDepartmentId(int id)
        {
            return await employeeService.GetEmployeesByDerpartmentId(id);
        }

        [HttpGet]
        [Route("/api/EmployeeOfTreeByDepartmentId/{id}")]
        public async Task<ActionResult<IEnumerable<Employee>>> GetEmployeesOfTreeByDepartmentId(int id)
        {


            List<DepartmentTree> departmentRes = await departmentService.GetDepartmentTree(id);
            List<Employee> employees = new List<Employee>();
            List<Employee> employeesOfDep = new List<Employee>();
            List<int> listid = new List<int>();
            listid.Add(id);


            List<int> listIdDepartmnet = this.departmentService.getAllDepartmentId(departmentRes, listid);

            foreach (int idDe in listIdDepartmnet)
            {
                employeesOfDep = await employeeService.GetEmployeesByDerpartmentId(idDe);
                if (employeesOfDep != null)
                {
                    employees.AddRange(employeesOfDep);
                }
            }
            return employees;
        }
    }
}
