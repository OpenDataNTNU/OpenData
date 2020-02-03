using OpenData.Domain.Models;

namespace OpenData.Domain.Services.Communication
{
    public class SaveMetadataTypeResponse : BaseResponse
    {
        public MetadataType MetadataType { get; private set; }

        private SaveMetadataTypeResponse(bool success, string message, MetadataType metadataType) : base(success, message)
        {
            MetadataType = metadataType;
        }

        /// <summary>
        /// Creates a success response.
        /// </summary>
        /// <param name="metadata">Saved metadata.</param>
        /// <returns>Response.</returns>
        public SaveMetadataTypeResponse(MetadataType metadataType) : this(true, string.Empty, metadataType)
        { }

        /// <summary>
        /// Creates am error response.
        /// </summary>
        /// <param name="message">Error message.</param>
        /// <returns>Response.</returns>
        public SaveMetadataTypeResponse(string message) : this(false, message, null)
        { }
    }
}