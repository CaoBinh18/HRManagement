using HRManagement.Domain.DTO;
using HRManagement.Domain.Models;
using HRManagement.Repository.DepartmentRepository;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HRManagement.Service.DepartmentService
{
    public class DepartmentService : IDepartmentService
    {
        private readonly IDepartmentRepository departmentRepository;

        public DepartmentService(IDepartmentRepository departmentRepository)
        {
            this.departmentRepository = departmentRepository;
        }

        public async Task<List<Department>> GetDepartments()
        {
            return await departmentRepository.GetDepartments();
        }

        public async Task<Department> GetDepartmentById(int id)
        {
            return await departmentRepository.GetDepartmentById(id);
        }

        public async Task<List<DepartmentTree>> GetDepartmentTree(int id)
        {
            List<Department> departments = await departmentRepository.GetDepartments();

            List<DepartmentTree> departmentsTree = new();
            foreach (Department d in departments)
            {
                departmentsTree.Add(ToDepartmentTree(d));
            }

            List<DepartmentTree> hierarchy = new();

            hierarchy = departmentsTree
                   .Where(c => c.ParentId == id)
                   .Select(c => new DepartmentTree()
                   {
                       Id = c.Id,
                       Name = c.Name,
                       ParentId = c.ParentId,
                       Children = GetChildren(departmentsTree, c.Id)
                   })
                   .ToList();

            return hierarchy;
        }

        private List<DepartmentTree> GetChildren(List<DepartmentTree> departmentsTree, int parentId)
        {
            return departmentsTree
                    .Where(c => c.ParentId == parentId)
                    .Select(c => new DepartmentTree
                    {
                        Id = c.Id,
                        Name = c.Name,
                        ParentId = c.ParentId,
                        Children = GetChildren(departmentsTree, c.Id)
                    })
                    .ToList();
        }

        public List<int> getAllDepartmentId(List<DepartmentTree> departmentsTree, List<int> listId)
        {

            foreach (DepartmentTree d in departmentsTree)
            {
                if (d.Children != null)
                {
                    listId.Add(d.Id);
                    listId = getAllDepartmentId(d.Children, listId);
                }
            }
            return listId;
        }

        private DepartmentTree ToDepartmentTree(Department department)
        {
            DepartmentTree departmentTree = new DepartmentTree();
            departmentTree.Id = department.Id;
            departmentTree.Name = department.Name;
            departmentTree.ParentId = department.ParentId;
            return departmentTree;
        }
    }
}
