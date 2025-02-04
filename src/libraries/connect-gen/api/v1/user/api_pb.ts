// @generated by protoc-gen-es v1.10.0 with parameter "target=ts,import_extension=.ts"
// @generated from file api/v1/user/api.proto (package api.v1.user, syntax proto3)
/* eslint-disable */
// @ts-nocheck

import type { BinaryReadOptions, FieldList, JsonReadOptions, JsonValue, PartialMessage, PlainMessage } from "@bufbuild/protobuf";
import { Message, proto3 } from "@bufbuild/protobuf";
import { User } from "../../../model/v1/user_pb.ts";

/**
 * @generated from message api.v1.user.WhoisRequest
 */
export class WhoisRequest extends Message<WhoisRequest> {
  constructor(data?: PartialMessage<WhoisRequest>) {
    super();
    proto3.util.initPartial(data, this);
  }

  static readonly runtime: typeof proto3 = proto3;
  static readonly typeName = "api.v1.user.WhoisRequest";
  static readonly fields: FieldList = proto3.util.newFieldList(() => [
  ]);

  static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): WhoisRequest {
    return new WhoisRequest().fromBinary(bytes, options);
  }

  static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): WhoisRequest {
    return new WhoisRequest().fromJson(jsonValue, options);
  }

  static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): WhoisRequest {
    return new WhoisRequest().fromJsonString(jsonString, options);
  }

  static equals(a: WhoisRequest | PlainMessage<WhoisRequest> | undefined, b: WhoisRequest | PlainMessage<WhoisRequest> | undefined): boolean {
    return proto3.util.equals(WhoisRequest, a, b);
  }
}

/**
 * @generated from message api.v1.user.WhoisResponse
 */
export class WhoisResponse extends Message<WhoisResponse> {
  /**
   * @generated from field: model.v1.User user = 1;
   */
  user?: User;

  constructor(data?: PartialMessage<WhoisResponse>) {
    super();
    proto3.util.initPartial(data, this);
  }

  static readonly runtime: typeof proto3 = proto3;
  static readonly typeName = "api.v1.user.WhoisResponse";
  static readonly fields: FieldList = proto3.util.newFieldList(() => [
    { no: 1, name: "user", kind: "message", T: User },
  ]);

  static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): WhoisResponse {
    return new WhoisResponse().fromBinary(bytes, options);
  }

  static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): WhoisResponse {
    return new WhoisResponse().fromJson(jsonValue, options);
  }

  static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): WhoisResponse {
    return new WhoisResponse().fromJsonString(jsonString, options);
  }

  static equals(a: WhoisResponse | PlainMessage<WhoisResponse> | undefined, b: WhoisResponse | PlainMessage<WhoisResponse> | undefined): boolean {
    return proto3.util.equals(WhoisResponse, a, b);
  }
}

