using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace OpenData.Domain.Models
{
    public class MetadataExperiencePostMapping
    {
        [ForeignKey("ExperiencePost")]
        public Guid ExperiencePostUuid { get; set; }
        public ExperiencePost ExperiencePost { get; set; }

        [ForeignKey("Metadata")]
        public Guid MetadataUuid { get; set; }
        public Metadata Metadata { get; set; }
    }
}
