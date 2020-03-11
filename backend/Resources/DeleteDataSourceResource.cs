using System;
using System.ComponentModel.DataAnnotations;

namespace OpenData.Resources
{
    public class DeleteDataSourceResource
    {
        [Required]
        public Guid DataSourceUuid { get; set; }
    }
}
