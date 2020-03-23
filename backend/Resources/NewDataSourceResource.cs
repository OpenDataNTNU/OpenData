using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using OpenData.Domain.Models;

namespace OpenData.Resources
{
    public class NewDataSourceResource
    {
        [Required]
        public Guid MetadataUuid { get; set; }

        [Required]
        [MaxLength(2048)]
        public string Url { get; set; }

        [Required]
        public string Description { get; set; }

        [Required]
        public string DataFormatName { get; set; }

        public DateTime? StartDate { get; set; }
        public DateTime? EndDate { get; set; }
    }
}
