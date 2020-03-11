using System;
using OpenData.Domain.Models;

namespace OpenData.Resources
{
    public class DataSourceResource
    {
        public Guid Uuid { get; set; }

        public string Url { get; set; }

        public string Description { get; set; }

        public DataFormat DataFormat { get; set; }

        public DateTime? StartDate { get; set; }
        public DateTime? EndDate { get; set; }
    }
}
