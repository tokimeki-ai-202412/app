// @generated by protoc-gen-es v1.10.0 with parameter "target=ts,import_extension=.ts"
// @generated from file model/v1/artifact.proto (package model.v1, syntax proto3)
/* eslint-disable */
// @ts-nocheck

import type { BinaryReadOptions, FieldList, JsonReadOptions, JsonValue, PartialMessage, PlainMessage } from "@bufbuild/protobuf";
import { Message, proto3 } from "@bufbuild/protobuf";

/**
 * @generated from message model.v1.ArtifactInput
 */
export class ArtifactInput extends Message<ArtifactInput> {
  /**
   * @generated from field: string image_path = 1;
   */
  imagePath = "";

  constructor(data?: PartialMessage<ArtifactInput>) {
    super();
    proto3.util.initPartial(data, this);
  }

  static readonly runtime: typeof proto3 = proto3;
  static readonly typeName = "model.v1.ArtifactInput";
  static readonly fields: FieldList = proto3.util.newFieldList(() => [
    { no: 1, name: "image_path", kind: "scalar", T: 9 /* ScalarType.STRING */ },
  ]);

  static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): ArtifactInput {
    return new ArtifactInput().fromBinary(bytes, options);
  }

  static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): ArtifactInput {
    return new ArtifactInput().fromJson(jsonValue, options);
  }

  static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): ArtifactInput {
    return new ArtifactInput().fromJsonString(jsonString, options);
  }

  static equals(a: ArtifactInput | PlainMessage<ArtifactInput> | undefined, b: ArtifactInput | PlainMessage<ArtifactInput> | undefined): boolean {
    return proto3.util.equals(ArtifactInput, a, b);
  }
}

/**
 * @generated from message model.v1.Artifact
 */
export class Artifact extends Message<Artifact> {
  /**
   * @generated from field: string id = 1;
   */
  id = "";

  /**
   * @generated from field: string job_id = 2;
   */
  jobId = "";

  /**
   * @generated from field: string status = 3;
   */
  status = "";

  /**
   * @generated from field: repeated string object_paths = 4;
   */
  objectPaths: string[] = [];

  /**
   * @generated from field: repeated string object_urls = 5;
   */
  objectUrls: string[] = [];

  /**
   * @generated from field: int32 created_at = 6;
   */
  createdAt = 0;

  /**
   * @generated from field: int32 updated_at = 7;
   */
  updatedAt = 0;

  constructor(data?: PartialMessage<Artifact>) {
    super();
    proto3.util.initPartial(data, this);
  }

  static readonly runtime: typeof proto3 = proto3;
  static readonly typeName = "model.v1.Artifact";
  static readonly fields: FieldList = proto3.util.newFieldList(() => [
    { no: 1, name: "id", kind: "scalar", T: 9 /* ScalarType.STRING */ },
    { no: 2, name: "job_id", kind: "scalar", T: 9 /* ScalarType.STRING */ },
    { no: 3, name: "status", kind: "scalar", T: 9 /* ScalarType.STRING */ },
    { no: 4, name: "object_paths", kind: "scalar", T: 9 /* ScalarType.STRING */, repeated: true },
    { no: 5, name: "object_urls", kind: "scalar", T: 9 /* ScalarType.STRING */, repeated: true },
    { no: 6, name: "created_at", kind: "scalar", T: 5 /* ScalarType.INT32 */ },
    { no: 7, name: "updated_at", kind: "scalar", T: 5 /* ScalarType.INT32 */ },
  ]);

  static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): Artifact {
    return new Artifact().fromBinary(bytes, options);
  }

  static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): Artifact {
    return new Artifact().fromJson(jsonValue, options);
  }

  static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): Artifact {
    return new Artifact().fromJsonString(jsonString, options);
  }

  static equals(a: Artifact | PlainMessage<Artifact> | undefined, b: Artifact | PlainMessage<Artifact> | undefined): boolean {
    return proto3.util.equals(Artifact, a, b);
  }
}

