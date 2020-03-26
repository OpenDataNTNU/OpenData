using System;
using System.ComponentModel.DataAnnotations.Schema;
using OpenData.Domain.Models;

namespace OpenData.Resources
{
    public class MetadataTypeDescriptionVoteResource
    {
        // TODO: This class may not be needed
        public SafeUserResource User { get; set; }

        public Guid MetadataTypeDescriptionUuid { get; set; }
        public MetadataTypeDescription MetadataTypeDescription { get; set; }
        
        public DateTime DateVoted { get; set; }
    }
}
