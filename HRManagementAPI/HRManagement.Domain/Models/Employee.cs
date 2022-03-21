using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HRManagement.Domain.Models
{
    public class Employee
    {
        [Key]
        public int Id { get; set; }
        //public int ParentId { get; set; }
        public string Fisrtname { get; set; }
        public string Lastname { get; set; }
        public string Position { get; set; }

        public string Title { get; set; }

        public string Avatar { get; set; }

        public virtual Department Department { get; set; }
        public bool Deleted { get; set; }

        public string Fullname
        {
            get { return Fisrtname + " " + Lastname; }
        }
    }
}
