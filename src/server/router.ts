import { Service as ArtifactService } from '@/libraries/connect-gen/api/v1/artifact/api_connect';
import { Service as CharacterService } from '@/libraries/connect-gen/api/v1/character/api_connect';
import { Service as StorageService } from '@/libraries/connect-gen/api/v1/storage/api_connect';
import { Service as UserService } from '@/libraries/connect-gen/api/v1/user/api_connect';
import {
  cancelArtifact,
  createArtifact,
  deleteArtifact,
  getArtifact,
  listArtifacts,
} from '@/server/api/v1/artifact';
import {
  createCharacter,
  deleteCharacter,
  getCharacter,
  listCharacters,
  updateCharacter,
} from '@/server/api/v1/character';
import { createUploadUrl } from '@/server/api/v1/storage';
import { whois } from '@/server/api/v1/user';
import { authenticator } from '@/server/interceptors/auth';
import {
  type ConnectRouter,
  type ContextValues,
  createConnectRouter,
} from '@connectrpc/connect';
import {
  type UniversalHandler,
  type UniversalServerRequest,
  universalServerRequestFromFetch,
  universalServerResponseToFetch,
} from '@connectrpc/connect/protocol';

const apiPrefixRegex = /^\/api/;

export class Router {
  contextValues: ContextValues;
  private router = createConnectRouter();
  private paths = new Map<string, UniversalHandler>();
  private routes = ({ service }: any) => {
    service(UserService, { whois }, { interceptors: [authenticator] });
    service(
      StorageService,
      { createUploadUrl },
      { interceptors: [authenticator] },
    );
    service(
      CharacterService,
      {
        createCharacter,
        deleteCharacter,
        getCharacter,
        listCharacters,
        updateCharacter,
      },
      { interceptors: [authenticator] },
    );
    service(
      ArtifactService,
      {
        cancelArtifact,
        createArtifact,
        deleteArtifact,
        getArtifact,
        listArtifacts,
      },
      { interceptors: [authenticator] },
    );
  };

  constructor(contextValues: ContextValues) {
    this.contextValues = contextValues;
    this.routes(this.router);
    // create handler map
    for (const uHandler of this.router.handlers) {
      this.paths.set(uHandler.requestPath, uHandler);
    }
  }

  async handle(req: Request): Promise<Response> {
    const url = new URL(req.url);
    const pathname = url.pathname.replace(apiPrefixRegex, '');
    const handler = this.paths.get(pathname);
    if (!handler) {
      return new Response(JSON.stringify({ code: 404 }), { status: 404 });
    }

    const uReq: UniversalServerRequest = {
      ...universalServerRequestFromFetch(req, {}),
      contextValues: this.contextValues,
    };
    const uRes = await handler(uReq);
    return universalServerResponseToFetch(uRes);
  }
}
