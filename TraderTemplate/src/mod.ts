import { DependencyContainer } from "tsyringe"

import { IPreSptLoadMod } from "@spt/models/external/IPreSptLoadMod"
import { IPostDBLoadMod } from "@spt/models/external/IPostDBLoadMod"
import { LogTextColor } from "@spt/models/spt/logging/LogTextColor"
import { ConfigTypes } from "@spt/models/enums/ConfigTypes"
import { ITraderConfig } from "@spt/models/spt/config/ITraderConfig"
import { Traders } from "@spt/models/enums/Traders"
import { References } from "./Refs/References"
import { TraderData } from "./Trader/TraderTemplate"
import { TraderUtils } from "./Refs/Utils"

import * as baseJson from "../db/base.json"

const modName = "TraderTemplate"

class TraderTemplate implements IPreSptLoadMod, IPostDBLoadMod {
	private ref: References = new References()

	constructor() {}

	public preSptLoad(container: DependencyContainer): void {
		this.ref.preSptLoad(container)
		const ragfair = this.ref.configServer.getConfig(ConfigTypes.RAGFAIR)
		const traderConfig: ITraderConfig = this.ref.configServer.getConfig<ITraderConfig>(ConfigTypes.TRADER)
		const traderUtils = new TraderUtils()
		const traderData = new TraderData(traderConfig, this.ref, traderUtils)

		traderData.registerProfileImage()
		traderData.setupTraderUpdateTime()

		Traders[baseJson._id] = baseJson._id
		ragfair.traders[baseJson._id] = true
	}

	public postDBLoad(container: DependencyContainer): void {
		this.ref.postDBLoad(container)
		const traderConfig: ITraderConfig = this.ref.configServer.getConfig<ITraderConfig>(ConfigTypes.TRADER)
		const traderUtils = new TraderUtils()
		const traderData = new TraderData(traderConfig, this.ref, traderUtils)

		traderData.pushTrader()
		traderData.addTraderToLocales(this.ref.tables, baseJson.name, "TraderNameYouWantToUse", baseJson.nickname, baseJson.location, "Trader Description")

		this.ref.logger.log(`[${modName}] If you want a message in the server window on startup put it here.`, LogTextColor.GREEN)
	}
}

module.exports = { mod: new TraderTemplate() }
