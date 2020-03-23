using System;
using System.ComponentModel.DataAnnotations.Schema;

namespace OpenData.Domain.Models
{
    public class MetadataTypeDescription
    {
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public Guid Uuid { get; set; }
        public string Content { get; set; }

        [ForeignKey("MetadataType")]
        public Guid MetadataTypeUuid { get; set; }
        public MetadataType MetadataType { get; set; }
    }
}
