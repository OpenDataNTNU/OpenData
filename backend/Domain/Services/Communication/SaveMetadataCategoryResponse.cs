using OpenData.Domain.Models;

namespace OpenData.Domain.Services.Communication
{
    public class SaveMetadataCategoryResponse : BaseResponse
    {
        public MetadataCategory Category { get; private set; }

        private SaveMetadataCategoryResponse(bool success, string message, MetadataCategory category) : base(success, message)
        {
            Category = category;
        }

        /// <summary>
        /// Creates a success response.
        /// </summary>
        /// <param name="metadata">Saved metadata.</param>
        /// <returns>Response.</returns>
        public SaveMetadataCategoryResponse(MetadataCategory category) : this(true, string.Empty, category)
        { }

        /// <summary>
        /// Creates am error response.
        /// </summary>
        /// <param name="message">Error message.</param>
        /// <returns>Response.</returns>
        public SaveMetadataCategoryResponse(string message) : this(false, message, null)
        { }
    }
}