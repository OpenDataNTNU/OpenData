using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;

namespace OpenData.Domain.Models
{
    public class MetadataTypeDescription
    {
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public Guid Uuid { get; set; }
        public string Content { get; set; }

        [DatabaseGenerated(DatabaseGeneratedOption.Computed)]
        public DateTime Published { get; set; }

        [DatabaseGenerated(DatabaseGeneratedOption.Computed)]
        public DateTime Edited { get; set; }

        [ForeignKey("MetadataType")]
        public Guid MetadataTypeUuid { get; set; }
        public MetadataType MetadataType { get; set; }

        [ForeignKey("Author")]
        public string AuthorMail { get; set; }
        public User Author { get; set; }

        [NotMapped]
        public int VoteCount { get; set; } = -1;
        public IEnumerable<MetadataTypeDescriptionVote> Votes { get; set; }
    }
}
