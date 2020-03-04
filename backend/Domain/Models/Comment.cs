using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;


namespace OpenData.Domain.Models
{
    public class Comment
    {
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public Guid Uuid { get; set; }

        [Required]
        [ForeignKey("User")]
        public string UserMail { get; set; }
        public User User { get; set; }

        [Required]
        public string Content { get; set; }

        [DatabaseGenerated(DatabaseGeneratedOption.Computed)]
        public DateTime Published { get; set; }
        
        [DatabaseGenerated(DatabaseGeneratedOption.Computed)]
        public DateTime Edited { get; set; }

        public bool HasChildren { get; set; } = false;

        public Guid? ParentCommentUuid { get; set; }
        public Comment? ParentComment { get; set; }
        public IList<Comment> ChildComments { get; set; }
    }
}
