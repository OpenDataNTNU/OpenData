using AutoMapper;
using OpenData.Domain.Models;
using OpenData.Resources;

namespace OpenData.Mapping
{
    public class ModelToResourceProfile : Profile
    {
        public ModelToResourceProfile()
        {
            CreateMap<Municipality, MunicipalityResource>();
        }
    }
}