using OpenData.Domain.Models;

namespace OpenData.Domain.Services.Communication
{
    public class SaveMetadataResponse : BaseResponse
    {
        public Metadata Metadata { get; private set; }

        private SaveMetadataResponse(bool success, string message, Metadata metadata) : base(success, message)
        {
            Metadata = metadata;
        }

        /// <summary>
        /// Creates a success response.
        /// </summary>
        /// <param name="metadata">Saved metadata.</param>
        /// <returns>Response.</returns>
        public SaveMetadataResponse(Metadata metadata) : this(true, string.Empty, metadata)
        { }

        /// <summary>
        /// Creates am error response.
        /// </summary>
        /// <param name="message">Error message.</param>
        /// <returns>Response.</returns>
        public SaveMetadataResponse(string message) : this(false, message, null)
        { }
    }
}