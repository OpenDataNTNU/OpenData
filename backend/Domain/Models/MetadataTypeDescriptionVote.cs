using System;
using System.ComponentModel.DataAnnotations.Schema;

namespace OpenData.Domain.Models
{
    public class MetadataTypeDescriptionVote
    {
        [ForeignKey("MetadataTypeDescription")]
        public Guid MetadataTypeDescriptionUuid { get; set; }
        public MetadataTypeDescription MetadataTypeDescription { get; set; }

        [ForeignKey("User")]
        public Guid UserUuid { get; set; }
        public User User { get; set; }
    }
}
