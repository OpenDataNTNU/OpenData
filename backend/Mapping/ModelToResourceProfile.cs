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

            CreateMap<Municipality, MunicipalityResource>();

            CreateMap<MetadataTypeTagMapping, MetadataTypeTagMappingResource>();
        }
    }
}