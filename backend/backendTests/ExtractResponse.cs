using System.Net.Http;
using System.Text.Json;

namespace OpenData.backend
{
    public class ExtractResponse
    {

        /// <summary>
        /// Extracts HttpResponseMessage to resource T.
        /// </summary>
        /// <returns>
        /// Returns resource T.
        /// </returns>
        public static T Extract<T>(HttpResponseMessage msg)
        {
            Utf8JsonReader jsonBytes = new Utf8JsonReader(msg.Content.ReadAsByteArrayAsync().Result);
            var options = new JsonSerializerOptions() { PropertyNameCaseInsensitive = true };
            var obj = JsonSerializer.Deserialize<T>(ref jsonBytes, options);
            return obj;
        }
    }
}
