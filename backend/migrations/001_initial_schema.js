const jsonbDefault = (knex, value) => knex.raw(`'${JSON.stringify(value)}'::jsonb`);

const createIdTable = (knex, tableName, columns) =>
  knex.schema.createTable(tableName, (table) => {
    table.text("Id").primary();
    columns(table);
  });

exports.up = async function up(knex) {
  await knex.schema.createTable("app_config", (table) => {
    table.integer("ID").primary();
    table.text("JF_HOST");
    table.text("JF_API_KEY");
    table.text("APP_USER");
    table.text("APP_PASSWORD");
    table.boolean("REQUIRE_LOGIN").notNullable().defaultTo(false);
    table.jsonb("settings").notNullable().defaultTo(jsonbDefault(knex, {}));
    table.jsonb("api_keys").notNullable().defaultTo(jsonbDefault(knex, []));
  });

  await knex("app_config").insert({
    ID: 1,
    settings: {},
    api_keys: [],
  });

  await createIdTable(knex, "jf_users", (table) => {
    table.text("Name");
    table.text("PrimaryImageTag");
    table.text("LastLoginDate");
    table.text("LastActivityDate");
    table.boolean("IsAdministrator").notNullable().defaultTo(false);
  });

  await createIdTable(knex, "jf_libraries", (table) => {
    table.text("Name");
    table.text("ServerId");
    table.boolean("IsFolder");
    table.text("Type");
    table.text("CollectionType");
    table.text("ImageTagsPrimary");
    table.boolean("archived").notNullable().defaultTo(false);
  });

  await createIdTable(knex, "jf_library_items", (table) => {
    table.text("Name");
    table.text("ServerId");
    table.text("PremiereDate");
    table.text("DateCreated");
    table.text("EndDate");
    table.decimal("CommunityRating");
    table.bigInteger("RunTimeTicks");
    table.integer("ProductionYear");
    table.boolean("IsFolder");
    table.text("Type");
    table.text("Status");
    table.text("ImageTagsPrimary");
    table.text("ImageTagsBanner");
    table.text("ImageTagsLogo");
    table.text("ImageTagsThumb");
    table.text("BackdropImageTags");
    table.text("ParentId");
    table.text("PrimaryImageHash");
    table.boolean("archived").notNullable().defaultTo(false);
    table.jsonb("Genres").notNullable().defaultTo(jsonbDefault(knex, []));
  });

  await createIdTable(knex, "jf_library_seasons", (table) => {
    table.text("Name");
    table.text("ServerId");
    table.integer("IndexNumber");
    table.text("Type");
    table.text("ParentLogoItemId");
    table.text("ParentBackdropItemId");
    table.text("ParentBackdropImageTags");
    table.text("SeriesName");
    table.text("SeriesId");
    table.text("SeriesPrimaryImageTag");
    table.boolean("archived").notNullable().defaultTo(false);
  });

  await createIdTable(knex, "jf_library_episodes", (table) => {
    table.text("EpisodeId");
    table.text("Name");
    table.text("ServerId");
    table.text("PremiereDate");
    table.text("DateCreated");
    table.text("OfficialRating");
    table.decimal("CommunityRating");
    table.bigInteger("RunTimeTicks");
    table.integer("ProductionYear");
    table.integer("IndexNumber");
    table.integer("ParentIndexNumber");
    table.text("Type");
    table.text("ParentLogoItemId");
    table.text("ParentBackdropItemId");
    table.text("ParentBackdropImageTags");
    table.text("SeriesId");
    table.text("SeasonId");
    table.text("SeasonName");
    table.text("SeriesName");
    table.text("PrimaryImageHash");
    table.boolean("archived").notNullable().defaultTo(false);
  });

  await createIdTable(knex, "jf_item_info", (table) => {
    table.text("Path");
    table.text("Name");
    table.bigInteger("Size");
    table.bigInteger("Bitrate");
    table.jsonb("MediaStreams");
    table.text("Type");
  });

  await createIdTable(knex, "jf_playback_activity", (table) => {
    table.boolean("IsPaused");
    table.text("UserId");
    table.text("UserName");
    table.text("Client");
    table.text("DeviceName");
    table.text("DeviceId");
    table.text("ApplicationVersion");
    table.text("NowPlayingItemId");
    table.text("NowPlayingItemName");
    table.text("EpisodeId");
    table.text("SeasonId");
    table.text("SeriesName");
    table.bigInteger("PlaybackDuration");
    table.text("PlayMethod");
    table.text("ActivityDateInserted");
    table.jsonb("MediaStreams");
    table.jsonb("TranscodingInfo");
    table.jsonb("PlayState");
    table.text("OriginalContainer");
    table.text("RemoteEndPoint");
    table.text("ServerId");
  });

  await createIdTable(knex, "jf_activity_watchdog", (table) => {
    table.text("ActivityId");
    table.boolean("IsPaused");
    table.text("UserId");
    table.text("UserName");
    table.text("Client");
    table.text("DeviceName");
    table.text("DeviceId");
    table.text("ApplicationVersion");
    table.text("NowPlayingItemId");
    table.text("NowPlayingItemName");
    table.text("EpisodeId");
    table.text("SeasonId");
    table.text("SeriesName");
    table.bigInteger("PlaybackDuration");
    table.text("PlayMethod");
    table.text("ActivityDateInserted");
    table.jsonb("MediaStreams");
    table.jsonb("TranscodingInfo");
    table.jsonb("PlayState");
    table.text("OriginalContainer");
    table.text("RemoteEndPoint");
    table.text("ServerId");
  });

  await knex.schema.createTable("jf_playback_reporting_plugin_data", (table) => {
    table.text("rowid").primary();
    table.text("DateCreated");
    table.text("UserId");
    table.text("ItemId");
    table.text("ItemType");
    table.text("ItemName");
    table.text("PlaybackMethod");
    table.text("ClientName");
    table.text("DeviceName");
    table.bigInteger("PlayDuration");
  });

  await createIdTable(knex, "jf_logging", (table) => {
    table.text("Name");
    table.text("Type");
    table.text("ExecutionType");
    table.bigInteger("Duration");
    table.text("TimeRun");
    table.text("Log");
    table.text("Result");
  });
};

exports.down = async function down(knex) {
  await knex.schema
    .dropTableIfExists("jf_logging")
    .dropTableIfExists("jf_playback_reporting_plugin_data")
    .dropTableIfExists("jf_activity_watchdog")
    .dropTableIfExists("jf_playback_activity")
    .dropTableIfExists("jf_item_info")
    .dropTableIfExists("jf_library_episodes")
    .dropTableIfExists("jf_library_seasons")
    .dropTableIfExists("jf_library_items")
    .dropTableIfExists("jf_libraries")
    .dropTableIfExists("jf_users")
    .dropTableIfExists("app_config");
};
