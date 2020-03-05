using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace OpenData.Domain.Models
{
    public class ExperiencePostCommentMapping
    {
        [ForeignKey("Comment")]
        public Guid CommentUuid { get; set; }
        public Comment Comment { get; set; }
        
        [ForeignKey("ExperiencePost")]
        public Guid ExperiencePostUuid { get; set; }
        public ExperiencePost ExperiencePost { get; set; }
    }
}
