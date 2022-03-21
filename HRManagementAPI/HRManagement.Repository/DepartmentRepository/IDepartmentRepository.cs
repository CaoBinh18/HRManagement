using HRManagement.Domain.DTO;
using HRManagement.Domain.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HRManagement.Repository.DepartmentRepository
{
    public interface IDepartmentRepository
    {
        Task<List<Department>> GetDepartments();
        Task<Department> GetDepartmentById(int id);
        //Task<List<DepartmentTree>> GetDepartmentTree(int id);
        //public List<int> getAllDepartmentId(List<DepartmentTree> departmentsTree, List<int> listId);
    }
}
