// @generated by protoc-gen-es v2.2.2 with parameter "target=ts,import_extension=.ts"
// @generated from file api/v1/artifact/api.proto (package api.v1.artifact, syntax proto3)
/* eslint-disable */

import type { GenFile, GenMessage, GenService } from "@bufbuild/protobuf/codegenv1";
import { fileDesc, messageDesc, serviceDesc } from "@bufbuild/protobuf/codegenv1";
import type { Artifact, ArtifactInput } from "../../../model/v1/artifact_pb.ts";
import { file_model_v1_artifact } from "../../../model/v1/artifact_pb.ts";
import type { Message } from "@bufbuild/protobuf";

/**
 * Describes the file api/v1/artifact/api.proto.
 */
export const file_api_v1_artifact_api: GenFile = /*@__PURE__*/
  fileDesc("ChlhcGkvdjEvYXJ0aWZhY3QvYXBpLnByb3RvEg9hcGkudjEuYXJ0aWZhY3QiLAoUTGlzdEFydGlmYWN0c1JlcXVlc3QSFAoMY2hhcmFjdGVyX2lkGAEgASgJIj4KFUxpc3RBcnRpZmFjdHNSZXNwb25zZRIlCglhcnRpZmFjdHMYASADKAsyEi5tb2RlbC52MS5BcnRpZmFjdCIpChJHZXRBcnRpZmFjdFJlcXVlc3QSEwoLYXJ0aWZhY3RfaWQYASABKAkiOwoTR2V0QXJ0aWZhY3RSZXNwb25zZRIkCghhcnRpZmFjdBgBIAEoCzISLm1vZGVsLnYxLkFydGlmYWN0Ij8KFUNyZWF0ZUFydGlmYWN0UmVxdWVzdBImCgVpbnB1dBgBIAEoCzIXLm1vZGVsLnYxLkFydGlmYWN0SW5wdXQiPgoWQ3JlYXRlQXJ0aWZhY3RSZXNwb25zZRIkCghhcnRpZmFjdBgBIAEoCzISLm1vZGVsLnYxLkFydGlmYWN0IiwKFUNhbmNlbEFydGlmYWN0UmVxdWVzdBITCgthcnRpZmFjdF9pZBgBIAEoCSI+ChZDYW5jZWxBcnRpZmFjdFJlc3BvbnNlEiQKCGFydGlmYWN0GAEgASgLMhIubW9kZWwudjEuQXJ0aWZhY3QiLAoVRGVsZXRlQXJ0aWZhY3RSZXF1ZXN0EhMKC2FydGlmYWN0X2lkGAEgASgJIhgKFkRlbGV0ZUFydGlmYWN0UmVzcG9uc2Uy9gMKB1NlcnZpY2USYAoNTGlzdEFydGlmYWN0cxIlLmFwaS52MS5hcnRpZmFjdC5MaXN0QXJ0aWZhY3RzUmVxdWVzdBomLmFwaS52MS5hcnRpZmFjdC5MaXN0QXJ0aWZhY3RzUmVzcG9uc2UiABJaCgtHZXRBcnRpZmFjdBIjLmFwaS52MS5hcnRpZmFjdC5HZXRBcnRpZmFjdFJlcXVlc3QaJC5hcGkudjEuYXJ0aWZhY3QuR2V0QXJ0aWZhY3RSZXNwb25zZSIAEmMKDkNyZWF0ZUFydGlmYWN0EiYuYXBpLnYxLmFydGlmYWN0LkNyZWF0ZUFydGlmYWN0UmVxdWVzdBonLmFwaS52MS5hcnRpZmFjdC5DcmVhdGVBcnRpZmFjdFJlc3BvbnNlIgASYwoOQ2FuY2VsQXJ0aWZhY3QSJi5hcGkudjEuYXJ0aWZhY3QuQ2FuY2VsQXJ0aWZhY3RSZXF1ZXN0GicuYXBpLnYxLmFydGlmYWN0LkNhbmNlbEFydGlmYWN0UmVzcG9uc2UiABJjCg5EZWxldGVBcnRpZmFjdBImLmFwaS52MS5hcnRpZmFjdC5EZWxldGVBcnRpZmFjdFJlcXVlc3QaJy5hcGkudjEuYXJ0aWZhY3QuRGVsZXRlQXJ0aWZhY3RSZXNwb25zZSIAQn0KE2NvbS5hcGkudjEuYXJ0aWZhY3RCCEFwaVByb3RvUAGiAgNBVkGqAg9BcGkuVjEuQXJ0aWZhY3TKAg9BcGlcVjFcQXJ0aWZhY3TiAhtBcGlcVjFcQXJ0aWZhY3RcR1BCTWV0YWRhdGHqAhFBcGk6OlYxOjpBcnRpZmFjdGIGcHJvdG8z", [file_model_v1_artifact]);

