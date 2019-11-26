import template from "../../lib/copyTemplate/copyTemplate";
export default async function (options) {
    await template("module", options.destination);
}
