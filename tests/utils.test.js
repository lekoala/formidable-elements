import { expect, test } from "bun:test";
import simpleConfig from "../src/utils/simpleConfig.js";

test("reads config", () => {
	expect(
		simpleConfig(
			`inline:true, locale: { firstDayOfWeek: 1}, configUrl: '/my/path/to_config/'`,
		),
	).toBeObject();
});
