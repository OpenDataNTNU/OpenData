using OpenData.Domain.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace OpenData.Resources
{
    public class MetadataTypeSearchParametersResource
    {
        public string Name { get; set; } = "";
        public IEnumerable<Tag> Tags { get; set; }
        public string Keywords { get; set; } = "";
    }
}
