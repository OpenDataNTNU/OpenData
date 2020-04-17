using System;
using System.ComponentModel.DataAnnotations.Schema;

namespace OpenData.Domain.Models
{
    public class MetadataTypeDescriptionVote
    {
        [ForeignKey("User")]
        public string UserMail { get; set; }
        public User User { get; set; }

        [ForeignKey("MetadataTypeDescription")]
        public Guid MetadataTypeDescriptionUuid { get; set; }
        public MetadataTypeDescription MetadataTypeDescription { get; set; }
        
        [DatabaseGenerated(DatabaseGeneratedOption.Computed)]
        public DateTime DateVoted { get; set; }
    }
}
