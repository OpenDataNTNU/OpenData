using System;
using System.ComponentModel.DataAnnotations;

namespace OpenData.Domain.Models
{
    public class MetadataCommentMapping
    {
        [Key]
        public Guid CommentUuid { get; set; }

        [Key]
        public Guid MetadataUuid { get; set; }
    }
}
