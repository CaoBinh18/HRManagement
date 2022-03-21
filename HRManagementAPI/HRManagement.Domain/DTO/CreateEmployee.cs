using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HRManagement.Domain.DTO
{
    public class CreateEmployee
    {
        public int EmployeeId { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string Position { get; set; }
        public string Title { get; set; }
        public string Avatar { get; set; }
        public int DepartmentId { get; set; }
    }
}