/**
 * @generated from message api.v1.artifact.ListArtifactsRequest
 */
export type ListArtifactsRequest = Message<"api.v1.artifact.ListArtifactsRequest"> & {
  /**
   * @generated from field: string character_id = 1;
   */
  characterId: string;
};

/**
 * Describes the message api.v1.artifact.ListArtifactsRequest.
 * Use `create(ListArtifactsRequestSchema)` to create a new message.
 */
export const ListArtifactsRequestSchema: GenMessage<ListArtifactsRequest> = /*@__PURE__*/
  messageDesc(file_api_v1_artifact_api, 0);

/**
 * @generated from message api.v1.artifact.ListArtifactsResponse
 */
export type ListArtifactsResponse = Message<"api.v1.artifact.ListArtifactsResponse"> & {
  /**
   * @generated from field: repeated model.v1.Artifact artifacts = 1;
   */
  artifacts: Artifact[];
};

/**
 * Describes the message api.v1.artifact.ListArtifactsResponse.
 * Use `create(ListArtifactsResponseSchema)` to create a new message.
 */
export const ListArtifactsResponseSchema: GenMessage<ListArtifactsResponse> = /*@__PURE__*/
  messageDesc(file_api_v1_artifact_api, 1);

/**
 * @generated from message api.v1.artifact.GetArtifactRequest
 */
export type GetArtifactRequest = Message<"api.v1.artifact.GetArtifactRequest"> & {
  /**
   * @generated from field: string artifact_id = 1;
   */
  artifactId: string;
};

/**
 * Describes the message api.v1.artifact.GetArtifactRequest.
 * Use `create(GetArtifactRequestSchema)` to create a new message.
 */
export const GetArtifactRequestSchema: GenMessage<GetArtifactRequest> = /*@__PURE__*/
  messageDesc(file_api_v1_artifact_api, 2);

/**
 * @generated from message api.v1.artifact.GetArtifactResponse
 */
export type GetArtifactResponse = Message<"api.v1.artifact.GetArtifactResponse"> & {
  /**
   * @generated from field: model.v1.Artifact artifact = 1;
   */
  artifact?: Artifact;
};

/**
 * Describes the message api.v1.artifact.GetArtifactResponse.
 * Use `create(GetArtifactResponseSchema)` to create a new message.
 */
export const GetArtifactResponseSchema: GenMessage<GetArtifactResponse> = /*@__PURE__*/
  messageDesc(file_api_v1_artifact_api, 3);

/**
 * @generated from message api.v1.artifact.CreateArtifactRequest
 */
export type CreateArtifactRequest = Message<"api.v1.artifact.CreateArtifactRequest"> & {
  /**
   * @generated from field: model.v1.ArtifactInput input = 1;
   */
  input?: ArtifactInput;
};

/**
 * Describes the message api.v1.artifact.CreateArtifactRequest.
 * Use `create(CreateArtifactRequestSchema)` to create a new message.
 */
export const CreateArtifactRequestSchema: GenMessage<CreateArtifactRequest> = /*@__PURE__*/
  messageDesc(file_api_v1_artifact_api, 4);

/**
 * @generated from message api.v1.artifact.CreateArtifactResponse
 */
export type CreateArtifactResponse = Message<"api.v1.artifact.CreateArtifactResponse"> & {
  /**
   * @generated from field: model.v1.Artifact artifact = 1;
   */
  artifact?: Artifact;
};

