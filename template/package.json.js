import { File, Indent, Text } from "@asyncapi/generator-react-sdk"
import { kebabCase } from "@asyncapi/generator-filters"

export default function ({ asyncapi, params }) {
  const packageJSON = {
    name: 'NodeJS Template',
    description: '',
    version: '0.0.1',
    scripts: {
      start: "node src/api/index.js"
    },
    dependencies: {
      nats: '^2.4.0',
      chalk: "4.1.2",
      dotenv: "8.1.0",
      hermesjs: "2.x",
      "hermesjs-router": "1.x",
      "asyncapi-validator": "3.0.0",
      "node-fetch": "2.6.0",
      "node-yaml-config": "0.0.4"
    }
  };
  if (asyncapi.info().title()) {
    packageJSON.name = kebabCase(asyncapi.info().title());
  }
  if (asyncapi.info().version()) {
    packageJSON.version = asyncapi.info().version();
  }
  if (asyncapi.info().description()) {
    const asyncApiDescriptionOneLine = asyncapi.info().description()?.replace(/\n/g, " ") || ""
    packageJSON.description = asyncApiDescriptionOneLine;
  }

  if (asyncapi.server(params.server).protocol() === 'mqtt' || asyncapi.server(params.server).protocol() === 'mqtts') {
    packageJSON.dependencies = { ...packageJSON.dependencies, "hermesjs-mqtt": "2.x" }
  }
  else if (asyncapi.server(params.server).protocol() === 'kafka' || asyncapi.server(params.server).protocol() === 'kafka-secure') {
    packageJSON.dependencies = { ...packageJSON.dependencies, "hermesjs-kafka": "2.x" }
  }
  else if (asyncapi.server(params.server).protocol() === 'amqp') {
    packageJSON.dependencies = { ...packageJSON.dependencies, "hermesjs-amqp": "1.x" }
  }
  else if (asyncapi.server(params.server).protocol() === 'ws') {
    packageJSON.dependencies = { ...packageJSON.dependencies, "hermesjs-ws": "1.x" }
  }

  return <File name={'package.json'}>
    {JSON.stringify(packageJSON, null, 2)}
  </File>;
}
