import { camelCase, pascalCase } from "../../utils/index"

export function Imports({channelName}) {
    return `
  const Router = require('hermesjs/lib/router');
  const {validateMessage} = require('../../lib/message-validator');
  const router = new Router();
  const ${camelCase(channelName)}Handler = require('../handlers/${pascalCase(channelName)}');
  module.exports = router;
  `
}