/**
 * Describes the message api.v1.artifact.CreateArtifactResponse.
 * Use `create(CreateArtifactResponseSchema)` to create a new message.
 */
export const CreateArtifactResponseSchema: GenMessage<CreateArtifactResponse> = /*@__PURE__*/
  messageDesc(file_api_v1_artifact_api, 5);

/**
 * @generated from message api.v1.artifact.CancelArtifactRequest
 */
export type CancelArtifactRequest = Message<"api.v1.artifact.CancelArtifactRequest"> & {
  /**
   * @generated from field: string artifact_id = 1;
   */
  artifactId: string;
};

/**
 * Describes the message api.v1.artifact.CancelArtifactRequest.
 * Use `create(CancelArtifactRequestSchema)` to create a new message.
 */
export const CancelArtifactRequestSchema: GenMessage<CancelArtifactRequest> = /*@__PURE__*/
  messageDesc(file_api_v1_artifact_api, 6);

/**
 * @generated from message api.v1.artifact.CancelArtifactResponse
 */
export type CancelArtifactResponse = Message<"api.v1.artifact.CancelArtifactResponse"> & {
  /**
   * @generated from field: model.v1.Artifact artifact = 1;
   */
  artifact?: Artifact;
};

/**
 * Describes the message api.v1.artifact.CancelArtifactResponse.
 * Use `create(CancelArtifactResponseSchema)` to create a new message.
 */
export const CancelArtifactResponseSchema: GenMessage<CancelArtifactResponse> = /*@__PURE__*/
  messageDesc(file_api_v1_artifact_api, 7);

/**
 * @generated from message api.v1.artifact.DeleteArtifactRequest
 */
export type DeleteArtifactRequest = Message<"api.v1.artifact.DeleteArtifactRequest"> & {
  /**
   * @generated from field: string artifact_id = 1;
   */
  artifactId: string;
};

/**
 * Describes the message api.v1.artifact.DeleteArtifactRequest.
 * Use `create(DeleteArtifactRequestSchema)` to create a new message.
 */
export const DeleteArtifactRequestSchema: GenMessage<DeleteArtifactRequest> = /*@__PURE__*/
  messageDesc(file_api_v1_artifact_api, 8);

/**
 * @generated from message api.v1.artifact.DeleteArtifactResponse
 */
export type DeleteArtifactResponse = Message<"api.v1.artifact.DeleteArtifactResponse"> & {
};

/**
 * Describes the message api.v1.artifact.DeleteArtifactResponse.
 * Use `create(DeleteArtifactResponseSchema)` to create a new message.
 */
export const DeleteArtifactResponseSchema: GenMessage<DeleteArtifactResponse> = /*@__PURE__*/
  messageDesc(file_api_v1_artifact_api, 9);

/**
 * @generated from service api.v1.artifact.Service
 */
export const Service: GenService<{
  /**
   * @generated from rpc api.v1.artifact.Service.ListArtifacts
   */
  listArtifacts: {
    methodKind: "unary";
    input: typeof ListArtifactsRequestSchema;
    output: typeof ListArtifactsResponseSchema;
  },
  /**
   * @generated from rpc api.v1.artifact.Service.GetArtifact
   */
  getArtifact: {
    methodKind: "unary";
    input: typeof GetArtifactRequestSchema;
    output: typeof GetArtifactResponseSchema;
  },
  /**
   * @generated from rpc api.v1.artifact.Service.CreateArtifact
   */
  createArtifact: {
    methodKind: "unary";
    input: typeof CreateArtifactRequestSchema;
    output: typeof CreateArtifactResponseSchema;
  },
  /**
   * @generated from rpc api.v1.artifact.Service.CancelArtifact
   */
  cancelArtifact: {
    methodKind: "unary";
    input: typeof CancelArtifactRequestSchema;
    output: typeof CancelArtifactResponseSchema;
  },
  /**
   * @generated from rpc api.v1.artifact.Service.DeleteArtifact
   */
  deleteArtifact: {
    methodKind: "unary";
    input: typeof DeleteArtifactRequestSchema;
    output: typeof DeleteArtifactResponseSchema;
  },
}> = /*@__PURE__*/
  serviceDesc(file_api_v1_artifact_api, 0);

