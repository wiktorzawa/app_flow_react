'use strict';
var __awaiter =
  (this && this.__awaiter) ||
  function (thisArg, _arguments, P, generator) {
    function adopt(value) {
      return value instanceof P
        ? value
        : new P(function (resolve) {
            resolve(value);
          });
    }
    return new (P || (P = Promise))(function (resolve, reject) {
      function fulfilled(value) {
        try {
          step(generator.next(value));
        } catch (e) {
          reject(e);
        }
      }
      function rejected(value) {
        try {
          step(generator['throw'](value));
        } catch (e) {
          reject(e);
        }
      }
      function step(result) {
        result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
      }
      step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
  };
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, '__esModule', { value: true });
exports.AdsPowerController = void 0;
const express_async_handler_1 = __importDefault(require('express-async-handler'));
const adsPowerService_1 = __importDefault(require('../services/adsPowerService'));
const zod_1 = require('zod');
const countryValidation_1 = require('../utils/countryValidation');
// Schemat walidacji dla zapytania o listę profili (opcjonalne parametry)
const ListProfilesQuerySchema = zod_1.z
  .object({
    page: zod_1.z
      .string()
      .optional()
      .transform((val) => (val ? parseInt(val, 10) : undefined)),
    pageSize: zod_1.z
      .string()
      .optional()
      .transform((val) => (val ? parseInt(val, 10) : undefined)),
  })
  .strict();
// Schemat walidacji dla proxy_config
const UserProxyConfigSchema = zod_1.z
  .object({
    proxy_soft: zod_1.z.enum([
      'brightdata',
      'brightauto',
      'oxylabsauto',
      '922S5auto',
      'ipideaauto',
      'ipfoxyauto',
      '922S5auth',
      'kookauto',
      'ssh',
      'other',
      'no_proxy',
    ]),
    proxy_type: zod_1.z.enum(['http', 'https', 'socks5']).optional(),
    proxy_host: zod_1.z.string().optional(),
    proxy_port: zod_1.z.string().optional(),
    proxy_user: zod_1.z.string().optional(),
    proxy_password: zod_1.z.string().optional(),
    proxy_url: zod_1.z.string().optional(),
    global_config: zod_1.z.enum(['0', '1']).optional(),
  })
  .refine(
    (data) => {
      if (
        data.proxy_soft !== 'no_proxy' &&
        data.proxy_soft !== '922S5auto' &&
        data.proxy_soft !== 'brightauto' &&
        data.proxy_soft !== 'oxylabsauto' &&
        data.proxy_soft !== 'ipideaauto' &&
        data.proxy_soft !== 'ipfoxyauto' &&
        data.proxy_soft !== 'kookauto'
      ) {
        return !!(data.proxy_host && data.proxy_port && data.proxy_type);
      }
      return true;
    },
    {
      message:
        "proxy_host, proxy_port, and proxy_type are required when proxy_soft is not 'no_proxy' or an 'auto' type that handles it.",
      path: ['proxy_host', 'proxy_port', 'proxy_type'],
    }
  );
// Schemat walidacji dla fingerprint_config
const FingerprintConfigSchema = zod_1.z.object({
  ua: zod_1.z.string().optional(),
  automatic_timezone: zod_1.z.enum(['0', '1']).optional(),
  language: zod_1.z.array(zod_1.z.string()).optional(),
  flash: zod_1.z.enum(['allow', 'block', 'ask']).optional(),
  webrtc: zod_1.z.enum(['forward', 'proxy', 'local', 'disabled']).optional(),
});
// Schemat walidacji dla całego payloadu tworzenia profilu
const CreateProfilePayloadSchema = zod_1.z
  .object({
    name: zod_1.z.string().optional(),
    group_id: zod_1.z.string(),
    remark: zod_1.z.string().optional(),
    domain_name: zod_1.z.string().optional(),
    open_urls: zod_1.z.array(zod_1.z.string()).optional(),
    username: zod_1.z.string().optional(),
    password: zod_1.z.string().optional(),
    fakey: zod_1.z.string().optional(),
    cookie: zod_1.z.string().optional(),
    ignore_cookie_error: zod_1.z.enum(['0', '1']).optional(),
    user_proxy_config: UserProxyConfigSchema.optional(),
    proxyid: zod_1.z.string().optional(),
    fingerprint_config: FingerprintConfigSchema,
    ip: zod_1.z.string().optional(),
    country: zod_1.z
      .string()
      .refine(countryValidation_1.isValidCountry, { message: 'Invalid country code.' })
      .optional(),
    region: zod_1.z.string().optional(),
    city: zod_1.z.string().optional(),
    ipchecker: zod_1.z.enum(['ip2location', 'ipapi']).optional(),
    sys_app_cate_id: zod_1.z.string().optional(),
    repeat_config: zod_1.z
      .array(
        zod_1.z.union([
          zod_1.z.literal(0),
          zod_1.z.literal(2),
          zod_1.z.literal(3),
          zod_1.z.literal(4),
        ])
      )
      .optional(),
  })
  .strict();
// Schemat walidacji dla parametrów ścieżki (userId)
const UserIdParamSchema = zod_1.z.object({
  userId: zod_1.z.string().min(1, 'User ID cannot be empty'),
});
// Schemat walidacji dla ciała żądania aktualizacji profilu
// Pola są opcjonalne, bo aktualizujemy tylko to, co przyszło w żądaniu
const UpdateProfileBodySchema = zod_1.z
  .object({
    name: zod_1.z.string().optional(),
    group_id: zod_1.z.string().optional(),
    remark: zod_1.z.string().optional(),
    domain_name: zod_1.z.string().optional(),
    open_urls: zod_1.z.array(zod_1.z.string()).optional(),
    username: zod_1.z.string().optional(),
    password: zod_1.z.string().optional(),
    fakey: zod_1.z.string().optional(),
    cookie: zod_1.z.string().optional(),
    ignore_cookie_error: zod_1.z.enum(['0', '1']).optional(),
    user_proxy_config: UserProxyConfigSchema.optional(),
    proxyid: zod_1.z.string().optional(),
    fingerprint_config: FingerprintConfigSchema.optional(),
    ip: zod_1.z.string().optional(),
    country: zod_1.z
      .string()
      .refine(countryValidation_1.isValidCountry, { message: 'Invalid country code.' })
      .optional(),
    region: zod_1.z.string().optional(),
    city: zod_1.z.string().optional(),
    ipchecker: zod_1.z.enum(['ip2location', 'ipapi']).optional(),
    sys_app_cate_id: zod_1.z.string().optional(),
    repeat_config: zod_1.z
      .array(
        zod_1.z.union([
          zod_1.z.literal(0),
          zod_1.z.literal(2),
          zod_1.z.literal(3),
          zod_1.z.literal(4),
        ])
      )
      .optional(),
  })
  .strict() // Aby upewnić się, że nie ma dodatkowych, nieznanych pól
  .refine((data) => Object.keys(data).length > 0, {
    message: 'Request body cannot be empty. At least one field to update must be provided.',
  }); // Upewniamy się, że przynajmniej jedno pole jest aktualizowane
// Schemat walidacji dla ciała żądania usuwania profili
const DeleteProfilesBodySchema = zod_1.z
  .object({
    user_ids: zod_1.z
      .array(zod_1.z.string().min(1, 'User ID in array cannot be empty'))
      .min(1, 'user_ids array cannot be empty'),
  })
  .strict();
// Schemat walidacji dla ciała żądania zmiany grupy profili
const RegroupProfilesBodySchema = zod_1.z
  .object({
    user_ids: zod_1.z
      .array(zod_1.z.string().min(1, 'User ID in array cannot be empty'))
      .min(1, 'user_ids array cannot be empty'),
    group_id: zod_1.z.string().min(1, 'Group ID cannot be empty'),
  })
  .strict();
// Schemat walidacji dla opcjonalnych query params dla startBrowser
const StartBrowserQuerySchema = zod_1.z
  .object({
    launch_args: zod_1.z
      .string()
      .optional()
      .transform((val) => (val ? JSON.parse(val) : undefined)), // Oczekujemy JSON stringified array
    ip_tab: zod_1.z.enum(['0', '1']).optional(),
    open_tabs: zod_1.z.enum(['0', '1']).optional(),
    clear_cache_after_closing: zod_1.z.enum(['0', '1']).optional(),
  })
  .strict();
// Schemat walidacji dla body przy tworzeniu grupy
const CreateGroupBodySchema = zod_1.z
  .object({
    group_name: zod_1.z.string().min(1, 'Group name cannot be empty.'),
    remark: zod_1.z.string().optional(),
  })
  .strict();
// Schemat walidacji dla parametrów paginacji (możemy reużyć lub dostosować, jeśli potrzeba)
// Założenie: API /api/v1/group/list używa `page` i `page_size` jeśli wspiera paginację.
// Dokumentacja tego nie precyzuje, więc czynimy to opcjonalnym.
const GroupPaginationQuerySchema = zod_1.z
  .object({
    page: zod_1.z
      .string()
      .optional()
      .transform((val) => (val ? parseInt(val, 10) : undefined)),
    page_size: zod_1.z
      .string()
      .optional()
      .transform((val) => (val ? parseInt(val, 10) : undefined)),
  })
  .strict();
// Schemat walidacji dla ciała żądania aktualizacji grupy
const UpdateGroupBodySchema = zod_1.z
  .object({
    group_id: zod_1.z.string().min(1, 'Group ID cannot be empty.'),
    group_name: zod_1.z.string().min(1, 'Group name cannot be empty.').optional(),
    remark: zod_1.z.string().optional(), // Remark może być pustym stringiem lub nie być podany
  })
  .strict()
  .refine((data) => data.group_name !== undefined || data.remark !== undefined, {
    message: 'At least group_name or remark must be provided for update.',
  });
// Schemat walidacji dla ciała żądania usuwania grup
const DeleteGroupsBodySchema = zod_1.z
  .object({
    group_ids: zod_1.z
      .array(zod_1.z.string().min(1, 'Group ID in array cannot be empty.'))
      .min(1, 'group_ids array cannot be empty.'),
  })
  .strict();
class AdsPowerController {
  constructor() {
    /**
     * Sprawdza status AdsPower API.
     */
    this.checkAdsPowerApi = (0, express_async_handler_1.default)((req, res) =>
      __awaiter(this, void 0, void 0, function* () {
        const apiResponse = yield adsPowerService_1.default.checkApiStatus();
        if (apiResponse && apiResponse.code === 0) {
          res.status(200).json({
            success: true,
            data: apiResponse.data,
            message: 'AdsPower API is operational.',
          });
        } else {
          res
            .status(
              (apiResponse === null || apiResponse === void 0 ? void 0 : apiResponse.code) === -1 ||
                !apiResponse
                ? 503
                : 500
            )
            .json({
              success: false,
              message:
                (apiResponse === null || apiResponse === void 0 ? void 0 : apiResponse.msg) ||
                'Failed to connect to AdsPower API or API returned an error.',
              errorDetails:
                (apiResponse === null || apiResponse === void 0 ? void 0 : apiResponse.data) ||
                null,
            });
        }
      })
    );
    /**
     * Obsługuje tworzenie nowego profilu AdsPower.
     */
    this.handleCreateProfile = (0, express_async_handler_1.default)((req, res) =>
      __awaiter(this, void 0, void 0, function* () {
        const validationResult = CreateProfilePayloadSchema.safeParse(req.body);
        if (!validationResult.success) {
          console.error('Validation errors:', validationResult.error.errors);
          res.status(400).json({
            success: false,
            message: 'Invalid request payload.',
            errors: validationResult.error.errors,
          });
          return;
        }
        const payload = validationResult.data;
        const apiResponse = yield adsPowerService_1.default.createProfile(payload);
        if (apiResponse && apiResponse.code === 0 && apiResponse.data && apiResponse.data.id) {
          res.status(201).json({
            success: true,
            data: apiResponse,
            message: 'AdsPower profile created successfully.',
          });
        } else {
          console.error('AdsPower API returned an error during profile creation:', apiResponse);
          res
            .status(
              (apiResponse === null || apiResponse === void 0 ? void 0 : apiResponse.code) === -1 ||
                !apiResponse
                ? 500
                : 400
            )
            .json({
              success: false,
              message:
                (apiResponse === null || apiResponse === void 0 ? void 0 : apiResponse.msg) ||
                'Failed to create AdsPower profile or API returned an error.',
              errorDetails: apiResponse || null,
            });
        }
      })
    );
    /**
     * Pobiera listę profili AdsPower.
     */
    this.listAdsPowerProfiles = (0, express_async_handler_1.default)((req, res) =>
      __awaiter(this, void 0, void 0, function* () {
        const validationResult = ListProfilesQuerySchema.safeParse(req.query);
        if (!validationResult.success) {
          res.status(400).json({
            success: false,
            message: 'Invalid query parameters.',
            errors: validationResult.error.errors,
          });
          return;
        }
        const { page, pageSize } = validationResult.data;
        const apiResponse = yield adsPowerService_1.default.listProfiles(page, pageSize);
        if (apiResponse && apiResponse.code === 0) {
          res.status(200).json({
            success: true,
            data: apiResponse.data,
            message: 'AdsPower profiles listed successfully.',
          });
        } else {
          console.error('AdsPower API returned an error when listing profiles:', apiResponse);
          res
            .status(
              (apiResponse === null || apiResponse === void 0 ? void 0 : apiResponse.code) === -1 ||
                !apiResponse
                ? 503
                : 500
            )
            .json({
              success: false,
              message:
                (apiResponse === null || apiResponse === void 0 ? void 0 : apiResponse.msg) ||
                'Failed to list AdsPower profiles or API returned an error.',
              errorDetails: apiResponse || null,
            });
        }
      })
    );
    /**
     * Obsługuje aktualizację istniejącego profilu AdsPower.
     */
    this.updateAdsPowerProfile = (0, express_async_handler_1.default)((req, res) =>
      __awaiter(this, void 0, void 0, function* () {
        // Walidacja user_id z parametrów ścieżki
        const paramsValidationResult = UserIdParamSchema.safeParse(req.params);
        if (!paramsValidationResult.success) {
          res.status(400).json({
            success: false,
            message: 'Invalid user ID in path parameter.',
            errors: paramsValidationResult.error.errors,
          });
          return;
        }
        const { userId } = paramsValidationResult.data;
        // Walidacja ciała żądania
        const bodyValidationResult = UpdateProfileBodySchema.safeParse(req.body);
        if (!bodyValidationResult.success) {
          res.status(400).json({
            success: false,
            message: 'Invalid request payload for profile update.',
            errors: bodyValidationResult.error.errors,
          });
          return;
        }
        // Przygotowanie payloadu dla serwisu AdsPower
        // user_id jest dodawane do pól z req.body
        const payload = Object.assign({ user_id: userId }, bodyValidationResult.data);
        const apiResponse = yield adsPowerService_1.default.updateProfile(payload);
        if (apiResponse && apiResponse.code === 0) {
          res.status(200).json({
            success: true,
            message: `AdsPower profile ${userId} updated successfully.`,
            data: apiResponse.data,
          });
        } else {
          console.error(
            `AdsPower API returned an error during profile update for user_id: ${userId}:`,
            apiResponse
          );
          res
            .status(
              (apiResponse === null || apiResponse === void 0 ? void 0 : apiResponse.code) === -1 ||
                !apiResponse
                ? 500
                : 400
            )
            .json({
              success: false,
              message:
                (apiResponse === null || apiResponse === void 0 ? void 0 : apiResponse.msg) ||
                `Failed to update AdsPower profile ${userId} or API returned an error.`,
              errorDetails: apiResponse || null,
            });
        }
      })
    );
    /**
     * Obsługuje usuwanie wybranych profili AdsPower.
     */
    this.deleteAdsPowerProfiles = (0, express_async_handler_1.default)((req, res) =>
      __awaiter(this, void 0, void 0, function* () {
        const bodyValidationResult = DeleteProfilesBodySchema.safeParse(req.body);
        if (!bodyValidationResult.success) {
          res.status(400).json({
            success: false,
            message: 'Invalid request payload for profile deletion.',
            errors: bodyValidationResult.error.errors,
          });
          return;
        }
        const payload = bodyValidationResult.data;
        const apiResponse = yield adsPowerService_1.default.deleteProfiles(payload);
        if (apiResponse && apiResponse.code === 0) {
          res.status(200).json({
            success: true,
            message: `AdsPower profiles deleted successfully. IDs: ${payload.user_ids.join(', ')}`,
            data: apiResponse.data, // Może być puste
          });
        } else {
          console.error(
            `AdsPower API returned an error during profile deletion for user_ids: ${payload.user_ids.join(', ')}:`,
            apiResponse
          );
          res
            .status(
              (apiResponse === null || apiResponse === void 0 ? void 0 : apiResponse.code) === -1 ||
                !apiResponse
                ? 500
                : 400
            )
            .json({
              success: false,
              message:
                (apiResponse === null || apiResponse === void 0 ? void 0 : apiResponse.msg) ||
                'Failed to delete AdsPower profiles or API returned an error.',
              errorDetails: apiResponse || null,
            });
        }
      })
    );
    /**
     * Obsługuje zmianę grupy dla wybranych profili AdsPower.
     */
    this.regroupAdsPowerProfiles = (0, express_async_handler_1.default)((req, res) =>
      __awaiter(this, void 0, void 0, function* () {
        const bodyValidationResult = RegroupProfilesBodySchema.safeParse(req.body);
        if (!bodyValidationResult.success) {
          res.status(400).json({
            success: false,
            message: 'Invalid request payload for profile regrouping.',
            errors: bodyValidationResult.error.errors,
          });
          return;
        }
        const payload = bodyValidationResult.data;
        const apiResponse = yield adsPowerService_1.default.regroupProfiles(payload);
        if (apiResponse && apiResponse.code === 0) {
          res.status(200).json({
            success: true,
            message: `AdsPower profiles successfully regrouped to group ID: ${payload.group_id}. Affected IDs: ${payload.user_ids.join(', ')}`,
            data: apiResponse.data, // Może być puste
          });
        } else {
          console.error(
            `AdsPower API returned an error during profile regrouping for user_ids: ${payload.user_ids.join(', ')} to group_id: ${payload.group_id}:`,
            apiResponse
          );
          res
            .status(
              (apiResponse === null || apiResponse === void 0 ? void 0 : apiResponse.code) === -1 ||
                !apiResponse
                ? 500
                : 400
            )
            .json({
              success: false,
              message:
                (apiResponse === null || apiResponse === void 0 ? void 0 : apiResponse.msg) ||
                'Failed to regroup AdsPower profiles or API returned an error.',
              errorDetails: apiResponse || null,
            });
        }
      })
    );
    /**
     * Obsługuje globalne czyszczenie cache profili AdsPower.
     */
    this.clearAllAdsPowerProfilesCache = (0, express_async_handler_1.default)((req, res) =>
      __awaiter(this, void 0, void 0, function* () {
        // Ten endpoint nie przyjmuje payloadu
        const apiResponse = yield adsPowerService_1.default.clearAllProfilesCache();
        if (apiResponse && apiResponse.code === 0) {
          res.status(200).json({
            success: true,
            message: 'AdsPower all profiles cache cleared successfully.',
            data: apiResponse.data, // Może być puste
          });
        } else {
          // Dokumentacja wspomina o kodzie błędu -1, jeśli są otwarte przeglądarki
          const statusCode =
            (apiResponse === null || apiResponse === void 0 ? void 0 : apiResponse.code) === -1
              ? 409
              : (apiResponse === null || apiResponse === void 0 ? void 0 : apiResponse.code) !==
                    0 && apiResponse !== null
                ? 400
                : 500;
          // 409 Conflict - jeśli operacja nie może być wykonana z powodu obecnego stanu (otwarte przeglądarki)
          // 400 Bad Request - jeśli API AdsPower zwróciło inny błąd aplikacyjny
          // 500 Internal Server Error - dla błędów połączenia lub nieoczekiwanych problemów
          console.error(
            'AdsPower API returned an error during global cache clearing:',
            apiResponse
          );
          res.status(statusCode).json({
            success: false,
            message:
              (apiResponse === null || apiResponse === void 0 ? void 0 : apiResponse.msg) ||
              'Failed to clear all AdsPower profiles cache or API returned an error.',
            errorDetails: apiResponse || null,
          });
        }
      })
    );
    /**
     * Obsługuje uruchamianie przeglądarki dla profilu AdsPower.
     */
    this.startAdsPowerBrowser = (0, express_async_handler_1.default)((req, res) =>
      __awaiter(this, void 0, void 0, function* () {
        const paramsValidationResult = UserIdParamSchema.safeParse(req.params);
        if (!paramsValidationResult.success) {
          res.status(400).json({
            success: false,
            message: 'Invalid user ID in path parameter.',
            errors: paramsValidationResult.error.errors,
          });
          return;
        }
        const { userId } = paramsValidationResult.data;
        const queryValidationResult = StartBrowserQuerySchema.safeParse(req.query);
        if (!queryValidationResult.success) {
          res.status(400).json({
            success: false,
            message: 'Invalid query parameters for starting browser.',
            errors: queryValidationResult.error.errors,
          });
          return;
        }
        const { launch_args, ip_tab, open_tabs, clear_cache_after_closing } =
          queryValidationResult.data;
        const apiResponse = yield adsPowerService_1.default.startBrowser(
          userId,
          launch_args,
          ip_tab,
          open_tabs,
          clear_cache_after_closing
        );
        if (apiResponse && apiResponse.code === 0 && apiResponse.data && apiResponse.data.ws) {
          res.status(200).json({
            success: true,
            message: `AdsPower browser for profile ${userId} started successfully.`,
            data: apiResponse.data,
          });
        } else {
          console.error(
            `AdsPower API returned an error when starting browser for profile ${userId}:`,
            apiResponse
          );
          res
            .status(
              (apiResponse === null || apiResponse === void 0 ? void 0 : apiResponse.code) === -1 ||
                !apiResponse
                ? 500
                : 400
            )
            .json({
              success: false,
              message:
                (apiResponse === null || apiResponse === void 0 ? void 0 : apiResponse.msg) ||
                `Failed to start AdsPower browser for profile ${userId} or API returned an error.`,
              errorDetails: apiResponse || null,
            });
        }
      })
    );
    /**
     * Obsługuje zatrzymywanie przeglądarki dla profilu AdsPower.
     */
    this.stopAdsPowerBrowser = (0, express_async_handler_1.default)((req, res) =>
      __awaiter(this, void 0, void 0, function* () {
        const paramsValidationResult = UserIdParamSchema.safeParse(req.params);
        if (!paramsValidationResult.success) {
          res.status(400).json({
            success: false,
            message: 'Invalid user ID in path parameter.',
            errors: paramsValidationResult.error.errors,
          });
          return;
        }
        const { userId } = paramsValidationResult.data;
        const apiResponse = yield adsPowerService_1.default.stopBrowser(userId);
        if (apiResponse && apiResponse.code === 0) {
          res.status(200).json({
            success: true,
            message: `AdsPower browser for profile ${userId} stopped successfully.`,
            data: apiResponse.data, // Może być puste
          });
        } else {
          console.error(
            `AdsPower API returned an error when stopping browser for profile ${userId}:`,
            apiResponse
          );
          res
            .status(
              (apiResponse === null || apiResponse === void 0 ? void 0 : apiResponse.code) === -1 ||
                !apiResponse
                ? 500
                : 400
            )
            .json({
              success: false,
              message:
                (apiResponse === null || apiResponse === void 0 ? void 0 : apiResponse.msg) ||
                `Failed to stop AdsPower browser for profile ${userId} or API returned an error.`,
              errorDetails: apiResponse || null,
            });
        }
      })
    );
    /**
     * Obsługuje sprawdzanie statusu przeglądarki dla profilu AdsPower.
     */
    this.checkAdsPowerBrowserStatus = (0, express_async_handler_1.default)((req, res) =>
      __awaiter(this, void 0, void 0, function* () {
        const paramsValidationResult = UserIdParamSchema.safeParse(req.params);
        if (!paramsValidationResult.success) {
          res.status(400).json({
            success: false,
            message: 'Invalid user ID in path parameter.',
            errors: paramsValidationResult.error.errors,
          });
          return;
        }
        const { userId } = paramsValidationResult.data;
        const apiResponse = yield adsPowerService_1.default.checkBrowserStatus(userId);
        if (apiResponse && apiResponse.code === 0 && apiResponse.data && apiResponse.data.status) {
          res.status(200).json({
            success: true,
            message: `AdsPower browser status for profile ${userId} checked successfully.`,
            data: apiResponse.data,
          });
        } else {
          console.error(
            `AdsPower API returned an error when checking browser status for profile ${userId}:`,
            apiResponse
          );
          res
            .status(
              (apiResponse === null || apiResponse === void 0 ? void 0 : apiResponse.code) === -1 ||
                !apiResponse
                ? 500
                : 400
            )
            .json({
              success: false,
              message:
                (apiResponse === null || apiResponse === void 0 ? void 0 : apiResponse.msg) ||
                `Failed to check AdsPower browser status for profile ${userId} or API returned an error.`,
              errorDetails: apiResponse || null,
            });
        }
      })
    );
    /**
     * Obsługuje tworzenie nowej grupy AdsPower.
     */
    this.createAdsPowerGroup = (0, express_async_handler_1.default)((req, res) =>
      __awaiter(this, void 0, void 0, function* () {
        const bodyValidationResult = CreateGroupBodySchema.safeParse(req.body);
        if (!bodyValidationResult.success) {
          res.status(400).json({
            success: false,
            message: 'Invalid request body for creating group.',
            errors: bodyValidationResult.error.errors,
          });
          return;
        }
        const validatedBody = bodyValidationResult.data;
        const apiResponse = yield adsPowerService_1.default.createGroup(validatedBody);
        if (
          apiResponse &&
          apiResponse.code === 0 &&
          apiResponse.data &&
          apiResponse.data.group_id
        ) {
          res.status(201).json({
            success: true,
            message: `AdsPower group '${validatedBody.group_name}' created successfully with ID: ${apiResponse.data.group_id}`,
            data: apiResponse.data,
          });
        } else {
          console.error(
            `AdsPower API returned an error when creating group '${validatedBody.group_name}':`,
            apiResponse
          );
          res
            .status(
              (apiResponse === null || apiResponse === void 0 ? void 0 : apiResponse.code) === -1 ||
                !apiResponse
                ? 500
                : 400
            )
            .json({
              success: false,
              message:
                (apiResponse === null || apiResponse === void 0 ? void 0 : apiResponse.msg) ||
                `Failed to create AdsPower group '${validatedBody.group_name}' or API returned an error.`,
              errorDetails: apiResponse || null,
            });
        }
      })
    );
    /**
     * Obsługuje listowanie grup AdsPower.
     */
    this.listAdsPowerGroups = (0, express_async_handler_1.default)((req, res) =>
      __awaiter(this, void 0, void 0, function* () {
        const queryValidationResult = GroupPaginationQuerySchema.safeParse(req.query);
        if (!queryValidationResult.success) {
          res.status(400).json({
            success: false,
            message: 'Invalid query parameters for listing groups.',
            errors: queryValidationResult.error.errors,
          });
          return;
        }
        const { page, page_size } = queryValidationResult.data;
        const apiResponse = yield adsPowerService_1.default.listGroups(page, page_size);
        if (apiResponse && apiResponse.code === 0 && apiResponse.data) {
          res.status(200).json({
            success: true,
            message: 'AdsPower groups listed successfully.',
            data: apiResponse.data, // Zawiera listę grup i potencjalnie info o paginacji
          });
        } else {
          console.error('AdsPower API returned an error when listing groups:', apiResponse);
          res
            .status(
              (apiResponse === null || apiResponse === void 0 ? void 0 : apiResponse.code) === -1 ||
                !apiResponse
                ? 500
                : 400
            )
            .json({
              success: false,
              message:
                (apiResponse === null || apiResponse === void 0 ? void 0 : apiResponse.msg) ||
                'Failed to list AdsPower groups or API returned an error.',
              errorDetails: apiResponse || null,
            });
        }
      })
    );
    /**
     * Obsługuje aktualizację istniejącej grupy AdsPower.
     */
    this.updateAdsPowerGroup = (0, express_async_handler_1.default)((req, res) =>
      __awaiter(this, void 0, void 0, function* () {
        const bodyValidationResult = UpdateGroupBodySchema.safeParse(req.body);
        if (!bodyValidationResult.success) {
          res.status(400).json({
            success: false,
            message: 'Invalid request payload for group update.',
            errors: bodyValidationResult.error.errors,
          });
          return;
        }
        const payload = bodyValidationResult.data;
        const apiResponse = yield adsPowerService_1.default.updateGroup(payload);
        if (apiResponse && apiResponse.code === 0) {
          res.status(200).json({
            success: true,
            message: `AdsPower group ID '${payload.group_id}' updated successfully.`,
            data: apiResponse.data, // Może być puste
          });
        } else {
          console.error(
            `AdsPower API returned an error during group update for ID '${payload.group_id}':`,
            apiResponse
          );
          res
            .status(
              (apiResponse === null || apiResponse === void 0 ? void 0 : apiResponse.code) === -1 ||
                !apiResponse
                ? 500
                : 400
            )
            .json({
              success: false,
              message:
                (apiResponse === null || apiResponse === void 0 ? void 0 : apiResponse.msg) ||
                `Failed to update AdsPower group ID '${payload.group_id}' or API returned an error.`,
              errorDetails: apiResponse || null,
            });
        }
      })
    );
    /**
     * Obsługuje usuwanie wybranych grup AdsPower.
     */
    this.deleteAdsPowerGroups = (0, express_async_handler_1.default)((req, res) =>
      __awaiter(this, void 0, void 0, function* () {
        const bodyValidationResult = DeleteGroupsBodySchema.safeParse(req.body);
        if (!bodyValidationResult.success) {
          res.status(400).json({
            success: false,
            message: 'Invalid request payload for group deletion.',
            errors: bodyValidationResult.error.errors,
          });
          return;
        }
        const payload = bodyValidationResult.data;
        const apiResponse = yield adsPowerService_1.default.deleteGroups(payload);
        if (apiResponse && apiResponse.code === 0) {
          res.status(200).json({
            success: true,
            message: `AdsPower groups deleted successfully. IDs: ${payload.group_ids.join(', ')}`,
            data: apiResponse.data, // Może być puste
          });
        } else {
          console.error(
            `AdsPower API returned an error during group deletion for IDs '${payload.group_ids.join(', ')}':`,
            apiResponse
          );
          res
            .status(
              (apiResponse === null || apiResponse === void 0 ? void 0 : apiResponse.code) === -1 ||
                !apiResponse
                ? 500
                : 400
            )
            .json({
              success: false,
              message:
                (apiResponse === null || apiResponse === void 0 ? void 0 : apiResponse.msg) ||
                `Failed to delete AdsPower groups or API returned an error.`,
              errorDetails: apiResponse || null,
            });
        }
      })
    );
    /**
     * Obsługuje pobieranie szczegółowych danych profilu AdsPower.
     */
    this.getAdsPowerProfileDetail = (0, express_async_handler_1.default)((req, res) =>
      __awaiter(this, void 0, void 0, function* () {
        const paramsValidationResult = UserIdParamSchema.safeParse(req.params);
        if (!paramsValidationResult.success) {
          res.status(400).json({
            success: false,
            message: 'Invalid user ID in path parameter.',
            errors: paramsValidationResult.error.errors,
          });
          return;
        }
        const { userId } = paramsValidationResult.data;
        const apiResponse = yield adsPowerService_1.default.getProfileDetail(userId);
        if (apiResponse && apiResponse.code === 0 && apiResponse.data) {
          res.status(200).json({
            success: true,
            message: `AdsPower profile detail for ID '${userId}' retrieved successfully.`,
            data: apiResponse.data,
          });
        } else {
          console.error(
            `AdsPower API returned an error when retrieving profile detail for ID '${userId}':`,
            apiResponse
          );
          res
            .status(
              (apiResponse === null || apiResponse === void 0 ? void 0 : apiResponse.code) === -1 ||
                !apiResponse
                ? 500
                : 400
            )
            .json({
              success: false,
              message:
                (apiResponse === null || apiResponse === void 0 ? void 0 : apiResponse.msg) ||
                `Failed to retrieve profile detail for ID '${userId}' or API returned an error.`,
              errorDetails: apiResponse || null,
            });
        }
      })
    );
    // --- Miejsce na przyszłe kontrolery ---
  }
}
exports.AdsPowerController = AdsPowerController;
exports.default = new AdsPowerController();
