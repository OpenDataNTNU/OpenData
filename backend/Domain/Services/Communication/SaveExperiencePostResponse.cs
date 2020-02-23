using OpenData.Domain.Models;

namespace OpenData.Domain.Services.Communication
{
    public class SaveExperiencePostResponse : BaseResponse
    {
        public ExperiencePost ExperiencePost { get; private set; }

        private SaveExperiencePostResponse(bool success, string message, ExperiencePost experiencePost) : base(success, message)
        {
            ExperiencePost = experiencePost;
        }

        /// <summary>
        /// Creates a success response.
        /// </summary>
        /// <param name="experiencePost">Saved experiencePost.</param>
        /// <returns>Response.</returns>
        public SaveExperiencePostResponse(ExperiencePost experiencePost) : this(true, string.Empty, experiencePost)
        { }

        /// <summary>
        /// Creates am error response.
        /// </summary>
        /// <param name="message">Error message.</param>
        /// <returns>Response.</returns>
        public SaveExperiencePostResponse(string message) : this(false, message, null)
        { }
    }
}