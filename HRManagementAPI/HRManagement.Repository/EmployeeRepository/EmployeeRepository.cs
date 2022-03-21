using HRManagement.Domain.Data;
using HRManagement.Domain.Models;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HRManagement.Repository.EmployeeRepository
{
    public class EmployeeRepository : IEmployeeRepository
    {
        private readonly HRMContext context;

        public EmployeeRepository(HRMContext context)
        {
            this.context = context;
        }

        public async Task<Employee> Create(Employee employee)
        {
            try
            {
                context.Employees.Add(employee);
                var employeeId = await context.SaveChangesAsync();
                employee.Id = employeeId;
                return employee;
            }
            catch (Exception)
            {
                throw;
            }
        }

        public bool EmployeeExists(int id)
        {
            return context.Employees.Any(e => e.Id == id);
        }

        public async Task<Employee> GetEmployeeById(int id)
        {
            return await context.Employees.Include(e => e.Department).Where(e => !e.Deleted && e.Id == id).FirstOrDefaultAsync();
        }

        public async Task<List<Employee>> GetEmployees()
        {
            return await context.Employees.Include(e => e.Department).Where(e => !e.Deleted).ToListAsync();
        }

        public async Task<List<Employee>> GetEmployeesByDerpartmentId(int id)
        {
            return await context.Employees.Include(e => e.Department).Where(e => !e.Deleted && e.Department.Id == id).ToListAsync();
        }

        public async Task<Employee> Modify(Employee employee)
        {
            try
            {
                context.Attach(employee);
                context.Entry<Employee>(employee).State = EntityState.Modified;
                await context.SaveChangesAsync();
                return employee;
            }
            catch (Exception)
            {
                throw;
            }
        }

        public async Task<Employee> Remove(int id)
        {
            try
            {
                var employee = await GetEmployeeById(id);
                employee.Deleted = true;
                context.Attach(employee);
                context.Entry<Employee>(employee).State = EntityState.Modified;
                await context.SaveChangesAsync();
                return employee;
            }
            catch (Exception)
            {
                throw;
            }
        }
    }
}
