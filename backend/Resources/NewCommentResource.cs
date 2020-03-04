using System;
using System.ComponentModel.DataAnnotations;
using OpenData.Domain.Models;

namespace OpenData.Resources
{
    public class NewCommentResource
    {
        [Required]
        public string Content { get; set; }
        public Guid ParentCommentGuid { get; set; }
    }
}
