using System.Collections.Generic;
using System;

using OpenData.Resources;

namespace OpenData.Resources
{
	public class MetadataExperiencePostMappingResource
    {
    	//public ExperiencePostTitleResource ExperiencePost { get; set; }
        public string Title { get; set; }
        public Guid ExperiencePostUuid { get; set; }

        //public Guid MetadataUuid { get; set; }
    }
}