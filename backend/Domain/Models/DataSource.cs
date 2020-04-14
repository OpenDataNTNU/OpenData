using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace OpenData.Domain.Models
{
    public class DataSource
    {
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public Guid Uuid { get; set; }

        [ForeignKey("Metadata")]
        public Guid MetadataUuid {get; set;}
        public Metadata Metadata { get; set; }

        [Required]
        public string Url { get; set; }

        [Required]
        public string Description { get; set; }

        [Required]
        [ForeignKey("DataFormat")]
        public string DataFormatMimeType { get; set; }
        public DataFormat DataFormat { get; set; }

#nullable enable
        public DateTime? StartDate { get; set; }
        public DateTime? EndDate { get; set; }
#nullable disable
    }
}
