import { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import { brightDataService, BrightDataProxy } from "../services/brightDataService";

export class BrightDataController {
  /**
   * @desc    Pobiera listę skonfigurowanych proxy z Bright Data Proxy Managera
   * @route   GET /api/brightdata/proxies
   * @access  Private (lub Public, w zależności od wymagań)
   */
  listBrightDataProxies = asyncHandler(async (req: Request, res: Response) => {
    const proxies: BrightDataProxy[] = await brightDataService.listProxies();

    // Serwis rzuci błąd w przypadku niepowodzenia, więc zakładamy, że proxies jest tablicą (może być pusta)
    res.status(200).json({
      success: true,
      count: proxies.length,
      data: proxies,
      message: "Successfully fetched Bright Data proxies.",
    });
  });
}

export const brightDataController = new BrightDataController(); 