using System.Collections.Generic;
using System;

using OpenData.Domain.Models;

namespace OpenData.Resources
{
        public class MetadataCategoryResource
        {
                public Guid Uuid { get; set; }

                public string Name { get; set; }

                public DateTime Created { get; set; }
                
                public DateTime LastEdited { get; set; }

                public bool HasChildren { get; set; } = false;
                public bool HasTypes { get; set; } = false;

#nullable enable
                public Guid? ParentUuid { get; set; }
#nullable disable

                public IList<MetadataCategoryChildResource> Children { get; set; }
                public IList<MetadataTypeResource> Types { get; set; }
	}
}
