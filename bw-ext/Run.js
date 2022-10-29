Extension.instance
    .register(new TownShop_AutomaticallyOpenBargains())
    .register(new TownShop_HighlightPerfectItems())
    .register(new Auction_AddPrValueColumn())
    .register(new Auction_HighlightImportantAffixes())
    .register(new Buildings_AddSummaryTable())
    .register(new Armory_LoadAllItems())
    .register(new Armory_AddSearch())
    .run();