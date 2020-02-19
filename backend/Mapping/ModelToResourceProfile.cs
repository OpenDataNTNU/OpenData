using AutoMapper;
using OpenData.Domain.Models;
using OpenData.Resources;
using System;
using System.Collections.Generic;

namespace OpenData.Mapping
{
    public class ModelToResourceProfile : Profile
    {
        public ModelToResourceProfile()
        {
            CreateMap<MetadataType, MetadataTypeResource>();

            CreateMap<Metadata, MetadataResource>();
            CreateMap<SaveMetadataResource, Metadata>();
            CreateMap<SaveMetadataTypeResource, MetadataType>();

            CreateMap<ExperiencePost, ExperiencePostResource>();
            CreateMap<ExperiencePostTagMapping, ExperiencePostTagMappingResource>();

            CreateMap<Municipality, MunicipalityResource>();

            CreateMap<SaveExperiencePostResource, ExperiencePost>();

            CreateMap<MetadataTypeTagMapping, MetadataTypeTagMappingResource>();

            CreateMap<NewUserResource, User>();
            CreateMap<User, PrivateSafeUserResource>();
            CreateMap<User, SafeUserResource>();
        }
    }
}