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

        [ForeignKey("User")]
        public string UserMail { get; set; }
        public User User { get; set; }

        [Required]
        [ForeignKey("Metadata")]
        public Guid MetadataUuid { get; set; }
        public Metadata Metadata { get; set; }

        [ForeignKey("ParentComment")]
        public Guid ParentCommentGuid { get; set; }
        public Comment ParentComment { get; set; }
        public IList<Comment> ChildComments { get; set; }

        [Required]
        public string Content { get; set; }

        [DatabaseGenerated(DatabaseGeneratedOption.Computed)]
        public DateTime Published { get; set; }

        [DatabaseGenerated(DatabaseGeneratedOption.Computed)]
        public DateTime Edited { get; set; }
    }
}
