using HRManagement.Domain.Models;
using HRManagement.Repository.EmployeeRepository;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HRManagement.Service.EmployeeService
{
    public class EmployeeService : IEmployeeService
    {
        private readonly IEmployeeRepository employeeRepository;


        public EmployeeService(IEmployeeRepository employeeRepository)
        {
            this.employeeRepository = employeeRepository;

        }

        public async Task<List<Employee>> GetEmployees()
        {
            return await employeeRepository.GetEmployees();
        }
        public async Task<Employee> Create(Employee employee)
        {
            return await employeeRepository.Create(employee);
        }

        public async Task<Employee> GetEmployeeById(int id)
        {
            return await employeeRepository.GetEmployeeById(id);

        }

        public async Task<Employee> Modify(Employee employee)
        {
            return await employeeRepository.Modify(employee);
        }

        public async Task<Employee> Remove(int id)
        {
            return await employeeRepository.Remove(id);
        }

        public bool EmployeeExists(int id)
        {
            return employeeRepository.EmployeeExists(id);
        }

        public async Task<List<Employee>> GetEmployeesByDerpartmentId(int id)
        {
            return await employeeRepository.GetEmployeesByDerpartmentId(id);
        }
    }
}
