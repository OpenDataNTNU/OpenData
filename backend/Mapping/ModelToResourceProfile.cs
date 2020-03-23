using AutoMapper;
using OpenData.Domain.Models;
using OpenData.Domain.Services.Communication;
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

            CreateMap<NewDataSourceResource, DataSource>();
            CreateMap<DataSource, DataSourceResource>();

            CreateMap<ExperiencePost, ExperiencePostResource>();
            CreateMap<ExperiencePostTagMapping, ExperiencePostTagMappingResource>();

            CreateMap<Municipality, MunicipalityResource>();

            CreateMap<SaveExperiencePostResource, ExperiencePost>();

            CreateMap<SaveExperiencePostResponse, SafeSaveExperiencePostResponse>();

            CreateMap<MetadataTypeTagMapping, MetadataTypeTagMappingResource>();
            CreateMap<MetadataExperiencePostMapping, MetadataExperiencePostMappingResource>().IncludeMembers(s => s.ExperiencePost);
            CreateMap<ExperiencePost, MetadataExperiencePostMappingResource>(MemberList.None);

            CreateMap<NewUserResource, User>();
            CreateMap<User, PrivateSafeUserResource>();
            CreateMap<User, SafeUserResource>();

            CreateMap<NewCommentResource,  Comment>();
            CreateMap<Comment,  CommentResource>();
        }
    }
}