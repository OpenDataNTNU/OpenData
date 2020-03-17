using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;


namespace OpenData.Domain.Models
{
    public class MetadataCategory
    {
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public Guid Uuid { get; set; }

        [Required]
        public string Name { get; set; }

        [DatabaseGenerated(DatabaseGeneratedOption.Computed)]
        public DateTime Created { get; set; }
        
        [DatabaseGenerated(DatabaseGeneratedOption.Computed)]
        public DateTime LastEdited { get; set; }

        public bool HasChildren { get; set; } = false;
        public bool HasTypes { get; set; } = false;

#nullable enable
        public Guid? ParentUuid { get; set; }
        public MetadataCategory? Parent { get; set; }
#nullable disable

        public IList<MetadataCategory> Children { get; set; }
        public IList<MetadataType> Types { get; set; }
    }
}
