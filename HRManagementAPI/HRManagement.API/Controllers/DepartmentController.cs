using HRManagement.Domain.DTO;
using HRManagement.Domain.Models;
using HRManagement.Service.DepartmentService;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace HRManagement.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class DepartmentController : ControllerBase
    {

        private readonly IDepartmentService departmentService;

        public DepartmentController(IDepartmentService departmentService)
        {
            this.departmentService = departmentService;
        }

        // GET: api/<DepartmentController>
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Department>>> GetDepartments()
        {
            return await departmentService.GetDepartments();
        }

        // GET api/<DepartmentController>/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Department>> GetDepartment(int id)
        {
            var department = await departmentService.GetDepartmentById(id);

            if (department == null)
            {
                return NotFound();
            }

            return department;
        }

        [HttpGet("/api/DepartmentTreeView")]
        public async Task<ActionResult<IEnumerable<DepartmentTree>>> GetDepartmentTree()
        {
            return await departmentService.GetDepartmentTree(0);
        }
    }
}
