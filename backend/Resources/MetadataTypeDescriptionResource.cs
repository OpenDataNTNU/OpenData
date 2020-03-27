using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using OpenData.Domain.Models;

namespace OpenData.Resources
{
    public class MetadataTypeDescriptionResource
    {
        public Guid Uuid { get; set; }
        public string Content { get; set; }

        public DateTime Published { get; set; }

        public DateTime Edited { get; set; }

        public MetadataType MetadataType { get; set; }

        public SafeUserResource Author { get; set; }

        public int VoteCount { get; set; } = 0;
        public bool HasVoted { get; set; } = false;
    }
}
