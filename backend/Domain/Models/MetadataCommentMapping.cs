using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace OpenData.Domain.Models
{
    public class MetadataCommentMapping
    {
        [ForeignKey("Comment")]
        public Guid CommentUuid { get; set; }
        public Comment Comment { get; set; }

        [ForeignKey("Metadata")]
        public Guid MetadataUuid { get; set; }
        public Metadata Metadata { get; set; }
    }
}
