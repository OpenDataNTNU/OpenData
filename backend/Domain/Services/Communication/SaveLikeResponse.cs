using OpenData.Domain.Models;

namespace OpenData.Domain.Services.Communication
{
    public class SaveLikeResponse : BaseResponse
    {
        public Like Like { get; private set; }

        private SaveLikeResponse(bool success, string message, Like like) : base(success, message)
        {
            Like = like;
        }

        /// <summary>
        /// Creates a success response.
        /// </summary>
        /// <param name="like">Saved like.</param>
        /// <returns>Response.</returns>
        public SaveLikeResponse(Like like) : this(true, string.Empty, like)
        { }

        /// <summary>
        /// Creates am error response.
        /// </summary>
        /// <param name="message">Error message.</param>
        /// <returns>Response.</returns>
        public SaveLikeResponse(string message) : this(false, message, null)
        { }
    }
}