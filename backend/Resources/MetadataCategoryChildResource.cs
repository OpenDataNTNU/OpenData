using System.Collections.Generic;
using System;

using OpenData.Domain.Models;

namespace OpenData.Resources
{
        public class MetadataCategoryChildResource
        {
                public Guid Uuid { get; set; }

                public string Name { get; set; }

                public bool HasChildren { get; set; } = false;

                public IList<MetadataCategoryChildResource> Children { get; set; }
                public IList<MetadataTypeResource> Types { get; set; }
	}
}