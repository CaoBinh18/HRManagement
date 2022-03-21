using HRManagement.Domain.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HRManagement.Repository.EmployeeRepository
{
    public interface IEmployeeRepository
    {
        Task<List<Employee>> GetEmployees();

        Task<List<Employee>> GetEmployeesByDerpartmentId(int id);
        Task<Employee> Create(Employee employee);
        Task<Employee> GetEmployeeById(int id);
        Task<Employee> Modify(Employee employee);
        Task<Employee> Remove(int id);
        bool EmployeeExists(int id);
    }
}
