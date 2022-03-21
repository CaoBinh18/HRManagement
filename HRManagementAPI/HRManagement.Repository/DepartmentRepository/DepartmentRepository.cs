using HRManagement.Domain.Data;
using HRManagement.Domain.Models;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HRManagement.Repository.DepartmentRepository
{
    public class DepartmentRepository : IDepartmentRepository
    {
        private readonly HRMContext context;

        public DepartmentRepository(HRMContext context)
        {
            this.context = context;
        }
        public async Task<Department> GetDepartmentById(int id)
        {
            return await context.Departments.Include(d => d.Employees).Where(d => !d.Deleted && d.Id == id).FirstOrDefaultAsync();
        }

        public async Task<List<Department>> GetDepartments()
        {
            return await context.Departments.Include(d => d.Employees).Where(d => d.Deleted == false).ToListAsync();
        }
    }
}
