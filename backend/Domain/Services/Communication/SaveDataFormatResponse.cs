using OpenData.Domain.Models;

namespace OpenData.Domain.Services.Communication
{
    public class SaveDataFormatResponse : BaseResponse
    {
        public DataFormat DataFormat { get; private set; }

        private SaveDataFormatResponse(bool success, string message, DataFormat df) : base(success, message)
        {
            DataFormat = df;
        }

        /// <summary>
        /// Creates a success response.
        /// </summary>
        /// <param name="df">The data format that was saved.</param>
        /// <returns>Response.</returns>
        public SaveDataFormatResponse(DataFormat df) : this(true, string.Empty, df)
        { }

        /// <summary>
        /// Creates am error response.
        /// </summary>
        /// <param name="message">Error message.</param>
        /// <returns>Response.</returns>
        public SaveDataFormatResponse(string message) : this(false, message, null)
        { }
    }
}