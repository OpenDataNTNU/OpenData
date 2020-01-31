using OpenData.Domain.Models;

namespace OpenData.Domain.Services.Communication
{
    public class SaveTagResponse : BaseResponse
    {
        public Tag Tag { get; private set; }

        private SaveTagResponse(bool success, string message, Tag tag) : base(success, message)
        {
            Tag = tag;
        }

        /// <summary>
        /// Creates a success response.
        /// </summary>
        /// <param name="tag">Saved tag.</param>
        /// <returns>Response.</returns>
        public SaveTagResponse(Tag tag) : this(true, string.Empty, tag)
        { }

        /// <summary>
        /// Creates am error response.
        /// </summary>
        /// <param name="message">Error message.</param>
        /// <returns>Response.</returns>
        public SaveTagResponse(string message) : this(false, message, null)
        { }
    }
}